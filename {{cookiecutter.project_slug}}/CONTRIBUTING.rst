Development Setup
=================

Cloning the project
-------------------

::

   git clone git@github.com:oddbird/{{cookiecutter.project_slug}}
   cd {{cookiecutter.project_slug}}

Making a virtual env
--------------------

{{cookiecutter.project_name}} development requires Python v3.6. If ``which python3.6`` returns a
non-empty path, it's already installed and you can continue to the next step. If
it returns nothing, then install Python v3.6 using
``brew install https://raw.githubusercontent.com/Homebrew/homebrew-core/f2a764ef944b1080be64bd88dca9a1d80130c558/Formula/python.rb``,
or from `Python.org`_.

.. _Python.org: https://www.python.org/downloads/

There are a variety of tools that let you set up environment variables
temporarily for a particular "environment" or directory. We use
`virtualenvwrapper`_. Assuming you're in the repo root, do the following to
create a virtualenv (once you have `virtualenvwrapper`_ installed locally)::

    mkvirtualenv {{cookiecutter.project_slug}} --python=$(which python3.6)
    setvirtualenvproject

Copy the ``.env`` file somewhere that will be sourced when you need it::

    cp env.example $VIRTUAL_ENV/bin/postactivate

Edit this file to change ``DJANGO_SECRET_KEY`` to any arbitrary string value.

Now run ``workon {{cookiecutter.project_slug}}`` again to set those environment variables.

Your ``PATH`` (and environment variables) will be updated when you
``workon {{cookiecutter.project_slug}}`` and restored when you ``deactivate``. This will make sure
that whenever you are working on MD, you use the MD-specific version of Node
instead of any system-wide Node you may have.

**All of the remaining steps assume that you have the virtualenv activated
(``workon {{cookiecutter.project_slug}}``).**

.. _virtualenvwrapper: https://virtualenvwrapper.readthedocs.io/en/latest/

Installing Python requirements
------------------------------

::

    pip install -r requirements/local.txt

Installing JavaScript requirements
----------------------------------

The project-local version of `Node.js`_ is bundled with the repo and can be
unpacked locally (in the git-ignored ``node/`` directory), so you don't have to
install it system-wide (and possibly conflict with other projects wanting other
Node versions).

To install the project-local version of Node (and `yarn`_)::

   bin/unpack-node

If you can run ``which node`` and see a path inside your MD repo ending with
``.../node/bin/node``, then you've got it set up right and can move on.

Then use ``yarn`` to install dependencies::

   yarn

.. _Node.js: http://nodejs.org
.. _yarn: https://yarnpkg.com/

Setting up the database
-----------------------

Assuming you have `Postgres <https://www.postgresql.org/download/>`_ installed
and running locally::

   createdb {{cookiecutter.project_slug}}

Then run the initial migrations::

   python manage.py migrate

Running the server
------------------

To run the local development server::

   yarn serve

The running server will be available at `<https://localhost:8080/>`_.

We need to serve local development on HTTPS to support Salesforce's requirement
for an HTTPS callback for OAuth. In most browsers, on your first visit you'll
have to add a local certificate exception (following the browser prompts), as
they'll be self-signed and not automatically trusted.

The WebSocket server (to live-reload on file changes) listens on
``wss://localhost:5000``. In Firefox, this requires first visiting
`<https://localhost:5000/>`_ to add another local certificate exception.

Logging in with Salesforce
--------------------------

To make an initial local user::

   python manage.py createsuperuser

To setup the Salesforce OAuth integration, add an entry in the database with
configuration information. You can do this by filling in the form at
`<https://localhost:8080/admin/socialaccount/socialapp/add/>`_ (you'll first be
asked to log in using the local user you created above).

To fill this in, you'll need some specific values from a Connected App in your
Salesforce configuration. If you're an OddBird, you can find these values in the
shared Keybase team folder.

If you don't have a Salesforce account, ask `Kit <mailto:kit@oddbird.net>`_ to
send you an invitation by email.

Development Tasks
-----------------

- ``yarn serve``: starts development server (with watcher) at
  `<https://localhost:8080/>`_ (assets are served from ``dist/`` dir)
- ``yarn test``: run JS tests
- ``yarn test:watch``: run JS tests with a watcher for development
- ``yarn lint``: formats and lints ``.scss`` and ``.js`` files; lints ``.py``
  files
- ``yarn prettier``: formats ``.scss`` and ``.js`` files
- ``yarn eslint``: lints ``.js`` files
- ``yarn stylelint``: lints ``.scss`` files
- ``yarn flake8``: lints ``.py`` files
- ``yarn build``: builds development (unminified) static assets into ``dist/``
  dir
- ``yarn prod``: builds production (minified) static assets into ``dist/prod/``
  dir

In commit messages or pull request titles, we use the following emojis to label
which development commands need to be run before serving locally:

- 📦 (``:package:``) -> ``pip install -r requirements/local.txt``
- 🛢 (``:oil_drum:``) -> ``python manage.py migrate``
- 🐈 (``:cat2:``) -> ``yarn``
- 🙀 (``:scream_cat:``) -> ``rm -rf node_modules/; bin/unpack-node; yarn``
