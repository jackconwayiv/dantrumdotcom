from datetime import date, timedelta

from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .birthdays import birthday_window_filter, next_birthday_on_or_after
from .models import Album, Resource, TimelineEvent
from .querysets import with_owner_and_social_auth
from .serializers import OwnerSerializer
from .timeline import _birthday_title

User = get_user_model()

KIND_ORDER = {"birthday": 0, "event": 1, "album": 2, "resource": 3}
RECENT_POST_KIND_ORDER = {"album": 0, "resource": 1}
WINDOW_DAYS = 30
MIN_CAROUSEL_ITEMS = 5


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


def _recent_post_pick_key(item):
    """When filling the carousel, prefer newer posts; albums beat resources on ties."""
    return (
        -int(item["sort_date"].replace("-", "")),
        RECENT_POST_KIND_ORDER[item["kind"]],
        item["id"],
    )


def _backfill_recent_posts(items, minimum=MIN_CAROUSEL_ITEMS):
    if len(items) >= minimum:
        return items

    existing = {(item["kind"], item["id"]) for item in items}
    candidates = []

    for album in with_owner_and_social_auth(Album.objects.all()).order_by("-created_at"):
        key = ("album", album.id)
        if key not in existing:
            candidates.append(_album_to_item(album))

    for resource in with_owner_and_social_auth(Resource.objects.all()).order_by(
        "-created_at"
    ):
        key = ("resource", resource.id)
        if key not in existing:
            candidates.append(_resource_to_item(resource))

    candidates.sort(key=_recent_post_pick_key)
    needed = minimum - len(items)
    if needed > 0:
        items.extend(candidates[:needed])

    return items


def _count_kinds(items):
    return {
        "event": sum(1 for i in items if i["kind"] == "event"),
        "birthday": sum(1 for i in items if i["kind"] == "birthday"),
        "album": sum(1 for i in items if i["kind"] == "album"),
        "resource": sum(1 for i in items if i["kind"] == "resource"),
    }


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def home_recent(request):
    """
    Carousel feed: upcoming events and birthdays (30d), plus recent albums/resources (30d).
    If fewer than MIN_CAROUSEL_ITEMS, backfill from the most recent albums and resources
    (albums win ties over resources).
    """
    today = timezone.localdate()
    upcoming_end = today + timedelta(days=WINDOW_DAYS)
    posted_since = timezone.now() - timedelta(days=WINDOW_DAYS)

    items = []

    for event in (
        TimelineEvent.objects.filter(date__gte=today, date__lte=upcoming_end)
        .select_related("owner")
        .prefetch_related("owner__social_auth")
    ):
        items.append(_event_to_item(event))

    for user in (
        User.objects.filter(is_active=True)
        .exclude(date_of_birth__isnull=True)
        .filter(birthday_window_filter(today, upcoming_end))
        .prefetch_related("social_auth")
    ):
        occurrence = next_birthday_on_or_after(user.date_of_birth, today)
        if occurrence <= upcoming_end:
            items.append(_birthday_to_item(user, occurrence))

    for album in with_owner_and_social_auth(
        Album.objects.filter(created_at__gte=posted_since)
    ):
        items.append(_album_to_item(album))

    for resource in with_owner_and_social_auth(
        Resource.objects.filter(created_at__gte=posted_since)
    ):
        items.append(_resource_to_item(resource))

    items = _backfill_recent_posts(items)
    items.sort(key=_sort_key)

    return Response({"items": items, "counts": _count_kinds(items)})
