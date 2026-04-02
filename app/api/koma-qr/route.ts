import { createKomaNext } from "koma-khqr/next";

export const runtime = "nodejs";

export function POST(req: Request) {
  return createKomaNext().qr(req);
}
