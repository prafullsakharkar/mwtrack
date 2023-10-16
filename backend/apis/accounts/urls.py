from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import GroupView, UserView

router = DefaultRouter()
router.register(r"users", UserView)
router.register(r"groups", GroupView)

account_urls = [
    path("api/v1/account/", include(router.urls)),
]
