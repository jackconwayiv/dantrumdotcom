from django.shortcuts import redirect
from django.urls import reverse


def check_user_active(strategy, details, user=None, *args, **kwargs):
    if user and not user.is_active:
        return redirect(reverse("unverified"))
    return {}
