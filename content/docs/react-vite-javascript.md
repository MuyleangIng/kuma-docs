# React + Vite JavaScript

The integration shape is the same as the TypeScript Vite guide, but with `.jsx` and `.js` files.

## Install

```bash
npm install koma-khqr react react-dom
```

If you start from the runnable example, that example already includes its platform packages.

Only add `express` if your Vite frontend needs a small Node backend, and only add `dotenv` if that plain Node backend should load local `.env` values by itself.

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

This example uses `express` because Vite does not provide the secure KHQR backend by itself. `dotenv` is only there because `server.mjs` is a plain Node file.

```js
import express from "express";
import { config as loadEnv } from "dotenv";
import { createKomaExpress } from "koma-khqr/express";

loadEnv({ path: ".env.local" });
loadEnv();

const app = express();

app.use(express.json());
app.use(
  createKomaExpress({
    appBaseUrl: process.env.KOMA_APP_URL || "http://localhost:5173",
  }),
);
```

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

Add `api/koma.js` (Vercel serverless function). See `examples/react-vite-js/api/koma.js`.

Set `KOMA_API_URL`, `KOMA_MERCHANT_ID`, `KOMA_SECRET_KEY` in Vercel project settings.

### Netlify

Add `netlify.toml`:

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

Add `netlify/functions/koma.mjs`. See `examples/react-vite-js/netlify/functions/koma.mjs`.

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
COPY server.mjs ./
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["npm", "start"]
```

`npm start` runs `node server.mjs` which serves the built static files and exposes the koma API. Pass env vars at runtime:

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
- runnable in-repo example: `examples/react-vite-js`
