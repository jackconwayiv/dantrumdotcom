import requests
import re
from bs4 import BeautifulSoup
from django.db.models.functions import ExtractYear
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from datetime import datetime, timedelta
from django.contrib.auth import get_user_model
from utils.slack_notifications import send_slack_message
from .models import Album, Quote, Resource, User
from .permissions import IsOwnerOrReadOnly, IsOwnerOrRestricted
from .serializers import (
    AlbumSerializer,
    AuthenticatedUserSerializer,
    QuoteSerializer,
    ResourceSerializer,
    URLSerializer,
    UserSerializer,
)
from django.db.models import Case, When, Value, IntegerField

class AlbumViewSet(viewsets.ModelViewSet):
    """
    This ViewSet automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.
    """

    queryset = Album.objects.all().order_by("-date")
    serializer_class = AlbumSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]

    def get_queryset(self):
        return Album.objects.all().order_by("-date")

    def perform_create(self, serializer):
        instance = serializer.save(owner=self.request.user)
        message = (
            f"> A lovely new album of fotos entitled '{instance.title}' has been shared to dantrum.com by {instance.owner}."
            # f"View it here: {album_url}"
        )
        send_slack_message(message)

    @action(detail=False, methods=["get"], url_path=r"year/(?P<year>\d{4})")
    def year(self, request, year=None):
        albums = Album.objects.filter(date__year=year).order_by("-date")
        serializer = self.get_serializer(albums, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"], url_path="mine")
    def mine(self, request):
        user = self.request.user
        albums = Album.objects.filter(owner=user).order_by("-date")
        serializer = self.get_serializer(albums, many=True)
        return Response(serializer.data)


@api_view(["GET"])
def album_years(request):
    years = (
        Album.objects.annotate(year=ExtractYear("date"))
        .values_list("year", flat=True)
        .distinct()
    )
    return Response(sorted(years, reverse=True))


class FetchAlbumData(APIView):
    def post(self, request, *args, **kwargs):
        serializer = URLSerializer(data=request.data)
        if serializer.is_valid():
            url = serializer.validated_data.get("url")

            response = requests.get(url)
            soup = BeautifulSoup(response.content, "html.parser")

            title = (
                soup.find("meta", property="og:title")["content"]
                if soup.find("meta", property="og:title")
                else soup.find("title").text if soup.find("title") else "No title found"
            )
            thumbnail = (
                soup.find("meta", property="og:image")["content"]
                if soup.find("meta", property="og:image")
                else "No image found"
            )
            album_url = (
                soup.find("meta", property="og:url")["content"]
                if soup.find("meta", property="og:url")
                else "No URL found"
            )

            # Initialize album_date as None
            album_date = None

            # Regular expression pattern to find month and day like "Jul 2", "Aug 12", "Dec 28"
            date_pattern = re.compile(r'\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\s\d{1,2}\b', re.IGNORECASE)
            year_pattern = re.compile(r'\b\d{4}\b')
            month_map = {
                "Jan": "01", "Feb": "02", "Mar": "03", "Apr": "04", "May": "05", "Jun": "06",
                "Jul": "07", "Aug": "08", "Sep": "09", "Sept": "09", "Oct": "10", "Nov": "11", "Dec": "12"
            }

            # Search for the pattern in all div elements
            div_elements = soup.find_all('div')
            for div in div_elements:
                if div.string and date_pattern.search(div.string):
                    # Extract the date string
                    date_str = date_pattern.search(div.string).group()
                    
                    # Split the date string to get month and day
                    month_str, day_str = date_str.split()
                    
                    # Convert month abbreviation to two-digit number
                    month = month_map[month_str.capitalize()]
                    
                    # Ensure day is two digits
                    day = f"{int(day_str):02d}"
                    
                    # Extract the year from the same div
                    year_match = year_pattern.search(div.string)
                    if year_match:
                        year = year_match.group()
                    else:
                        # Fallback to find a four-digit string within the div
                        for word in div.string.split():
                            if len(word) == 4 and word.isdigit():
                                year = word
                                break
                        else:
                            year = datetime.now().year  # Default to current year if no year found

                    # Construct the date in YYYY-MM-DD format
                    album_date = f"{year}-{month}-{day}"

                    break

            # Fallback if no date found
            if not album_date:
                album_date = "No date found"

            data = {
                "title": title,
                "thumbnail_url": thumbnail,
                "link_url": album_url,
                "date": album_date
            }
            return Response(data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class QuoteViewSet(viewsets.ModelViewSet):
    """
    This ViewSet automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.
    """

    queryset = Quote.objects.all().order_by("-date")
    serializer_class = QuoteSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class ResourceViewSet(viewsets.ModelViewSet):
    """
    This ViewSet automatically provides `list`, `create`, `retrieve`,
    `update`, and `destroy` actions.
    """

    queryset = Resource.objects.all().order_by("-created_at")
    serializer_class = ResourceSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        instance = serializer.save(owner=self.request.user)
        message = (
            f"> A fascinating new resource link entitled '{instance.title}' has been shared to dantrum.com by {instance.owner}."
            # f"View it here: {album_url}"
        )
        send_slack_message(message)


class URLSummaryView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = URLSerializer(data=request.data)
        if serializer.is_valid():
            url = serializer.validated_data["url"]
            try:
                response = requests.get(url)
                response.raise_for_status()
                soup = BeautifulSoup(response.content, "html.parser")

                title = soup.title.string if soup.title else ""

                thumbnail = ""
                for img in soup.find_all("img"):
                    if img.get("src"):
                        thumbnail = img["src"]
                        break

                paragraphs = soup.find_all("p")
                summary = ""
                if paragraphs:
                    first_paragraph = paragraphs[0].get_text()
                    sentences = first_paragraph.split(".")
                    if sentences:
                        summary = sentences[0] + "."

                return Response(
                    {"title": title, "thumbnail": thumbnail, "summary": summary},
                    status=status.HTTP_200_OK,
                )
            except requests.exceptions.RequestException as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

User = get_user_model()

class BirthdayListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        user = request.user
        if not user.is_active:
            return Response(status=403)

        today = datetime.now().date()
        start_date = today - timedelta(days=2)
        end_date = today + timedelta(days=6)

        active_users = User.objects.filter(is_active=True).exclude(date_of_birth__isnull=True)

        result = []
        for user in active_users:
            dob = user.date_of_birth
            dob_this_year = dob.replace(year=today.year)
            if start_date <= dob_this_year <= end_date:
                result.append(user)

        serializer = UserSerializer(result, many=True)
        return Response(serializer.data)


class UserViewSet(viewsets.ModelViewSet):
    """
    This viewset provides `retrieve`, `update`, `partial_update`, `list`, and `me` actions.
    """
    queryset = User.objects.all()
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrRestricted]

    def get_queryset(self):
        user = self.request.user
        if self.action == "me":
            return User.objects.filter(pk=user.pk)

        queryset = User.objects.exclude(email="admin@dantrum.com").annotate(
            last_login_order=Case(
                When(last_login__isnull=True, then=Value(1)),
                default=Value(0),
                output_field=IntegerField()
            )
        ).order_by('last_login_order', '-last_login')

        if user.is_staff:
            return queryset
        filtered_queryset = queryset.filter(is_active=True)
        return filtered_queryset

    def get_serializer_class(self):
        if self.action == "me" or (self.action == 'retrieve' and self.get_object() == self.request.user):
            return AuthenticatedUserSerializer
        return UserSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer_class = self.get_serializer_class()
        serializer = serializer_class(instance)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if 'is_staff' in request.data or 'is_superuser' in request.data:
            if request.user == instance:
                return Response({'detail': 'You do not have permission to change your own staff or superuser status.'}, status=status.HTTP_403_FORBIDDEN)
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        if 'is_staff' in request.data or 'is_superuser' in request.data:
            if request.user == instance:
                return Response({'detail': 'You do not have permission to change your own staff or superuser status.'}, status=status.HTTP_403_FORBIDDEN)
        return super().partial_update(request, *args, **kwargs)

    @action(detail=False, methods=["get", "put", "patch"], url_path="me", url_name="me")
    def me(self, request):
        user = request.user
        if request.method == "GET":
            serializer = self.get_serializer(user)
            return Response(serializer.data)
        elif request.method in ["PUT", "PATCH"]:
            partial = request.method == "PATCH"
            serializer = self.get_serializer(user, data=request.data, partial=partial)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["post"], url_path="activate", url_name="activate")
    def activate(self, request, pk=None):
        user = request.user
        if not user.is_staff:
            return Response({"detail": "You do not have permission to perform this action."}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            friend = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        
        if friend == user:
            return Response({"detail": "You cannot change your own status."}, status=status.HTTP_400_BAD_REQUEST)
        
        if friend.is_active:
            return Response({"detail": "User is already active."}, status=status.HTTP_400_BAD_REQUEST)
        
        friend.is_active = True
        friend.save()
        return Response({"detail": "User has been activated."}, status=status.HTTP_200_OK)