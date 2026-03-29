# WebContainer Sandboxes

Use this guide when you want a StackBlitz-style sandbox for each framework example.

## Goal

Every sandbox should keep the same Koma contract:

```env
KOMA_API_URL=https://your-koma-api.example.com
KOMA_MERCHANT_ID=your-merchant-id@bankcode
KOMA_SECRET_KEY=replace-with-your-secret-key
KOMA_APP_URL=http://localhost:3000
```

Shared routes:

- `POST /api/koma-qr`
- `POST /api/koma-status`
- `/payment/success`
- `/payment/cancelled`

The framework can change, but the env names and route paths should not.

## WebContainer Auth

Use a client-side env var for the WebContainer OAuth client id instead of hardcoding it in source:

```env
VITE_WEBCONTAINER_CLIENT_ID=replace-with-your-webcontainer-client-id
```

Example:

```ts
import { auth } from "@webcontainer/api";

auth.init({
  clientId: import.meta.env.VITE_WEBCONTAINER_CLIENT_ID,
  scope: "",
});
```

Call `auth.init()` before `WebContainer.boot()`.

## Example Standard

A WebContainer-ready example should be a standalone app root with:

```text
example-name/
  package.json
  .env.example
  README.md
  src/ or app/
  server.mjs or framework-native server routes
```

## Recommended Sandbox Layouts

### Next.js

```text
app/
  api/
    koma-qr/
      route.ts
    koma-status/
      route.ts
  payment/
    success/
      page.tsx
    cancelled/
      page.tsx
```

### React + Vite

```text
src/
  App.tsx
  main.tsx
server.mjs
```

### Vue

```text
src/
  App.vue
  main.ts
server.mjs
```

### Angular

```text
src/app/
  app.ts
  app.html
  app.css
server.mjs
```

## Repo Strategy

To make every framework runnable in the same style:

- keep one standalone root per framework example
- keep the same four Koma env names
- keep the same four payment paths
- keep WebContainer auth optional and externalized in env

## Current Readiness

- Next.js, React, React + Vite, Vue + Vite, Nuxt, Express, NestJS, and Angular all have standalone example roots in this repo
- all of those examples follow the same Koma env contract
- all of those examples can create live checkout sessions when you provide real merchant env
