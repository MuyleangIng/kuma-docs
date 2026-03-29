# Vue

Vue support is best handled as a Vue frontend plus a small server backend.

## Entry Point

Use:

```ts
import { createKomaVueConfig } from "koma-khqr/vue";
```

## Recommended Pattern

- Vue page or component renders product UI
- backend owns `KOMA_SECRET_KEY`
- backend exposes:
  - `POST /api/koma-qr`
  - `POST /api/koma-status`
  - `/payment/success`
  - `/payment/cancelled`

For Vue + Vite, the easiest backend is `koma-khqr/express`.

## Env

```env
KOMA_API_URL=https://your-koma-api.example.com
KOMA_MERCHANT_ID=your-merchant-id@bankcode
KOMA_SECRET_KEY=replace-with-your-secret-key
KOMA_APP_URL=http://localhost:5174
```

## Config Helper

```ts
import { createKomaVueConfig } from "koma-khqr/vue";

const koma = createKomaVueConfig();
```

This gives you:

- `apiBaseUrl`
- `merchantId`
- `secretKey`
- `appBaseUrl`

## Best Fit

If you want a stronger first-class Vue integration, prefer Nuxt:
[nuxt.md](./nuxt.md)

Runnable example:

- [examples/vue-vite/README.md](../examples/vue-vite/README.md)
