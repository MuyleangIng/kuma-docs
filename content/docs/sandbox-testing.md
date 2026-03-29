# Sandbox Testing

Use the same server-side env names across every framework example and consumer project:

```env
KOMA_API_URL=https://your-koma-api.example.com
KOMA_MERCHANT_ID=your-merchant-id@bankcode
KOMA_SECRET_KEY=replace-with-your-secret-key
KOMA_APP_URL=http://localhost:3000
```

Rules:

- `KOMA_SECRET_KEY` stays on the server only
- `KOMA_APP_URL` should match the local app URL for the framework you are running
- `NEXT_PUBLIC_APP_URL` is a supported legacy fallback and should not be the default for new examples

## Sandbox Modes

### 1. Live local sandbox

Use this when the example actually creates QR sessions and polls payment status.

Requirements:

- real Koma sandbox credentials
- a local server route that owns `KOMA_SECRET_KEY`
- success and cancelled pages
- for Nuxt built server starts, map runtime env as `NUXT_KOMA_API_URL`, `NUXT_KOMA_MERCHANT_ID`, `NUXT_KOMA_SECRET_KEY`, and `NUXT_PUBLIC_KOMA_APP_URL`

Minimum routes:

- `POST /api/koma-qr`
- `POST /api/koma-status`
- `/payment/success`
- `/payment/cancelled`

### 2. Package smoke test

Use this when the goal is only to verify that a framework can install, import, build, and create config objects from the package.

Requirements:

- no live credentials needed
- no payment backend required
- verify package import and basic config helper behavior

### 3. WebContainer sandbox

Use this when you want a StackBlitz-style browser sandbox with a standalone example root.

Requirements:

- framework example is self-contained
- same Koma env names are preserved
- same payment paths are preserved
- WebContainer auth is initialized before boot if private package access is needed

See [webcontainer-sandboxes.md](./webcontainer-sandboxes.md).

## Local URL Convention

Use these defaults when writing example env files:

- Next.js / Express / Nest / Nuxt server: `KOMA_APP_URL=http://localhost:3000`
- React + Vite examples: `KOMA_APP_URL=http://localhost:5173`
- Angular dev app: `KOMA_APP_URL=http://localhost:4200`
- Vue Vite dev app: `KOMA_APP_URL=http://localhost:5174`

## Node Runtime Floors

- `Node 18+` for the package core, Express adapter, React + Vite, Vue + Vite, and smoke-test consumers
- `Node 20.9+` for the Next.js path in this repo
- `Node 16` is not in the current supported sandbox matrix

## Framework Matrix

| Framework | Example Path | Sandbox Type | Env File |
| --- | --- | --- | --- |
| Next.js App Router | repo root app | Live local sandbox | `.env.local` |
| Next.js standalone | `examples/next-khqr-demo` | Standalone local sandbox | `examples/next-khqr-demo/.env.example` |
| React | `examples/react` | Standalone local sandbox | `examples/react/.env.example` |
| React + Vite TS | `examples/react-vite-ts` | Standalone local sandbox | `examples/react-vite-ts/.env.example` |
| React + Vite JS | `examples/react-vite-js` | Standalone local sandbox | `examples/react-vite-js/.env.example` |
| Vue + Vite | `examples/vue-vite` | Standalone local sandbox | `examples/vue-vite/.env.example` |
| Nuxt | `examples/nuxt` | Standalone local sandbox | `examples/nuxt/.env.example` |
| Express | `examples/express` | Standalone local sandbox | `examples/express/.env.example` |
| NestJS | `examples/nest` | Standalone local sandbox | `examples/nest/.env.example` |
| Angular | `examples/angular` | Standalone local sandbox | `examples/angular/.env.example` |

## What Every Example Should Prove

For a full sandbox example:

- env names are exactly the standard four names
- checkout route signs on the server
- QR route returns QR data plus polling tokens
- polling route works
- success page exists
- cancelled page exists

Current automated finish line:

- every in-repo Node-family runnable example can create a live checkout session with real merchant env
- the only non-automated step is scanning and completing the payment from a real banking app

For a smoke-test example:

- package installs cleanly
- framework imports the right entrypoint
- config helper returns the expected keys
- build or import test passes
