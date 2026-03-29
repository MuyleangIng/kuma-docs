import json

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .services import create_qr_session


@csrf_exempt
def koma_qr(request):
    body = json.loads(request.body)
    return JsonResponse(create_qr_session(body["amount"], body["currency"], body["productId"]))


@csrf_exempt
def koma_status(request):
    body = json.loads(request.body)
    return JsonResponse({"md5": body["md5"], "pollToken": body["pollToken"]})
