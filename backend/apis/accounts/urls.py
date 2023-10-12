from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import UserView

router = DefaultRouter()
router.register(r"users", UserView)

account_urls = [
    path("api/v1/account/", include(router.urls)),
]
