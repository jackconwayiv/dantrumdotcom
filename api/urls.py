from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

# Create a router and register our ViewSets with it.

router = DefaultRouter()
router.register(r"albums", views.AlbumViewSet, basename="album")
router.register(r"users", views.UserViewSet, basename="user")
router.register(r"quotes", views.QuoteViewSet, basename="quote")
router.register(r"resources", views.ResourceViewSet, basename="resource")

# The API URLs are now determined automatically by the router.

urlpatterns = [
    # path("", views.index, name="index"),
    path("", include(router.urls)),
    path("years/", views.album_years, name="album-years"),
    path("fetch-album-data/", views.FetchAlbumData.as_view(), name="fetch_album_data"),
    path("api-auth/", include("rest_framework.urls")),
]
