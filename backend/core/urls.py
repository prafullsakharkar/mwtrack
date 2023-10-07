from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("djoser.urls")),
    path("api/", include("apis.accounts.urls")),
    # path("auth/", include("djoser.urls.jwt")),
    # path("auth/", include("djoser.social.urls")),
]
