# Next.js TypeScript

Use this when your app is already on Next.js App Router and TypeScript.

## Install

```bash
npm install koma-khqr
```

## Env

```env
KOMA_API_URL=https://your-koma-api.example.com
KOMA_MERCHANT_ID=your-merchant-id@bankcode
KOMA_SECRET_KEY=replace-with-your-secret-key
KOMA_APP_URL=http://localhost:3000
```

## Recommended Structure

```text
src/
  app/
    api/
      koma/
        handlers.ts
      koma-checkout/
        route.ts
      koma-qr/
        route.ts
      koma-status/
        route.ts
    payment/
      success/
        page.tsx
      cancelled/
        page.tsx
  components/
    ProductCard.tsx
```

## Shared Handlers

`src/app/api/koma/handlers.ts`

```ts
import { createKomaNext } from "koma-khqr/next";

export const koma = createKomaNext();
```

## API Routes

`src/app/api/koma-checkout/route.ts`

```ts
import { koma } from "../koma/handlers";

export const POST = koma.checkout;
```

`src/app/api/koma-qr/route.ts`

```ts
import { koma } from "../koma/handlers";

export const POST = koma.qr;
```

`src/app/api/koma-status/route.ts`

```ts
import { koma } from "../koma/handlers";

export const POST = koma.status;
```

## Checkout UI

```tsx
import { KhqrCheckout } from "koma-khqr/react";

export function ProductCard() {
  return (
    <KhqrCheckout
      amount="12"
      currency="USD"
      productId="P001"
      productName="Cambodian Coffee Blend"
    />
  );
}
```

## Success Page

Use your own page, or copy the shape from:
- [success page](../src/app/payment/success/page.tsx)
- [cancelled page](../src/app/payment/cancelled/page.tsx)

Recommended paths:

- `/payment/success`
- `/payment/cancelled`

## Notes

- `KOMA_SECRET_KEY` stays server-only
- the full flow should include checkout, polling, success, and cancelled pages
- see [examples/next-khqr-demo/README.md](../examples/next-khqr-demo/README.md) for the runnable example
