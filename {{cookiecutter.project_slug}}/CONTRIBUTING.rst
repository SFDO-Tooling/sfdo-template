Development Setup
=================

Cloning the project
-------------------

::

    $ git clone git@github.com:{{cookiecutter.github_username}}/{{cookiecutter.project_slug}}
    $ cd {{cookiecutter.project_slug}}

Making a virtual env
--------------------

{{cookiecutter.project_name}} development requires Python v3.7. If ``which python3.7`` returns a
non-empty path, it's already installed and you can continue to the next step. If
it returns nothing, then install Python v3.7 using ``brew install python``, or
from `Python.org`_.

.. _Python.org: https://www.python.org/downloads/

There are a variety of tools that let you set up environment variables
temporarily for a particular "environment" or directory. We use
`virtualenvwrapper`_. Assuming you're in the repo root, do the following to
create a virtualenv (once you have `virtualenvwrapper`_ installed locally)::

    $ mkvirtualenv {{cookiecutter.project_slug}} --python=$(which python3.7)
    $ setvirtualenvproject

Install Python requirements::

    $ pip install -Ur requirements/local.txt

Copy the ``env.example`` file somewhere that will be sourced when you need it::

    $ cp env.example $VIRTUAL_ENV/bin/postactivate

Edit this file to change ``DJANGO_SECRET_KEY`` and ``DJANGO_HASHID_SALT`` to any
two different arbitrary string values.

Next, run the following commands to generate a database encryption key::

    $ python manage.py shell
    >>> from cryptography.fernet import Fernet
    >>> Fernet.generate_key()

This will output a bytestring, e.g. ``b'mystring='``. Copy only the contents of
``'...'``, and add it to your ``$VIRTUAL_ENV/bin/postactivate`` file as
``DB_ENCRYPTION_KEY``, e.g. ``export DB_ENCRYPTION_KEY="mystring="``.

To exit the Python shell, press ``Ctrl-Z`` and then ``Enter`` on Windows, or
``Ctrl-D`` on OS X or Linux. Alternatively, you could also type the Python
command ``exit()`` and press ``Enter``.

{%- if cookiecutter.use_bucketeer_aws_for_file_storage == 'y' %}

Finally, set the following environment variables::

    export BUCKETEER_AWS_ACCESS_KEY_ID=...
    export BUCKETEER_AWS_SECRET_ACCESS_KEY=...
    export BUCKETEER_BUCKET_NAME=...{% endif %}

Now run ``workon {{cookiecutter.project_slug}}`` again to set those environment variables.

Your ``PATH`` (and environment variables) will be updated when you
``workon {{cookiecutter.project_slug}}`` and restored when you ``deactivate``. This will make sure
that whenever you are working on the project, you use the project-specific version of Node
instead of any system-wide Node you may have.

**All of the remaining steps assume that you have the virtualenv activated.**
(``workon {{cookiecutter.project_slug}}``)

.. _virtualenvwrapper: https://virtualenvwrapper.readthedocs.io/en/latest/

Installing JavaScript requirements
----------------------------------

The project-local version of `Node.js`_ can be downloaded and unpacked locally
(in the git-ignored ``node/`` directory), so you don't have to install it
system-wide (and possibly conflict with other projects wanting other Node
versions).

To download and install the project-local version of Node (and `yarn`_)::

    $ bin/unpack-node

If you can run ``which node`` and see a path inside your project directory
ending with ``.../node/bin/node``, then you've got it set up right and can move
on.

Then use ``yarn`` to install dependencies::

    $ yarn

.. _Node.js: http://nodejs.org
.. _yarn: https://yarnpkg.com/

Setting up the database
-----------------------

Assuming you have `Postgres <https://www.postgresql.org/download/>`_ installed
and running locally::

    $ createdb {{cookiecutter.project_slug}}

Then run the initial migrations::

    $ python manage.py migrate

Running the server
------------------

The local development server requires `Redis <https://redis.io/>`_ to manage
background worker tasks. If you can successfully run ``redis-cli ping`` and see
output ``PONG``, then you have Redis installed and running. Otherwise, run
``brew install redis`` (followed by ``brew services start redis``) or refer to
the `Redis Quick Start`_.

To run the local development server::

    $ yarn serve

The running server will be available at `<http://localhost:8080/>`_.

.. _Redis Quick Start: https://redis.io/topics/quickstart

Logging in with Salesforce
--------------------------

To setup the Salesforce OAuth integration, run the ``populate_social_apps``
management command. The values to use in place of the ``XXX`` and ``YYY`` flags
can be found on the Connected App you've made in your Salesforce configuration::

    $ python manage.py populate_social_apps --prod-id XXX --prod-secret YYY

You can also run it with ``--test-id`` and ``--test-secret``, or ``--cust-id``
and ``--cust-secret``, or all three sets at once, to populate all three
providers.

Once you've logged in, you probably want to make your user a superuser. You can
do that easily via the ``promote_superuser`` management command::

    $ python manage.py promote_superuser <your email>

Development Tasks
-----------------

- ``yarn serve``: starts development server (with watcher) at
  `<http://localhost:8080/>`_ (assets are served from ``dist/`` dir)
- ``yarn pytest``: run Python tests
- ``yarn test``: run JS tests
- ``yarn test:watch``: run JS tests with a watcher for development
- ``yarn lint``: formats and lints ``.scss`` and ``.js`` files; lints ``.py``
  files
- ``yarn prettier``: formats ``.scss`` and ``.js`` files
- ``yarn eslint``: lints ``.js`` files
- ``yarn tsc``: runs JS type-checking
- ``yarn stylelint``: lints ``.scss`` files
- ``yarn flake8``: lints ``.py`` files
- ``yarn build``: builds development (unminified) static assets into ``dist/``
  dir
- ``yarn prod``: builds production (minified) static assets into ``dist/prod/``
  dir

In commit messages or pull request titles, we use the following emojis to label
which development commands need to be run before serving locally (these are
automatically prepended to commit messages):

- 📦 (``:package:``) -> ``pip install -r requirements/local.txt``
- 🛢 (``:oil_drum:``) -> ``python manage.py migrate``
- 🐈 (``:cat2:``) -> ``yarn``

Internationalization
--------------------

To build and compile ``.mo`` and ``.po`` files for the backend, run::

   $ python manage.py makemessages --locale <locale>
   $ python manage.py compilemessages

These commands require the `GNU gettext toolset`_ (``brew install gettext``).

For the front-end, translation JSON files are served from
``locales/<language>/`` directories, and the `user language is auto-detected at
runtime`_.

During development, strings are parsed automatically from the JS, and an English
translation file is auto-generated to ``locales_dev/en/translation.json`` on
every build (``yarn build`` or ``yarn serve``). When this file changes,
translations must be copied over to the ``locales/en/translation.json`` file in
order to have any effect.

Strings with dynamic content (i.e. known only at runtime) cannot be
automatically parsed, but will log errors while the app is running if they're
missing from the served translation files. To resolve, add the missing key:value
translations to ``locales/<language>/translation.json``.

.. _GNU gettext toolset: https://www.gnu.org/software/gettext/
.. _user language is auto-detected at runtime: https://github.com/i18next/i18next-browser-languageDetector
