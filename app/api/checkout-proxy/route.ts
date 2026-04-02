import { NextRequest, NextResponse } from "next/server";
import { createCheckoutSession } from "koma-khqr/server";

const API_BASE_URL = "https://koma.khqr.site";

export async function POST(req: NextRequest) {
  let payload: Record<string, string>;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { merchantId, secretKey, amount, currency, tranID, returnURL, continueSuccessURL } = payload;

  if (!merchantId || !secretKey || !amount) {
    return NextResponse.json(
      { error: "merchantId, secretKey, and amount are required" },
      { status: 400 },
    );
  }

  try {
    // SDK handles: amount normalisation, hash generation, FormData build, and POST.
    const result = await createCheckoutSession({
      apiBaseUrl: API_BASE_URL,
      merchantId,
      secretKey,
      fields: {
        amount,
        currency: (currency as "USD" | "KHR") || "USD",
        tranID: tranID || undefined,
        returnURL: returnURL || undefined,
        continueSuccessURL: continueSuccessURL || undefined,
      },
    });

    return new NextResponse(result.body, {
      status: result.status,
      headers: { "content-type": result.contentType },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Checkout failed" },
      { status: 500 },
    );
  }
}
