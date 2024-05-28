from django.contrib.auth.models import User
from django.http import HttpResponse
from rest_framework import generics, permissions

from .models import Album
from .permissions import IsOwnerOrReadOnly
from .serializers import AlbumSerializer, UserSerializer


def index(request):
    return HttpResponse("Hello world. You're at the api index.")


class AlbumList(generics.ListCreateAPIView):
    """
    List all albums, or create a new album.
    """

    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    queryset = Album.objects.all()
    serializer_class = AlbumSerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class AlbumDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete an Album instance.
    """

    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    queryset = Album.objects.all()
    serializer_class = AlbumSerializer


class UserList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class UserDetail(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
