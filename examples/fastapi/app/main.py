from fastapi import FastAPI

from .koma_service import create_qr_session
from .schemas import CreateQrRequest, PollRequest

app = FastAPI()


@app.post("/api/koma-qr")
async def koma_qr(body: CreateQrRequest):
    return await create_qr_session(body.amount, body.currency, body.productId)


@app.post("/api/koma-status")
async def koma_status(body: PollRequest):
    return {"md5": body.md5, "pollToken": body.pollToken}
