# Example Apps

This page is the example overview for `koma-khqr`.

The package repo contains runnable examples for the implemented Node-family integrations. Use this page to understand their shape quickly before opening a specific example folder.

## Available Now

### Next.js

- runtime: Next.js App Router
- flow: checkout page, API routes, success page, cancelled page
- best for: full-stack React apps
- repo path: `examples/next-khqr-demo`

Typical structure:

```text
app/
  page.tsx
  api/
    koma-checkout/route.ts
    koma-qr/route.ts
    koma-status/route.ts
  payment/
    success/page.tsx
    cancelled/page.tsx
```

### React + Vite

- runtime: Vite frontend + small Node backend
- flow: client UI + secure backend routes
- best for: client-only React frontend with lightweight server
- repo path: `examples/react-vite-ts` and `examples/react-vite-js`

Typical structure:

```text
src/
  App.tsx
  main.tsx
server.mjs
```

### React

- runtime: React frontend + separate backend
- flow: UI in React, signing on the server
- repo path: `examples/react`

Typical structure:

```text
src/
  App.jsx
  main.jsx
server.mjs
```

### Vue + Vite

- runtime: Vue frontend + small Node backend
- flow: client UI + secure backend routes
- repo path: `examples/vue-vite`

Typical structure:

```text
src/
  App.vue
  main.ts
server.mjs
```

### Nuxt

- runtime: Nuxt pages + Nitro server routes
- flow: full-stack app in one framework
- repo path: `examples/nuxt`

Typical structure:

```text
pages/
  index.vue
  payment/
    success.vue
    cancelled.vue
server/
  api/
    koma-qr.post.ts
    koma-status.post.ts
```

### Express

- runtime: standalone Node backend
- flow: secure KHQR backend adapter
- repo path: `examples/express`

Typical structure:

```text
public/
  app.js
  styles.css
server.mjs
```

### NestJS

- runtime: structured Node backend
- flow: controller + service layers
- repo path: `examples/nest`

Typical structure:

```text
src/
  main.ts
  pages.controller.ts
  koma/
    koma.controller.ts
    koma.service.ts
```

### Angular

- runtime: Angular SPA + secure backend
- flow: frontend UI plus Express or Nest backend
- repo path: `examples/angular`

Typical structure:

```text
src/
  app/
    app.routes.ts
    pages/
      shop-page.component.ts
server.mjs
```

## Custom Backend Recipes

These stacks now have implementation recipe pages with concrete file layouts and code snippets, but they are not runnable in-repo package examples:

- PHP: [php.md](./php.md)
- Laravel: [laravel.md](./laravel.md)

Use these shared references first:

- [First Setup](./first-setup.md)
- [PI Integration Reference](./pi-integration.md)

## What This Overview Covers

This overview covers:

- setup flow
- env contract
- signing rules
- runtime shape
- suggested structure
- example overview

The example folders listed above are the in-repo source of truth for the implemented Node-family support paths.
