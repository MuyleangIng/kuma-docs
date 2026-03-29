# Python

Use this guide when your secure payment backend is Python instead of Node. This is a custom integration path, not a `koma-khqr` npm runtime.

## Good Fits

- FastAPI backend
- Flask backend
- Django backend with custom API endpoints

## What Python Should Own

- `KOMA_SECRET_KEY`
- checkout signing
- Koma checkout request
- Koma status request
- success and cancelled endpoints if your backend serves those pages

## Env

```env
KOMA_API_URL=https://koma.khqr.site
KOMA_MERCHANT_ID=yourname@aclb
KOMA_SECRET_KEY=replace-with-your-secret-key
KOMA_APP_URL=http://localhost:8000
```

## Suggested Structure

```text
app/
  main.py
  settings.py
  koma.py
templates/
  success.html
  cancelled.html
```

## Core Flow

1. frontend sends checkout request to your Python backend
2. Python creates `tranID`
3. Python signs the checkout payload
4. Python sends the signed request to Koma
5. Python returns QR data and polling tokens to the frontend
6. frontend polls Python, not Koma directly

## Hash Payload Order

Use this exact payload order:

`continueSuccessURL + returnURL + currency + tranID + merchantId + amount`

The digest should be:

- HMAC-SHA512
- keyed with `KOMA_SECRET_KEY`
- base64-encoded

## Example Python Signing

```python
import base64
import hashlib
import hmac

payload = (
    continue_success_url
    + return_url
    + currency
    + tran_id
    + merchant_id
    + amount
)

hash_value = base64.b64encode(
    hmac.new(secret_key.encode(), payload.encode(), hashlib.sha512).digest()
).decode()
```

## Routes You Usually Expose

- `POST /api/koma-qr`
- `POST /api/koma-status`
- `GET /payment/success`
- `GET /payment/cancelled`

## Frontend Pairings

Python works well with:

- React
- Vue
- Angular
- server-rendered templates

The frontend should call your Python API. It should never hold the secret key.

## First Setup

Before coding, complete:

- [First Setup](./first-setup.md)

That guide covers where to get:

- secret key
- merchant name
- merchant ID

## Important Notes

- verify the Merchant ID from your Bakong account before saving it in Koma
- keep `KOMA_SECRET_KEY` server-only
- return normalized success and cancelled redirects through your own app
