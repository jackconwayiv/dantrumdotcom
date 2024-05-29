from rest_framework import permissions, viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse

from .models import Album, User
from .permissions import IsOwnerOrReadOnly
from .serializers import AlbumSerializer, UserSerializer


@api_view(["GET"])
def index(request, format=None):
    return Response(
        {
            "users": reverse("user-list", request=request, format=format),
            "albums": reverse("album-list", request=request, format=format),
        }
    )


class AlbumViewSet(viewsets.ModelViewSet):
    """
    This ViewSet automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.
    """

    queryset = Album.objects.all().order_by(
        "-album_date"
    )  # Order by album_date descending
    serializer_class = AlbumSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """
    This viewset automatically provides `list` and `retrieve` actions.
    """

    queryset = User.objects.all()
    serializer_class = UserSerializer
