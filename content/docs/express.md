# Express

Express is the recommended backend adapter for React + Vite, Vue + Vite, Angular SPA, and other client-only frontends.

It is not required for Next.js, Nuxt, or other frameworks that already give you a server runtime. Use this guide when your frontend is client-only and you want the shortest Node backend path.

## Install

```bash
npm install koma-khqr express
```

Add `dotenv` only if you are running a plain Node server file and want it to load `.env` or `.env.local` directly during development.

## Fast Path

Use `koma-khqr/express` when you want ready-made KHQR endpoints.

```ts
import express from "express";
import { createKomaExpress } from "koma-khqr/express";

const app = express();

app.use(express.json());
app.use(
  createKomaExpress({
    appBaseUrl: "http://localhost:5173",
  }),
);
```

That mounts:

- `POST /api/koma-qr`
- `POST /api/koma-status`

## Custom Paths

```ts
import { createKomaExpressRouter } from "koma-khqr/express";

app.use(
  createKomaExpressRouter({
    appBaseUrl: "http://localhost:5173",
    qrPath: "/payments/koma-qr",
    statusPath: "/payments/koma-status",
  }),
);
```

## Lower-Level Control

If you need custom middleware or different route composition, use:

- `createKomaExpressHandlers`
- `koma-khqr/server`

## Full Flow

Your frontend should still include:

- checkout page
- `/payment/success`
- `/payment/cancelled`

Start with [First Setup](./first-setup.md) if you still need merchant credentials.

Runnable in-repo examples:

- standalone backend: `examples/express`
- client + backend pairing: `examples/react-vite-ts`
