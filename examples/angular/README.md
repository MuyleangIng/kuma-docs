# Angular Example

Runnable Angular + Express demo for `koma-khqr`.

## Run

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:4200`.

## Routes

- `/`
- `/api/koma-qr`
- `/api/koma-status`
- `/payment/success`
- `/payment/cancelled`

## Package Story

- Angular renders the shop and checkout UI
- `koma-khqr/angular` resolves the server-side config shape
- `koma-khqr/express` exposes the secure KHQR backend routes
- `KOMA_SECRET_KEY` stays on the Express server only

Use [angular.md](../../docs/angular.md) as the implementation guide.

## Docs

- setup: [../../docs/first-setup.md](../../docs/first-setup.md)
- guide: [../../docs/angular.md](../../docs/angular.md)
- overview: [../../docs/example-apps.md](../../docs/example-apps.md)
