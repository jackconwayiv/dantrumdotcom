from django.db.models import Prefetch
from social_django.models import UserSocialAuth


def with_owner_and_social_auth(qs):
    return qs.select_related("owner").prefetch_related(
        Prefetch("owner__social_auth", queryset=UserSocialAuth.objects.all())
    )
