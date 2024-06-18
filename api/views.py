from django.contrib.auth import logout as auth_logout
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse
from django.db.models.functions import ExtractYear

from .models import Album, Quote, Resource, User
from .permissions import IsOwnerOrReadOnly
from .serializers import (
    AlbumSerializer,
    AuthenticatedUserSerializer,
    QuoteSerializer,
    ResourceSerializer,
    UserSerializer,
)


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
        serializer.save(owner=self.request.user)

    @action(detail=False, methods=['get'], url_path='year/(?P<year>\d{4})')
    def year(self, request, year=None):
        albums = Album.objects.filter(date__year=year).order_by("-date")
        serializer = self.get_serializer(albums, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='mine')
    def mine(self, request):
        user = self.request.user
        albums = Album.objects.filter(owner=user).order_by("-date")
        serializer = self.get_serializer(albums, many=True)
        return Response(serializer.data)

@api_view(['GET'])
def album_years(request):
    years = Album.objects.annotate(year=ExtractYear('date')).values_list('year', flat=True).distinct()
    return Response(sorted(years, reverse=True))

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
        serializer.save(owner=self.request.user)


class UserViewSet(viewsets.ModelViewSet):
    """
    This viewset provides `retrieve`, `update`, `partial_update`, `list`, and `me` actions.
    """

    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]

    def get_queryset(self):
        if self.action == "me":
            return User.objects.filter(pk=self.request.user.pk)
        return User.objects.filter(is_active=True)

    def get_serializer_class(self):
        if self.action == "me":
            return AuthenticatedUserSerializer
        return UserSerializer

    @action(detail=False, methods=["get", "put", "patch"], url_path="me")
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
