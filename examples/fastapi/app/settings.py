from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    KOMA_API_URL: str
    KOMA_MERCHANT_ID: str
    KOMA_SECRET_KEY: str
    KOMA_APP_URL: str


settings = Settings()
