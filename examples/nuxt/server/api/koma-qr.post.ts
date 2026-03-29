import {
  RouteError,
  createSignedCheckoutFields,
  extractCheckoutError,
  getRouteError,
  parseAmount,
  parseCheckoutPage,
  parseCurrency,
  requireString,
} from "koma-khqr/server";

import { getKomaConfig, buildKomaAppUrl } from "../utils/koma";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<Record<string, unknown>>(event);
    const amount = parseAmount(requireString(body.amount, "amount"));
    const currency = parseCurrency(requireString(body.currency, "currency"));
    const productId = requireString(body.productId, "productId");
    const config = getKomaConfig();
    const appBaseUrl = config.appBaseUrl || "http://localhost:3000";

    const signed = createSignedCheckoutFields({
      apiBaseUrl: config.apiBaseUrl,
      merchantId: config.merchantId,
      secretKey: config.secretKey,
      fields: {
        amount,
        currency,
        returnURL: buildKomaAppUrl(appBaseUrl, "/payment/cancelled", { productId }),
        continueSuccessURL: buildKomaAppUrl(appBaseUrl, "/payment/success", { productId }),
      },
    });

    const form = new FormData();
    form.append("amount", signed.amount);
    form.append("merchantId", signed.merchantId);
    form.append("hash", signed.hash);
    form.append("tranID", signed.tranID);
    form.append("currency", signed.currency);

    if (signed.returnURL) {
      form.append("returnURL", signed.returnURL);
    }

    if (signed.continueSuccessURL) {
      form.append("continueSuccessURL", signed.continueSuccessURL);
    }

    const response = await fetch(`${config.apiBaseUrl}/api/payment/checkout`, {
      method: "POST",
      body: form,
      cache: "no-store",
    });
    const html = await response.text();

    if (!response.ok) {
      const providerError = extractCheckoutError(html);
      throw new RouteError(
        providerError
          ? `Koma checkout request failed: ${providerError}`
          : "Koma checkout request failed",
        response.status,
      );
    }

    const parsed = parseCheckoutPage(html);

    if (!parsed) {
      throw new RouteError("Could not parse Koma checkout response", 502);
    }

    return { ...parsed, tranID: signed.tranID };
  } catch (error) {
    const { message, status } = getRouteError(error, "Unable to create KHQR checkout");
    setResponseStatus(event, status);
    return { error: message };
  }
});
