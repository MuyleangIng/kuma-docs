import os


class Config:
    KOMA_API_URL = os.environ["KOMA_API_URL"]
    KOMA_MERCHANT_ID = os.environ["KOMA_MERCHANT_ID"]
    KOMA_SECRET_KEY = os.environ["KOMA_SECRET_KEY"]
    KOMA_APP_URL = os.environ["KOMA_APP_URL"]
