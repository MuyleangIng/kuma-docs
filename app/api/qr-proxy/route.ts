import { NextRequest, NextResponse } from "next/server";
import { createSignedCheckoutFields } from "koma-khqr/server";
import { parseCheckoutPage } from "koma-khqr/server";

const API_BASE_URL = "https://koma.khqr.site";

export async function POST(req: NextRequest) {
  const merchantId = req.nextUrl.searchParams.get("merchantId");
  const secretKey  = req.nextUrl.searchParams.get("secretKey");

  if (!merchantId || !secretKey) {
    return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
  }

  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { amount, currency = "USD" } = body;
  if (!amount) {
    return NextResponse.json({ error: "amount is required" }, { status: 400 });
  }

  let signed: ReturnType<typeof createSignedCheckoutFields>;
  try {
    signed = createSignedCheckoutFields({
      apiBaseUrl: API_BASE_URL,
      merchantId,
      secretKey,
      fields: {
        amount,
        currency: currency as "USD" | "KHR",
        returnURL: `${API_BASE_URL}`,
        continueSuccessURL: `${API_BASE_URL}`,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Sign failed" },
      { status: 400 },
    );
  }

  const fd = new FormData();
  fd.append("amount",    signed.amount);
  fd.append("merchantId", signed.merchantId);
  fd.append("hash",      signed.hash);
  fd.append("tranID",    signed.tranID);
  fd.append("currency",  signed.currency);
  if (signed.returnURL)          fd.append("returnURL",          signed.returnURL);
  if (signed.continueSuccessURL) fd.append("continueSuccessURL", signed.continueSuccessURL);

  let upstreamRes: Response;
  try {
    upstreamRes = await fetch(`${API_BASE_URL}/api/payment/checkout`, {
      method: "POST",
      body: fd,
      cache: "no-store",
    });
  } catch (err) {
    return NextResponse.json({ error: "Upstream unreachable: " + String(err) }, { status: 502 });
  }

  const html = await upstreamRes.text();

  if (!upstreamRes.ok) {
    return NextResponse.json({ error: html || "Checkout failed" }, { status: upstreamRes.status });
  }

  const parsed = parseCheckoutPage(html, { assetBaseUrl: API_BASE_URL });
  if (!parsed) {
    return NextResponse.json({ error: "Could not parse checkout response" }, { status: 502 });
  }

  return NextResponse.json({ ...parsed, tranID: signed.tranID });
}
