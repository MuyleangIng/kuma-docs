import type { Metadata } from "next";
import Link from "next/link";

import { ApiPlaygroundCheckout } from "@/components/api-playground-checkout";
import { DocsShell } from "@/components/docs-shell";

export const metadata: Metadata = {
  title: "QR Checkout — API Reference",
  description:
    "Generate secure KHQR checkout sessions with a single signed POST. Interactive playground included.",
};

const TOC = [
  { id: "overview", level: 2 as const, text: "Overview" },
  { id: "how-it-works", level: 2 as const, text: "How it works" },
  { id: "endpoint", level: 2 as const, text: "Endpoint" },
  { id: "request-parameters", level: 2 as const, text: "Request parameters" },
  { id: "hash-generation", level: 2 as const, text: "Hash generation" },
  { id: "responses", level: 2 as const, text: "Responses" },
  { id: "security", level: 2 as const, text: "Security" },
  { id: "playground", level: 2 as const, text: "Try it" },
];

export default function ApiCheckoutPage() {
  return (
    <DocsShell currentSlug="api-checkout" toc={TOC}>
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
        <h1 className="docs-page-title">QR Payment Checkout</h1>
        <p className="docs-page-copy">
          Generate secure, mobile-optimised KHQR checkout sessions for your customers using any
          Cambodian bank app. Mirrors the ABA PayWay QR checkout flow — powered by Koma KHQR.
        </p>
      </div>

      <article className="docs-article">
        {/* ── Overview ── */}
        <h2 id="overview">Overview</h2>
        <p>
          A single <code>POST</code> creates a signed session and returns a full KHQR checkout page
          — no redirects, no client SDK required. The page handles QR display, polling, and success
          or cancel redirects automatically.
        </p>

        {/* ── How it works ── */}
        <h2 id="how-it-works">How it works</h2>
        <ol>
          <li>
            <strong>Sign the request.</strong> Build the hash string (
            <code>continueSuccessURL + returnURL + currency + tranID + merchantId + amount</code>) and
            sign it with HMAC-SHA512 using your Secret Key.
          </li>
          <li>
            <strong>POST multipart/form-data.</strong> Send all fields to{" "}
            <code>POST /api/payment/checkout</code>. The server validates your Merchant ID, verifies
            the hash, checks domain restrictions, and generates a KHQR code.
          </li>
          <li>
            <strong>Render the response HTML.</strong> On HTTP 200 the body is a complete,
            self-contained HTML checkout page. Stream or echo it directly to the customer's browser
            — no further requests needed.
          </li>
          <li>
            <strong>Customer scans &amp; pays.</strong> The checkout page polls for payment
            confirmation automatically. On success it redirects to <code>continueSuccessURL</code>;
            on cancel/close it redirects to <code>returnURL</code>.
          </li>
        </ol>

        {/* ── Endpoint ── */}
        <h2 id="endpoint">Endpoint</h2>
        <div className="api-ref-endpoint">
          <span className="api-ref-method">POST</span>
          <code className="api-ref-path">/api/payment/checkout</code>
          <span className="api-ref-ct">multipart/form-data</span>
        </div>

        {/* ── Request parameters ── */}
        <h2 id="request-parameters">Request parameters</h2>
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
                <td><code>amount</code></td>
                <td>string</td>
                <td><span className="api-ref-required">yes</span></td>
                <td>Payment amount, e.g. <code>"1.00"</code></td>
              </tr>
              <tr>
                <td><code>merchantId</code></td>
                <td>string</td>
                <td><span className="api-ref-required">yes</span></td>
                <td>Your Koma Merchant ID from the dashboard</td>
              </tr>
              <tr>
                <td><code>hash</code></td>
                <td>string (base64)</td>
                <td><span className="api-ref-required">yes</span></td>
                <td>HMAC-SHA512 signature — see Hash generation below</td>
              </tr>
              <tr>
                <td><code>tranID</code></td>
                <td>string</td>
                <td>optional</td>
                <td>Your internal order / transaction reference</td>
              </tr>
              <tr>
                <td><code>currency</code></td>
                <td><code>"USD"</code> | <code>"KHR"</code></td>
                <td>optional</td>
                <td>Defaults to <code>"USD"</code> if omitted</td>
              </tr>
              <tr>
                <td><code>returnURL</code></td>
                <td>string (URL)</td>
                <td>optional</td>
                <td>Where to send the customer on cancel / close</td>
              </tr>
              <tr>
                <td><code>continueSuccessURL</code></td>
                <td>string (URL)</td>
                <td>optional</td>
                <td>Auto-redirect here immediately after bank confirms payment</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ── Hash generation ── */}
        <h2 id="hash-generation">Hash generation</h2>
        <p>Concatenate the fields in this exact order with <strong>no separator</strong>, then sign with HMAC-SHA512 and base64-encode the raw digest.</p>
        <pre className="api-ref-formula">
          HMAC-SHA512(secretKey,{"\n"}  continueSuccessURL + returnURL + currency + tranID + merchantId + amount)
        </pre>
        <p>
          <strong>Always generate the hash server-side</strong> to keep your Secret Key private.
          The Try It playground below computes it in-browser for convenience — never do this in
          production client code.
        </p>

        {/* ── Responses ── */}
        <h2 id="responses">Responses</h2>
        <div className="api-ref-table-wrap">
          <table className="api-ref-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Content-Type</th>
                <th>Meaning</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span className="api-ref-status api-ref-status-ok">200 OK</span></td>
                <td><code>text/html</code></td>
                <td>Full KHQR checkout page — stream directly to the browser</td>
              </tr>
              <tr>
                <td><span className="api-ref-status api-ref-status-err">400 Bad Request</span></td>
                <td><code>text/html | application/json</code></td>
                <td>Missing fields, invalid hash, or domain restriction violation</td>
              </tr>
              <tr>
                <td><span className="api-ref-status api-ref-status-err">403 Forbidden</span></td>
                <td><code>text/html</code></td>
                <td>Origin not in your allowed-domains list</td>
              </tr>
              <tr>
                <td><span className="api-ref-status api-ref-status-err">429 Too Many Requests</span></td>
                <td><code>application/json</code></td>
                <td>Global rate limit exceeded — use exponential backoff</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ── Security ── */}
        <h2 id="security">Security</h2>
        <div className="api-ref-security-grid">
          <div className="api-ref-security-card">
            <span className="api-ref-security-icon">🔐</span>
            <strong>HMAC-SHA512 signature</strong>
            <p>Every request is verified against a server-side hash using your Secret Key. Tampered fields return HTTP 400.</p>
          </div>
          <div className="api-ref-security-card">
            <span className="api-ref-security-icon">🌐</span>
            <strong>Domain restrictions</strong>
            <p>If you configure an allowed-domains list, requests from unlisted origins are blocked with HTTP 403.</p>
          </div>
          <div className="api-ref-security-card">
            <span className="api-ref-security-icon">⏱</span>
            <strong>Rate limiting</strong>
            <p>A global POST rate limit is enforced. HTTP 429 on excess. Implement exponential backoff.</p>
          </div>
          <div className="api-ref-security-card">
            <span className="api-ref-security-icon">🛡</span>
            <strong>Content Security Policy</strong>
            <p>The checkout HTML includes a strict CSP with a per-request nonce, blocking XSS in the customer's browser.</p>
          </div>
          <div className="api-ref-security-card">
            <span className="api-ref-security-icon">🔗</span>
            <strong>Redirect URL validation</strong>
            <p>Both redirect URLs are validated as proper URLs. If domain restrictions are set they must match an allowed domain.</p>
          </div>
          <div className="api-ref-security-card">
            <span className="api-ref-security-icon">⚖</span>
            <strong>Constant-time comparison</strong>
            <p>Hash comparison uses <code>timingSafeEqual</code> to prevent timing-based side-channel attacks.</p>
          </div>
        </div>

        <div className="api-ref-callout api-ref-callout-warn">
          <strong>Never expose your Secret Key</strong> in client-side code or public repositories.
          Always generate the hash on your server before sending the checkout request.
        </div>

      </article>

      <section id="playground" className="api-pg-section">
        <div className="docs-section-head">
          <p className="docs-section-label">Interactive</p>
          <h2>Try it — live KHQR checkout</h2>
          <p className="docs-page-copy" style={{ marginTop: 8 }}>
            Enter your credentials and payment fields. The hash is generated server-side using the
            same SDK logic as production — amount normalisation, HMAC-SHA512, base64 encoding.
            The response is shown as HTML source — switch to Preview to render it inline.
          </p>
        </div>
        <ApiPlaygroundCheckout />
      </section>

      <nav className="docs-footer-nav">
        <div />
        <Link className="docs-footer-card" href="/docs/api-webhooks">
          <span className="docs-footer-card-label">Next</span>
          <span className="docs-footer-card-title">Webhooks &amp; Events</span>
        </Link>
      </nav>
    </DocsShell>
  );
}
