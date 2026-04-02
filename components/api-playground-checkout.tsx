"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// ── Copy button ─────────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* ignore */ }
  }

  return (
    <button
      className="api-pg-inspector-copy"
      title="Copy to clipboard"
      type="button"
      onClick={handleCopy}
    >
      {copied ? (
        <svg fill="none" height="13" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" viewBox="0 0 24 24" width="13">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg fill="none" height="13" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="13">
          <rect height="13" rx="2" width="13" x="9" y="9" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

// ── JSON syntax renderer ────────────────────────────────────────────────────

const TRUNCATE_AT = 80; // chars before we truncate a string value

function JsonValue({ value, depth = 0 }: { value: unknown; depth?: number }) {
  if (value === null)  return <span className="json-null">null</span>;
  if (typeof value === "boolean") return <span className="json-bool">{String(value)}</span>;
  if (typeof value === "number")  return <span className="json-num">{String(value)}</span>;

  if (typeof value === "string") {
    const display = value.length > TRUNCATE_AT
      ? `"${value.slice(0, TRUNCATE_AT)}…"  (${value.length} chars)`
      : `"${value}"`;
    return <span className="json-str">{display}</span>;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return <span className="json-punct">[]</span>;
    return (
      <span>
        <span className="json-punct">{"["}</span>
        <span className="json-indent">
          {value.map((v, i) => (
            <div key={i} style={{ paddingLeft: (depth + 1) * 16 }}>
              <JsonValue value={v} depth={depth + 1} />
              {i < value.length - 1 && <span className="json-punct">,</span>}
            </div>
          ))}
        </span>
        <span className="json-punct" style={{ paddingLeft: depth * 16 }}>]</span>
      </span>
    );
  }

  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) return <span className="json-punct">{"{}"}</span>;
    return (
      <span>
        <span className="json-punct">{"{"}</span>
        {entries.map(([k, v], i) => (
          <div key={k} style={{ paddingLeft: (depth + 1) * 16 }}>
            <span className="json-key">&quot;{k}&quot;</span>
            <span className="json-punct">: </span>
            <JsonValue value={v} depth={depth + 1} />
            {i < entries.length - 1 && <span className="json-punct">,</span>}
          </div>
        ))}
        <span className="json-punct" style={{ paddingLeft: depth * 16 }}>{"}"}</span>
      </span>
    );
  }

  return <span>{String(value)}</span>;
}

function JsonViewer({ raw }: { raw: string }) {
  try {
    const parsed = JSON.parse(raw) as unknown;
    return (
      <div className="api-pg-json-viewer">
        <JsonValue value={parsed} />
      </div>
    );
  } catch {
    return <pre className="api-pg-inspector-pre"><code>{raw}</code></pre>;
  }
}

const QR_ENDPOINT     = "/api/qr-proxy";
const STATUS_ENDPOINT = "/api/status-proxy";

type Phase = "idle" | "fetching" | "ready" | "polling" | "success" | "failed" | "expired";

interface QrPayload {
  qrDataUrl: string;
  md5: string;
  pollToken: string;
  transactionId: string;
  tranID: string;
}

export function ApiPlaygroundCheckout() {
  const [merchantId, setMerchantId] = useState("");
  const [secretKey,  setSecretKey]  = useState("");
  const [amount,     setAmount]     = useState("1");
  const [currency,   setCurrency]   = useState<"USD" | "KHR">("USD");

  const [phase,      setPhase]      = useState<Phase>("idle");
  const [qr,         setQr]         = useState<QrPayload | null>(null);
  const [error,      setError]      = useState<string | null>(null);

  // Inspector state
  const [, setReqJson]  = useState<string>("");
  const [resJson,  setResJson]  = useState<string>("");
  const [resStatus, setResStatus] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"request" | "response">("request");
  const [countdown, setCountdown] = useState(120);

  const pollRef      = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const ready = Boolean(merchantId && secretKey && amount);

  // Live request JSON preview
  const requestBody = {
    amount,
    currency,
  };

  function stopPoll() {
    if (pollRef.current)      { clearTimeout(pollRef.current);  pollRef.current = null; }
    if (countdownRef.current) { clearInterval(countdownRef.current); countdownRef.current = null; }
  }

  const poll = useCallback(async (md5: string, pollToken: string) => {
    try {
      const res  = await fetch(STATUS_ENDPOINT, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ md5, pollToken }),
      });
      const data = await res.json() as Record<string, unknown>;

      if (!res.ok) { return; }

      const state = String(data.status ?? data.state ?? "");
      if (state === "SUCCESS" || state === "success") {
        stopPoll();
        setPhase("success");
        return;
      }
      if (state === "FAILED" || state === "failed") {
        stopPoll();
        setPhase("failed");
        return;
      }
      if (state === "EXPIRED" || state === "expired") {
        stopPoll();
        setPhase("expired");
        return;
      }

      pollRef.current = setTimeout(() => void poll(md5, pollToken), 3000);
    } catch {
      pollRef.current = setTimeout(() => void poll(md5, pollToken), 4000);
    }
  }, []);

  async function handlePay() {
    if (!ready || phase === "fetching") return;
    stopPoll();

    setPhase("fetching");
    setQr(null);
    setError(null);
    setResJson("");
    setResStatus(null);
    setCountdown(120);

    const url = `${QR_ENDPOINT}?merchantId=${encodeURIComponent(merchantId)}&secretKey=${encodeURIComponent(secretKey)}`;
    const body = JSON.stringify(requestBody);

    setReqJson(JSON.stringify({ ...requestBody, _endpoint: url }, null, 2));
    setActiveTab("request");

    try {
      const res  = await fetch(url, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });
      const data = await res.json() as Record<string, unknown>;

      setResStatus(res.status);
      setResJson(JSON.stringify(data, null, 2));
      setActiveTab("response");

      if (!res.ok || data.error) {
        setError(String(data.error ?? `HTTP ${res.status}`));
        setPhase("idle");
        return;
      }

      const payload: QrPayload = {
        qrDataUrl:     String(data.qrDataUrl ?? ""),
        md5:           String(data.md5 ?? ""),
        pollToken:     String(data.pollToken ?? ""),
        transactionId: String(data.transactionId ?? ""),
        tranID:        String(data.tranID ?? ""),
      };

      if (!payload.qrDataUrl || !payload.md5 || !payload.pollToken) {
        setError("Incomplete QR response from server.");
        setPhase("idle");
        return;
      }

      setQr(payload);
      setPhase("ready");

      // start countdown
      countdownRef.current = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            stopPoll();
            setPhase("expired");
            return 0;
          }
          return c - 1;
        });
      }, 1000);

      pollRef.current = setTimeout(() => void poll(payload.md5, payload.pollToken), 1000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Network error";
      setError(msg);
      setResJson(JSON.stringify({ error: msg }, null, 2));
      setActiveTab("response");
      setPhase("idle");
    }
  }

  function handleReset() {
    stopPoll();
    setPhase("idle");
    setQr(null);
    setError(null);
    setResJson("");
    setResStatus(null);
    setCountdown(120);
    setActiveTab("request");
  }

  useEffect(() => () => stopPoll(), []);

  // ── render ──────────────────────────────────────────────────────────────

  const statusOk  = resStatus !== null && resStatus >= 200 && resStatus < 300;
  const statusBadge = resStatus !== null
    ? `${resStatus} ${statusOk ? "OK" : "Error"}`
    : null;

  return (
    <div className="api-pg">
      <div className="api-pg-endpoint">
        <span className="api-pg-method">POST</span>
        <span className="api-pg-path">/api/payment/checkout</span>
        <span className="api-pg-ct">multipart/form-data</span>
      </div>

      <div className="api-pg-body">

        {/* ── LEFT: form + inspector ── */}
        <div className="api-pg-form">

          <fieldset className="api-pg-fieldset">
            <legend className="api-pg-legend">Credentials</legend>
            <label className="api-pg-label">
              Merchant ID <span className="api-pg-required">required</span>
              <input
                className="api-pg-input"
                placeholder="your_merchant_id"
                type="text"
                value={merchantId}
                onChange={(e) => setMerchantId(e.target.value)}
              />
            </label>
            <label className="api-pg-label">
              Secret Key <span className="api-pg-required">required</span>
              <input
                className="api-pg-input api-pg-input-secret"
                placeholder="sk_••••••••"
                type="password"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
              />
              <span className="api-pg-hint">
                Sent over HTTPS to sign the request server-side. Never stored or logged.
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
                placeholder="1"
                step="0.01"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </label>
            <label className="api-pg-label">
              Currency
              <select
                className="api-pg-select"
                value={currency}
                onChange={(e) => setCurrency(e.target.value as "USD" | "KHR")}
              >
                <option value="USD">USD</option>
                <option value="KHR">KHR</option>
              </select>
            </label>
          </fieldset>

          {/* ── JSON inspector ── */}
          <div className="api-pg-inspector">
            <div className="api-pg-inspector-tabs">
              <button
                className={`api-pg-inspector-tab${activeTab === "request" ? " active" : ""}`}
                type="button"
                onClick={() => setActiveTab("request")}
              >
                Request
              </button>
              <button
                className={`api-pg-inspector-tab${activeTab === "response" ? " active" : ""}`}
                type="button"
                onClick={() => setActiveTab("response")}
              >
                Response
                {statusBadge && (
                  <span className={`api-pg-inspector-badge${statusOk ? " ok" : " err"}`}>
                    {statusBadge}
                  </span>
                )}
              </button>
              <CopyButton text={activeTab === "request" ? JSON.stringify(requestBody, null, 2) : resJson} />
            </div>

            <div className="api-pg-inspector-body">
              {activeTab === "request" ? (
                <JsonViewer raw={JSON.stringify(requestBody)} />
              ) : resJson ? (
                <JsonViewer raw={resJson} />
              ) : (
                <p className="api-pg-hint" style={{ padding: "14px 16px", margin: 0 }}>
                  Click Send to see the server response here.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── RIGHT: live checkout ── */}
        <div className="api-pg-response">
          <div className="api-pg-response-header">
            <span className="api-pg-response-label">Live checkout</span>
            {phase === "ready" || phase === "polling" ? (
              <span className="api-pg-status-badge api-pg-status-ok">QR ready · {countdown}s</span>
            ) : phase === "success" ? (
              <span className="api-pg-status-badge api-pg-status-ok">Paid</span>
            ) : phase === "fetching" ? (
              <span className="api-pg-status-badge" style={{ color: "var(--text-secondary)" }}>Fetching…</span>
            ) : null}
          </div>

          {/* idle / error */}
          {(phase === "idle") && !error && (
            <div className="api-pg-response-empty">
              <span className="api-pg-response-empty-icon">▷</span>
              <p>{ready ? "Click Send to generate the KHQR checkout." : "Enter your credentials and amount first."}</p>
            </div>
          )}

          {error && phase === "idle" && (
            <div className="api-pg-response-empty">
              <span className="api-pg-response-empty-icon" style={{ color: "#f87171" }}>✕</span>
              <p style={{ color: "#f87171" }}>{error}</p>
            </div>
          )}

          {/* fetching */}
          {phase === "fetching" && (
            <div className="api-pg-response-empty">
              <span className="api-pg-response-empty-icon api-pg-spin">◌</span>
              <p>Generating QR…</p>
            </div>
          )}

          {/* QR ready */}
          {(phase === "ready" || phase === "polling") && qr && (
            <div className="api-pg-qr-panel">
              <p className="api-pg-qr-label">Scan with any Cambodian bank app</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="KHQR code"
                className="api-pg-qr-img"
                src={qr.qrDataUrl}
              />
              <p className="api-pg-qr-txn">TXN: {qr.tranID}</p>
            </div>
          )}

          {/* success */}
          {phase === "success" && (
            <div className="api-pg-response-empty">
              <span className="api-pg-response-empty-icon" style={{ color: "#4ade80", fontSize: 36 }}>✓</span>
              <p style={{ color: "#4ade80", fontWeight: 600 }}>Payment confirmed!</p>
            </div>
          )}

          {/* failed / expired */}
          {(phase === "failed" || phase === "expired") && (
            <div className="api-pg-response-empty">
              <span className="api-pg-response-empty-icon" style={{ color: "#f87171" }}>
                {phase === "expired" ? "⏱" : "✕"}
              </span>
              <p style={{ color: "#f87171" }}>
                {phase === "expired" ? "QR expired. Click Send to generate a new one." : "Payment failed."}
              </p>
            </div>
          )}

          {/* ── Send / Reset button ── */}
          <div className="api-pg-checkout-btn-wrap">
            {phase === "success" || phase === "failed" || phase === "expired" ? (
              <button
                className="api-pg-checkout-btn api-pg-checkout-btn-secondary"
                type="button"
                onClick={handleReset}
              >
                Try again
              </button>
            ) : (
              <button
                className="api-pg-checkout-btn"
                disabled={!ready || phase === "fetching"}
                type="button"
                onClick={handlePay}
              >
                {phase === "fetching" ? (
                  <>
                    <svg className="api-pg-checkout-spinner" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" opacity=".25" r="10" stroke="currentColor" strokeWidth="3" />
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeLinecap="round" strokeWidth="3" />
                    </svg>
                    Generating…
                  </>
                ) : (
                  "Send →"
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
