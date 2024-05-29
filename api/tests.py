from django.contrib.auth.models import User
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient, APITestCase

from .models import Album
from .serializers import AlbumSerializer


class AlbumModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="testpass")

    def test_album_creation(self):
        album = Album.objects.create(title="Test Album", owner=self.user)
        self.assertEqual(album.title, "Test Album")
        self.assertEqual(album.owner, self.user)


class AlbumSerializerTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="testpass")
        self.album = Album.objects.create(title="Test Album", owner=self.user)

    def test_album_serializer(self):
        serializer = AlbumSerializer(self.album)
        data = serializer.data
        self.assertEqual(data["title"], "Test Album")
        self.assertEqual(data["owner"], self.user.username)  # Check for username


class AlbumViewSetTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="testpass")
        self.album = Album.objects.create(
            title="Test Album",
            description="Test Description",
            link_url="http://test.com",
            thumbnail_url="http://test.com/thumbnail.jpg",
            owner=self.user,
        )
        self.client = APIClient()
        self.client.login(username="testuser", password="testpass")

    def test_list_albums(self):
        url = reverse("album-list")
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)

    def test_create_album(self):
        url = reverse("album-list")
        data = {
            "title": "New Album",
            "description": "New Description",
            "link_url": "http://new.com",
            "thumbnail_url": "http://new.com/thumbnail.jpg",
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Album.objects.count(), 2)
        self.assertEqual(Album.objects.get(id=response.data["id"]).owner, self.user)


class AlbumPermissionTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="testpass")
        self.other_user = User.objects.create_user(
            username="otheruser", password="testpass"
        )
        self.album = Album.objects.create(title="Test Album", owner=self.user)
        self.client = APIClient()
        self.client.login(username="testuser", password="testpass")

    def test_permission_denied_for_other_user(self):
        self.client.logout()
        self.client.login(username="otheruser", password="testpass")
        url = reverse("album-detail", args=[self.album.id])
        response = self.client.put(url, {"title": "Updated Album"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
