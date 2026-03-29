# Flask

Use this when you want the smallest Python backend shape.

## Recommended Structure

```text
app.py
config.py
koma_service.py
templates/
  success.html
  cancelled.html
```

## Config

```python
import os

class Config:
    KOMA_API_URL = os.environ["KOMA_API_URL"]
    KOMA_MERCHANT_ID = os.environ["KOMA_MERCHANT_ID"]
    KOMA_SECRET_KEY = os.environ["KOMA_SECRET_KEY"]
    KOMA_APP_URL = os.environ["KOMA_APP_URL"]
```

## Service Example

```python
import base64
import hashlib
import hmac
import uuid

import requests

from config import Config

def normalize_amount(raw: str) -> str:
    return str(float(raw)).rstrip("0").rstrip(".")

def create_qr_session(amount: str, currency: str, product_id: str):
    tran_id = str(uuid.uuid4())
    normalized = normalize_amount(amount)
    success_url = f"{Config.KOMA_APP_URL}/payment/success?productId={product_id}"
    cancel_url = f"{Config.KOMA_APP_URL}/payment/cancelled?productId={product_id}"
    payload = f"{success_url}{cancel_url}{currency}{tran_id}{Config.KOMA_MERCHANT_ID}{normalized}"

    digest = hmac.new(
        Config.KOMA_SECRET_KEY.encode("utf-8"),
        payload.encode("utf-8"),
        hashlib.sha512,
    ).digest()
    signature = base64.b64encode(digest).decode("utf-8")

    response = requests.post(
        f"{Config.KOMA_API_URL}/api/payment-gateway/checkout",
        data={
            "amount": normalized,
            "currency": currency,
            "merchantId": Config.KOMA_MERCHANT_ID,
            "tranID": tran_id,
            "returnURL": cancel_url,
            "continueSuccessURL": success_url,
            "hash": signature,
        },
        timeout=30,
    )
    response.raise_for_status()
    return response.text
```

## App Routes

```python
from flask import Flask, render_template, request

from koma_service import create_qr_session

app = Flask(__name__)

@app.post("/api/koma-qr")
def koma_qr():
    body = request.get_json(force=True)
    return create_qr_session(body["amount"], body["currency"], body["productId"])

@app.post("/api/koma-status")
def koma_status():
    body = request.get_json(force=True)
    return {"md5": body["md5"], "pollToken": body["pollToken"]}

@app.get("/payment/success")
def success_page():
    return render_template("success.html")

@app.get("/payment/cancelled")
def cancelled_page():
    return render_template("cancelled.html")
```

## Notes

- Flask is a good fit when you want a simple backend behind React, Vue, or plain HTML
- use [Python Overview](./python.md) for the shared contract
