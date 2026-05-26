from datetime import date, timedelta

from django.db.models import Q


def birthday_window_filter(start_date: date, end_date: date) -> Q:
    """Match users whose month/day falls on any date in [start_date, end_date]."""
    birthday_filter = Q()
    current = start_date
    while current <= end_date:
        birthday_filter |= Q(
            date_of_birth__month=current.month,
            date_of_birth__day=current.day,
        )
        current += timedelta(days=1)
    return birthday_filter


def _safe_birthday(year: int, month: int, day: int) -> date:
    """Feb 29 birthdays use Feb 28 on non-leap years."""
    try:
        return date(year, month, day)
    except ValueError:
        return date(year, month, 28)


def next_birthday_on_or_after(dob: date, from_date: date) -> date:
    """Next calendar occurrence of dob's month/day on or after from_date."""
    candidate = _safe_birthday(from_date.year, dob.month, dob.day)
    if candidate >= from_date:
        return candidate
    return _safe_birthday(from_date.year + 1, dob.month, dob.day)
