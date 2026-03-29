# Testing Matrix

Use [sandbox-testing.md](./sandbox-testing.md) as the env and example contract for every framework.
Use [framework-support-checklist.md](./framework-support-checklist.md) as the release checklist.

## Node Runtime Floors

- `Node 18+` for the package core and client-only backend paths
- `Node 20.9+` for the Next.js path in this repo
- `Node 16` is not part of the current supported matrix

## Tier 1

These should be checked before a polished framework-support release:

- Next.js TypeScript
- Next.js JavaScript
- React + Vite TypeScript
- Express

## Tier 2

- React + Vite JavaScript
- Nuxt
- Angular
- NestJS

## Tier 3

- Vue package smoke test
- Angular package smoke test

## Minimum Checks

- package build passes
- example apps are current
- env names are consistent
- checkout page exists
- polling route exists
- success page exists
- cancelled page exists

## Current Reality

Build-verified inside this repo:

- root `npm run build`
- Next.js app integration
- `examples/next-khqr-demo` standalone build
- `examples/react` standalone build
- `examples/react-vite-ts` standalone build
- `examples/react-vite-js` standalone build
- `examples/vue-vite` standalone build
- `examples/nuxt` standalone build
- `examples/angular` standalone build
- `examples/nest` standalone build

Route-probed inside this repo:

- `examples/express` local route probe
- `examples/react` local frontend and API route probe
- `examples/react-vite-js` local frontend and API proxy probe
- `examples/nuxt` local route probe
- `examples/angular` local route probe
- `examples/nest` local route probe

Runtime-verified outside this repo:

- Vue local sandbox demo in `/Users/ingmuyleang/test-ecosystem/vue-app`

Build-verified and packaged:

- package build
- `koma-khqr/vue` smoke-test consumer import
- `koma-khqr/angular` smoke-test consumer import

Live checkout-session creation verified with real merchant env:

- Next.js via `examples/next-khqr-demo`
- React via `examples/react`
- React + Vite via `examples/react-vite-ts`
- Vue + Vite via `examples/vue-vite`
- Nuxt via `examples/nuxt`
- Express via `examples/express`
- NestJS via `examples/nest`
- Angular via `examples/angular`

Manual-only remaining step:

- scan and complete at least one real payment on-device if you want bank-confirmed completion evidence in release notes
