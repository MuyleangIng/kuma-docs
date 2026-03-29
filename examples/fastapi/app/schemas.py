from pydantic import BaseModel


class CreateQrRequest(BaseModel):
    amount: str
    currency: str
    productId: str


class PollRequest(BaseModel):
    md5: str
    pollToken: str
