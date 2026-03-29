# Express Example

Runnable Express demo for `koma-khqr`.

## Run

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Routes

- `/`
- `/api/koma-qr`
- `/api/koma-status`
- `/payment/success`
- `/payment/cancelled`
- `/healthz`

## Package Story

- `koma-khqr/express` mounts the secure KHQR API routes
- the example app serves the checkout page and success/cancel pages
- `KOMA_SECRET_KEY` stays on the server

See [express.md](../../docs/express.md) as the implementation guide.

## Docs

- setup: [../../docs/first-setup.md](../../docs/first-setup.md)
- guide: [../../docs/express.md](../../docs/express.md)
- overview: [../../docs/example-apps.md](../../docs/example-apps.md)
