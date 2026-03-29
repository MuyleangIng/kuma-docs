# NestJS Example

Runnable NestJS demo for `koma-khqr`.

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

- NestJS owns both the pages and the secure server routes
- `koma-khqr/server` handles signing, parsing, and validation
- `KOMA_SECRET_KEY` stays on the server

Use [nest.md](../../docs/nest.md) as the implementation guide.

## Docs

- setup: [../../docs/first-setup.md](../../docs/first-setup.md)
- guide: [../../docs/nest.md](../../docs/nest.md)
- overview: [../../docs/example-apps.md](../../docs/example-apps.md)
