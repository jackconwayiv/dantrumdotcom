from rest_framework.test import APITestCase
from api.models import Album, User
from api.serializers import AlbumSerializer

class AlbumSerializerTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="testuser@test.com", password="testpass", date_of_birth="1990-01-01"
        )
        self.album = Album.objects.create(title="Test Album", owner=self.user)

    def test_album_serializer(self):
        serializer = AlbumSerializer(self.album)
        data = serializer.data
        self.assertEqual(data["title"], "Test Album")
        self.assertEqual(data["owner"]["email"], self.user.email)