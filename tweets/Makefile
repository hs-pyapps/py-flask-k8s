# variables
VENV := tweets_venv
IMAGE = flaskapp
IMAGE_TAG := $(IMAGE):latest_t
CONTAINER_NAME := $(IMAGE)_container_tweets

# docker variables
DHUB_IMAGE_TAG = hshishir/$(IMAGE):latest
DHUB_CONTAINER_NAME = dhub_$(CONTAINER_NAME)

# AWS variables
AWS_PROFILE = ecr-user1
AWS_ECR_REPOSITORY = py-flask-demo
AWS_REGION = us-west-2
AWS_ACCOUNT_ID = 628549630984
AWS_SERVER = $(AWS_ACCOUNT_ID).dkr.ecr.$(AWS_REGION).amazonaws.com
AWS_IMAGE_TAG = $(AWS_SERVER)/$(AWS_ECR_REPOSITORY):latest
AWS_CONTAINER_NAME = aws_$(CONTAINER_NAME)
AWS_ECS_CLUSTER_NAME = stg-flask-cluster
AWS_ECS_SERVICE_NAME = stg-flask-app-service


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
	docker run -d -p 8000:8000 --name $(CONTAINER_NAME) $(IMAGE_TAG)
	open http://localhost:8000

cleandocker:
	docker container stop $(CONTAINER_NAME)
	docker container rm $(CONTAINER_NAME)
	docker image rm $(IMAGE_TAG)


#### Push to AWS ECR ####
build_ecr:
	echo Building image $(AWS_IMAGE_TAG)
	docker build --cache-from $(AWS_IMAGE_TAG) -t $(AWS_IMAGE_TAG) .
login_ecr:
	echo Logging to AWS ECR $(AWS_SERVER) using profile $(AWS_PROFILE)
	aws ecr get-login-password --region $(AWS_REGION) --profile $(AWS_PROFILE) | \
    docker login --username AWS --password-stdin $(AWS_SERVER)

runecr: build_ecr
	docker run -d -p 8000:8000 --name $(AWS_CONTAINER_NAME) $(AWS_IMAGE_TAG)

pushecr: build_ecr login_ecr
	docker push $(AWS_IMAGE_TAG)

cleanecr:
	docker container stop $(AWS_CONTAINER_NAME)
	docker container rm $(AWS_CONTAINER_NAME)
	docker image rm $(AWS_IMAGE_TAG)

### Push to docker hub
builddhub:
	echo Build image $(DHUB_IMAGE_TAG)
	docker build --cache-from $(DHUB_IMAGE_TAG) -t $(DHUB_IMAGE_TAG) .
pushdhub: builddhub
	docker run -d -p 8000:8000 --name $(DHUB_CONTAINER_NAME) $(DHUB_IMAGE_TAG)
	docker push $(DHUB_IMAGE_TAG)
cleandhub:
	docker container stop $(DHUB_CONTAINER_NAME)
	docker container rm $(DHUB_CONTAINER_NAME)
	docker image rm $(DHUB_IMAGE_TAG)

# Update image on ECS cluster
updateecscluster:
	aws ecs update-service --cluster $(AWS_ECS_CLUSTER_NAME) --service $(AWS_ECS_SERVICE_NAME) --force-new-deployment

.PHONY: all venv run clean build
