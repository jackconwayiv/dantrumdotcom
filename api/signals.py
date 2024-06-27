from django.db.models.signals import post_save
from django.dispatch import receiver

from utils.slack_notifications import send_slack_message

from .models import Album, Resource


@receiver(post_save, sender=Album)
def notify_album_creation(sender, instance, created, **kwargs):
    if created:
        owner = instance.owner
        send_slack_message(
            f"INCOMING TRANSMISSION FROM DANTRUM.COM: A lovely new album of fotos entitled '{instance.title}' has been added by {owner}."
            # f"View it here: {http://www.dantrum.com}"
        )


@receiver(post_save, sender=Resource)
def notify_resource_creation(sender, instance, created, **kwargs):
    if created:
        owner = instance.owner
        send_slack_message(
            f"INCOMING TRANSMISSION FROM DANTRUM.COM: A fascinating new resource link entitled '{instance.title}' has been added by {owner}."
            # f"View it here: {http://www.dantrum.com}"
        )
