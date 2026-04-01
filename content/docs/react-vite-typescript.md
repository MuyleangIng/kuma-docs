# React + Vite TypeScript

Use this when your frontend is Vite and your backend is a small Node server.

## Install

```bash
npm install koma-khqr react react-dom
```

If you start from the runnable example, stop there. The example app already includes the platform packages it needs.

Only add `express` if your Vite frontend needs a small Node backend, and only add `dotenv` if that plain Node backend should load `.env.local` itself.

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

This server example uses `express` because Vite is only the frontend tool here. The backend still needs somewhere safe to keep `KOMA_SECRET_KEY`.

`dotenv` appears here only because `server.mjs` is a plain Node file. If your runtime already loads env vars, remove it.

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

## Deploy

### Vercel

Add `vercel.json` at the project root:

```json
{
  "rewrites": [
    { "source": "/api/koma-checkout", "destination": "/api/koma?type=checkout" },
    { "source": "/api/koma-qr",       "destination": "/api/koma?type=qr"       },
    { "source": "/api/koma-status",   "destination": "/api/koma?type=status"   },
    { "source": "/payment/success",   "destination": "/"                        },
    { "source": "/payment/cancelled", "destination": "/"                        }
  ]
}
```

Add `api/koma.js` (Vercel serverless function) that imports from `koma-khqr/next` and dispatches by `?type=`. See `examples/react-vite-ts/api/koma.js`.

Set these environment variables in your Vercel project settings:

```
KOMA_API_URL
KOMA_MERCHANT_ID
KOMA_SECRET_KEY
```

`KOMA_APP_URL` is optional — Vercel sets `VERCEL_URL` automatically.

### Netlify

Add `netlify.toml` at the project root:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[functions]
  directory = "netlify/functions"

[[redirects]]
  from = "/api/koma-checkout"
  to   = "/.netlify/functions/koma?type=checkout"
  status = 200
  force  = true

[[redirects]]
  from = "/api/koma-qr"
  to   = "/.netlify/functions/koma?type=qr"
  status = 200
  force  = true

[[redirects]]
  from = "/api/koma-status"
  to   = "/.netlify/functions/koma?type=status"
  status = 200
  force  = true

[[redirects]]
  from = "/*"
  to   = "/index.html"
  status = 200
```

Add `netlify/functions/koma.mjs` using the Netlify event handler shape. See `examples/react-vite-ts/netlify/functions/koma.mjs`.

Set `KOMA_API_URL`, `KOMA_MERCHANT_ID`, `KOMA_SECRET_KEY` in Netlify site environment variables.

### Docker

Add a `Dockerfile`:

```dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM deps AS build
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production PORT=3000
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["npm", "start"]
```

`npm start` runs `serve -s dist -l 3000`. Pass env vars at runtime:

```bash
docker build -t my-app .
docker run -p 3000:3000 \
  -e KOMA_API_URL=... \
  -e KOMA_MERCHANT_ID=... \
  -e KOMA_SECRET_KEY=... \
  my-app
```

## Reference

- start with [First Setup](./first-setup.md) if you still need merchant credentials
- runnable in-repo example: `examples/react-vite-ts`
- public overview: [Example Apps](./example-apps.md)
