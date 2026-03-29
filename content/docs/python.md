# Python Overview

Use Python when your secure backend is already outside the Node runtime family.

This is a custom backend path. You do not import `koma-khqr` from Python. Instead, you keep the same env contract and implement the secure KHQR routes in your own server.

## Shared Env

```env
KOMA_API_URL=https://koma.khqr.site
KOMA_MERCHANT_ID=your-merchant-id@bankcode
KOMA_SECRET_KEY=replace-with-your-secret-key
KOMA_APP_URL=http://localhost:8000
```

## Shared Responsibilities

Every Python backend should own:

- `POST /api/koma-qr`
- `POST /api/koma-status`
- `/payment/success`
- `/payment/cancelled`
- HMAC-SHA512 signing with base64 output
- outbound POST calls to Koma

## Pick Your Shape

- FastAPI: [fastapi.md](./fastapi.md)
- Flask: [flask.md](./flask.md)
- Django: [django.md](./django.md)

## Shared Signing Rule

The hash payload order is:

```text
continueSuccessURL + returnURL + currency + tranID + merchantId + amount
```

Python example:

```python
import base64
import hashlib
import hmac

def sign_checkout(payload: str, secret_key: str) -> str:
    digest = hmac.new(
        secret_key.encode("utf-8"),
        payload.encode("utf-8"),
        hashlib.sha512,
    ).digest()
    return base64.b64encode(digest).decode("utf-8")
```

## Recommended Route Contract

Your frontend or server-rendered app should speak the same KHQR shape used throughout the Node examples:

```json
POST /api/koma-qr
{
  "amount": "12",
  "currency": "USD",
  "productId": "P001"
}
```

```json
POST /api/koma-status
{
  "md5": "...",
  "pollToken": "..."
}
```

## Notes

- keep `KOMA_SECRET_KEY` server-side only
- normalize amounts before signing
- use [First Setup](./first-setup.md) before you implement the backend
- use [PI Integration Reference](./pi-integration.md) for provider details
