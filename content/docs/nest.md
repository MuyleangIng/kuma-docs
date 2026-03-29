# NestJS

NestJS should use `koma-khqr/server` from a controller and service pair.

## Suggested Structure

```text
src/
  koma/
    koma.controller.ts
    koma.service.ts
  pages.controller.ts
```

## Controller Responsibilities

- receive client payload for KHQR creation
- receive polling payload

## Service Responsibilities

- sign checkout fields
- call Koma checkout
- parse returned checkout page
- proxy polling requests

## Required Routes

- `POST /api/koma-qr`
- `POST /api/koma-status`
- app-owned success page
- app-owned cancelled page

## Env

```env
KOMA_API_URL=https://your-koma-api.example.com
KOMA_MERCHANT_ID=your-merchant-id@bankcode
KOMA_SECRET_KEY=replace-with-your-secret-key
KOMA_APP_URL=http://localhost:3000
```

Runnable example:

- [examples/nest/README.md](../examples/nest/README.md)
