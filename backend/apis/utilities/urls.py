from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import FileUploadView, StatusView, UtilStepView

router = DefaultRouter()
router.register(r"statuses", StatusView)
router.register(r"utilsteps", UtilStepView)
router.register(r"uploadfiles", FileUploadView)

utility_urls = [
    path("api/v1/utility/", include(router.urls)),
]
