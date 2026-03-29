from flask import Flask, request

from koma_service import create_qr_session

app = Flask(__name__)


@app.post("/api/koma-qr")
def koma_qr():
    body = request.get_json(force=True)
    return create_qr_session(body["amount"], body["currency"], body["productId"])
