# variables
VENV := search_venv
IMAGE = flaskapp
IMAGE_TAG := $(IMAGE):latest_s
CONTAINER_NAME := $(IMAGE)_container_search

#### Local run in vitual environment ####
# default target, when make executed without arguments
all: venv

$(VENV)/bin/activate: requirements.txt
	python3 -m venv $(VENV)
	./$(VENV)/bin/pip install -r requirements.txt

# venv is a shortcut target
venv: $(VENV)/bin/activate


runvenv: venv
	./$(VENV)/bin/python3 src/app.py

testvenv: venv
	./$(VENV)/bin/python3 src/test.py

cleanvenv:
	rm -rf $(VENV)
	find . -type f -name '*.pyc' -delete
	find . -type d -name '*pycache*' -delete

#### Local docker build and run ####
# docker build -f Dockerfile -t $(IMAGE_TAG) .
# docker run -d -p hostport:containerport -n containername imagename
rundocker:
	docker build --cache-from $(IMAGE_TAG) -t $(IMAGE_TAG) .
	docker run -d -p 8002:8000 --name $(CONTAINER_NAME) $(IMAGE_TAG)
	open http://localhost:8002

cleandocker:
	docker container stop $(CONTAINER_NAME)
	docker container rm $(CONTAINER_NAME)
	docker image rm $(IMAGE_TAG)


.PHONY: all venv run clean build activate
