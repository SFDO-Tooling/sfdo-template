from pytest_factoryboy import register
from rest_framework.test import APIClient
import factory
import pytest

from django.contrib.auth import get_user_model

from allauth.socialaccount.models import (
    SocialApp,
    SocialAccount,
    SocialToken,
)

User = get_user_model()


@register
class SocialAppFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = SocialApp
        django_get_or_create = ('provider',)

    name = 'Salesforce Production'
    provider = 'salesforce-production'
    key = 'https://login.salesforce.com/'


@register
class SocialTokenFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = SocialToken

    token = '0123456789abcdef'
    token_secret = 'secret.0123456789abcdef'
    app = factory.SubFactory(SocialAppFactory)


@register
class SocialAccountFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = SocialAccount

    provider = 'salesforce-production'
    socialtoken_set = factory.RelatedFactory(SocialTokenFactory, 'account')
    uid = factory.Sequence('https://example.com/{}'.format)
    extra_data = {
        'instance_url': 'https://example.com',
    }


@register
class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User

    email = factory.Sequence("user_{}@example.com".format)
    username = factory.Sequence("user_{}@example.com".format)
    password = factory.PostGenerationMethodCall('set_password', 'foobar')
    socialaccount_set = factory.RelatedFactory(SocialAccountFactory, 'user')


@pytest.fixture
def anon_client():  # pragma: nocover
    return APIClient()
