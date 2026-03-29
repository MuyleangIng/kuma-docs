# React + Vite TypeScript

Use this when your frontend is Vite and your backend is a small Node server.

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

## Recommended Structure

```text
src/
  App.tsx
  main.tsx
server.mjs
```

## Client

```tsx
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

```ts
import express from "express";
import { config as loadEnv } from "dotenv";
import { createKomaExpress } from "koma-khqr/express";

loadEnv({ path: ".env.local" });
loadEnv();

const app = express();

app.use(express.json());
app.use(
  createKomaExpress({
    appBaseUrl: process.env.KOMA_APP_URL?.trim() || "http://localhost:5173",
  }),
);
```

## Responsibilities Split

- React renders the checkout UI
- Express keeps `KOMA_SECRET_KEY`
- `createKomaExpress()` gives you the KHQR API routes
- your frontend owns `/payment/success` and `/payment/cancelled`

## Reference

Use [examples/react-vite-ts/README.md](../examples/react-vite-ts/README.md) as the runnable reference.
