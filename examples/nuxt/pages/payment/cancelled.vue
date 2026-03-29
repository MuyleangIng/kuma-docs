<template>
  <main class="shell">
    <section class="state-card cancelled">
      <p class="eyebrow">Payment Cancelled</p>
      <h1>Payment was not completed</h1>
      <p class="sub">
        The KHQR flow for <strong>{{ productId }}</strong> was cancelled or did not finish.
      </p>
      <NuxtLink class="primary-link" to="/">Try again</NuxtLink>
    </section>
  </main>
</template>

<script setup lang="ts">
const route = useRoute();
const productId = computed(() => String(route.query.productId || "order"));
</script>
