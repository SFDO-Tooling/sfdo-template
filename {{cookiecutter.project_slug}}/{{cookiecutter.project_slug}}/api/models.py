from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractUser
from django.db import models
from hashid_field import HashidAutoField


class HashIdMixin(models.Model):
    class Meta:
        abstract = True

    id = HashidAutoField(primary_key=True)


class UserQuerySet(models.QuerySet):
    pass


class UserManager(BaseUserManager.from_queryset(UserQuerySet)):
    pass


class User(HashIdMixin, AbstractUser):
    objects = UserManager()

    def subscribable_by(self, user):
        return self == user

    @property
    def social_account(self):
        return self.socialaccount_set.first()

    @property
    def instance_url(self):
        try:
            return self.social_account.extra_data["instance_url"]
        except (AttributeError, KeyError):
            return None

    @property
    def token(self):
        account = self.social_account
        if account and account.socialtoken_set.exists():
            token = self.social_account.socialtoken_set.first()
            return (token.token, token.token_secret)
        return (None, None)

    @property
    def valid_token_for(self):
        if all(self.token) and self.instance_url:
            return self.instance_url
        return None
