{{cookiecutter.project_name}}
{{ '=' * cookiecutter.project_name|length }}

Copy the ``.env`` file::

    mv env.example .env

You can also edit ``.env``, if you have any values that you know should
be different.

.. todo:: Set up database
.. todo:: Set up message queue?
.. todo:: Set up JS dependencies?
.. todo:: Run DB migrations
.. todo:: Set initial data
.. todo:: Run worker process
.. todo:: Run server process

Access the running server at http://localhost/ or
http://{{ cookiecutter.domain_name }}.hexxie.com/ (these both point to
127.0.0.1).
