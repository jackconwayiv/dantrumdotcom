from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

# Create a router and register our ViewSets with it.
router = DefaultRouter()
router.register(r"albums", views.AlbumViewSet, basename="album")
router.register(r"users", views.UserViewSet, basename="user")

# album_list = AlbumViewSet.as_view({"get": "list", "post": "create"})
# album_detail = AlbumViewSet.as_view(
#     {"get": "retrieve", "put": "update", "patch": "partial_update", "delete": "destroy"}
# )
# user_list = UserViewSet.as_view({"get": "list"})
# user_detail = UserViewSet.as_view({"get": "retrieve"})

# urlpatterns = [
#     path("", index, name="index"),
#     path("albums/", album_list, name="album-list"),
#     path("albums/<int:pk>/", album_detail, name="album-detail"),
#     path("users/", user_list, name="user-list"),
#     path("users/<int:pk>/", user_detail, name="user-detail"),
# ]

# The API URLs are now determined automatically by the router.
urlpatterns = [
    path("", include(router.urls)),
    path("api-auth/", include("rest_framework.urls")),
]
