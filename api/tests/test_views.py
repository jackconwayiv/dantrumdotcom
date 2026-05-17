from datetime import datetime, timedelta

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient, APITestCase
from social_django.models import UserSocialAuth
from unittest.mock import patch

from api.models import Album, Quote, User

class AlbumViewSetTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="testuser@test.com", password="testpass", date_of_birth="1990-01-01"
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_list_albums(self):
        Album.objects.create(
            title="Album 1",
            description="Desc 1",
            link_url="http://test1.com",
            thumbnail_url="http://test1.com/thumbnail.jpg",
            date="2024-05-29",
            owner=self.user,
        )
        Album.objects.create(
            title="Album 2",
            description="Desc 2",
            link_url="http://test2.com",
            thumbnail_url="http://test2.com/thumbnail.jpg",
            date="2024-05-28",
            owner=self.user,
        )
        url = reverse("album-list")
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 2)
        self.assertEqual(response.data["results"][0]["title"], "Album 1")

    @patch('api.views.send_slack_message')
    def test_create_album(self, mock_send_slack_message):
        mock_send_slack_message.return_value = None  # Mock the Slack function

        url = reverse("album-list")
        data = {
            "title": "New Album",
            "description": "New Description",
            "link_url": "http://new.com",
            "thumbnail_url": "http://new.com/thumbnail.jpg",
            "date": "2024-05-29",
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Album.objects.count(), 1)
        self.assertEqual(Album.objects.get(id=response.data["id"]).owner, self.user)

    def test_create_album_missing_fields(self):
        url = reverse("album-list")
        data = {"title": "New Album"}
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_permission_denied_for_unauthenticated_user(self):
        self.client.logout()
        url = reverse("album-list")
        data = {
            "title": "New Album",
            "description": "New Description",
            "link_url": "http://new.com",
            "thumbnail_url": "http://new.com/thumbnail.jpg",
            "date": "2024-05-29",
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_list_albums_bounded_query_count(self):
        UserSocialAuth.objects.create(
            user=self.user,
            provider="google-oauth2",
            uid="album-test-uid",
            extra_data={"picture": "http://example.com/pic.jpg"},
        )
        for i in range(3):
            Album.objects.create(
                title=f"Album {i}",
                description=f"Desc {i}",
                link_url=f"http://test{i}.com",
                thumbnail_url=f"http://test{i}.com/thumbnail.jpg",
                date=f"2024-05-{20 + i}",
                owner=self.user,
            )
        url = reverse("album-list")
        with self.assertNumQueries(3):
            response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class QuoteViewSetQueryTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="quoteuser@test.com", password="testpass", date_of_birth="1990-01-01"
        )
        self.user.is_active = True
        self.user.save()
        UserSocialAuth.objects.create(
            user=self.user,
            provider="google-oauth2",
            uid="quote-test-uid",
            extra_data={"picture": "http://example.com/pic.jpg"},
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_list_quotes_bounded_query_count(self):
        for i in range(3):
            Quote.objects.create(text=f"Quote {i}", date=f"2024-05-{20 + i}", owner=self.user)
        url = reverse("quote-list")
        with self.assertNumQueries(3):
            response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class UserViewSetQueryTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="listuser@test.com", password="testpass", date_of_birth="1990-01-01"
        )
        self.user.is_active = True
        self.user.save()
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_list_users_bounded_query_count(self):
        for i in range(3):
            friend = User.objects.create_user(
                email=f"friend{i}@test.com",
                password="testpass",
                date_of_birth="1990-01-01",
            )
            friend.is_active = True
            friend.save()
            UserSocialAuth.objects.create(
                user=friend,
                provider="google-oauth2",
                uid=f"friend-{i}-uid",
                extra_data={"picture": f"http://example.com/pic{i}.jpg"},
            )
        url = reverse("user-list")
        with self.assertNumQueries(3):
            response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class BirthdayListViewQueryTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="bdayuser@test.com", password="testpass", date_of_birth="1990-01-01"
        )
        self.user.is_active = True
        self.user.save()
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_birthdays_bounded_query_count(self):
        today = datetime.now().date()
        for i in range(3):
            friend = User.objects.create_user(
                email=f"bdayfriend{i}@test.com",
                password="testpass",
                date_of_birth=today - timedelta(days=i),
            )
            friend.is_active = True
            friend.save()
            UserSocialAuth.objects.create(
                user=friend,
                provider="google-oauth2",
                uid=f"bday-friend-{i}-uid",
                extra_data={"picture": f"http://example.com/bday{i}.jpg"},
            )
        url = reverse("birthdays")
        with self.assertNumQueries(2):
            response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)