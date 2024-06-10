import datetime

from django.contrib.auth import get_user_model
from rest_framework import serializers
from social_django.models import UserSocialAuth

from api.models import Album, Quote, User


class AlbumSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source="owner.email")

    class Meta:
        model = Album
        fields = [
            "id",
            "title",
            "description",
            "link_url",
            "thumbnail_url",
            "date",
            "owner",
        ]


class QuoteSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source="owner.email")

    class Meta:
        model = Quote
        fields = ["id", "text", "date", "owner"]


class UserSocialAuthSerializer(serializers.ModelSerializer):
    picture = serializers.SerializerMethodField()

    class Meta:
        model = UserSocialAuth
        fields = ["picture"]

    def get_picture(self, obj):
        if "picture" in obj.extra_data:
            return obj.extra_data["picture"]
        return None


class UserSerializer(serializers.ModelSerializer):
    # albums = serializers.PrimaryKeyRelatedField(many=True, queryset=Album.objects.all())
    # quotes = serializers.PrimaryKeyRelatedField(many=True, queryset=Quote.objects.all())
    social_auth = UserSocialAuthSerializer(many=True)

    class Meta:
        model = User
        fields = [
            "id",
            "first_name",
            "last_name",
            "username",
            "email",
            "social_auth",
            "date_of_birth",
        ]


class AuthenticatedUserSerializer(serializers.ModelSerializer):
    # albums = serializers.PrimaryKeyRelatedField(many=True, queryset=Album.objects.all())
    # quotes = serializers.PrimaryKeyRelatedField(many=True, queryset=Quote.objects.all())
    social_auth = UserSocialAuthSerializer(many=True)

    class Meta:
        model = User
        fields = [
            "first_name",
            "last_name",
            "username",
            "email",
            "social_auth",
            "date_of_birth",
            "last_login",
            "date_joined",
        ]
