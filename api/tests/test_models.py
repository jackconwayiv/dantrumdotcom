from api.models import Album, Resource
from django.contrib.auth import get_user_model
from django.test import TestCase
from django.db import IntegrityError
import datetime

class CreatedUpdatedModelTests(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(email="user@example.com", password="test1234")

    def test_timestamps(self):
        album = Album.objects.create(
            title="Test Album", link_url="http://example.com", owner=self.user
        )
        self.assertIsNotNone(album.created_at)
        self.assertIsNotNone(album.updated_at)
        self.assertLessEqual(album.created_at, album.updated_at)
        
        old_updated_at = album.updated_at
        album.title = "Updated Title"
        album.save()
        album.refresh_from_db()
        self.assertGreater(album.updated_at, old_updated_at)

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status

class UserManagerTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.User = get_user_model()
        cls.user = cls.User.objects.create_user(email="user1@example.com", password="test1234")
        cls.other_user = cls.User.objects.create_user(email="user2@example.com", password="test5678")
        cls.superuser = cls.User.objects.create_superuser(email="admin@example.com", password="admin1234")

    def setUp(self):
        self.client = APIClient()

    def test_create_user(self):
        user = self.User.objects.create_user(email="user3@example.com", password="test1234")
        self.assertEqual(user.email, "user3@example.com")
        self.assertTrue(user.check_password("test1234"))
        self.assertFalse(user.is_active)

    def test_create_superuser(self):
        superuser = self.User.objects.create_superuser(email="admin2@example.com", password="admin1234")
        self.assertEqual(superuser.email, "admin2@example.com")
        self.assertTrue(superuser.check_password("admin1234"))
        self.assertTrue(superuser.is_active)
        self.assertTrue(superuser.is_staff)
        self.assertTrue(superuser.is_superuser)

    def test_create_user_no_email(self):
        with self.assertRaises(ValueError):
            self.User.objects.create_user(email=None, password="test1234")

class AlbumModelTests(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(email="user@example.com", password="test1234")

    def test_create_album(self):
        album = Album.objects.create(
            title="Test Album",
            link_url="http://example.com",
            owner=self.user
        )
        self.assertEqual(album.title, "Test Album")
        self.assertEqual(album.link_url, "http://example.com")
        self.assertEqual(album.owner, self.user)
        self.assertEqual(album.date, datetime.date.today())

    def test_unique_link_url(self):
        Album.objects.create(title="Album 1", link_url="http://example.com", owner=self.user)
        with self.assertRaises(IntegrityError):
            Album.objects.create(title="Album 2", link_url="http://example.com", owner=self.user)

class ResourceModelTests(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(email="user@example.com", password="test1234")

    def test_create_resource(self):
        resource = Resource.objects.create(
            title="Test Resource",
            url="http://example.com/resource",
            owner=self.user
        )
        self.assertEqual(resource.title, "Test Resource")
        self.assertEqual(resource.url, "http://example.com/resource")
        self.assertEqual(resource.owner, self.user)

    def test_unique_url(self):
        Resource.objects.create(title="Resource 1", url="http://example.com/resource", owner=self.user)
        with self.assertRaises(IntegrityError):
            Resource.objects.create(title="Resource 2", url="http://example.com/resource", owner=self.user)
