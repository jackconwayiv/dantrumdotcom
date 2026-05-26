import calendar
from collections import defaultdict
from datetime import date

from django.contrib.auth import get_user_model
from django.db.models.functions import ExtractMonth, ExtractYear

from api.models import Album, TimelineEvent
from api.querysets import with_owner_and_social_auth
from api.serializers import OwnerSerializer

User = get_user_model()


def visible_albums_queryset(*, with_owner=True):
    qs = Album.objects.filter(timeline_exclusion__isnull=True)
    if with_owner:
        return with_owner_and_social_auth(qs)
    return qs


def get_birthday_months():
    return set(
        User.objects.filter(is_active=True)
        .exclude(date_of_birth__isnull=True)
        .values_list("date_of_birth__month", flat=True)
        .distinct()
    )


def _months_by_year(qs):
    """Single query: distinct (year, month) pairs for a date field on qs."""
    by_year = defaultdict(set)
    rows = qs.annotate(
        y=ExtractYear("date"),
        m=ExtractMonth("date"),
    ).values("y", "m").distinct()
    for row in rows:
        y, m = row["y"], row["m"]
        if y is not None and m is not None:
            by_year[y].add(m)
    return by_year


def build_timeline_summary():
    """Build year/month grid in O(1) DB round-trips (not one query per year)."""
    birthday_months = get_birthday_months()
    album_months = _months_by_year(visible_albums_queryset(with_owner=False))
    event_months = _months_by_year(TimelineEvent.objects.all())

    all_years = sorted(set(album_months) | set(event_months))
    years = []
    for year in all_years:
        months = set()
        months |= album_months.get(year, set())
        months |= event_months.get(year, set())
        months |= birthday_months
        years.append({"year": year, "months_with_events": sorted(months)})
    return {"years": years}


def _owner_payload(user):
    return OwnerSerializer(user).data


def _birthday_title(user):
    if user.username:
        return f"{user.username}'s Birthday"
    name = " ".join(part for part in [user.first_name, user.last_name] if part)
    return f"{name}'s Birthday" if name else f"{user.email}'s Birthday"


def get_month_events(year, month, requesting_user=None):
    events = []

    for album in visible_albums_queryset().filter(date__year=year, date__month=month):
        events.append(
            {
                "id": f"album-{album.id}",
                "type": "album",
                "title": album.title,
                "date": album.date.isoformat(),
                "sort_date": album.date.isoformat(),
                "owner": _owner_payload(album.owner),
                "link_url": album.link_url,
                "description": album.description,
                "can_remove_from_timeline": requesting_user == album.owner
                if requesting_user
                else False,
            }
        )

    for event in (
        TimelineEvent.objects.filter(date__year=year, date__month=month)
        .select_related("owner")
        .prefetch_related("owner__social_auth")
    ):
        events.append(
            {
                "id": f"event-{event.id}",
                "type": "event",
                "title": event.title,
                "date": event.date.isoformat(),
                "sort_date": event.date.isoformat(),
                "owner": _owner_payload(event.owner),
                "link_url": None,
                "description": event.description,
                "can_remove_from_timeline": False,
            }
        )

    for user in User.objects.filter(is_active=True, date_of_birth__month=month).prefetch_related(
        "social_auth"
    ):
        dob = user.date_of_birth
        sort_date = date(year, month, dob.day)
        events.append(
            {
                "id": f"birthday-{user.id}",
                "type": "birthday",
                "title": _birthday_title(user),
                "date": None,
                "sort_date": sort_date.isoformat(),
                "owner": _owner_payload(user),
                "link_url": None,
                "description": None,
                "can_remove_from_timeline": False,
            }
        )

    events.sort(key=lambda e: (e["sort_date"], e["type"], e["title"]))
    return events


def get_month_detail(year, month, requesting_user=None):
    return {
        "year": year,
        "month": month,
        "month_name": calendar.month_name[month],
        "events": get_month_events(year, month, requesting_user),
    }
