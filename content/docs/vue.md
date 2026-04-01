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

That does not mean Vue always needs Express specifically. It means a client-only Vue app still needs some server runtime somewhere to own `KOMA_SECRET_KEY` and call Koma securely. Express is just the smallest ready-made backend path in this package.

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

Add `api/koma.js` (Vercel serverless function). See `examples/vue-vite/api/koma.js`.

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

Add `netlify/functions/koma.mjs`. See `examples/vue-vite/netlify/functions/koma.mjs`.

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

`npm start` runs `node server.mjs` which serves the built Vue app and exposes the koma API. Pass env vars at runtime:

```bash
docker build -t my-app .
docker run -p 3000:3000 \
  -e KOMA_API_URL=... \
  -e KOMA_MERCHANT_ID=... \
  -e KOMA_SECRET_KEY=... \
  my-app
```

## Runnable Example

- start with [First Setup](./first-setup.md) if you still need merchant credentials
- runnable in-repo example: `examples/vue-vite`
- public overview: [Example Apps](./example-apps.md)
