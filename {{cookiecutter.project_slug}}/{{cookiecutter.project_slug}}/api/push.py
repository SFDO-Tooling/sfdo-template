"""
Websocket notifications you can subscribe to:

    user.:id
        BACKEND_ERROR
"""
from channels.layers import get_channel_layer
from django.utils.translation import gettext_lazy as _

from .constants import CHANNELS_GROUP_NAME


async def push_message_about_instance(instance, json_message):
    model_name = instance._meta.model_name
    id = str(instance.id)
    group_name = CHANNELS_GROUP_NAME.format(model=model_name, id=id)
    channel_layer = get_channel_layer()
    await channel_layer.group_send(
        group_name, {"type": "notify", "content": json_message}
    )


async def push_serializable(instance, serializer, type_):
    model_name = instance._meta.model_name
    id = str(instance.id)
    group_name = CHANNELS_GROUP_NAME.format(model=model_name, id=id)
    serializer_name = f"{serializer.__module__}.{serializer.__name__}"
    channel_layer = get_channel_layer()
    await channel_layer.group_send(
        group_name,
        {
            "type": "notify",
            "instance": {"model": model_name, "id": id},
            "serializer": serializer_name,
            "inner_type": type_,
        },
    )


async def report_error(user):
    message = {
        "type": "BACKEND_ERROR",
        # We don't pass the message through to the frontend in case it
        # contains sensitive material:
        "payload": {"message": _("There was an error")},
    }
    await push_message_about_instance(user, message)
