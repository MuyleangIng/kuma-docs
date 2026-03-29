<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";

type Phase = "idle" | "ready" | "scanned" | "failed";

type Product = {
  currency: "USD" | "KHR";
  desc: string;
  id: string;
  name: string;
  price: string;
};

const products: Product[] = [
  {
    id: "CITY-01",
    name: "Phnom Penh City Pass",
    desc: "Curated city guide and venue access bundle",
    price: "14",
    currency: "USD",
  },
  {
    id: "TRAVEL-01",
    name: "Tonle Explorer Kit",
    desc: "Travel map, notebook, and local coffee voucher",
    price: "9",
    currency: "USD",
  },
];

const selected = ref<Product | null>(null);
const loadingId = ref<string | null>(null);
const error = ref("");
const phase = ref<Phase>("idle");
const qrDataUrl = ref("");
const md5 = ref("");
const pollToken = ref("");
let timer: ReturnType<typeof setTimeout> | null = null;

function stopPolling() {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
}

onBeforeUnmount(() => stopPolling());

async function poll() {
  if (!md5.value || !pollToken.value || !selected.value) {
    return;
  }

  try {
    const response = await fetch("/api/koma-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ md5: md5.value, pollToken: pollToken.value }),
    });

    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? await response.json()
      : JSON.parse(await response.text());
    const bakong = data?.data ?? {};

    if (bakong.responseCode === 0) {
      stopPolling();
      window.location.href = `/payment/success?productId=${encodeURIComponent(selected.value.id)}`;
      return;
    }

    if (bakong.responseCode === 1 && bakong.errorCode === 2) {
      phase.value = "scanned";
      timer = setTimeout(poll, 2500);
      return;
    }

    if (bakong.responseCode === 1 && bakong.errorCode === 3) {
      stopPolling();
      window.location.href = `/payment/cancelled?productId=${encodeURIComponent(selected.value.id)}`;
      return;
    }
  } catch {
    // Retry on transient errors.
  }

  timer = setTimeout(poll, 3000);
}

async function openCheckout(product: Product) {
  stopPolling();
  selected.value = product;
  loadingId.value = product.id;
  error.value = "";
  phase.value = "idle";

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
    selected.value = null;
    error.value = err instanceof Error ? err.message : "Checkout failed";
  } finally {
    loadingId.value = null;
  }
}

function closeModal() {
  stopPolling();
  selected.value = null;
  qrDataUrl.value = "";
  md5.value = "";
  pollToken.value = "";
  phase.value = "idle";
}
</script>

<template>
  <main class="shell">
    <header class="hero">
      <p class="eyebrow">Nuxt full-stack demo</p>
      <h1>Nuxt KHQR Travel Shop</h1>
      <p class="sub">Nuxt owns both the pages and the secure Koma server routes.</p>
    </header>

    <section class="grid">
      <article v-for="product in products" :key="product.id" class="card">
        <div class="card__top">
          <p class="eyebrow">Nuxt Demo</p>
          <h2>{{ product.name }}</h2>
          <p>{{ product.desc }}</p>
        </div>
        <div class="price">
          <strong>${{ product.price }}</strong>
          <button class="pay" :disabled="loadingId === product.id" @click="openCheckout(product)">
            {{ loadingId === product.id ? "Loading..." : "Pay with KHQR" }}
          </button>
        </div>
      </article>
    </section>

    <p v-if="error" class="error">{{ error }}</p>

    <div v-if="selected" class="overlay" @click.self="closeModal">
      <div class="modal">
        <p class="eyebrow">KHQR Checkout</p>
        <h2>{{ selected.name }}</h2>
        <p class="amount">${{ selected.price }} {{ selected.currency }}</p>

        <div v-if="phase === 'ready' || phase === 'scanned'">
          <img class="qr" :src="qrDataUrl" alt="KHQR code" />
          <p class="status">
            {{
              phase === "scanned"
                ? "QR scanned. Waiting for payment confirmation..."
                : "Scan this QR with your banking app."
            }}
          </p>
        </div>

        <p v-else class="status">Creating QR session...</p>

        <div class="actions">
          <button class="secondary" @click="closeModal">Close</button>
        </div>
      </div>
    </div>
  </main>
</template>
