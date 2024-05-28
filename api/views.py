from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser

from .models import Album
from .serializers import AlbumSerializer


def index(request):
    return HttpResponse("Hello world. You're at the api index.")


@csrf_exempt
def album_list(request):
    """
    List all albums, or create a new album.
    """
    if request.method == "GET":
        snippets = Album.objects.all()
        serializer = AlbumSerializer(snippets, many=True)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == "POST":
        data = JSONParser().parse(request)
        serializer = AlbumSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)


@csrf_exempt
def album_detail(request, pk):
    """
    Retrieve, update or delete an album.
    """
    try:
        album = Album.objects.get(pk=pk)
    except Album.DoesNotExist:
        return HttpResponse(status=404)

    if request.method == "GET":
        serializer = AlbumSerializer(album)
        return JsonResponse(serializer.data)

    elif request.method == "PUT":
        data = JSONParser().parse(request)
        serializer = AlbumSerializer(album, data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=400)

    elif request.method == "DELETE":
        album.delete()
        return HttpResponse(status=204)
