from rest_framework import serializers

from django.contrib.auth import get_user_model


User = get_user_model()


class FullUserSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "email",
            "valid_token_for",
            "is_staff",
        )
