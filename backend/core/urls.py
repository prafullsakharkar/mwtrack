from apis.accounts.urls import account_urls
from apis.entities.urls import entity_urls
from apis.utilities.urls import utility_urls
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path, re_path

from .views import (
    CustomProviderAuthView,
    CustomTokenObtainPairView,
    CustomTokenRefreshView,
    CustomTokenVerifyView,
    LogoutView,
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("djoser.urls")),
    re_path(r"^o/(?P<provider>\S+)/$", CustomProviderAuthView.as_view(), name="provider-auth"),
    path("api/jwt/create/", CustomTokenObtainPairView.as_view()),
    path("api/jwt/refresh/", CustomTokenRefreshView.as_view()),
    path("api/jwt/verify/", CustomTokenVerifyView.as_view()),
    path("api/logout/", LogoutView.as_view()),
    # path("auth/", include("djoser.social.urls")),
]

# Add app urls here
urlpatterns += account_urls
urlpatterns += utility_urls
urlpatterns += entity_urls


urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
