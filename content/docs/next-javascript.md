# Next.js JavaScript

Use the same Next.js App Router flow as TypeScript, but with `.js` files.

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

## Shared Handlers

`app/api/koma/handlers.js`

```js
import { createKomaNext } from "koma-khqr/next";

export const koma = createKomaNext();
```

## API Routes

`app/api/koma-checkout/route.js`

```js
import { koma } from "../koma/handlers";

export const POST = koma.checkout;
```

`app/api/koma-qr/route.js`

```js
import { koma } from "../koma/handlers";

export const POST = koma.qr;
```

`app/api/koma-status/route.js`

```js
import { koma } from "../koma/handlers";

export const POST = koma.status;
```

## Checkout UI

```jsx
import { KhqrCheckout } from "koma-khqr/react";

export default function ProductCard() {
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

## Required Pages

Add:

- `app/payment/success/page.js`
- `app/payment/cancelled/page.js`

Keep those routes aligned with `KOMA_APP_URL`.

Runnable example:

- start with [First Setup](./first-setup.md) if you still need merchant credentials
- runnable in-repo example: `examples/next-khqr-demo`
