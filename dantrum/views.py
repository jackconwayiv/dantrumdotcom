import json
from urllib.parse import quote_plus, urlencode

import requests
from authlib.integrations.django_client import OAuth
from django.conf import settings
from django.contrib.auth import authenticate, login
from django.contrib.auth import logout as auth_logout
from django.contrib.auth import logout as django_logout
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.shortcuts import redirect, render
from django.urls import reverse

# oauth = OAuth()

# oauth.register(
#     "auth0",
#     client_id=settings.AUTH0_CLIENT_ID,
#     client_secret=settings.AUTH0_CLIENT_SECRET,
#     client_kwargs={
#         "scope": "openid profile email",
#     },
#     server_metadata_url=f"https://{settings.AUTH0_DOMAIN}/.well-known/openid-configuration",
# )


# def login(request):
#     return oauth.auth0.authorize_redirect(
#         request, request.build_absolute_uri(reverse("callback"))
#     )


# def callback(request):
#     token = oauth.auth0.authorize_access_token(request)
#     request.session["user"] = token
#     return redirect(request.build_absolute_uri(reverse("index")))


# def callback(request):
#     # Obtain the token from Auth0
#     token = oauth.auth0.authorize_access_token(request)

#     # Store the token in the session
#     request.session["user"] = token

#     # Retrieve user information from Auth0
#     userinfo_url = f"https://{settings.AUTH0_DOMAIN}/userinfo"
#     headers = {"Authorization": f"Bearer {token['access_token']}"}
#     userinfo_response = requests.get(userinfo_url, headers=headers)
#     userinfo = userinfo_response.json()

#     # Authenticate the user using a custom backend
#     user = authenticate(request, token=token["access_token"])
#     if user:
#         # Log in the user
#         login(request, user)

#     # Redirect to the desired page
#     return redirect(reverse("index"))


def is_logged_in(request):
    if request.user.is_authenticated:
        return HttpResponse("true", status=200)
    else:
        return HttpResponse("false", status=401)


def react(request):
    if settings.DEBUG:
        return redirect("http://localhost:5173")
    else:
        return render(request, "index.html")


@login_required
def logout(request):
    print("Logging out user:", request.user)
    django_logout(request)
    print("User logged out. Session:", request.session)
    domain = settings.SOCIAL_AUTH_AUTH0_DOMAIN
    client_id = settings.SOCIAL_AUTH_AUTH0_KEY
    return_to = request.build_absolute_uri("/")
    return redirect(
        f"https://{domain}/v2/logout?client_id={client_id}&returnTo={return_to}"
    )


def unverified(request):
    return render(request, "unverified.html")


# def logout(request):
#     """Logs out user"""
#     auth_logout(request)
#     return render_to_response('home.html', {}, RequestContext(request))


# def logout(request):
#     request.session.clear()


#     return redirect(
#         f"https://{settings.AUTH0_DOMAIN}/v2/logout?"
#         + urlencode(
#             {
#                 "returnTo": request.build_absolute_uri(reverse("index")),
#                 "client_id": settings.AUTH0_CLIENT_ID,
#             },
#             quote_via=quote_plus,
#         ),
#     )
# def logout(request):
#     django_logout(request)
#     domain = settings.SOCIAL_AUTH_AUTH0_DOMAIN
#     client_id = settings.SOCIAL_AUTH_AUTH0_KEY
#     return_to = request.build_absolute_uri("/")
#     return redirect(
#         f"https://{domain}/v2/logout?client_id={client_id}&returnTo={return_to}"
#     )


# def index(request):
#     return render(
#         request,
#         "index.html",
#         context={
#             "session": request.session.get("user"),
#             "pretty": json.dumps(request.session.get("user"), indent=4),
#         },
#     )
