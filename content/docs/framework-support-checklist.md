# Framework Support Checklist

This is the current implementation and verification checklist for `koma-khqr`.

The counts in this file cover the implemented Node-family targets only. PHP and Laravel recipe docs exist, but they are custom backend guides and are not counted as implemented package runtimes.

Legacy sandboxes that are not part of the current support matrix are excluded from this document.

## Current Count

- `8` integration targets
- `7` npm entrypoints
- `9` runnable in-repo example paths already verified
- `2` in-repo smoke-test consumer examples

## NPM Entry Points

- `koma-khqr`
- `koma-khqr/react`
- `koma-khqr/next`
- `koma-khqr/express`
- `koma-khqr/server`
- `koma-khqr/vue`
- `koma-khqr/angular`

## Integration Targets

1. Next.js
2. React
3. React + Vite
4. Vue + Vite
5. Nuxt
6. Express
7. NestJS
8. Angular

## Custom Backend Ecosystem Notes

- PHP and Laravel recipe docs available
- these recipe pages are not counted in the `8` implemented framework targets above

## Node Runtime Support

| Runtime | Current Status | Notes |
| --- | --- | --- |
| Node 16.x | not supported | current server code uses global `fetch` and `FormData`, and the current example stack does not target 16 |
| Node 18.x | supported for package core and client-only backend paths | practical floor for `koma-khqr/server`, `koma-khqr/express`, React + Vite, Vue + Vite |
| Node 20.9+ | required for the Next.js path in this repo | local `next@16` requires `>=20.9.0` |
| Node 22+ | expected to work where upstream frameworks support it | not separately verified in this repo yet |

Important:

- do not mark Node 16 as supported in release notes today
- if Node 16 support is required later, it needs a separate compatibility pass and legacy example stack

## Shared Env Contract

Use the same server-side env names everywhere:

```env
KOMA_API_URL=https://koma.khqr.site
KOMA_MERCHANT_ID=your-merchant-id@bankcode
KOMA_SECRET_KEY=replace-with-your-secret-key
KOMA_APP_URL=http://localhost:3000
```

Rules:

- keep `KOMA_SECRET_KEY` on the server only
- do not commit real merchant credentials
- copy your private values into each example locally
- for Vite examples, `KOMA_APP_URL` should match the frontend URL
- `NEXT_PUBLIC_APP_URL` is still accepted as a legacy fallback

## Legacy Config Compatibility

Older package usage is still tolerated in these ways:

- `NEXT_PUBLIC_APP_URL` still resolves as the app base URL fallback across the server config helpers
- `KhqrCheckout` still accepts `merchantId` for legacy display behavior
- deprecated client props like `secretKey`, `apiBaseUrl`, `successUrl`, and `cancelUrl` are accepted with a warning instead of hard-breaking older apps

## Standard Flow Contract

Every complete framework integration should include:

- checkout page
- `POST /api/koma-qr`
- `POST /api/koma-status`
- `/payment/success`
- `/payment/cancelled`

## Support Matrix

| Target | Package Story | Current State | Local Example Status |
| --- | --- | --- | --- |
| Next.js | `koma-khqr/next` + `koma-khqr/react` | first-class | live-session-verified |
| React | `koma-khqr/react` + `koma-khqr/express` | supported | live-session-verified |
| React + Vite | `koma-khqr/react` + `koma-khqr/express` | first-class | live-session-verified |
| Vue + Vite | `koma-khqr/express` + optional `koma-khqr/vue` config helper | first-class | live-session-verified |
| Nuxt | `koma-khqr/server` or `koma-khqr/vue` config helper | supported | live-session-verified |
| Express | `koma-khqr/express` | first-class backend adapter | live-session-verified |
| NestJS | `koma-khqr/server` | supported | live-session-verified |
| Angular | `koma-khqr/angular` + `koma-khqr/express` | supported | live-session-verified |

## What Is Already Verified

Package and root repo:

- [x] `npm run build:package`
- [x] root `npm run build`

Runnable examples in this repo:

- [x] `examples/next-khqr-demo` build
- [x] `examples/react` build and local route probe
- [x] `examples/express` local route probe
- [x] React + Vite TypeScript build in `examples/react-vite-ts`
- [x] React + Vite JavaScript build in `examples/react-vite-js`
- [x] Vue + Vite build in `examples/vue-vite`
- [x] `examples/nuxt` build and local route probe
- [x] `examples/angular` build and local route probe
- [x] `examples/nest` build and local route probe

Root app:

- [x] root Next.js app build

Package surface:

- [x] `koma-khqr/react`
- [x] `koma-khqr/next`
- [x] `koma-khqr/express`
- [x] `koma-khqr/server`
- [x] `koma-khqr/vue`
- [x] `koma-khqr/angular`

Smoke-test consumers in this repo:

- [x] `examples/test-vue` import test on current package version
- [x] `examples/test-angular` import test on current package version

Live checkout-session creation verified with real merchant env:

- [x] `examples/next-khqr-demo`
- [x] `examples/react`
- [x] `examples/react-vite-ts`
- [x] `examples/vue-vite`
- [x] `examples/nuxt`
- [x] `examples/express`
- [x] `examples/nest`
- [x] `examples/angular`

## Manual-Only Follow-Up

- [ ] optional: record one real scanned payment completion on-device if you want bank-confirmed screenshots in release evidence

## Public Docs Router

- [First Setup](./first-setup.md)
- [Example Apps](./example-apps.md)
- [Framework And Ecosystem Guides](./framework-recipes.md)

## Framework-by-Framework Test Checklist

### 1. Next.js

Files:

- `src/app/api/koma-checkout/route.ts`
- `src/app/api/koma-qr/route.ts`
- `src/app/api/koma-status/route.ts`
- `src/app/payment/success/page.tsx`
- `src/app/payment/cancelled/page.tsx`

Checklist:

- [x] env loads
- [x] route handlers compile
- [x] success page exists
- [x] cancelled page exists
- [x] root build passes
- [x] standalone `examples/next-khqr-demo` build passes
- [x] Node floor documented as `20.9+`
- [x] live checkout-session creation with real merchant env

### 2. React

Package story:

- client uses `koma-khqr/react`
- server should be `koma-khqr/express` or custom server

Checklist:

- [x] client package exists
- [x] docs explain server requirement
- [x] Node floor documented as `18+`
- [x] dedicated plain React runnable reference app
- [x] local route probe passes
- [x] live checkout-session creation with real merchant env

### 3. React + Vite

Files:

- `examples/react-vite-ts/src/App.tsx`
- `examples/react-vite-ts/server.mjs`

Checklist:

- [x] frontend build passes
- [x] backend now uses `createKomaExpress()`
- [x] success state exists
- [x] cancelled state exists
- [x] `/api/koma-qr`
- [x] `/api/koma-status`
- [x] Node floor documented as `18+`
- [x] live checkout-session creation with real merchant env
- [x] JavaScript example is included as a runnable app

### 4. Vue + Vite

Files:

- `examples/vue-vite/src/App.vue`
- `examples/vue-vite/server.mjs`

Checklist:

- [x] frontend build passes
- [x] backend now uses `createKomaExpress()`
- [x] success state exists
- [x] cancelled state exists
- [x] `/api/koma-qr`
- [x] `/api/koma-status`
- [x] Node floor documented as `18+`
- [x] live checkout-session creation with real merchant env

### 5. Nuxt

Checklist:

- [x] guide exists
- [x] runnable example README exists
- [x] Node floor documented as `18+`
- [x] runnable example app
- [x] route handlers implemented in repo example
- [x] local route probe passes
- [x] live checkout-session creation with real merchant env

### 6. Express

Checklist:

- [x] `koma-khqr/express` router exists
- [x] custom path support exists
- [x] docs exist
- [x] Node floor documented as `18+`
- [x] dedicated runnable example app
- [x] live checkout-session creation with real merchant env

### 7. NestJS

Checklist:

- [x] guide exists
- [x] runnable example README exists
- [x] Node floor documented as `18+`
- [x] runnable example app
- [x] local route probe passes
- [x] live checkout-session creation with real merchant env

### 8. Angular

Checklist:

- [x] `koma-khqr/angular` entrypoint exists
- [x] guide exists
- [x] smoke-test consumer exists
- [x] import smoke test passes on current package version
- [x] Node floor documented as `18+`
- [x] runnable Angular app in repo
- [x] backend pairing example in repo
- [x] local route probe passes
- [x] live checkout-session creation with real merchant env

## Recommended Test Order

1. package build
2. root Next.js build
3. React + Vite TypeScript local run
4. Vue + Vite local run
5. Express dedicated example
6. Nuxt example
7. Angular example
8. NestJS example
9. React generic standalone example

## Commands To Use First

Root package:

```bash
npm run build:package
npm run build
```

React + Vite TS:

```bash
cd examples/react-vite-ts
npm install
cp .env.example .env.local
npm run dev
```

Vue + Vite:

```bash
cd examples/vue-vite
npm install
cp .env.example .env.local
npm run dev
```

Nuxt:

```bash
cd examples/nuxt
npm install
cp .env.example .env.local
npm run dev
```

## Release Gate

Before calling framework support complete, all of these should be true:

- [x] shared env contract is identical across frameworks
- [x] React never signs in the browser
- [x] Next has first-class route helpers
- [x] Express has first-class backend adapter
- [x] Node runtime floors are documented honestly
- [x] every documented framework has a runnable example
- [x] every runnable example can create one live checkout session with real merchant env
- [x] README links point only to current examples

Manual-only final proof, if you want it:

- [ ] record at least one real scanned payment completion from a banking app
