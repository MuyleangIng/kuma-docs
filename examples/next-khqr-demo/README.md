# Next KHQR Demo

Standalone Next.js demo for `koma-khqr`.

## Env

Create `.env.local` from `.env.example` and fill in your server-side values:

```env
KOMA_API_URL=https://koma.khqr.site
KOMA_MERCHANT_ID=your-merchant-id@bankcode
KOMA_SECRET_KEY=replace-with-your-secret-key
KOMA_APP_URL=http://localhost:3000
```

## Run

```bash
npm install
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

- `koma-khqr/react` for the checkout UI
- Next.js route handlers for the secure backend flow

## Node Runtime

- `Node 20.9+` is required here because this example uses `next@16`

## Docs

- setup: [../../docs/first-setup.md](../../docs/first-setup.md)
- guide: [../../docs/next-typescript.md](../../docs/next-typescript.md)
- overview: [../../docs/example-apps.md](../../docs/example-apps.md)
