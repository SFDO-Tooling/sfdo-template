from .base import *  # NOQA
from .base import PROJECT_ROOT, TEMPLATES

STATICFILES_DIRS = [
    str(PROJECT_ROOT / "static"),
    str(PROJECT_ROOT / "dist" / "prod"),
    str(PROJECT_ROOT / "locales"),
]

TEMPLATES[0]["DIRS"] = [
    str(PROJECT_ROOT / "dist" / "prod"),
    str(PROJECT_ROOT / "templates"),
]

RQ = {"WORKER_CLASS": "{{cookiecutter.project_slug}}.rq_worker.ConnectionClosingHerokuWorker"}
