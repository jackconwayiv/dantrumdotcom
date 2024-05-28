from django.http import Http404, HttpResponse, JsonResponse
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.parsers import JSONParser
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Album
from .serializers import AlbumSerializer


def index(request):
    return HttpResponse("Hello world. You're at the api index.")


class AlbumList(APIView):
    """
    List all albums, or create a new album.
    """

    def get(self, request, format=None):
        albums = Album.objects.all()
        serializer = AlbumSerializer(albums, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = AlbumSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AlbumDetail(APIView):
    """
    Retrieve, update or delete a Album instance.
    """

    def get_object(self, pk):
        try:
            return Album.objects.get(pk=pk)
        except Album.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        Album = self.get_object(pk)
        serializer = AlbumSerializer(Album)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        Album = self.get_object(pk)
        serializer = AlbumSerializer(Album, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        Album = self.get_object(pk)
        Album.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# @api_view(["GET", "POST"])
# def album_list(request):
#     """
#     List all albums, or create a new album.
#     """
#     if request.method == "GET":
#         snippets = Album.objects.all()
#         serializer = AlbumSerializer(snippets, many=True)
#         return Response(serializer.data)

#     elif request.method == "POST":

#         serializer = AlbumSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# @api_view(["GET", "PUT", "DELETE"])
# def album_detail(request, pk):
#     """
#     Retrieve, update or delete an album.
#     """
#     try:
#         album = Album.objects.get(pk=pk)
#     except Album.DoesNotExist:
#         return Response(status=status.HTTP_404_NOT_FOUND)

#     if request.method == "GET":
#         serializer = AlbumSerializer(album)
#         return Response(serializer.data)

#     elif request.method == "PUT":

#         serializer = AlbumSerializer(album, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     elif request.method == "DELETE":
#         album.delete()
#         return Response(status=status.HTTP_202_NO_CONTENT)
