from datetime import datetime, timedelta

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient, APITestCase
from social_django.models import UserSocialAuth
from unittest.mock import patch

from api.models import Album, Quote, User, TimelineAlbumExclusion, TimelineEvent

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


class ResourceViewSetQueryTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="resourceuser@test.com",
            password="testpass",
            date_of_birth="1990-01-01",
        )
        self.user.is_active = True
        self.user.save()
        UserSocialAuth.objects.create(
            user=self.user,
            provider="google-oauth2",
            uid="resource-test-uid",
            extra_data={"picture": "http://example.com/pic.jpg"},
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_list_resources_bounded_query_count(self):
        from api.models import Resource

        for i in range(3):
            Resource.objects.create(
                title=f"Resource {i}",
                description=f"Desc {i}",
                url=f"http://test{i}.com",
                thumbnail_url=f"http://test{i}.com/thumb.jpg",
                owner=self.user,
            )
        url = reverse("resource-list")
        with self.assertNumQueries(3):
            response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    @patch("api.views.send_slack_message")
    def test_create_resource_posts_slack(self, mock_send_slack_message):
        mock_send_slack_message.return_value = None
        url = reverse("resource-list")
        data = {
            "title": "Slack Resource",
            "description": "A resource for slack testing",
            "url": "http://slack-resource.example.com",
            "thumbnail_url": "http://slack-resource.example.com/t.jpg",
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(mock_send_slack_message.call_count, 1)


class HomeRecentViewTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="homeuser@test.com",
            password="testpass",
            date_of_birth="1990-01-01",
        )
        self.user.is_active = True
        self.user.save()
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_home_recent_returns_all_recent_posts(self):
        from api.models import Album, Resource

        for i in range(4):
            Album.objects.create(
                title=f"Album {i}",
                link_url=f"http://album{i}.com",
                thumbnail_url="http://example.com/a.jpg",
                owner=self.user,
            )
        for i in range(2):
            Resource.objects.create(
                title=f"Resource {i}",
                url=f"http://resource{i}.com",
                thumbnail_url="http://example.com/r.jpg",
                owner=self.user,
            )

        response = self.client.get(reverse("home-recent"), format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        items = response.data["items"]
        self.assertEqual(len(items), 6)
        self.assertEqual(response.data["counts"]["album"], 4)
        self.assertEqual(response.data["counts"]["resource"], 2)
        kinds = {item["kind"] for item in items}
        self.assertEqual(kinds, {"album", "resource"})
        sort_dates = [item["sort_date"] for item in items]
        self.assertEqual(sort_dates, sorted(sort_dates, reverse=True))

    def test_home_recent_excludes_album_older_than_30_days(self):
        from datetime import timedelta

        from django.utils import timezone

        from api.models import Album

        album = Album.objects.create(
            title="Old",
            link_url="http://old.com",
            thumbnail_url="http://example.com/old.jpg",
            owner=self.user,
        )
        Album.objects.filter(pk=album.pk).update(
            created_at=timezone.now() - timedelta(days=31)
        )

        response = self.client.get(reverse("home-recent"), format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        album_items = [i for i in response.data["items"] if i["kind"] == "album"]
        self.assertEqual(len(album_items), 0)

    def test_home_recent_includes_upcoming_event(self):
        from datetime import timedelta

        from django.utils import timezone

        from api.models import TimelineEvent

        TimelineEvent.objects.create(
            title="Party",
            date=timezone.localdate() + timedelta(days=10),
            owner=self.user,
        )
        TimelineEvent.objects.create(
            title="Past",
            date=timezone.localdate() - timedelta(days=1),
            owner=self.user,
        )

        response = self.client.get(reverse("home-recent"), format="json")
        event_titles = [
            i["title"] for i in response.data["items"] if i["kind"] == "event"
        ]
        self.assertIn("Party", event_titles)
        self.assertNotIn("Past", event_titles)

    def test_timeline_events_mine_returns_only_owner(self):
        from datetime import timedelta

        from django.utils import timezone

        from api.models import TimelineEvent

        other = User.objects.create_user(
            email="other@test.com",
            password="testpass",
            date_of_birth="1990-01-01",
        )
        other.is_active = True
        other.save()
        TimelineEvent.objects.create(
            title="Mine",
            date=timezone.localdate() + timedelta(days=5),
            owner=self.user,
        )
        TimelineEvent.objects.create(
            title="Theirs",
            date=timezone.localdate() + timedelta(days=5),
            owner=other,
        )

        response = self.client.get(
            reverse("timeline-event-mine"), format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        titles = [e["title"] for e in response.data]
        self.assertEqual(titles, ["Mine"])


class TimelineEventSlackTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="eventslackuser@test.com",
            password="testpass",
            date_of_birth="1990-01-01",
        )
        self.user.is_active = True
        self.user.save()
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    @patch("api.views.send_slack_message")
    def test_create_upcoming_timeline_event_posts_slack(self, mock_send_slack_message):
        from django.utils import timezone

        future = timezone.localdate() + timedelta(days=10)
        url = reverse("timeline-event-list")
        response = self.client.post(
            url,
            {"title": "Upcoming Event", "date": future.isoformat()},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(mock_send_slack_message.call_count, 1)

    @patch("api.views.send_slack_message")
    def test_create_past_timeline_event_does_not_post_slack(self, mock_send_slack_message):
        from django.utils import timezone

        past = timezone.localdate() - timedelta(days=10)
        url = reverse("timeline-event-list")
        response = self.client.post(
            url,
            {"title": "Past Event", "date": past.isoformat()},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        mock_send_slack_message.assert_not_called()

    def test_home_recent_includes_upcoming_birthday(self):
        from datetime import date, timedelta

        from django.utils import timezone

        today = timezone.localdate()
        upcoming = today + timedelta(days=5)
        friend = User.objects.create_user(
            email="bdaycarousel@test.com",
            password="testpass",
            date_of_birth=date(1992, upcoming.month, upcoming.day),
        )
        friend.is_active = True
        friend.save()

        response = self.client.get(reverse("home-recent"), format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        birthday_items = [
            i for i in response.data["items"] if i["kind"] == "birthday"
        ]
        self.assertEqual(len(birthday_items), 1)
        self.assertEqual(birthday_items[0]["id"], friend.id)
        self.assertEqual(
            birthday_items[0]["date"],
            upcoming.isoformat(),
        )
        self.assertEqual(response.data["counts"]["birthday"], 1)

    def test_home_recent_excludes_birthday_outside_30_day_window(self):
        from datetime import date, timedelta

        from django.utils import timezone

        today = timezone.localdate()
        far = today + timedelta(days=35)
        User.objects.create_user(
            email="farbday@test.com",
            password="testpass",
            date_of_birth=date(1988, far.month, far.day),
            is_active=True,
        )

        response = self.client.get(reverse("home-recent"), format="json")
        birthday_items = [
            i for i in response.data["items"] if i["kind"] == "birthday"
        ]
        self.assertEqual(len(birthday_items), 0)

    def test_home_recent_excludes_event_beyond_30_days(self):
        from datetime import timedelta

        from django.utils import timezone

        from api.models import TimelineEvent

        TimelineEvent.objects.create(
            title="Far away",
            date=timezone.localdate() + timedelta(days=31),
            owner=self.user,
        )

        response = self.client.get(reverse("home-recent"), format="json")
        event_titles = [
            i["title"] for i in response.data["items"] if i["kind"] == "event"
        ]
        self.assertNotIn("Far away", event_titles)


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
        self.assertEqual(len(response.data), 3)


class AlbumYearsViewTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="yearsuser@test.com",
            password="testpass",
            date_of_birth="1990-01-01",
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_album_years_returns_distinct_sorted_years(self):
        Album.objects.create(
            title="Old",
            description="",
            link_url="http://a.com",
            thumbnail_url="http://a.com/t.jpg",
            date="2022-06-01",
            owner=self.user,
        )
        Album.objects.create(
            title="New",
            description="",
            link_url="http://b.com",
            thumbnail_url="http://b.com/t.jpg",
            date="2024-01-01",
            owner=self.user,
        )
        url = reverse("album-years")
        with self.assertNumQueries(1):
            response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [2024, 2022])


class TimelineViewTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="timelineowner@test.com",
            password="testpass",
            date_of_birth="1990-03-15",
        )
        self.user.is_active = True
        self.user.save()
        self.other = User.objects.create_user(
            email="timelineother@test.com",
            password="testpass",
            date_of_birth="1990-01-01",
        )
        self.other.is_active = True
        self.other.save()
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def _create_album(self, title, date_str, owner=None):
        return Album.objects.create(
            title=title,
            description="",
            link_url=f"http://{title.replace(' ', '')}.com",
            thumbnail_url="http://example.com/t.jpg",
            date=date_str,
            owner=owner or self.user,
        )

    def test_new_album_appears_on_timeline(self):
        self._create_album("Summer Trip", "2024-06-10")
        response = self.client.get(reverse("timeline-summary"), format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["years"][0]["year"], 2024)
        self.assertIn(6, response.data["years"][0]["months_with_events"])

    def test_new_album_appears_on_timeline_summary_month(self):
        self._create_album("Trip", "2024-06-10")
        response = self.client.get(reverse("timeline-summary"), format="json")
        years = {
            item["year"]: item["months_with_events"]
            for item in response.data["years"]
        }
        self.assertIn(6, years[2024])

    def test_owner_can_exclude_and_restore_album(self):
        album = self._create_album("Hidden Album", "2024-07-04")
        exclude_url = reverse("timeline-album-exclude", kwargs={"album_id": album.id})

        response = self.client.post(exclude_url, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Album.objects.filter(pk=album.id).exists())

        month_url = reverse("timeline-month-detail", kwargs={"year": 2024, "month": 7})
        response = self.client.get(month_url, format="json")
        album_ids = [e["id"] for e in response.data["events"] if e["type"] == "album"]
        self.assertNotIn(f"album-{album.id}", album_ids)

        response = self.client.delete(exclude_url, format="json")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        response = self.client.get(month_url, format="json")
        album_ids = [e["id"] for e in response.data["events"] if e["type"] == "album"]
        self.assertIn(f"album-{album.id}", album_ids)

    def test_non_owner_cannot_exclude_album(self):
        album = self._create_album("Other Album", "2024-08-01", owner=self.other)
        exclude_url = reverse("timeline-album-exclude", kwargs={"album_id": album.id})
        response = self.client.post(exclude_url, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_month_events_include_birthday_and_custom_event(self):
        self._create_album("March Pics", "2024-03-20")
        TimelineEvent.objects.create(
            title="Reunion",
            date="2024-03-05",
            owner=self.user,
        )
        url = reverse("timeline-month-detail", kwargs={"year": 2024, "month": 3})
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        types = [e["type"] for e in response.data["events"]]
        self.assertIn("album", types)
        self.assertIn("event", types)
        self.assertIn("birthday", types)
        self.assertEqual(response.data["events"][0]["sort_date"], "2024-03-05")

    def test_birthday_month_highlighted_on_all_years(self):
        self._create_album("Old", "2022-01-01")
        self._create_album("New", "2024-01-01")
        response = self.client.get(reverse("timeline-summary"), format="json")
        years = {item["year"]: item["months_with_events"] for item in response.data["years"]}
        self.assertIn(3, years[2024])
        self.assertIn(3, years[2022])

    def test_timeline_years_oldest_first(self):
        self._create_album("Old", "2022-01-01")
        self._create_album("New", "2024-01-01")
        response = self.client.get(reverse("timeline-summary"), format="json")
        year_list = [item["year"] for item in response.data["years"]]
        self.assertEqual(year_list, [2022, 2024])

    def test_timeline_summary_query_count_does_not_scale_with_years(self):
        """Regression: summary must not run per-year month queries (Sentry N+1)."""
        from django.db import connection
        from django.test.utils import CaptureQueriesContext

        for year in (2018, 2019, 2020, 2021, 2022, 2023, 2024):
            self._create_album(f"Y{year}", f"{year}-06-15")
        TimelineEvent.objects.create(
            title="Reunion",
            date="2020-08-01",
            owner=self.user,
        )
        with CaptureQueriesContext(connection) as ctx:
            response = self.client.get(reverse("timeline-summary"), format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["years"]), 7)
        # Fixed small number of queries regardless of how many years have data.
        self.assertEqual(len(ctx.captured_queries), 3)

    def test_timeline_summary_query_count_same_for_few_or_many_years(self):
        """Adding more years must not add more summary queries."""
        from django.db import connection
        from django.test.utils import CaptureQueriesContext

        self._create_album("Y2020", "2020-06-15")
        self._create_album("Y2021", "2021-06-15")
        with CaptureQueriesContext(connection) as ctx_few:
            self.client.get(reverse("timeline-summary"), format="json")
        few_count = len(ctx_few.captured_queries)

        for year in (2018, 2019, 2022, 2023, 2024):
            self._create_album(f"Y{year}", f"{year}-06-15")

        with CaptureQueriesContext(connection) as ctx_many:
            response = self.client.get(reverse("timeline-summary"), format="json")
        self.assertEqual(len(response.data["years"]), 7)
        self.assertEqual(len(ctx_many.captured_queries), few_count)

    def test_album_mine_includes_timeline_excluded_flag(self):
        album = self._create_album("Excluded", "2024-05-01")
        TimelineAlbumExclusion.objects.create(
            album=album,
            excluded_by=self.user,
        )
        response = self.client.get(reverse("album-mine"), format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        row = next(item for item in response.data if item["id"] == album.id)
        self.assertTrue(row["timeline_excluded"])

    def test_timeline_event_crud_permissions(self):
        create_url = reverse("timeline-event-list")
        response = self.client.post(
            create_url,
            {"title": "Party", "date": "2025-05-01", "description": "Fun"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        event_id = response.data["id"]

        self.client.logout()
        self.client.force_authenticate(user=self.other)
        detail_url = reverse("timeline-event-detail", kwargs={"pk": event_id})
        response = self.client.delete(detail_url, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)