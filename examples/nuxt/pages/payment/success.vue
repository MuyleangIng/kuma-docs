<template>
  <main class="shell">
    <section class="state-card success">
      <p class="eyebrow">Payment Successful</p>
      <h1>Payment confirmed</h1>
      <p class="sub">
        Your KHQR payment for <strong>{{ productId }}</strong> completed successfully.
      </p>
      <NuxtLink class="primary-link" to="/">Back to shop</NuxtLink>
    </section>
  </main>
</template>

<script setup lang="ts">
const route = useRoute();
const productId = computed(() => String(route.query.productId || "order"));
</script>
