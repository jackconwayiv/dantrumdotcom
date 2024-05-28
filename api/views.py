from django.http import HttpResponse
from rest_framework import generics

from .models import Album
from .serializers import AlbumSerializer


def index(request):
    return HttpResponse("Hello world. You're at the api index.")


class AlbumList(generics.ListCreateAPIView):
    """
    List all albums, or create a new album.
    """

    queryset = Album.objects.all()
    serializer_class = AlbumSerializer

    # def get(self, request, format=None):
    #     albums = Album.objects.all()
    #     serializer = AlbumSerializer(albums, many=True)
    #     return Response(serializer.data)

    # def post(self, request, format=None):
    #     serializer = AlbumSerializer(data=request.data)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data, status=status.HTTP_201_CREATED)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AlbumDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a Album instance.
    """

    queryset = Album.objects.all()
    serializer_class = AlbumSerializer

    # def get_object(self, pk):
    #     try:
    #         return Album.objects.get(pk=pk)
    #     except Album.DoesNotExist:
    #         raise Http404

    # def get(self, request, pk, format=None):
    #     Album = self.get_object(pk)
    #     serializer = AlbumSerializer(Album)
    #     return Response(serializer.data)

    # def put(self, request, pk, format=None):
    #     Album = self.get_object(pk)
    #     serializer = AlbumSerializer(Album, data=request.data)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # def delete(self, request, pk, format=None):
    #     Album = self.get_object(pk)
    #     Album.delete()
    #     return Response(status=status.HTTP_204_NO_CONTENT)
