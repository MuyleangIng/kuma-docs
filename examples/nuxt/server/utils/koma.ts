import { createKomaVueConfig } from "koma-khqr/vue";
import { useRuntimeConfig } from "#imports";

export function getKomaConfig() {
  const runtimeConfig = useRuntimeConfig();

  return createKomaVueConfig({
    env: {
      KOMA_API_URL: runtimeConfig.komaApiUrl,
      KOMA_MERCHANT_ID: runtimeConfig.komaMerchantId,
      KOMA_SECRET_KEY: runtimeConfig.komaSecretKey,
      KOMA_APP_URL: runtimeConfig.public.komaAppUrl,
    },
  });
}

export function buildKomaAppUrl(
  baseUrl: string,
  pathname: string,
  searchParams?: Record<string, string | undefined>,
) {
  const url = new URL(pathname, baseUrl);

  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (value) {
        url.searchParams.set(key, value);
      }
    }
  }

  return url.toString();
}
