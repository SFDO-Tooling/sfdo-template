"""
Does the following:

1. Removes files needed for the GPLv3 license if it isn't going to be used
2. Downloads appropriate versions of node and yarn.
"""
import os
import platform

platform = platform.system().lower()

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

node_version = '{{ cookiecutter.node_version }}'
yarn_version = '{{ cookiecutter.yarn_version }}'

node_output = os.path.join(PROJECT_DIRECTORY, 'requirements', f'node-v{node_version}-{platform}-x64.tar.xz')
yarn_output = os.path.join(PROJECT_DIRECTORY, 'requirements', f'yarn-v{yarn_version}.tar.xz')

os.system(' '.join([
    f'curl',
    f'https://nodejs.org/download/release/v{node_version}/node-v{node_version}-{platform}-x64.tar.xz',
    f'-o {node_output}',
]))
os.system(' '.join([
    f'curl',
    f'https://github.com/yarnpkg/yarn/releases/download/v{yarn_version}/yarn-v{yarn_version}.tar.gz',
    f'-o {yarn_output}'
]))
