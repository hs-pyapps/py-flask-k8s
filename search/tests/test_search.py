# In order to successfully run tests in development environments,
# devs will need to run the following command in this current
# working directory, using their unique project path on their
# machine/virtual environment:
#
# export PYTHONPATH="${PYTHONPATH}:{your/unique/path}/python-flask-k8s/search"
#
# TODO: Move this information to more permanent location and
#       implement solution to project structure issues
# 
# POSSIBLE FIX: Make universal change to settings.json on main

import pytest
from src.search_backend.search import Search

# Tests go here

if __name__ == '__main__':
    pytest.main()