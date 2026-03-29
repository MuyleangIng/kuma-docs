<script setup lang="ts">
import { computed, ref } from "vue";

type Product = {
  currency: "USD" | "KHR";
  desc: string;
  id: string;
  name: string;
  price: string;
};

const products: Product[] = [
  {
    id: "DIAMOND-01",
    name: "Diamond Game Pass",
    desc: "1200 gems and limited skin unlock",
    price: "10",
    currency: "USD",
  },
  {
    id: "BOOST-01",
    name: "Rank Boost Bundle",
    desc: "XP boost, coins, and badge pack",
    price: "6",
    currency: "USD",
  },
];

const loadingId = ref<string | null>(null);
const error = ref("");
const phase = ref<"idle" | "ready" | "scanned" | "success" | "failed">("idle");
const qrDataUrl = ref("");
const md5 = ref("");
const pollToken = ref("");
const selected = ref<Product | null>(null);
let timer: ReturnType<typeof setTimeout> | null = null;

const pathname = computed(() => window.location.pathname);

function stopPolling() {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
}

async function poll() {
  if (!md5.value || !pollToken.value) {
    return;
  }

  try {
    const response = await fetch("/api/koma-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ md5: md5.value, pollToken: pollToken.value }),
    });
    const data = await response.json();
    const bakong = data?.data ?? {};

    if (bakong.responseCode === 0) {
      phase.value = "success";
      stopPolling();
      return;
    }

    if (bakong.responseCode === 1 && bakong.errorCode === 2) {
      phase.value = "scanned";
    }

    if (bakong.responseCode === 1 && bakong.errorCode === 3) {
      phase.value = "failed";
      stopPolling();
      return;
    }
  } catch {
    // Retry on transient errors.
  }

  timer = setTimeout(poll, 2500);
}

async function openCheckout(product: Product) {
  stopPolling();
  error.value = "";
  loadingId.value = product.id;
  selected.value = product;

  try {
    const response = await fetch("/api/koma-qr", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: product.price,
        currency: product.currency,
        productId: product.id,
      }),
    });
    const data = await response.json();

    if (!response.ok || data.error) {
      throw new Error(data.error || "Failed to create QR checkout");
    }

    qrDataUrl.value = data.qrDataUrl;
    md5.value = data.md5;
    pollToken.value = data.pollToken;
    phase.value = "ready";
    timer = setTimeout(poll, 800);
  } catch (err) {
    phase.value = "idle";
    error.value = err instanceof Error ? err.message : "Checkout failed";
  } finally {
    loadingId.value = null;
  }
}

function closeModal() {
  stopPolling();
  phase.value = "idle";
  qrDataUrl.value = "";
  md5.value = "";
  pollToken.value = "";
  selected.value = null;
}

</script>

<template>
  <main v-if="pathname === '/payment/success'" class="shell">
    <section class="state-card state-card--success">
      <h1>Payment Successful</h1>
      <p>Your KHQR payment was confirmed.</p>
      <a href="/">Back to shop</a>
    </section>
  </main>

  <main v-else-if="pathname === '/payment/cancelled'" class="shell">
    <section class="state-card state-card--cancelled">
      <h1>Payment Cancelled</h1>
      <p>The KHQR payment was cancelled or not completed.</p>
      <a href="/">Try again</a>
    </section>
  </main>

  <main v-else class="shell">
    <header class="hero">
      <p class="eyebrow">Vue + Vite sandbox</p>
      <h1>Diamond Game Store</h1>
      <p class="sub">Vue owns the page. Express owns the secure Koma routes.</p>
    </header>

    <section class="grid">
      <article v-for="product in products" :key="product.id" class="card">
        <div class="card__top">
          <div>
            <h2>{{ product.name }}</h2>
            <p>{{ product.desc }}</p>
          </div>
          <strong>${{ product.price }}</strong>
        </div>
        <button class="pay" :disabled="loadingId === product.id" @click="openCheckout(product)">
          {{ loadingId === product.id ? "Loading..." : "Pay with KHQR" }}
        </button>
      </article>
    </section>

    <p v-if="error" class="error">{{ error }}</p>

    <div v-if="phase !== 'idle' && selected" class="overlay" @click.self="closeModal">
      <div class="modal">
        <p class="eyebrow">KHQR Checkout</p>
        <h2>{{ selected.name }}</h2>
        <p class="amount">${{ selected.price }} {{ selected.currency }}</p>

        <div v-if="phase === 'ready' || phase === 'scanned'">
          <img class="qr" :src="qrDataUrl" alt="KHQR code" />
          <p>{{ phase === "scanned" ? "QR scanned. Waiting for confirmation..." : "Scan to pay with your banking app." }}</p>
        </div>

        <div v-else-if="phase === 'success'">
          <p class="success">Payment confirmed.</p>
        </div>

        <div v-else-if="phase === 'failed'">
          <p class="error">Payment failed.</p>
        </div>

        <button class="secondary" @click="closeModal">Close</button>
      </div>
    </div>
  </main>
</template>

<style>
:root {
  font-family: "Segoe UI", Arial, sans-serif;
  color: #0f172a;
  background: linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%);
}

body {
  margin: 0;
}

.shell {
  max-width: 720px;
  margin: 0 auto;
  padding: 48px 20px 72px;
}

.hero {
  margin-bottom: 28px;
}

.eyebrow {
  color: #7c3aed;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  margin: 0 0 10px;
  text-transform: uppercase;
}

.sub {
  color: #64748b;
}

.grid {
  display: grid;
  gap: 16px;
}

.card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  box-shadow: 0 18px 48px rgba(15, 23, 42, 0.08);
  padding: 20px;
}

.card__top {
  display: flex;
  gap: 16px;
  justify-content: space-between;
  margin-bottom: 16px;
}

.card h2 {
  margin: 0 0 6px;
}

.card p {
  color: #64748b;
  margin: 0;
}

.pay,
.secondary,
.state-card a {
  appearance: none;
  border: 0;
  border-radius: 999px;
  cursor: pointer;
  display: inline-flex;
  font-weight: 700;
  justify-content: center;
  padding: 12px 18px;
  text-decoration: none;
}

.pay {
  background: #111827;
  color: #fff;
  width: 100%;
}

.pay:disabled {
  opacity: 0.65;
}

.error {
  color: #dc2626;
  margin-top: 14px;
}

.success {
  color: #15803d;
}

.overlay {
  align-items: center;
  background: rgba(15, 23, 42, 0.6);
  display: flex;
  inset: 0;
  justify-content: center;
  padding: 20px;
  position: fixed;
}

.modal,
.state-card {
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 24px 80px rgba(15, 23, 42, 0.22);
  padding: 28px;
  text-align: center;
}

.modal {
  max-width: 420px;
  width: 100%;
}

.amount {
  font-size: 22px;
  font-weight: 700;
}

.qr {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  display: block;
  margin: 0 auto 12px;
  padding: 14px;
  width: 220px;
}

.secondary,
.state-card a {
  background: #0f172a;
  color: #fff;
  margin-top: 12px;
}

.state-card {
  margin-top: 80px;
}

.state-card--success {
  border: 1px solid #86efac;
}

.state-card--cancelled {
  border: 1px solid #fca5a5;
}
</style>
