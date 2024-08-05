from django.urls import include, path
from rest_framework.routers import DefaultRouter
from . import views


router = DefaultRouter()
router.register(r"albums", views.AlbumViewSet, basename="album")
router.register(r"users", views.UserViewSet, basename="user")
router.register(r"quotes", views.QuoteViewSet, basename="quote")
router.register(r"resources", views.ResourceViewSet, basename="resource")
router.register(r'family-tree', views.FamilyTreeMemberViewSet, basename='family-tree')


urlpatterns = [
    path("", include(router.urls)),
    path("years/", views.album_years, name="album-years"),
    path("birthdays/", views.BirthdayListView.as_view(), name="birthdays"),
    path("summary/", views.URLSummaryView.as_view(), name="url-summary"),
    path("fetch-album-data/", views.FetchAlbumData.as_view(), name="fetch_album_data"),
    path("api-auth/", include("rest_framework.urls")),
]