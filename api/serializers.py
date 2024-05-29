import datetime

from rest_framework import serializers

from api.models import Album, User


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
            "album_date",
            "owner",
        ]


class UserSerializer(serializers.ModelSerializer):
    albums = serializers.PrimaryKeyRelatedField(many=True, queryset=Album.objects.all())

    class Meta:
        model = User
        fields = ["id", "email", "date_of_birth", "albums"]
