from datetime import datetime

from django.db import models

# Create your models here.


class CreatedUpdated(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


# TypeError: Cannot create a consistent method resolution
# web-1  | order (MRO) for bases Model, CreatedUpdated


class Album(CreatedUpdated):

    title = models.CharField(max_length=200)
    description = models.CharField(max_length=200)
    link_url = models.CharField(max_length=200)
    thumbnail_url = models.CharField(max_length=200)
    album_date = models.DateField(default=datetime.now, blank=True)

    def __str__(self):
        return self.title
