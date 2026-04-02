import type { Metadata } from "next";
import Link from "next/link";

import { DocsShell } from "@/components/docs-shell";

export const metadata: Metadata = {
  title: "Webhooks & Events — API Reference",
  description:
    "Receive payment outcomes via browser redirects and real-time window.postMessage events from the hosted KHQR checkout page.",
};

const TOC = [
  { id: "overview", level: 2 as const, text: "Overview" },
  { id: "redirect-urls", level: 2 as const, text: "Redirect URLs" },
  { id: "payment-flow", level: 2 as const, text: "Payment flow" },
  { id: "postmessage-events", level: 2 as const, text: "postMessage events" },
  { id: "event-payload", level: 2 as const, text: "Event payload examples" },
  { id: "listening", level: 2 as const, text: "Listening for events" },
  { id: "best-practices", level: 2 as const, text: "Best practices" },
];

export default function ApiWebhooksPage() {
  return (
    <DocsShell currentSlug="api-webhooks" toc={TOC}>
      {/* ── Page header ── */}
      <div className="docs-page-meta">
        <div className="docs-breadcrumbs">
          <Link href="/docs">Docs</Link>
          <span aria-hidden="true">/</span>
          <span>Reference</span>
        </div>
        <div className="docs-badge-row">
          <span className="docs-badge">Reference</span>
          <span className="docs-badge">EVENTS</span>
          <span className="docs-badge">v1.1.0</span>
        </div>
        <h1 className="docs-page-title">Webhooks &amp; Events</h1>
        <p className="docs-page-copy">
          Receive payment outcomes via browser redirects (<code>returnURL</code> /{" "}
          <code>continueSuccessURL</code>) and real-time <code>window.postMessage</code> events
          emitted by the hosted checkout page.
        </p>
      </div>

      <div className="api-ref-callout api-ref-callout-info" style={{ marginBottom: 32 }}>
        <strong>No server-to-server webhooks.</strong> Koma KHQR uses browser redirects and{" "}
        <code>postMessage</code> events — not HTTP webhook callbacks. There is no server-to-server
        POST to a webhook URL. The checkout page handles all state transitions and notifies your
        page directly.
      </div>

      <article className="docs-article">
        {/* ── Redirect URLs ── */}
        <h2 id="redirect-urls">Redirect URLs</h2>
        <p>
          Two optional URLs control where the customer ends up after a payment outcome. Pass them as
          form fields in the checkout request.
        </p>
        <div className="api-ref-table-wrap">
          <table className="api-ref-table">
            <thead>
              <tr>
                <th>Parameter</th>
                <th>When triggered</th>
                <th>Behaviour</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>continueSuccessURL</code></td>
                <td>Payment confirmed</td>
                <td>
                  The checkout page immediately redirects the customer here after the bank confirms
                  payment (<code>responseCode: 0</code> from Bakong). If empty, the success screen
                  is shown instead.
                </td>
              </tr>
              <tr>
                <td><code>returnURL</code></td>
                <td>Success screen CTA</td>
                <td>
                  When <code>continueSuccessURL</code> is empty, the success screen shows a
                  "Continue Shopping" button that redirects here. If both are empty no redirect ever
                  occurs.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ── Payment flow ── */}
        <h2 id="payment-flow">Payment flow</h2>
        <div className="api-ref-flow">
          <div className="api-ref-flow-step">
            <span className="api-ref-flow-icon api-ref-flow-icon-ok">✓</span>
            <div>
              <strong>Payment confirmed</strong>
              <ul>
                <li><code>continueSuccessURL</code> set → auto-redirect to <code>continueSuccessURL</code></li>
                <li><code>continueSuccessURL</code> empty → show success screen with <code>returnURL</code> button</li>
              </ul>
            </div>
          </div>
          <div className="api-ref-flow-step">
            <span className="api-ref-flow-icon api-ref-flow-icon-close">✕</span>
            <div>
              <strong>Customer closes modal</strong>
              <ul>
                <li>any → <code>koma_khqr_closed</code> postMessage, no redirect</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ── postMessage events ── */}
        <h2 id="postmessage-events">window.postMessage events</h2>
        <p>
          For inline or modal integrations, the checkout page broadcasts events to the parent window
          or opener via <code>postMessage</code>. Listen for these to react to all outcomes without
          relying on redirects.
        </p>
        <div className="api-ref-table-wrap">
          <table className="api-ref-table">
            <thead>
              <tr>
                <th>Event type</th>
                <th>Trigger</th>
                <th><code>data.data</code></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>koma_khqr_success</code></td>
                <td>Bank confirms payment</td>
                <td>Full Bakong transaction record</td>
              </tr>
              <tr>
                <td><code>koma_khqr_failed</code></td>
                <td>Bank rejects / customer declines</td>
                <td><code>null</code></td>
              </tr>
              <tr>
                <td><code>koma_khqr_expired</code></td>
                <td>10-minute session timeout</td>
                <td><code>null</code></td>
              </tr>
              <tr>
                <td><code>koma_khqr_closed</code></td>
                <td>Customer clicks the × close button</td>
                <td><code>null</code> (no redirect occurs)</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ── Event payload examples ── */}
        <h2 id="event-payload">Event payload examples</h2>
        <p>
          <strong>Success — <code>koma_khqr_success</code></strong>
        </p>
        <pre>{`{
  "type": "koma_khqr_success",
  "data": {
    "transactionId": "ORD_1234567890",
    "data": {
      "hash": "abc123...",
      "fromAccountId": "customer@acleda",
      "toAccountId": "merchant@aclb",
      "currency": "USD",
      "amount": 5,
      "description": "Payment",
      "createDateMs": 1705312000000,
      "acknowledgedDateMs": 1705312180000
    }
  }
}`}</pre>

        <p>
          <strong>Failed / Closed — <code>koma_khqr_failed</code> / <code>koma_khqr_closed</code></strong>
        </p>
        <pre>{`{
  "type": "koma_khqr_failed",
  "data": null
}`}</pre>

        {/* ── Listening for events ── */}
        <h2 id="listening">Listening for events</h2>
        <pre>{`window.addEventListener("message", (event) => {
  // Always verify the origin in production
  const { type, data } = event.data ?? {};

  if (type === "koma_khqr_success") {
    console.log("Payment confirmed", data);
    // Verify server-side with /api/payment/status before fulfilling order
  }
  if (type === "koma_khqr_closed") {
    // Hide your checkout modal/iframe
  }
  if (type === "koma_khqr_expired") {
    // Session timed out — allow customer to retry
  }
});`}</pre>

        {/* ── Best practices ── */}
        <h2 id="best-practices">Best practices</h2>
        <ul>
          <li>
            Use <code>continueSuccessURL</code> for instant auto-redirect after payment. Leave it
            empty if you want to show the built-in receipt screen first.
          </li>
          <li>
            For inline/modal integrations, always listen for <code>postMessage</code> events — the
            customer may close the modal without triggering any redirect.
          </li>
          <li>
            <strong>Do not rely solely on <code>continueSuccessURL</code></strong> to mark an order
            as paid; a customer could navigate to it directly. Always verify with{" "}
            <code>/api/payment/status</code> from your server.
          </li>
          <li>
            The <code>koma_khqr_closed</code> event fires when the customer clicks ×. No redirect
            occurs — hide the checkout modal from your UI when you receive it.
          </li>
          <li>
            Both <code>continueSuccessURL</code> and <code>returnURL</code> must be on an allowed
            domain if you have configured domain restrictions in Settings.
          </li>
        </ul>
      </article>

      <nav className="docs-footer-nav">
        <Link className="docs-footer-card" href="/docs/api-checkout">
          <span className="docs-footer-card-label">Previous</span>
          <span className="docs-footer-card-title">QR Checkout</span>
        </Link>
        <Link className="docs-footer-card" href="/docs/api-status">
          <span className="docs-footer-card-label">Next</span>
          <span className="docs-footer-card-title">Check Transaction</span>
        </Link>
      </nav>
    </DocsShell>
  );
}
