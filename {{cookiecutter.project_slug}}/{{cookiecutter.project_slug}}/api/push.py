from channels.layers import get_channel_layer


async def push_message_to_user(user, json_message):
    channel_layer = get_channel_layer()
    await channel_layer.group_send(f'user-{user.id}', {
        'type': 'notify',
        'content': json_message,
    })
