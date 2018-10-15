import pytest
from django.contrib.auth.models import AnonymousUser
from channels.testing import WebsocketCommunicator
from ..consumers import PushNotificationConsumer
from ..api.push import push_message_to_user


@pytest.mark.django_db
@pytest.mark.asyncio
async def test_push_notification_consumer__push_message_to_user(user_factory):
    user = user_factory()

    communicator = WebsocketCommunicator(
        PushNotificationConsumer,
        "/ws/notifications/",
    )
    communicator.scope["user"] = user
    connected, subprotocol = await communicator.connect()
    assert connected

    message = {
        'type': 'TEST_MESSAGE',
    }
    await push_message_to_user(user, message)
    response = await communicator.receive_json_from()
    assert response == {
        "type": "TEST_MESSAGE",
    }

    await communicator.disconnect()


@pytest.mark.asyncio
async def test_push_notification_consumer__anonymous():
    communicator = WebsocketCommunicator(
        PushNotificationConsumer,
        "/ws/notifications/",
    )
    communicator.scope["user"] = AnonymousUser()
    connected, subprotocol = await communicator.connect()
    assert not connected
