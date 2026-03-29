# React + Vite JavaScript

The integration shape is the same as the TypeScript Vite guide, but with `.jsx` and `.js` files.

## Install

```bash
npm install koma-khqr react react-dom
```

## Env

Keep these on the server side of your Vite setup:

```env
KOMA_API_URL=https://your-koma-api.example.com
KOMA_MERCHANT_ID=your-merchant-id@bankcode
KOMA_SECRET_KEY=replace-with-your-secret-key
KOMA_APP_URL=http://localhost:5173
```

## Required Pieces

- React checkout page
- small server with `/api/koma-qr`
- small server with `/api/koma-status`
- `/payment/success`
- `/payment/cancelled`

## Client

```jsx
import { KhqrCheckout } from "koma-khqr/react";

export default function App() {
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

## Server

Use `koma-khqr/express` for the backend and keep `KOMA_SECRET_KEY` on the server only.

```js
import express from "express";
import { createKomaExpress } from "koma-khqr/express";

const app = express();

app.use(express.json());
app.use(
  createKomaExpress({
    appBaseUrl: process.env.KOMA_APP_URL || "http://localhost:5173",
  }),
);
```

Runnable example:

- [examples/react-vite-js/README.md](../examples/react-vite-js/README.md)
