from django.urls import path

from . import views

urlpatterns = [
    path("api/koma-qr", views.koma_qr),
    path("api/koma-status", views.koma_status),
]
