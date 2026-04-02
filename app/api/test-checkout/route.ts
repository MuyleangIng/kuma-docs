import { createSignedCheckoutFields } from "koma-khqr/server";

const API_BASE_URL = "https://koma.khqr.site";
const RETURN_URL = `${API_BASE_URL}/api/webhooks/aba`;

type CheckoutBody = {
  merchantId?: string;
  secretKey?: string;
  amount?: string;
  currency?: string;
  productId?: string;
};

function requireString(value: unknown, name: string) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${name} is required.`);
  }

  return value.trim();
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CheckoutBody;
    const merchantId = requireString(body.merchantId, "merchantId");
    const secretKey = requireString(body.secretKey, "secretKey");
    const amount = requireString(body.amount, "amount");
    const currency = requireString(body.currency, "currency");
    const productId = requireString(body.productId, "productId");
    const continueSuccessURL = `${API_BASE_URL}/success/${encodeURIComponent(productId)}`;
    const signed = createSignedCheckoutFields({
      apiBaseUrl: API_BASE_URL,
      merchantId,
      secretKey,
      fields: {
        amount,
        continueSuccessURL,
        currency: currency as "USD" | "KHR",
        returnURL: RETURN_URL,
      },
    });

    return Response.json(
      {
        action: `${API_BASE_URL}/api/payment/checkout`,
        fields: {
          amount: signed.amount,
          continueSuccessURL: signed.continueSuccessURL,
          currency: signed.currency,
          hash: signed.hash,
          merchantId: signed.merchantId,
          returnURL: signed.returnURL,
          tranID: signed.tranID,
        },
      },
      {
        headers: {
          "cache-control": "no-store",
        },
      },
    );
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Checkout test failed.",
      },
      { status: 400 },
    );
  }
}
