from .base import *  # NOQA
from .base import LOGGING

INSTALLED_APPS = INSTALLED_APPS + ["django_extensions"]  # NOQA

LOGGING["loggers"]["werkzeug"] = {
    "handlers": ["console"],
    "level": "DEBUG",
    "propagate": True,
}

# Make sure we default to no HSTS when running locally
SECURE_HSTS_SECONDS = env("SECURE_HSTS_SECONDS", default=0, type_=int)
