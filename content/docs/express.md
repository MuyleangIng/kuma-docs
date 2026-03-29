# Express

Express is the recommended backend adapter for React + Vite, Vue + Vite, Angular SPA, and other client-only frontends.

## Install

```bash
npm install koma-khqr express
```

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

See [examples/express/README.md](../examples/express/README.md) for the standalone Express app.
If you want the same backend adapter paired with a client-only frontend, see [examples/react-vite-ts/README.md](../examples/react-vite-ts/README.md).
