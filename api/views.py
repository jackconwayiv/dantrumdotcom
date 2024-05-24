from django.http import HttpResponse

# Create your views here.


def index(request):
    return HttpResponse("Hello world. You're at the api index.")


def detail(request, album_id):
    return HttpResponse("You're looking at album %s." % album_id)
