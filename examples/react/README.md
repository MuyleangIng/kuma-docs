# React Example

Runnable plain React demo for `koma-khqr`.

## Run

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Routes

- `/`
- `/payment/success`
- `/payment/cancelled`
- `/api/koma-qr`
- `/api/koma-status`
- `/healthz`

## Package Story

- React renders the checkout UI
- Express serves the bundle and the secure KHQR routes
- `KOMA_SECRET_KEY` stays on the server

Use [react.md](../../docs/react.md) as the implementation guide.

## Docs

- setup: [../../docs/first-setup.md](../../docs/first-setup.md)
- guide: [../../docs/react.md](../../docs/react.md)
- overview: [../../docs/example-apps.md](../../docs/example-apps.md)
