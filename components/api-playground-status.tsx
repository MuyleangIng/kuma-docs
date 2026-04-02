"use client";

import { useState } from "react";

type StatusFields = {
  md5: string;
  pollToken: string;
};

type StatusResponse = {
  success: boolean;
  data: {
    responseCode: number;
    responseMessage: string;
    errorCode: number | null;
    data: Record<string, unknown> | null;
  };
};

function getResponseLabel(data: StatusResponse["data"] | null): {
  label: string;
  kind: "success" | "pending" | "failed" | "unknown";
} {
  if (!data) return { label: "No data", kind: "unknown" };
  if (data.responseCode === 0) return { label: "Payment confirmed", kind: "success" };
  if (data.responseCode === 1 && data.errorCode === 2)
    return { label: "QR scanned — awaiting bank", kind: "pending" };
  if (data.responseCode === 1 && data.errorCode === 3)
    return { label: "Payment failed / rejected", kind: "failed" };
  if (data.responseCode === 1 && data.errorCode === null)
    return { label: "Pending — QR not yet scanned", kind: "pending" };
  return { label: "Unknown state", kind: "unknown" };
}

export function ApiPlaygroundStatus() {
  const [fields, setFields] = useState<StatusFields>({
    md5: "",
    pollToken: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [response, setResponse] = useState<StatusResponse | null>(null);
  const [rawError, setRawError] = useState("");
  const [httpStatus, setHttpStatus] = useState<number | null>(null);

  function setField(key: keyof StatusFields, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }));
    setResponse(null);
    setRawError("");
    setHttpStatus(null);
    setStatus("idle");
  }

  async function handleSend() {
    if (!fields.md5 || !fields.pollToken) {
      setRawError("md5 and pollToken are required.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    setResponse(null);
    setRawError("");
    setHttpStatus(null);
    try {
      const res = await fetch("/api/status-proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ md5: fields.md5, pollToken: fields.pollToken }),
      });
      setHttpStatus(res.status);
      const json = await res.json();
      if (res.ok) {
        setResponse(json as StatusResponse);
        setStatus("done");
      } else {
        setRawError(JSON.stringify(json, null, 2));
        setStatus("error");
      }
    } catch (err) {
      setRawError(err instanceof Error ? err.message : "Network error");
      setStatus("error");
    }
  }

  const responseLabel = response ? getResponseLabel(response.data) : null;

  return (
    <div className="api-pg">
      <div className="api-pg-endpoint">
        <span className="api-pg-method">POST</span>
        <span className="api-pg-path">/api/payment/status</span>
        <span className="api-pg-ct">application/json</span>
      </div>

      <div className="api-pg-body api-pg-body-narrow">
        <div className="api-pg-form">
          <fieldset className="api-pg-fieldset">
            <legend className="api-pg-legend">Request Body</legend>
            <label className="api-pg-label">
              md5 <span className="api-pg-required">required</span>
              <input
                className="api-pg-input"
                placeholder="MD5 from checkout response"
                type="text"
                value={fields.md5}
                onChange={(e) => setField("md5", e.target.value)}
              />
            </label>
            <label className="api-pg-label">
              pollToken <span className="api-pg-required">required</span>
              <input
                className="api-pg-input"
                placeholder="pollToken from checkout response"
                type="text"
                value={fields.pollToken}
                onChange={(e) => setField("pollToken", e.target.value)}
              />
              <span className="api-pg-hint">
                Values are available in the checkout response from the QR Checkout playground.
              </span>
            </label>
          </fieldset>

          <div className="api-pg-preview-json">
            <span className="api-pg-legend">Request preview</span>
            <pre className="api-pg-json-pre">
              {JSON.stringify(
                {
                  md5: fields.md5 || "<md5>",
                  pollToken: fields.pollToken || "<pollToken>",
                },
                null,
                2,
              )}
            </pre>
          </div>

          <button
            className="api-pg-btn api-pg-btn-primary"
            disabled={status === "loading" || !fields.md5 || !fields.pollToken}
            type="button"
            onClick={handleSend}
          >
            {status === "loading" ? "Checking…" : "Check status"}
          </button>
        </div>

        <div className="api-pg-response">
          <div className="api-pg-response-header">
            <span className="api-pg-response-label">Response</span>
            {httpStatus !== null ? (
              <span
                className={`api-pg-status-badge ${
                  httpStatus < 400 ? "api-pg-status-ok" : "api-pg-status-err"
                }`}
              >
                HTTP {httpStatus}
              </span>
            ) : null}
            {responseLabel ? (
              <span className={`api-pg-state-pill api-pg-state-${responseLabel.kind}`}>
                {responseLabel.label}
              </span>
            ) : null}
          </div>

          {status === "idle" ? (
            <div className="api-pg-response-empty">
              <span className="api-pg-response-empty-icon">▷</span>
              <p>Enter md5 and pollToken from the checkout response, then send.</p>
            </div>
          ) : null}

          {status === "loading" ? (
            <div className="api-pg-response-empty">
              <span className="api-pg-response-empty-icon api-pg-spin">◌</span>
              <p>Calling the local SDK status route…</p>
            </div>
          ) : null}

          {status === "done" && response ? (
            <pre className="api-pg-response-pre api-pg-response-pre-scroll">
              {JSON.stringify(response, null, 2)}
            </pre>
          ) : null}

          {status === "error" && rawError ? (
            <div className="api-pg-response-err-body">
              <pre className="api-pg-response-pre">{rawError}</pre>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
