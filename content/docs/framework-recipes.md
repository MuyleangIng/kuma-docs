# Framework Recipes

This file is the router for framework-specific integration guides.

## Shared Env

```env
KOMA_API_URL=https://koma.khqr.site
KOMA_MERCHANT_ID=your-merchant-id@bankcode
KOMA_SECRET_KEY=replace-with-your-secret-key
KOMA_APP_URL=https://your-app.example.com
```

Use `KOMA_APP_URL` as the standard app URL.

`NEXT_PUBLIC_APP_URL` is supported as a backward-compatible fallback for older projects.

## Framework Guides

- Next.js TypeScript: [next-typescript.md](./next-typescript.md)
- Next.js JavaScript: [next-javascript.md](./next-javascript.md)
- React: [react.md](./react.md)
- React + Vite TypeScript: [react-vite-typescript.md](./react-vite-typescript.md)
- React + Vite JavaScript: [react-vite-javascript.md](./react-vite-javascript.md)
- Vue: [vue.md](./vue.md)
- Nuxt: [nuxt.md](./nuxt.md)
- Express: [express.md](./express.md)
- NestJS: [nest.md](./nest.md)
- Angular: [angular.md](./angular.md)
- Testing Matrix: [testing-matrix.md](./testing-matrix.md)
- Framework Support Checklist: [framework-support-checklist.md](./framework-support-checklist.md)
- Sandbox Testing: [sandbox-testing.md](./sandbox-testing.md)

## Current Status

- every listed framework target has a runnable in-repo example
- every listed framework target can create a live checkout session with real merchant env
- the only remaining manual proof step is scanning and completing a payment in a real banking app

## Easy Package Story

Use the package like this:

- `koma-khqr/next`
- `koma-khqr/react`
- `koma-khqr/express`
- `koma-khqr/vue`
- `koma-khqr/angular`
- `koma-khqr/server`

Entry point summary:

- `koma-khqr/next` is the Next.js entrypoint
- `koma-khqr/react` is the React UI entrypoint
- `koma-khqr/express` is the backend adapter for client-only frontends
- `koma-khqr/vue` is the Vue-oriented config helper entrypoint
- `koma-khqr/angular` is the Angular-oriented config helper entrypoint
- `koma-khqr/server` is the low-level backend entrypoint

## Integration Standard

Every complete framework integration should include:

- a checkout page
- a QR creation route
- a polling route
- `/payment/success`
- `/payment/cancelled`

If a framework does not own the backend, pair it with a small server layer and keep `KOMA_SECRET_KEY` there.
