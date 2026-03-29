# Angular

Angular should be treated as a frontend that pairs with a backend server.

## Entry Point

Use:

```ts
import { createKomaAngularConfig } from "koma-khqr/angular";
```

## Recommended Shape

- Angular frontend renders the checkout page
- Express or Nest backend keeps `KOMA_SECRET_KEY`
- backend exposes:
  - `POST /api/koma-qr`
  - `POST /api/koma-status`
  - `/payment/success`
  - `/payment/cancelled`

## Recommended Pairings

- Angular + Express: [express.md](./express.md)
- Angular + NestJS: [nest.md](./nest.md)

Do not attempt to sign Koma requests inside Angular browser code.

## Env

```env
KOMA_API_URL=https://your-koma-api.example.com
KOMA_MERCHANT_ID=your-merchant-id@bankcode
KOMA_SECRET_KEY=replace-with-your-secret-key
KOMA_APP_URL=http://localhost:4200
```

## Config Helper

```ts
import { createKomaAngularConfig } from "koma-khqr/angular";

const koma = createKomaAngularConfig();
```

## Runnable Example

- [examples/angular/README.md](../examples/angular/README.md)
