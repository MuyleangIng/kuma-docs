"use client";

import { useState } from "react";

type CheckoutFields = {
  baseURL: string;
  amount: string;
  merchantId: string;
  secretKey: string;
  tranID: string;
  currency: "USD" | "KHR";
  returnURL: string;
  continueSuccessURL: string;
};

async function computeHash(fields: CheckoutFields): Promise<string> {
  const message =
    fields.continueSuccessURL +
    fields.returnURL +
    fields.currency +
    fields.tranID +
    fields.merchantId +
    fields.amount;
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(fields.secretKey),
    { name: "HMAC", hash: "SHA-512" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return btoa(String.fromCharCode(...new Uint8Array(sig)));
}

export function ApiPlaygroundCheckout() {
  const [fields, setFields] = useState<CheckoutFields>({
    baseURL: "",
    amount: "1.00",
    merchantId: "",
    secretKey: "",
    tranID: `TXN_${Date.now()}`,
    currency: "USD",
    returnURL: "",
    continueSuccessURL: "",
  });
  const [hash, setHash] = useState("");
  const [hashError, setHashError] = useState("");
  const [status, setStatus] = useState<"idle" | "hashing" | "loading" | "done" | "error">("idle");
  const [responseHTML, setResponseHTML] = useState("");
  const [responseError, setResponseError] = useState("");

  function setField(key: keyof CheckoutFields, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }));
    setHash("");
    setHashError("");
  }

  async function handleGenerateHash() {
    if (!fields.secretKey || !fields.amount || !fields.merchantId) {
      setHashError("Secret Key, Merchant ID, and Amount are required to generate the hash.");
      return;
    }

    setStatus("hashing");
    setHashError("");

    try {
      const nextHash = await computeHash(fields);
      setHash(nextHash);
      setStatus("idle");
    } catch {
      setHashError("Hash generation failed. Check your Secret Key.");
      setStatus("idle");
    }
  }

  async function handleSend() {
    if (!fields.baseURL) {
      setResponseError("Enter your API base URL first.");
      return;
    }

    if (!hash) {
      setResponseError("Generate the hash first before sending.");
      return;
    }

    setStatus("loading");
    setResponseHTML("");
    setResponseError("");

    try {
      const fd = new FormData();
      fd.append("amount", fields.amount);
      fd.append("merchantId", fields.merchantId);
      fd.append("hash", hash);
      if (fields.tranID) fd.append("tranID", fields.tranID);
      fd.append("currency", fields.currency);
      if (fields.returnURL) fd.append("returnURL", fields.returnURL);
      if (fields.continueSuccessURL) fd.append("continueSuccessURL", fields.continueSuccessURL);

      const url = `${fields.baseURL.replace(/\/$/, "")}/api/payment/checkout`;
      const res = await fetch(url, { method: "POST", body: fd });
      const contentType = res.headers.get("content-type") ?? "";

      if (contentType.includes("text/html")) {
        const html = await res.text();
        setResponseHTML(html);
        setStatus("done");
      } else {
        const text = await res.text();
        setResponseError(`HTTP ${res.status} — ${text}`);
        setStatus("error");
      }
    } catch (error) {
      setResponseError(error instanceof Error ? error.message : "Network error");
      setStatus("error");
    }
  }

  return (
    <div className="api-pg">
      <div className="api-pg-endpoint">
        <span className="api-pg-method">POST</span>
        <span className="api-pg-path">/api/payment/checkout</span>
        <span className="api-pg-ct">multipart/form-data</span>
      </div>

      <div className="api-pg-body">
        <div className="api-pg-form">
          <fieldset className="api-pg-fieldset">
            <legend className="api-pg-legend">Connection</legend>
            <label className="api-pg-label">
              Base URL
              <input
                className="api-pg-input"
                placeholder="https://your-app.com"
                type="url"
                value={fields.baseURL}
                onChange={(event) => setField("baseURL", event.target.value)}
              />
            </label>
          </fieldset>

          <fieldset className="api-pg-fieldset">
            <legend className="api-pg-legend">Credentials</legend>
            <label className="api-pg-label">
              Merchant ID <span className="api-pg-required">required</span>
              <input
                className="api-pg-input"
                placeholder="your_merchant_id"
                type="text"
                value={fields.merchantId}
                onChange={(event) => setField("merchantId", event.target.value)}
              />
            </label>
            <label className="api-pg-label">
              Secret Key <span className="api-pg-required">required for hash</span>
              <input
                className="api-pg-input api-pg-input-secret"
                placeholder="sk_••••••••"
                type="password"
                value={fields.secretKey}
                onChange={(event) => setField("secretKey", event.target.value)}
              />
              <span className="api-pg-hint">
                Used only in-browser to compute the HMAC. Never sent to any server.
              </span>
            </label>
          </fieldset>

          <fieldset className="api-pg-fieldset">
            <legend className="api-pg-legend">Payment Fields</legend>
            <label className="api-pg-label">
              Amount <span className="api-pg-required">required</span>
              <input
                className="api-pg-input"
                min="0.01"
                placeholder="1.00"
                step="0.01"
                type="number"
                value={fields.amount}
                onChange={(event) => setField("amount", event.target.value)}
              />
            </label>
            <label className="api-pg-label">
              Currency
              <select
                className="api-pg-select"
                value={fields.currency}
                onChange={(event) => setField("currency", event.target.value)}
              >
                <option value="USD">USD</option>
                <option value="KHR">KHR</option>
              </select>
            </label>
            <label className="api-pg-label">
              Transaction ID
              <input
                className="api-pg-input"
                placeholder="TXN_1234567890"
                type="text"
                value={fields.tranID}
                onChange={(event) => setField("tranID", event.target.value)}
              />
            </label>
          </fieldset>

          <fieldset className="api-pg-fieldset">
            <legend className="api-pg-legend">Redirect URLs</legend>
            <label className="api-pg-label">
              Return URL
              <input
                className="api-pg-input"
                placeholder="https://your-app.com/payment/cancelled"
                type="url"
                value={fields.returnURL}
                onChange={(event) => setField("returnURL", event.target.value)}
              />
            </label>
            <label className="api-pg-label">
              Continue Success URL
              <input
                className="api-pg-input"
                placeholder="https://your-app.com/payment/success"
                type="url"
                value={fields.continueSuccessURL}
                onChange={(event) => setField("continueSuccessURL", event.target.value)}
              />
            </label>
          </fieldset>

          <div className="api-pg-hash-panel">
            <div className="api-pg-hash-header">
              <span className="api-pg-hash-label">HMAC-SHA512 Hash</span>
              <button
                className="api-pg-btn api-pg-btn-secondary"
                disabled={status === "hashing"}
                type="button"
                onClick={handleGenerateHash}
              >
                {status === "hashing" ? "Generating…" : "Generate hash"}
              </button>
            </div>

            {hashError ? (
              <p className="api-pg-error-inline">{hashError}</p>
            ) : hash ? (
              <code className="api-pg-hash-value">{hash}</code>
            ) : (
              <p className="api-pg-hint">Fill in credentials and fields, then click Generate hash.</p>
            )}
          </div>

          <button
            className="api-pg-btn api-pg-btn-primary"
            disabled={status === "loading" || !hash || !fields.baseURL}
            type="button"
            onClick={handleSend}
          >
            {status === "loading" ? "Sending…" : "Send request →"}
          </button>
        </div>

        <div className="api-pg-response">
          <div className="api-pg-response-header">
            <span className="api-pg-response-label">Response</span>
            {status === "done" ? (
              <span className="api-pg-status-badge api-pg-status-ok">200 OK · text/html</span>
            ) : null}
            {status === "error" ? (
              <span className="api-pg-status-badge api-pg-status-err">Error</span>
            ) : null}
          </div>

          {status === "idle" ? (
            <div className="api-pg-response-empty">
              <span className="api-pg-response-empty-icon">▷</span>
              <p>Fill the form and send the request to see the live KHQR checkout page here.</p>
            </div>
          ) : null}

          {status === "loading" ? (
            <div className="api-pg-response-empty">
              <span className="api-pg-response-empty-icon api-pg-spin">◌</span>
              <p>Waiting for response…</p>
            </div>
          ) : null}

          {status === "done" && responseHTML ? (
            <div className="api-pg-iframe-wrap">
              <iframe
                className="api-pg-iframe"
                sandbox="allow-scripts allow-forms allow-same-origin allow-popups"
                srcDoc={responseHTML}
                title="KHQR Checkout Preview"
              />
            </div>
          ) : null}

          {status === "error" && responseError ? (
            <div className="api-pg-response-err-body">
              <pre className="api-pg-response-pre">{responseError}</pre>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
