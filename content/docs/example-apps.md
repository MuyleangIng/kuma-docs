# Example Apps

This page is the public example overview for `koma-khqr`.

The package repo contains runnable examples for the Node-family integrations, but this docs site is the public place to understand their structure and testing shape without relying on private repo links.

## Available Now

### Next.js

- runtime: Next.js App Router
- flow: checkout page, API routes, success page, cancelled page
- best for: full-stack React apps

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

Typical structure:

```text
src/
  app/
    app.routes.ts
    pages/
      shop-page.component.ts
server.mjs
```

## Coming Soon

These ecosystem pages are documented as direction pages, not full runnable package examples yet:

- Spring Boot
- Python
- Laravel / PHP

For those stacks, use:

- [First Setup](./first-setup.md)
- [PI Integration Reference](./pi-integration.md)

## What Public Docs Cover

The public docs site covers:

- setup flow
- env contract
- signing rules
- runtime shape
- suggested structure
- example overview

The private workspace repo still contains the runnable in-repo example applications for the Node-family support paths.
