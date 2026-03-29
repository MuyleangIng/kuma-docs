import path from "node:path";
import { fileURLToPath } from "node:url";

import express from "express";
import { config as loadEnv } from "dotenv";
import { createKomaExpress } from "koma-khqr/express";

loadEnv({ path: ".env.local" });
loadEnv();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT || 3000);
const host = process.env.HOST?.trim() || "127.0.0.1";
const appBaseUrl = process.env.KOMA_APP_URL?.trim() || `http://localhost:${port}`;
const staticDir = path.join(__dirname, "public");

const PRODUCTS = [
  {
    id: "ESP-01",
    name: "Espresso Beans",
    desc: "Medium roast with chocolate notes",
    price: "12",
    currency: "USD",
  },
  {
    id: "CUP-01",
    name: "Ceramic Cup Set",
    desc: "Hand-finished cups for cafe service",
    price: "8",
    currency: "USD",
  },
];

app.use(express.json());
app.use(express.static(staticDir));
app.use(
  createKomaExpress({
    appBaseUrl,
  }),
);

app.get("/healthz", (_req, res) => {
  res.json({ ok: true, appBaseUrl });
});

app.get("/", (_req, res) => {
  const productCards = PRODUCTS.map((product) => `
    <article class="product-card">
      <div class="product-copy">
        <p class="eyebrow">Express Demo</p>
        <h2>${product.name}</h2>
        <p>${product.desc}</p>
      </div>
      <div class="product-meta">
        <strong>$${product.price}</strong>
        <button
          class="pay-button"
          data-product-id="${product.id}"
          data-product-name="${product.name}"
          data-amount="${product.price}"
          data-currency="${product.currency}"
        >
          Pay with KHQR
        </button>
      </div>
    </article>
  `).join("");

  res.type("html").send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Koma KHQR Express Example</title>
    <link rel="stylesheet" href="/styles.css" />
  </head>
  <body>
    <main class="shell">
      <header class="hero">
        <p class="eyebrow">koma-khqr/express</p>
        <h1>Express KHQR Demo Store</h1>
        <p class="sub">Express serves the pages and owns the secure Koma routes.</p>
      </header>
      <section class="product-grid">
        ${productCards}
      </section>
    </main>

    <div id="qr-overlay" class="overlay hidden">
      <section class="modal">
        <button id="close-modal" class="close-button" type="button">Close</button>
        <p class="eyebrow">KHQR Checkout</p>
        <h2 id="modal-title">Loading payment</h2>
        <p id="modal-amount" class="amount">Preparing checkout...</p>
        <div id="modal-status" class="status">Creating QR session...</div>
        <img id="qr-image" class="qr-image hidden" alt="KHQR code" />
        <div class="actions">
          <button id="cancel-payment" class="secondary-button" type="button">Cancel payment</button>
        </div>
      </section>
    </div>

    <script>
      window.KOMA_PRODUCTS = ${JSON.stringify(PRODUCTS)};
    </script>
    <script type="module" src="/app.js"></script>
  </body>
</html>`);
});

app.get("/payment/success", (req, res) => {
  const productId = typeof req.query.productId === "string" ? req.query.productId : "order";

  res.type("html").send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Payment Successful</title>
    <link rel="stylesheet" href="/styles.css" />
  </head>
  <body>
    <main class="state-shell">
      <section class="state-card success">
        <p class="eyebrow">Payment Successful</p>
        <h1>Payment confirmed</h1>
        <p>Your KHQR payment for <strong>${productId}</strong> completed successfully.</p>
        <a class="primary-link" href="/">Back to shop</a>
      </section>
    </main>
  </body>
</html>`);
});

app.get("/payment/cancelled", (req, res) => {
  const productId = typeof req.query.productId === "string" ? req.query.productId : "order";

  res.type("html").send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Payment Cancelled</title>
    <link rel="stylesheet" href="/styles.css" />
  </head>
  <body>
    <main class="state-shell">
      <section class="state-card cancelled">
        <p class="eyebrow">Payment Cancelled</p>
        <h1>Payment was not completed</h1>
        <p>The KHQR flow for <strong>${productId}</strong> was cancelled or did not finish.</p>
        <a class="primary-link" href="/">Try again</a>
      </section>
    </main>
  </body>
</html>`);
});

app.listen(port, host, () => {
  console.log(`Koma Express example running on ${appBaseUrl}`);
});
