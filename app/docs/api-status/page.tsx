import type { Metadata } from "next";
import Link from "next/link";

import { ApiPlaygroundStatus } from "@/components/api-playground-status";
import { DocsShell } from "@/components/docs-shell";

export const metadata: Metadata = {
  title: "Check Transaction — API Reference",
  description:
    "Query real-time KHQR payment status using the MD5 hash and poll token. Interactive playground included.",
};

const TOC = [
  { id: "overview", level: 2 as const, text: "Overview" },
  { id: "endpoint", level: 2 as const, text: "Endpoint" },
  { id: "request-body", level: 2 as const, text: "Request body" },
  { id: "response-codes", level: 2 as const, text: "Response codes" },
  { id: "session-limits", level: 2 as const, text: "Session limits" },
  { id: "best-practices", level: 2 as const, text: "Best practices" },
  { id: "playground", level: 2 as const, text: "Try it" },
];

export default function ApiStatusPage() {
  return (
    <DocsShell currentSlug="api-status" toc={TOC}>
      {/* ── Page header ── */}
      <div className="docs-page-meta">
        <div className="docs-breadcrumbs">
          <Link href="/docs">Docs</Link>
          <span aria-hidden="true">/</span>
          <span>Reference</span>
        </div>
        <div className="docs-badge-row">
          <span className="docs-badge">Reference</span>
          <span className="docs-badge">DIRECT API</span>
          <span className="docs-badge">v1.1.0</span>
        </div>
        <h1 className="docs-page-title">Check Transaction</h1>
        <p className="docs-page-copy">
          Query real-time KHQR payment status using the MD5 hash and poll token issued with the
          checkout session. Use this endpoint for independent server-side verification.
        </p>
      </div>

      <div className="api-ref-callout api-ref-callout-info" style={{ marginBottom: 32 }}>
        <strong>Handled automatically by the checkout page.</strong> The KHQR checkout HTML polls{" "}
        <code>/api/payment/status</code> every 3 seconds automatically. You only need to call this
        endpoint directly if you want independent server-side verification using the{" "}
        <code>md5</code> and <code>pollToken</code> values.
      </div>

      <article className="docs-article">
        {/* ── Endpoint ── */}
        <h2 id="endpoint">Endpoint</h2>
        <div className="api-ref-endpoint">
          <span className="api-ref-method">POST</span>
          <code className="api-ref-path">/api/payment/status</code>
          <span className="api-ref-ct">application/json</span>
        </div>

        {/* ── Request body ── */}
        <h2 id="request-body">Request body (JSON)</h2>
        <div className="api-ref-table-wrap">
          <table className="api-ref-table">
            <thead>
              <tr>
                <th>Field</th>
                <th>Type</th>
                <th>Required</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>md5</code></td>
                <td>string (MD5 hex)</td>
                <td><span className="api-ref-required">yes</span></td>
                <td>The MD5 hash issued with the checkout session</td>
              </tr>
              <tr>
                <td><code>pollToken</code></td>
                <td>string</td>
                <td><span className="api-ref-required">yes</span></td>
                <td>The poll token issued with the checkout session. Expires after 15 min.</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ── Response codes ── */}
        <h2 id="response-codes">Response codes</h2>
        <div className="api-ref-table-wrap">
          <table className="api-ref-table">
            <thead>
              <tr>
                <th>responseCode</th>
                <th>errorCode</th>
                <th>Meaning</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span className="api-ref-status api-ref-status-ok">0</span></td>
                <td><code>null</code></td>
                <td>Payment confirmed</td>
                <td>Fulfil the order. Stop polling.</td>
              </tr>
              <tr>
                <td>1</td>
                <td>2</td>
                <td>QR scanned — awaiting bank confirmation</td>
                <td>Keep polling.</td>
              </tr>
              <tr>
                <td>1</td>
                <td>3</td>
                <td>Payment failed or rejected</td>
                <td>Stop polling. Show error.</td>
              </tr>
              <tr>
                <td>1</td>
                <td><code>null</code></td>
                <td>Pending — QR not yet scanned</td>
                <td>Keep polling until 10 min expire.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          <strong>Success response example (<code>responseCode: 0</code>)</strong>
        </p>
        <pre>{`{
  "success": true,
  "data": {
    "responseCode": 0,
    "responseMessage": "Success",
    "errorCode": null,
    "data": {
      "hash": "abc123def456...",
      "fromAccountId": "customer@acleda",
      "toAccountId": "merchant@aclb",
      "currency": "USD",
      "amount": 1,
      "description": "Payment",
      "createDateMs": 1705312000000,
      "acknowledgedDateMs": 1705312180000
    }
  }
}`}</pre>

        <p>
          <strong>Pending example (<code>responseCode: 1, errorCode: null</code>)</strong>
        </p>
        <pre>{`{
  "success": true,
  "data": {
    "responseCode": 1,
    "responseMessage": "Pending",
    "errorCode": null,
    "data": null
  }
}`}</pre>

        {/* ── Session limits ── */}
        <h2 id="session-limits">Session limits</h2>
        <div className="api-ref-table-wrap">
          <table className="api-ref-table">
            <thead>
              <tr>
                <th>Limit</th>
                <th>Value</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Poll token TTL</td>
                <td>15 minutes</td>
                <td><code>pollToken</code> expires 15 min after checkout session creation</td>
              </tr>
              <tr>
                <td>Checkout session</td>
                <td>10 minutes</td>
                <td>Checkout page stops polling after 10 min and emits <code>koma_khqr_expired</code></td>
              </tr>
              <tr>
                <td>Poll interval</td>
                <td>3 seconds</td>
                <td>Initial delay 800 ms, then every 3 s (≈ 200 attempts)</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ── Best practices ── */}
        <h2 id="best-practices">Best practices</h2>
        <ul>
          <li>The checkout page handles all polling automatically — you don't need to poll unless doing independent server-side verification.</li>
          <li>Poll every 3 seconds. Sessions expire after 10 minutes.</li>
          <li>Stop polling immediately when <code>responseCode</code> is <code>0</code> (success) or <code>errorCode</code> is <code>3</code> (failed).</li>
          <li>The <code>pollToken</code> expires after 15 minutes. Store it from the checkout HTML if you plan to verify later.</li>
          <li>Implement exponential backoff if you receive HTTP 500 errors — the Bakong network may be briefly unavailable.</li>
          <li>For guaranteed delivery, listen to the <code>postMessage</code> events emitted by the checkout page (see <Link href="/docs/api-webhooks">Webhooks &amp; Events</Link>).</li>
        </ul>
      </article>

      {/* ── Interactive playground ── */}
      <section id="playground" className="api-pg-section">
        <div className="docs-section-head">
          <p className="docs-section-label">Interactive</p>
          <h2>Try it — check a transaction</h2>
          <p className="docs-page-copy" style={{ marginTop: 8 }}>
            Enter the <code>md5</code> and <code>pollToken</code> from an active checkout session
            to query the live payment status directly.
          </p>
        </div>
        <ApiPlaygroundStatus />
      </section>

      <nav className="docs-footer-nav">
        <Link className="docs-footer-card" href="/docs/api-webhooks">
          <span className="docs-footer-card-label">Previous</span>
          <span className="docs-footer-card-title">Webhooks &amp; Events</span>
        </Link>
        <div />
      </nav>
    </DocsShell>
  );
}
