from rest_framework.test import APIClient, APITestCase
from rest_framework import status
from django.urls import reverse
from api.models import Album, User, Resource
from django.contrib.auth import get_user_model

class TestAlbumPermissions(APITestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(
            email="testuser@test.com", password="testpass", date_of_birth="1990-01-01"
        )
        self.user2 = User.objects.create_user(
            email="seconduser@test.com", password="testpass", date_of_birth="1990-02-02"
        )
        self.album = Album.objects.create(title="Test Album", owner=self.user1)
        self.client = APIClient()
        self.client.force_authenticate(user=self.user1)

    def test_permission_denied_for_other_user(self):
        self.client.logout()
        self.client.force_authenticate(user=self.user2)
        url = reverse("album-detail", args=[self.album.id])
        response = self.client.put(url, {"title": "Updated Album"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

class TestPermissions(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.User = get_user_model()
        cls.user = cls.User.objects.create_user(email="user1@example.com", password="test1234")
        cls.other_user = cls.User.objects.create_user(email="user2@example.com", password="test5678", is_active=False)
        cls.superuser = cls.User.objects.create_superuser(email="admin@example.com", password="admin1234")
        cls.album = Album.objects.create(title="Test Album", owner=cls.user)
        cls.resource = Resource.objects.create(title="Test Resource", owner=cls.user)

    def setUp(self):
        self.client = APIClient()
        self.user_id = self.user.id
        self.other_user_id = self.other_user.id
        self.superuser_id = self.superuser.id

    def test_user_cannot_edit_other_user_album(self):
        self.client.force_authenticate(user=self.other_user)
        url = reverse('album-detail', kwargs={'pk': self.album.pk})
        response = self.client.patch(url, {'title': 'New Title'})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_user_cannot_edit_other_user_resource(self):
        self.client.force_authenticate(user=self.other_user)
        url = reverse('resource-detail', kwargs={'pk': self.resource.pk})
        response = self.client.patch(url, {'title': 'New Name'})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

class TestCustomPermissions(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.User = get_user_model()
        cls.user = cls.User.objects.create_user(email="user1@example.com", password="test1234", is_active=True)
        cls.other_user = cls.User.objects.create_user(email="user2@example.com", password="test5678", is_active=True)
        cls.inactive_user = cls.User.objects.create_user(email="user3@example.com", password="test7890", is_active=False)
        cls.superuser = cls.User.objects.create_superuser(email="admin@example.com", password="admin1234", is_active=True)

    def setUp(self):
        self.client = APIClient()
        self.user_id = self.user.id
        self.other_user_id = self.other_user.id
        self.inactive_user_id = self.inactive_user.id
        self.superuser_id = self.superuser.id

    def test_staff_can_activate_inactive_user(self):
        self.client.force_authenticate(user=self.superuser)
        url = reverse('user-activate', kwargs={'pk': self.inactive_user_id})
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.inactive_user.refresh_from_db()
        self.assertTrue(self.inactive_user.is_active)

    def test_staff_cannot_activate_active_user(self):
        self.client.force_authenticate(user=self.superuser)
        self.other_user.is_active = True
        self.other_user.save()
        url = reverse('user-activate', kwargs={'pk': self.other_user_id})
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_non_staff_cannot_activate_user(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('user-activate', kwargs={'pk': self.inactive_user_id})
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.inactive_user.refresh_from_db()
        self.assertFalse(self.inactive_user.is_active)

    def test_user_can_view_own_full_details_me_endpoint(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('user-me')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('email', response.data)
        self.assertIn('date_of_birth', response.data)

    def test_user_can_view_own_full_details(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('user-detail', kwargs={'pk': self.user_id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('email', response.data)
        self.assertIn('date_of_birth', response.data)

    def test_user_can_view_other_user_restricted_details(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('user-detail', kwargs={'pk': self.other_user_id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertNotIn('is_staff', response.data)
        self.assertNotIn('date_joined', response.data)
    
    def test_user_can_edit_own_details(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('user-detail', kwargs={'pk': self.user_id})
        response = self.client.patch(url, {'first_name': 'NewName'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.first_name, 'NewName')
    
    def test_user_cannot_edit_other_user_details(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('user-detail', kwargs={'pk': self.other_user_id})
        response = self.client.patch(url, {'first_name': 'NewName'})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_user_cannot_delete_other_user(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('user-detail', kwargs={'pk': self.other_user_id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_user_cannot_change_own_is_staff_status(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('user-detail', kwargs={'pk': self.user_id})
        response = self.client.patch(url, {'is_staff': True})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.user.refresh_from_db()
        self.assertFalse(self.user.is_staff)
    
    def test_user_cannot_change_own_is_superuser_status(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('user-detail', kwargs={'pk': self.user_id})
        response = self.client.patch(url, {'is_superuser': True})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.user.refresh_from_db()
        self.assertFalse(self.user.is_superuser)