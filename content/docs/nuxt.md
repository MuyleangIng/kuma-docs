# Nuxt

Nuxt is a good fit because it has both pages and server routes.

## Entry Point

Use:

```ts
import { createKomaVueConfig } from "koma-khqr/vue";
```

## Recommended Structure

```text
pages/
  index.vue
  payment/
    success.vue
    cancelled.vue
server/
  api/
    koma-qr.post.ts
    koma-status.post.ts
```

## Runtime Config

Keep these values in server runtime config:

- `KOMA_API_URL`
- `KOMA_MERCHANT_ID`
- `KOMA_SECRET_KEY`
- `KOMA_APP_URL`

Expose only non-secret values to the client.

Nuxt runtime note:

- when starting the built Nitro server directly, runtime overrides should be provided as `NUXT_KOMA_API_URL`, `NUXT_KOMA_MERCHANT_ID`, `NUXT_KOMA_SECRET_KEY`, and `NUXT_PUBLIC_KOMA_APP_URL`
- when using `nuxt dev`, your normal `.env.local` values are enough

## Config Helper

```ts
import { createKomaVueConfig } from "koma-khqr/vue";

const koma = createKomaVueConfig();
```

## Server Logic

Use `koma-khqr/server` for:

- `createSignedCheckoutFields`
- `createCheckoutSession`
- `parseCheckoutPage`

## Required Flow

- checkout page
- `POST /api/koma-qr`
- `POST /api/koma-status`
- `/payment/success`
- `/payment/cancelled`

Runnable example:

- start with [First Setup](./first-setup.md) if you still need merchant credentials
- runnable in-repo example: `examples/nuxt`
- public overview: [Example Apps](./example-apps.md)
