from django.urls import include, path
from rest_framework.urlpatterns import format_suffix_patterns

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("albums/", views.AlbumList.as_view()),
    path("albums/<int:pk>/", views.AlbumDetail.as_view()),
    path("users/", views.UserList.as_view()),
    path("users/<int:pk>/", views.UserDetail.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
urlpatterns += [
    path("api-auth/", include("rest_framework.urls")),
]
