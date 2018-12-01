from django.contrib.auth.models import AbstractUser
from django.db import models

from hashid_field import HashidAutoField


class HashIdMixin(models.Model):
    class Meta:
        abstract = True

    id = HashidAutoField(primary_key=True)


class User(AbstractUser):
    pass
