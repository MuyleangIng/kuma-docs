# Framework And Ecosystem Guides

This file is the router for the in-repo integration guides, runnable examples, and ecosystem notes.

## Start Here

- First setup: [first-setup.md](./first-setup.md)
- Example overview: [example-apps.md](./example-apps.md)
- Support checklist: [framework-support-checklist.md](./framework-support-checklist.md)
- Testing matrix: [testing-matrix.md](./testing-matrix.md)
- Sandbox guide: [sandbox-testing.md](./sandbox-testing.md)

## Shared Env

```env
KOMA_API_URL=https://koma.khqr.site
KOMA_MERCHANT_ID=your-merchant-id@bankcode
KOMA_SECRET_KEY=replace-with-your-secret-key
KOMA_APP_URL=https://your-app.example.com
```

Use `KOMA_APP_URL` as the standard app URL.

`NEXT_PUBLIC_APP_URL` is supported as a backward-compatible fallback for older projects.

## Node Family: Implemented Now

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
- Example overview: [example-apps.md](./example-apps.md)

## Java Recipes

- Spring Boot: [spring.md](./spring.md)

## Python Recipes

- Python overview: [python.md](./python.md)
- FastAPI: [fastapi.md](./fastapi.md)
- Flask: [flask.md](./flask.md)
- Django: [django.md](./django.md)

## PHP Recipes

- PHP: [php.md](./php.md)
- Laravel: [laravel.md](./laravel.md)
- PI integration reference: [pi-integration.md](./pi-integration.md)

These non-Node pages are custom backend recipes. They are useful implementation guides, but they are not first-class package runtimes in this repo.

## Current Status

- all `8` Node-family framework targets have runnable in-repo examples
- all `8` Node-family framework targets can create a live checkout session with real merchant env
- Spring Boot, FastAPI, Flask, Django, PHP, and Laravel now have custom backend recipe docs
- the only remaining manual proof step is scanning and completing a payment in a real banking app

## Package Surface

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
