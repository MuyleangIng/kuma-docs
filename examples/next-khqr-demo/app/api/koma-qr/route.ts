import { createKomaNext } from "koma-khqr/next";
import type { NextRequest } from "next/server";

export function POST(req: NextRequest) {
  return createKomaNext().qr(req);
}
