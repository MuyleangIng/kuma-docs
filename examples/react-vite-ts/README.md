# React + Vite TypeScript Example

This folder is now a standalone runnable React + Vite example for `koma-khqr`.

Run:

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:5173`.

Routes included:

- `/`
- `/api/koma-qr`
- `/api/koma-status`
- `/payment/success`
- `/payment/cancelled`

It uses:

- `koma-khqr/react` for `KhqrCheckout`
- `koma-khqr/express` for the local API server

## Docs

- setup: [../../docs/first-setup.md](../../docs/first-setup.md)
- guide: [../../docs/react-vite-typescript.md](../../docs/react-vite-typescript.md)
- overview: [../../docs/example-apps.md](../../docs/example-apps.md)
