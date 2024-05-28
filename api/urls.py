from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("albums/", views.AlbumList.as_view()),
    path("albums/<int:pk>/", views.AlbumDetail.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
