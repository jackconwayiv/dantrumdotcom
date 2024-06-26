from django.contrib import admin
from django.contrib.auth.decorators import login_required
from django.urls import include, path, re_path
from django.views.generic import RedirectView

from . import views

urlpatterns = [
    path("logout/", login_required(views.logout), name="logout"),
    path("admin/", admin.site.urls),
    path("api/", include("api.urls")),
    path("check/", views.is_logged_in),
    path("", include("social_django.urls")),
    path("unverified/", views.unverified, name="unverified"),
    re_path(r"^home/*", login_required(views.react), name="react"),
    path(
        "",
        RedirectView.as_view(pattern_name="react", permanent=True),
        name="index",
    ),
]
