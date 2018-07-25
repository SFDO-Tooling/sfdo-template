"""
Does the following:

1. Generates and saves random secret key
2. Removes the taskapp if celery isn't going to be used
3. Removes the .idea directory if PyCharm isn't going to be used
4. Copy files from /docs/ to {{ cookiecutter.project_slug }}/docs/

    TODO: this might have to be moved to a pre_gen_hook

A portion of this code was adopted from Django's standard crypto functions and
utilities, specifically:
    https://github.com/django/django/blob/master/django/utils/crypto.py
"""
import os
import random
import string

# Get the root project directory
PROJECT_DIRECTORY = os.path.realpath(os.path.curdir)
PROJECT_SLUG = "{{ cookiecutter.project_slug }}"

# Use the system PRNG if possible
try:
    random = random.SystemRandom()
    using_sysrandom = True
except NotImplementedError:
    using_sysrandom = False


def get_random_string(length=50):
    """
    Returns a securely generated random string.
    The default length of 12 with the a-z, A-Z, 0-9 character set returns
    a 71-bit value. log_2((26+26+10)^12) =~ 71 bits
    """
    punctuation = string.punctuation.replace('"', '').replace("'", '')
    punctuation = punctuation.replace('\\', '')
    if using_sysrandom:
        return ''.join(random.choice(
            string.digits + string.ascii_letters + punctuation
        ) for i in range(length))

    print(
        "Cookiecutter Django couldn't find a secure pseudo-random number "
        "generator on your system. Please change change your SECRET_KEY "
        "variables in conf/settings/local.py and env.example manually."
    )
    return "CHANGEME!!"


def set_secret_key(setting_file_location):
    # Open settings
    with open(setting_file_location) as f:
        file_ = f.read()

    # Generate a SECRET_KEY that matches the Django standard
    SECRET_KEY = get_random_string()

    # Replace "CHANGEME!!!" with SECRET_KEY
    file_ = file_.replace('CHANGEME!!!', SECRET_KEY, 1)

    # Write the results to the settings module
    with open(setting_file_location, 'w') as f:
        f.write(file_)


def make_secret_key(project_directory):
    """Generates and saves random secret key"""
    # Determine the local_setting_file_location
    local_setting = os.path.join(
        project_directory,
        'src',
        PROJECT_SLUG,
        'settings/base.py'
    )

    # base.py settings file
    set_secret_key(local_setting)

    env_file = os.path.join(
        project_directory,
        'env.example'
    )

    # env.example file
    set_secret_key(env_file)


def remove_file(file_name):
    if os.path.exists(file_name):
        os.remove(file_name)


def remove_files(file_names):
    for file_name in file_names:
        file_name = os.path.join(PROJECT_DIRECTORY, file_name)
        remove_file(file_name)


def remove_heroku_files():
    """
    Removes files needed for heroku if it isn't going to be used
    """
    remove_files(["Procfile", "runtime.txt"])


def remove_copying_files():
    """
    Removes files needed for the GPLv3 licence if it isn't going to be used
    """
    remove_files(["COPYING"])


def remove_open_source_files():
    """
    Removes files conventional to opensource projects only.
    """
    remove_files(["CONTRIBUTORS.rst", "CONTRIBUTING.rst"])


use_gplv3 = '{{ cookiecutter.open_source_license}}' == 'GPLv3'
not_oss = '{{ cookiecutter.open_source_license }}' == 'Not open source'

# 1. Generates and saves random secret key
make_secret_key(PROJECT_DIRECTORY)

# 2. Removes files needed for the GPLv3 licence if it isn't going to be used.
if not use_gplv3:
    remove_copying_files()

# 3. Remove files conventional to opensource projects only.
if not_oss:
    remove_copying_files()
    remove_open_source_files()
