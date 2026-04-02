# React

`koma-khqr/react` is the UI layer. It renders the KHQR checkout experience, but it does not own your secret key and it does not sign requests in the browser.

## Mental Model

- `koma-khqr/react` = checkout UI
- `koma-khqr/next` = server routes when React is running inside Next.js
- `koma-khqr/express` = server routes when React is running in Vite, CRA, or another client-only setup
- `koma-khqr/server` = lower-level escape hatch if you want custom backend code

## What React Covers

- `KhqrCheckout`
- `KomaCheckoutForm`

## What Still Needs Server Runtime

- `KOMA_SECRET_KEY`
- checkout signing
- Koma API calls
- polling proxy
- success and cancelled routes

React can render on the server inside a framework, but React by itself is not a secure payment backend. The Koma secret still belongs on the server.

## Do You Need Express?

Not always.

- If React is running inside Next.js, use `koma-khqr/next` and Next route handlers instead of Express.
- If React is running as a client-only app in Vite, CRA, or another SPA setup, you still need a backend. `koma-khqr/express` is the shortest ready-made option.
- If you already have your own backend, use that instead of Express and call the lower-level helpers from `koma-khqr/server`.

`dotenv` is also optional. You only need it when a plain Node server file needs to load local `.env` values itself.

## Recommended Pairings

- Next.js: [next-typescript.md](./next-typescript.md)
- React + Vite: [react-vite-typescript.md](./react-vite-typescript.md)
- Express backend: [express.md](./express.md)

If you are building plain React, use `koma-khqr/react` on the client and pair it with `koma-khqr/express` or your own server implementation.

## Runnable Example

- start with [First Setup](./first-setup.md) if you still need merchant credentials
- runnable in-repo example: `examples/react`
