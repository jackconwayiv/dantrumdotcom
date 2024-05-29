from django.urls import include, path
from rest_framework.urlpatterns import format_suffix_patterns

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("albums/", views.AlbumList.as_view(), name="album-list"),
    path("albums/<int:pk>/", views.AlbumDetail.as_view(), name="album-detail"),
    path("users/", views.UserList.as_view(), name="user-list"),
    path("users/<int:pk>/", views.UserDetail.as_view(), name="user-detail"),
]

urlpatterns = format_suffix_patterns(urlpatterns)
urlpatterns += [
    path("api-auth/", include("rest_framework.urls")),
]
