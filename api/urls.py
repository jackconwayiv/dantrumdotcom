from django.urls import include, path
from rest_framework.routers import DefaultRouter
from . import home, views


router = DefaultRouter()
router.register(r"albums", views.AlbumViewSet, basename="album")
router.register(r"users", views.UserViewSet, basename="user")
router.register(r"quotes", views.QuoteViewSet, basename="quote")
router.register(r"resources", views.ResourceViewSet, basename="resource")
router.register(r'family-tree', views.FamilyTreeMemberViewSet, basename='family-tree')
router.register(r"timeline-events", views.TimelineEventViewSet, basename="timeline-event")


urlpatterns = [
    path("", include(router.urls)),
    path("timeline/", views.timeline_summary, name="timeline-summary"),
    path(
        "timeline/<int:year>/<int:month>/",
        views.timeline_month_detail,
        name="timeline-month-detail",
    ),
    path(
        "timeline/albums/<int:album_id>/exclude/",
        views.timeline_album_exclude,
        name="timeline-album-exclude",
    ),
    path("years/", views.album_years, name="album-years"),
    path("birthdays/", views.BirthdayListView.as_view(), name="birthdays"),
    path("home/recent/", home.home_recent, name="home-recent"),
    path("summary/", views.URLSummaryView.as_view(), name="url-summary"),
    path("fetch-album-data/", views.FetchAlbumData.as_view(), name="fetch_album_data"),
    path("api-auth/", include("rest_framework.urls")),
]