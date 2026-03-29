# FastAPI

Use this when you want a typed Python backend with async handlers.

## Recommended Structure

```text
app/
  main.py
  schemas.py
  settings.py
  koma_service.py
```

## Settings

```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    KOMA_API_URL: str
    KOMA_MERCHANT_ID: str
    KOMA_SECRET_KEY: str
    KOMA_APP_URL: str

settings = Settings()
```

## Request Models

```python
from pydantic import BaseModel

class CreateQrRequest(BaseModel):
    amount: str
    currency: str
    productId: str

class PollRequest(BaseModel):
    md5: str
    pollToken: str
```

## Service Example

```python
import base64
import hashlib
import hmac
import uuid

import httpx

from .settings import settings

def normalize_amount(raw: str) -> str:
    return str(float(raw)).rstrip("0").rstrip(".")

def sign_checkout(payload: str) -> str:
    digest = hmac.new(
        settings.KOMA_SECRET_KEY.encode("utf-8"),
        payload.encode("utf-8"),
        hashlib.sha512,
    ).digest()
    return base64.b64encode(digest).decode("utf-8")

async def create_qr_session(amount: str, currency: str, product_id: str):
    tran_id = str(uuid.uuid4())
    normalized = normalize_amount(amount)
    success_url = f"{settings.KOMA_APP_URL}/payment/success?productId={product_id}"
    cancel_url = f"{settings.KOMA_APP_URL}/payment/cancelled?productId={product_id}"
    payload = f"{success_url}{cancel_url}{currency}{tran_id}{settings.KOMA_MERCHANT_ID}{normalized}"

    async with httpx.AsyncClient(base_url=settings.KOMA_API_URL, timeout=30.0) as client:
        response = await client.post(
            "/api/payment-gateway/checkout",
            data={
                "amount": normalized,
                "currency": currency,
                "merchantId": settings.KOMA_MERCHANT_ID,
                "tranID": tran_id,
                "returnURL": cancel_url,
                "continueSuccessURL": success_url,
                "hash": sign_checkout(payload),
            },
        )
        response.raise_for_status()
        return response.text
```

## Routes

```python
from fastapi import FastAPI
from fastapi.responses import HTMLResponse

from .koma_service import create_qr_session
from .schemas import CreateQrRequest, PollRequest

app = FastAPI()

@app.post("/api/koma-qr")
async def koma_qr(body: CreateQrRequest):
    return await create_qr_session(body.amount, body.currency, body.productId)

@app.post("/api/koma-status")
async def koma_status(body: PollRequest):
    return {"md5": body.md5, "pollToken": body.pollToken}

@app.get("/payment/success", response_class=HTMLResponse)
async def success_page():
    return "<h1>Payment successful</h1>"

@app.get("/payment/cancelled", response_class=HTMLResponse)
async def cancelled_page():
    return "<h1>Payment cancelled</h1>"
```

## Notes

- pair this backend with any frontend you want
- keep the secret key out of client code
- use [Python Overview](./python.md) for the shared contract
