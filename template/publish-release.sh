#!/bin/bash
echo "Tagging docker image..."
docker image tag unity-forms-app/gw-app $DOCKER_REGISTRY/unity-forms-app/gw-app:$VERSION
docker image tag unity-forms-app/gw-app $DOCKER_REGISTRY/unity-forms-app/gw-app:release

echo "Publishing docker image..."
docker login -u $DOCKER_USER -p $DOCKER_PASSWORD $DOCKER_REGISTRY
docker image push $DOCKER_REGISTRY/unity-forms-app/gw-app:$VERSION
docker image push $DOCKER_REGISTRY/unity-forms-app/gw-app:release