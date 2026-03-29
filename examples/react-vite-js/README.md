# React + Vite JavaScript Example

Runnable React + Vite JavaScript demo for `koma-khqr`.

## Run

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:5173`.

## Routes

- `/`
- `/payment/success`
- `/payment/cancelled`
- `/api/koma-qr`
- `/api/koma-status`

## Package Story

- React handles the checkout UI
- Express handles the secure Koma server routes
- `KOMA_SECRET_KEY` stays on the backend

Use [react-vite-javascript.md](../../docs/react-vite-javascript.md) as the guide.

## Docs

- setup: [../../docs/first-setup.md](../../docs/first-setup.md)
- guide: [../../docs/react-vite-javascript.md](../../docs/react-vite-javascript.md)
- overview: [../../docs/example-apps.md](../../docs/example-apps.md)
