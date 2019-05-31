"""
Django settings for {{cookiecutter.project_name}} project.

Generated by 'django-admin startproject' using Django 1.11.1.

For more information on this file, see
https://docs.djangoproject.com/en/1.11/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.11/ref/settings/
"""

from ipaddress import IPv4Network
from os import environ
from pathlib import Path
from typing import List

import dj_database_url
from django.core.exceptions import ImproperlyConfigured

BOOLS = ("True", "true", "T", "t", "1", 1)


def boolish(val: str) -> bool:
    return val in BOOLS


def ipv4_networks(val: str) -> List[IPv4Network]:
    return [IPv4Network(s.strip()) for s in val.split(",")]


def url_prefix(val: str) -> str:
    return val.rstrip("/") + "/"


class NoDefaultValue:
    pass


def env(name, default=NoDefaultValue, type_=str):
    """
    Get a configuration value from the environment.

    Arguments
    ---------
    name : str
        The name of the environment variable to pull from for this
        setting.
    default : any
        A default value of the return type in case the intended
        environment variable is not set. If this argument is not passed,
        the environment variable is considered to be required, and
        ``ImproperlyConfigured`` may be raised.
    type_ : callable
        A callable that takes a string and returns a value of the return
        type.

    Returns
    -------
    any
        A value of the type returned by ``type_``.

    Raises
    ------
    ImproperlyConfigured
        If there is no ``default``, and the environment variable is not
        set.
    """
    try:
        val = environ[name]
    except KeyError:
        if default == NoDefaultValue:
            raise ImproperlyConfigured(f"Missing environment variable: {name}.")
        val = default
    val = type_(val)
    return val


# Build paths inside the project like this: BASE_DIR.joinpath(...)
PROJECT_ROOT = Path(__file__).absolute().parent.parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.11/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env("DJANGO_SECRET_KEY")
HASHID_FIELD_SALT = env("DJANGO_HASHID_SALT")
DB_ENCRYPTION_KEY = env("DB_ENCRYPTION_KEY")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env("DJANGO_DEBUG", default=False, type_=boolish)

MODE = env("DJANGO_MODE", default="dev" if DEBUG else "prod")

ALLOWED_HOSTS = [
    "127.0.0.1",
    "127.0.0.1:8000",
    "127.0.0.1:8080",
    "localhost",
    "localhost:8000",
    "localhost:8080",
] + [
    el.strip()
    for el in env("DJANGO_ALLOWED_HOSTS", default="", type_=lambda x: x.split(","))
    if el.strip()
]


# Application definition

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.sites",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "channels",
    "whitenoise.runserver_nostatic",
    "django.contrib.staticfiles",
    "django_rq",
    "scheduler",
    "allauth",
    "allauth.account",
    "allauth.socialaccount",
    "rest_framework",
    "rest_framework.authtoken",
    "parler",
    "{{cookiecutter.project_slug}}",
    "{{cookiecutter.project_slug}}.multisalesforce",
    "{{cookiecutter.project_slug}}.api",
    "{{cookiecutter.project_slug}}.adminapi.apps.AdminapiConfig",
    "django_js_reverse",
]

MIDDLEWARE = [
    "{{cookiecutter.project_slug}}.logging_middleware.LoggingMiddleware",
    "sfdo_template_helpers.admin.middleware.AdminRestrictMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        # This gets overridden in settings.production:
        "DIRS": [str(PROJECT_ROOT / "dist"), str(PROJECT_ROOT / "templates")],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
                # `allauth` needs this from django:
                "django.template.context_processors.request",
                # custom
                "{{cookiecutter.project_slug}}.context_processors.env",
            ]
        },
    }
]

AUTHENTICATION_BACKENDS = [
    "django.contrib.auth.backends.ModelBackend",
    "allauth.account.auth_backends.AuthenticationBackend",
]

ASGI_APPLICATION = "{{cookiecutter.project_slug}}.routing.application"

SITE_ID = 1

PARLER_LANGUAGES = {1: ({"code": "en-us"},), "default": {"fallback": "en-us"}}

# Database
# https://docs.djangoproject.com/en/1.11/ref/settings/#databases

DATABASES = {"default": dj_database_url.config(default="postgres:///{{cookiecutter.project_slug}}")}

# Custom User model:
AUTH_USER_MODEL = "api.User"


# URL configuration:
ROOT_URLCONF = "{{cookiecutter.project_slug}}.urls"

ADMIN_AREA_PREFIX = env("DJANGO_ADMIN_URL", default="admin/", type_=url_prefix)

ADMIN_API_ALLOWED_SUBNETS = env(
    "ADMIN_API_ALLOWED_SUBNETS", default="127.0.0.1/32", type_=ipv4_networks
)

# Password validation
# https://docs.djangoproject.com/en/1.11/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": (
            "django.contrib.auth.password_validation."
            "UserAttributeSimilarityValidator"
        )
    },
    {"NAME": ("django.contrib.auth.password_validation.MinimumLengthValidator")},
    {"NAME": ("django.contrib.auth.password_validation.CommonPasswordValidator")},
    {"NAME": ("django.contrib.auth.password_validation.NumericPasswordValidator")},
]

LOGIN_REDIRECT_URL = "/"

# Use HTTPS:
SECURE_PROXY_SSL_HEADER = env(
    "SECURE_PROXY_SSL_HEADER",
    default="HTTP_X_FORWARDED_PROTO:https",
    type_=(lambda v: tuple(v.split(":", 1)) if (v is not None and ":" in v) else None),
)
SECURE_SSL_REDIRECT = env("SECURE_SSL_REDIRECT", default=True, type_=boolish)
SESSION_COOKIE_SECURE = env(
    "SESSION_COOKIE_SECURE", default=SECURE_SSL_REDIRECT, type_=boolish
)
CSRF_COOKIE_SECURE = env(
    "CSRF_COOKIE_SECURE", default=SECURE_SSL_REDIRECT, type_=boolish
)
SECURE_HSTS_SECONDS = env(
    "SECURE_HSTS_SECONDS", default=3600 if SECURE_SSL_REDIRECT else 0, type_=int
)
SECURE_HSTS_INCLUDE_SUBDOMAINS = env(
    "SECURE_HSTS_INCLUDE_SUBDOMAINS", default=True, type_=boolish
)
SECURE_HSTS_PRELOAD = env("SECURE_HSTS_PRELOAD", default=False, type_=boolish)


# Internationalization
# https://docs.djangoproject.com/en/1.11/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_L10N = True

USE_TZ = True{% if cookiecutter.use_bucketeer_aws_for_file_storage == 'y' %}


# Media files
DEFAULT_FILE_STORAGE = "storages.backends.s3boto3.S3Boto3Storage"

AWS_ACCESS_KEY_ID = env(
    "BUCKETEER_AWS_ACCESS_KEY_ID", default=env("AWS_ACCESS_KEY_ID", default=None)
)
AWS_SECRET_ACCESS_KEY = env(
    "BUCKETEER_AWS_SECRET_ACCESS_KEY",
    default=env("AWS_SECRET_ACCESS_KEY", default=None),
)
AWS_STORAGE_BUCKET_NAME = env(
    "BUCKETEER_BUCKET_NAME", default=env("AWS_BUCKET_NAME", default=None)
)
AWS_DEFAULT_ACL = None{% endif %}


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.11/howto/static-files/

# This gets overridden in settings.production:
STATICFILES_DIRS = [str(PROJECT_ROOT / "dist"), str(PROJECT_ROOT / "locales")]
STATIC_URL = "/static/"
STATIC_ROOT = str(PROJECT_ROOT / "staticfiles")


# Per the docs:
# > Absolute path to a directory of files which will be served at the root of
# > your application (ignored if not set).
# Set this way, this lets us serve the styleguide relative to itself. If you
# access the styleguide at `/styleguide/`, then the relative path asset
# requests it makes will land in WhiteNoise, and get served appropriately,
# given how the static directory is structured (with an internal `styleguide`
# directory).
# This comes at a cost, though:
# > you won't benefit from cache versioning
# WHITENOISE_ROOT = PROJECT_ROOT.joinpath(static_dir_root)

SOCIALACCOUNT_PROVIDERS = {
    "salesforce-production": {"SCOPE": ["web", "full", "refresh_token"]},
    "salesforce-test": {"SCOPE": ["web", "full", "refresh_token"]},
    "salesforce-custom": {"SCOPE": ["web", "full", "refresh_token"]},
}
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_UNIQUE_EMAIL = False
ACCOUNT_EMAIL_VERIFICATION = "none"
SOCIALACCOUNT_ADAPTER = (
    "{{cookiecutter.project_slug}}.multisalesforce.adapter.CustomSocialAccountAdapter"
)

JS_REVERSE_JS_VAR_NAME = "api_urls"
JS_REVERSE_EXCLUDE_NAMESPACES = ["admin", "admin_rest"]


# Redis configuration:

REDIS_LOCATION = "{0}/{1}".format(env("REDIS_URL", default="redis://localhost:6379"), 0)
CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": REDIS_LOCATION,
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
            "IGNORE_EXCEPTIONS": True,
        },
    }
}
RQ_QUEUES = {
    "default": {
        "USE_REDIS_CACHE": "default",
        "DEFAULT_TIMEOUT": env("REDIS_JOB_TIMEOUT", type_=int, default=3600),
        "DEFAULT_RESULT_TTL": 720,
    },
    "short": {
        "USE_REDIS_CACHE": "default",
        "DEFAULT_TIMEOUT": 10,
        "DEFAULT_RESULT_TTL": 300,
    },
}
RQ = {"WORKER_CLASS": "{{cookiecutter.project_slug}}.rq_worker.ConnectionClosingWorker"}
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {"hosts": [REDIS_LOCATION]},
    }
}

# Rest Framework settings:
REST_FRAMEWORK = {
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticatedOrReadOnly",
    ),
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework.authentication.TokenAuthentication",
        "rest_framework.authentication.SessionAuthentication",
    ),
}


# Logging

LOG_REQUESTS = True
LOG_REQUEST_ID_HEADER = "HTTP_X_REQUEST_ID"
GENERATE_REQUEST_ID_IF_NOT_IN_HEADER = True
REQUEST_ID_RESPONSE_HEADER = "X-Request-ID"

LOGGING = {
    "version": 1,
    "disable_existing_loggers": True,
    "filters": {
        "request_id": {"()": "log_request_id.filters.RequestIDFilter"},
        "job_id": {"()": "{{cookiecutter.project_slug}}.logfmt.JobIDFilter"},
    },
    "formatters": {
        "logfmt": {
            "()": "{{cookiecutter.project_slug}}.logfmt.LogfmtFormatter",
            "format": (
                "%(levelname)s %(asctime)s %(module)s %(process)d %(thread)d "
                "%(message)s"
            ),
        },
        "simple": {
            "()": "django.utils.log.ServerFormatter",
            "format": "{levelname} {message}",
            "style": "{",
        },
    },
    "handlers": {
        "console_error": {
            "level": "ERROR",
            "class": "logging.StreamHandler",
            "filters": ["request_id"],
            "formatter": "simple",
        },
        "console": {
            "level": "DEBUG",
            "class": "logging.StreamHandler",
            "filters": ["request_id"],
            "formatter": "logfmt",
        },
        "rq_console": {
            "level": "DEBUG",
            "class": "logging.StreamHandler",
            "filters": ["job_id"],
            "formatter": "logfmt",
        },
    },
    "loggers": {
        "django.db.backends": {
            "level": "ERROR",
            "handlers": ["console"],
            "propagate": False,
        },
        "django.server": {"handlers": ["console"], "level": "INFO", "propagate": False},
        "django.request": {
            "handlers": ["console_error"],
            "level": "INFO",
            "propagate": False,
        },
        "rq.worker": {"handlers": ["rq_console"], "level": "DEBUG"},
        "{{cookiecutter.project_slug}}.multisalesforce": {"handlers": ["console"], "level": "DEBUG"},
        "{{cookiecutter.project_slug}}.logging_middleware": {
            "handlers": ["console"],
            "level": "DEBUG",
            "propagate": False,
        },
    },
}

# Raven / Sentry
SENTRY_DSN = env("SENTRY_DSN", default="")

if SENTRY_DSN:
    INSTALLED_APPS += ["raven.contrib.django.raven_compat"]
    RAVEN_CONFIG = {"dsn": SENTRY_DSN}
    MIDDLEWARE = [
        (
            "raven.contrib.django.raven_compat.middleware."
            "SentryResponseErrorIdMiddleware"
        )
    ] + MIDDLEWARE
    if not DEBUG:
        # Extend the logging dict with Sentry settings:
        LOGGING["root"] = {"level": "WARNING", "handlers": ["sentry"]}
        LOGGING["handlers"]["sentry"] = {
            "level": "ERROR",
            "class": ("raven.contrib.django.raven_compat.handlers." "SentryHandler"),
            "tags": {"custom-tag": "x"},
        }
        LOGGING["loggers"]["raven"] = {
            "level": "DEBUG",
            "handlers": ["console"],
            "propagate": False,
        }
        LOGGING["loggers"]["rq.worker"]["handlers"].append("sentry")
