from rest_framework import serializers

from api.models import Album


class AlbumSerializer(serializers.ModelSerializer):
    class Meta:
        model = Album
        fields = [
            "id",
            "title",
            "description",
            "link_url",
            "thumbnail_url",
            "album_date",
        ]
