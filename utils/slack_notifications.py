import logging

from django.conf import settings
from slack_sdk.webhook import WebhookClient

logger = logging.getLogger(__name__)


def send_slack_message(text: str):
    """
    Send a Slack webhook message.

    Safety: if Slack is not configured (missing webhook URL) we no-op instead of
    failing the API request.
    """
    webhook_url = getattr(settings, "SLACK_WEBHOOK_URL", None)
    if not webhook_url:
        logger.info("Slack webhook not configured; skipping message.")
        return None

    try:
        webhook = WebhookClient(webhook_url)
        return webhook.send(text=text)
    except Exception:
        logger.exception("Failed to send Slack message.")
        return None
