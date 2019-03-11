"""
Does the following:

1. Removes files needed for the GPLv3 license if it isn't going to be used
2. Downloads appropriate versions of node and yarn.
"""
import os
import platform
import json

# We have this because of cookiecutter:
import requests

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


use_gplv3 = "{{ cookiecutter.open_source_license }}" == "GPLv3"
not_oss = "{{ cookiecutter.open_source_license }}" == "Not open source"

# 1. Removes files needed for the GPLv3 license if it isn't going to be used.
if not use_gplv3:
    remove_copying_files()


def get_node_lts():
    url = "https://api.github.com/repos/nodejs/node/releases"
    res = requests.get(url)
    version = [
        {"tag_name": v["tag_name"], "name": v["name"]}
        for v in res.json()
        if "LTS" in v["name"]
    ]
    return version[0]["tag_name"].lstrip("v")


def get_yarn_latest():
    url = "https://api.github.com/repos/yarnpkg/yarn/releases/latest"
    res = requests.get(url)
    return res.json()["tag_name"].lstrip("v")


package_json = os.path.join(PROJECT_DIRECTORY, "package.json")

with open(package_json) as f:
    data = json.load(f)
    if data["engines"]["node"] == "lts":
        data["engines"]["node"] = get_node_lts()
    if data["engines"]["yarn"] == "latest":
        data["engines"]["yarn"] = get_yarn_latest()

with open(package_json, "w") as f:
    json.dump(data, f, indent=2)
