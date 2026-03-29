import {
  getRouteError,
  requireString,
} from "koma-khqr/server";

import { getKomaConfig } from "../utils/koma";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<Record<string, unknown>>(event);
    const md5 = requireString(body.md5, "md5");
    const pollToken = requireString(body.pollToken, "pollToken");
    const config = getKomaConfig();

    const response = await fetch(`${config.apiBaseUrl}/api/payment/status`, {
      method: "POST",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ md5, pollToken }),
    });
    const text = await response.text();
    const contentType = response.headers.get("content-type") ?? "application/json; charset=utf-8";
    const isJson = contentType.includes("application/json");

    setResponseStatus(event, response.status);
    setHeader(event, "cache-control", "no-store");
    setHeader(event, "content-type", contentType);

    return isJson ? JSON.parse(text) : text;
  } catch (error) {
    const { message, status } = getRouteError(error, "Unable to check payment status");
    setResponseStatus(event, status);
    return { error: message };
  }
});
