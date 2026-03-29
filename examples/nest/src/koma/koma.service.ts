import {
  RouteError,
  createSignedCheckoutFields,
  extractCheckoutError,
  parseAmount,
  parseCheckoutPage,
  parseCurrency,
  requireEnv,
  requireString,
} from "koma-khqr/server";

type StatusResponse = {
  body: object | string;
  contentType: string;
  status: number;
};

export class KomaService {
  private readonly defaultApiBaseUrl = "https://koma.khqr.site";
  private readonly defaultAppBaseUrl = "http://localhost:3000";

  async createQrSession(body: Record<string, unknown>) {
    const amount = parseAmount(requireString(body.amount, "amount"));
    const currency = parseCurrency(requireString(body.currency, "currency"));
    const productId = requireString(body.productId, "productId");

    const signed = createSignedCheckoutFields({
      apiBaseUrl: this.apiBaseUrl,
      merchantId: this.merchantId,
      secretKey: this.secretKey,
      fields: {
        amount,
        currency,
        returnURL: this.buildUrl("/payment/cancelled", { productId }),
        continueSuccessURL: this.buildUrl("/payment/success", { productId }),
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

    const response = await fetch(`${this.apiBaseUrl}/api/payment/checkout`, {
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
  }

  async getStatus(body: Record<string, unknown>): Promise<StatusResponse> {
    const md5 = requireString(body.md5, "md5");
    const pollToken = requireString(body.pollToken, "pollToken");

    const response = await fetch(`${this.apiBaseUrl}/api/payment/status`, {
      method: "POST",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ md5, pollToken }),
    });
    const text = await response.text();
    const contentType = response.headers.get("content-type") ?? "application/json; charset=utf-8";

    return {
      status: response.status,
      contentType,
      body: contentType.includes("application/json") ? JSON.parse(text) : text,
    };
  }

  get health() {
    return {
      ok: true,
      apiBaseUrl: this.apiBaseUrl,
      appBaseUrl: this.appBaseUrl,
    };
  }

  private get apiBaseUrl() {
    return process.env.KOMA_API_URL?.trim() || this.defaultApiBaseUrl;
  }

  private get appBaseUrl() {
    return (
      process.env.KOMA_APP_URL?.trim() ||
      process.env.NEXT_PUBLIC_APP_URL?.trim() ||
      this.defaultAppBaseUrl
    );
  }

  private get merchantId() {
    return requireEnv("KOMA_MERCHANT_ID");
  }

  private get secretKey() {
    return requireEnv("KOMA_SECRET_KEY");
  }

  private buildUrl(pathname: string, params?: Record<string, string | undefined>) {
    const url = new URL(pathname, this.appBaseUrl);

    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value) {
          url.searchParams.set(key, value);
        }
      }
    }

    return url.toString();
  }
}
