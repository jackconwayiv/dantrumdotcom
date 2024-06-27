from django.conf import settings
from slack_sdk.webhook import WebhookClient

def send_slack_message(text):
    webhook_url = settings.SLACK_WEBHOOK_URL
    webhook = WebhookClient(webhook_url)
    response = webhook.send(text=text)
    return response
