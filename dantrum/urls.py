from django.contrib import admin
from django.contrib.auth.decorators import login_required
from django.urls import include, path

urlpatterns = [
    path("api/", include("api.urls")),
    path("auth/", include("social_django.urls")),
    path("admin/", admin.site.urls),
    # Including social_django.urls without any prefix
    # path("", include("social_django.urls")),
    # Redirecting the root URL to the React application
    # path(
    #     "",
    #     RedirectView.as_view(pattern_name="react", permanent=True),
    #     name="index",
    # ),
    # Logout URL
    # path("logout/", login_required(views.logout), name="logout"),
]
