import datetime

from django.db import models


class CreatedUpdated(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Album(CreatedUpdated):

    title = models.CharField(max_length=200)
    description = models.CharField(max_length=200)
    link_url = models.CharField(max_length=200)
    thumbnail_url = models.CharField(max_length=200)
    album_date = models.DateField(default=datetime.date.today, editable=True)
    owner = models.ForeignKey(
        "auth.User", related_name="albums", on_delete=models.CASCADE
    )

    def __str__(self):
        return self.title
