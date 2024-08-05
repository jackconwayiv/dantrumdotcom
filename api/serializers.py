import datetime

from django.contrib.auth import get_user_model
from rest_framework import serializers
from social_django.models import UserSocialAuth

from api.models import Album, Quote, Resource, User, FamilyTreeMember, FamilyTreeRelation


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
            "is_active",
            "last_login",
        ]


class AuthenticatedUserSerializer(serializers.ModelSerializer):
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
            "is_staff",
            "last_login",
            "date_joined",
        ]

class OwnerSerializer(serializers.ModelSerializer):
    social_auth = UserSocialAuthSerializer(many=True)

    class Meta:
        model = User
        fields = ["id", "email", "first_name", "last_name", "username", "social_auth"]

class AlbumSerializer(serializers.ModelSerializer):
    owner = OwnerSerializer(read_only=True)

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
    owner = OwnerSerializer(read_only=True)

    class Meta:
        model = Quote
        fields = ["id", "text", "date", "owner"]

class URLSerializer(serializers.Serializer):
    url = serializers.URLField()

class ResourceSerializer(serializers.ModelSerializer):
    owner = OwnerSerializer(read_only=True)

    class Meta:
        model = Resource
        fields = ["id", "title", "description", "url", "thumbnail_url", "owner"]

class FamilyTreeMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = FamilyTreeMember
        fields = ['id', 'name', 'title', 'date_of_birth', 'date_of_death']

class FamilyTreeRelationSerializer(serializers.ModelSerializer):
    from_member = FamilyTreeMemberSerializer()
    to_member = FamilyTreeMemberSerializer()

    class Meta:
        model = FamilyTreeRelation
        fields = ['id', 'from_member', 'to_member', 'type', 'owner']

class AddFamilyMemberSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255)
    title = serializers.CharField(max_length=255, required=False, allow_null=True)
    date_of_birth = serializers.DateField(required=False, allow_null=True)
    date_of_death = serializers.DateField(required=False, allow_null=True)
    relation_type = serializers.ChoiceField(choices=[('parent', 'parent'), ('child', 'child'), ('partner', 'partner')])
    related_member_id = serializers.IntegerField()