from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("albums/", views.album_list, name="albums"),
    path("albums/<int:pk>/", views.album_detail, name="detail"),
]
