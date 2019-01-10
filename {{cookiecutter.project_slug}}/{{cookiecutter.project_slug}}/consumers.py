from channels.generic.websocket import AsyncJsonWebsocketConsumer


class PushNotificationConsumer(AsyncJsonWebsocketConsumer):
    """
    This is just a hint at a start; you will likely need to edit it heavily for your
    project's use case.
    """

    async def connect(self):
        if self.scope["user"].is_anonymous:
            await self.close()
            return

        await self.accept()
        # Add this channel to the user-id group, so all browser windows
        # where that user is logged in will get notifications:
        user_id = self.scope["user"].id
        await self.channel_layer.group_add(f"user-{user_id}", self.channel_name)

    async def disconnect(self, close_code):
        user_id = self.scope["user"].id
        await self.channel_layer.group_discard(f"user-{user_id}", self.channel_name)

    async def notify(self, event):
        await self.send_json(event["content"])
