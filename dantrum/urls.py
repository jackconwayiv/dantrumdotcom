from django.contrib import admin
from django.contrib.auth.decorators import login_required
from django.urls import include, path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login/", views.login, name="login"),
    path("admin/", admin.site.urls),
    path("api/", include("api.urls")),
    path("", include("social_django.urls", namespace="social")),
    path("callback", views.callback, name="callback"),
]
