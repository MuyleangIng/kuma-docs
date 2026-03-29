# Django

Use this when you want Python backend structure with Django settings, urls, and views.

## Recommended Structure

```text
project/
  settings.py
  urls.py
payments/
  urls.py
  views.py
  services.py
templates/
  payment/
    success.html
    cancelled.html
```

## Service Example

```python
import base64
import hashlib
import hmac
import uuid

import requests
from django.conf import settings

def normalize_amount(raw: str) -> str:
    return str(float(raw)).rstrip("0").rstrip(".")

def sign_checkout(payload: str) -> str:
    digest = hmac.new(
        settings.KOMA_SECRET_KEY.encode("utf-8"),
        payload.encode("utf-8"),
        hashlib.sha512,
    ).digest()
    return base64.b64encode(digest).decode("utf-8")

def create_qr_session(amount: str, currency: str, product_id: str):
    tran_id = str(uuid.uuid4())
    normalized = normalize_amount(amount)
    success_url = f"{settings.KOMA_APP_URL}/payment/success?productId={product_id}"
    cancel_url = f"{settings.KOMA_APP_URL}/payment/cancelled?productId={product_id}"
    payload = f"{success_url}{cancel_url}{currency}{tran_id}{settings.KOMA_MERCHANT_ID}{normalized}"

    response = requests.post(
        f"{settings.KOMA_API_URL}/api/payment-gateway/checkout",
        data={
            "amount": normalized,
            "currency": currency,
            "merchantId": settings.KOMA_MERCHANT_ID,
            "tranID": tran_id,
            "returnURL": cancel_url,
            "continueSuccessURL": success_url,
            "hash": sign_checkout(payload),
        },
        timeout=30,
    )
    response.raise_for_status()
    return response.text
```

## Views

```python
import json

from django.http import JsonResponse, HttpResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt

from .services import create_qr_session

@csrf_exempt
def koma_qr(request):
    body = json.loads(request.body)
    html = create_qr_session(body["amount"], body["currency"], body["productId"])
    return HttpResponse(html)

@csrf_exempt
def koma_status(request):
    body = json.loads(request.body)
    return JsonResponse({"md5": body["md5"], "pollToken": body["pollToken"]})

def success_page(request):
    return render(request, "payment/success.html")

def cancelled_page(request):
    return render(request, "payment/cancelled.html")
```

## URL Wiring

```python
from django.urls import path

from . import views

urlpatterns = [
    path("api/koma-qr", views.koma_qr),
    path("api/koma-status", views.koma_status),
    path("payment/success", views.success_page),
    path("payment/cancelled", views.cancelled_page),
]
```

## Notes

- if Django renders your checkout pages, keep the success and cancelled views server-side
- if a separate frontend owns those pages, Django can still own just the API routes
- use [Python Overview](./python.md) for the shared contract
