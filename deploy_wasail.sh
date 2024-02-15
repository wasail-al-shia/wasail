#!/bin/bash

# terminate script if any command execution fails i.e. returns non-zero exit status
set -e

echo "Logging in..."
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 537213935442.dkr.ecr.us-east-1.amazonaws.com

echo "Building image..."
docker compose build

echo "Deleting old image"
aws ecr batch-delete-image \
     --repository-name wasail-ecr \
     --image-ids imageTag=latest

echo "Pushing new image..."
docker push 537213935442.dkr.ecr.us-east-1.amazonaws.com/wasail-ecr:latest

echo "Restarting service..."
aws ecs update-service --cluster WasailCluster --service WasailAppService --force-new-deployment --no-cli-pager

echo "Success!"
