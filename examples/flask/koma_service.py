from config import Config


def create_qr_session(amount: str, currency: str, product_id: str):
    return {
        "amount": amount,
        "currency": currency,
        "productId": product_id,
        "merchantId": Config.KOMA_MERCHANT_ID,
    }
