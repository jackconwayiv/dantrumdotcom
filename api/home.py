from datetime import date, timedelta

from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .birthdays import birthday_window_filter, next_birthday_on_or_after
from .models import Album, Resource, TimelineEvent
from .querysets import with_owner_and_social_auth
from .serializers import AlbumSerializer, OwnerSerializer, ResourceSerializer
from .timeline import _birthday_title

User = get_user_model()

KIND_ORDER = {"birthday": 0, "event": 1, "album": 2, "resource": 3}
WINDOW_DAYS = 30


def _owner_thumbnail(user):
    for auth in user.social_auth.all():
        picture = auth.extra_data.get("picture") if auth.extra_data else None
        if picture:
            return picture
    return None


def _base_item(kind, obj_id, title, sort_date, link_url, **extra):
    return {
        "kind": kind,
        "id": obj_id,
        "title": title,
        "sort_date": sort_date.isoformat(),
        "link_url": link_url,
        "description": extra.get("description"),
        "thumbnail_url": extra.get("thumbnail_url"),
        "date": extra.get("date"),
        "owner": extra.get("owner"),
    }


def _album_to_item(album):
    sort_date = album.created_at.date()
    return _base_item(
        "album",
        album.id,
        album.title,
        sort_date,
        album.link_url,
        description=album.description,
        thumbnail_url=album.thumbnail_url,
        date=album.date.isoformat(),
        owner=OwnerSerializer(album.owner).data,
    )


def _resource_to_item(resource):
    sort_date = resource.created_at.date()
    return _base_item(
        "resource",
        resource.id,
        resource.title,
        sort_date,
        resource.url,
        description=resource.description,
        thumbnail_url=resource.thumbnail_url,
        owner=OwnerSerializer(resource.owner).data,
    )


def _event_to_item(event):
    return _base_item(
        "event",
        event.id,
        event.title,
        event.date,
        "/app/timeline/",
        description=event.description,
        date=event.date.isoformat(),
        owner=OwnerSerializer(event.owner).data,
    )


def _birthday_to_item(user, occurrence: date):
    return _base_item(
        "birthday",
        user.id,
        _birthday_title(user),
        occurrence,
        f"/app/friends/{user.id}",
        thumbnail_url=_owner_thumbnail(user),
        date=occurrence.isoformat(),
        owner=OwnerSerializer(user).data,
    )


def _sort_key(item):
    return (
        -int(item["sort_date"].replace("-", "")),
        KIND_ORDER[item["kind"]],
        item["id"],
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def home_recent(request):
    """Carousel feed: all items in 30-day windows, interleaved by sort_date desc."""
    today = timezone.localdate()
    upcoming_end = today + timedelta(days=WINDOW_DAYS)
    posted_since = timezone.now() - timedelta(days=WINDOW_DAYS)

    items = []

    events = (
        TimelineEvent.objects.filter(date__gte=today, date__lte=upcoming_end)
        .select_related("owner")
        .prefetch_related("owner__social_auth")
    )
    for event in events:
        items.append(_event_to_item(event))

    birthday_users = (
        User.objects.filter(is_active=True)
        .exclude(date_of_birth__isnull=True)
        .filter(birthday_window_filter(today, upcoming_end))
        .prefetch_related("social_auth")
    )
    for user in birthday_users:
        occurrence = next_birthday_on_or_after(user.date_of_birth, today)
        if occurrence <= upcoming_end:
            items.append(_birthday_to_item(user, occurrence))

    albums = with_owner_and_social_auth(
        Album.objects.filter(created_at__gte=posted_since)
    )
    for album in albums:
        items.append(_album_to_item(album))

    resources = with_owner_and_social_auth(
        Resource.objects.filter(created_at__gte=posted_since)
    )
    for resource in resources:
        items.append(_resource_to_item(resource))

    items.sort(key=_sort_key)

    counts = {
        "event": sum(1 for i in items if i["kind"] == "event"),
        "birthday": sum(1 for i in items if i["kind"] == "birthday"),
        "album": sum(1 for i in items if i["kind"] == "album"),
        "resource": sum(1 for i in items if i["kind"] == "resource"),
    }

    return Response({"items": items, "counts": counts})
