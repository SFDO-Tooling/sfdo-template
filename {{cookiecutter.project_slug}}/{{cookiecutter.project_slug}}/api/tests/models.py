import pytest


@pytest.mark.django_db
class TestUser:
    def test_social_account(self, user_factory):
        user = user_factory()
        assert user.social_account is not None
        assert user.social_account == user.socialaccount_set.first()

        user.socialaccount_set.all().delete()
        assert user.social_account is None

    def test_instance_url(self, user_factory):
        user = user_factory()
        assert user.instance_url == "https://example.com"

        user.socialaccount_set.all().delete()
        assert user.instance_url is None

    def test_token(self, user_factory):
        user = user_factory()
        assert user.token == ("0123456789abcdef", "secret.0123456789abcdef")

        user.socialaccount_set.all().delete()
        assert user.token == (None, None)

    def test_valid_token_for(self, user_factory):
        user = user_factory()
        assert user.valid_token_for == "https://example.com"

        user.socialaccount_set.first().socialtoken_set.all().delete()
        assert user.valid_token_for is None
