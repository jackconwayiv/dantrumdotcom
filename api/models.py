import datetime
from django.conf import settings
from django.contrib.auth.models import (
    AbstractUser,
    BaseUserManager,
)
from django.db import models

class CreatedUpdated(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        extra_fields.setdefault(
            "is_active", False
        )  # Set is_active to False for regular users
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault(
            "is_active", True
        )  # Set is_active to True for superusers
        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    username = models.CharField(
        max_length=200, null=True, blank=True
    )
    date_of_birth = models.DateField(null=True, blank=True)
    email = models.EmailField(verbose_name="email address", max_length=255, unique=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return self.email


class Album(CreatedUpdated):

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    link_url = models.CharField(max_length=4000, unique=True)
    thumbnail_url = models.CharField(max_length=4000, blank=True, null=True)
    date = models.DateField(default=datetime.date.today, editable=True)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="albums", on_delete=models.CASCADE
    )

    def __str__(self):
        return self.title


class Resource(CreatedUpdated):
    
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    url = models.CharField(max_length=4000, unique=True)
    thumbnail_url = models.CharField(max_length=4000, blank=True, null=True)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="resources", on_delete=models.CASCADE
    )

    def __str__(self):
        return self.title

class Quote(CreatedUpdated):
    text = models.TextField()
    date = models.DateField(default=datetime.date.today, editable=True)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="quotes", on_delete=models.CASCADE
    )

    def __str__(self):
        return f"{self.text}"
    
class FamilyTreeMember(CreatedUpdated):
    name = models.TextField()
    title = models.TextField(null=True, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    date_of_death = models.DateField(null=True, blank=True)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="family_tree_members", on_delete=models.CASCADE
    )

    relations = models.ManyToManyField(
        'self',
        through='FamilyTreeRelation',
        symmetrical=False,
        related_name='related_to'
    )

    def __str__(self):
        return self.name

class FamilyTreeRelation(CreatedUpdated):
    class RelationType(models.TextChoices):
        VERTICAL = 'vertical', 'parent'
        HORIZONTAL = 'horizontal', 'partner'

    from_member = models.ForeignKey(FamilyTreeMember, related_name='from_relations', on_delete=models.CASCADE)
    to_member = models.ForeignKey(FamilyTreeMember, related_name='to_relations', on_delete=models.CASCADE)
    type = models.CharField(max_length=10, choices=RelationType.choices)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="family_tree_relations", on_delete=models.CASCADE
    )

    def __str__(self):
        relation_type_display = dict(FamilyTreeRelation.RelationType.choices).get(self.type, self.type)
        return f"{self.from_member} is a {relation_type_display} of {self.to_member}"