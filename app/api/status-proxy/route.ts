import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = "https://koma.khqr.site";

export async function POST(req: NextRequest) {
  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { md5, pollToken } = body;
  if (!md5 || !pollToken) {
    return NextResponse.json({ error: "md5 and pollToken are required" }, { status: 400 });
  }

  const res = await fetch(`${API_BASE_URL}/api/payment/status`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ md5, pollToken }),
    cache: "no-store",
  });

  const text = await res.text();
  const contentType = res.headers.get("content-type") ?? "application/json; charset=utf-8";

  return new NextResponse(text, {
    status: res.status,
    headers: { "content-type": contentType },
  });
}
