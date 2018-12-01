"""
Does the following:

1. Removes files needed for the GPLv3 license if it isn't going to be used
"""
import os

# Get the root project directory
PROJECT_DIRECTORY = os.path.realpath(os.path.curdir)


def remove_file(file_name):
    if os.path.exists(file_name):
        os.remove(file_name)


def remove_files(file_names):
    for file_name in file_names:
        file_name = os.path.join(PROJECT_DIRECTORY, file_name)
        remove_file(file_name)


def remove_copying_files():
    """
    Removes files needed for the GPLv3 license if it isn't going to be used
    """
    remove_files(["COPYING"])


use_gplv3 = '{{ cookiecutter.open_source_license }}' == 'GPLv3'
not_oss = '{{ cookiecutter.open_source_license }}' == 'Not open source'

# 1. Removes files needed for the GPLv3 license if it isn't going to be used.
if not use_gplv3:
    remove_copying_files()
