# Nuxt Example

Runnable Nuxt demo for `koma-khqr`.

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

## Package Story

- Nuxt owns both the pages and the server routes
- `koma-khqr/server` handles signing, parsing, and validation
- `KOMA_SECRET_KEY` stays on the server

Use [nuxt.md](../../docs/nuxt.md) as the implementation guide.

## Docs

- setup: [../../docs/first-setup.md](../../docs/first-setup.md)
- guide: [../../docs/nuxt.md](../../docs/nuxt.md)
- overview: [../../docs/example-apps.md](../../docs/example-apps.md)
