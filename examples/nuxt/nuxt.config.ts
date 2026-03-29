export default defineNuxtConfig({
  compatibilityDate: "2026-03-29",
  devtools: { enabled: false },
  css: ["~/assets/main.css"],
  runtimeConfig: {
    komaApiUrl: process.env.KOMA_API_URL,
    komaMerchantId: process.env.KOMA_MERCHANT_ID,
    komaSecretKey: process.env.KOMA_SECRET_KEY,
    public: {
      komaAppUrl: process.env.KOMA_APP_URL || "http://localhost:3000",
    },
  },
});
