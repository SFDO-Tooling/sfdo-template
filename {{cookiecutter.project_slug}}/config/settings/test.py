from .base import *  # NOQA

CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "{{cookiecutter.project_slug}}.tests.layer_utils.MockedRedisInMemoryChannelLayer"
    }
}
