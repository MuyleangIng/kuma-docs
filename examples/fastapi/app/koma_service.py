from .settings import settings


async def create_qr_session(amount: str, currency: str, product_id: str):
    return {
        "amount": amount,
        "currency": currency,
        "productId": product_id,
        "merchantId": settings.KOMA_MERCHANT_ID,
    }
