#!/bin/bash

DO_REGISTRY_ADDRESS=registry.digitalocean.com/$2/$1

doctl registry login

docker build -f Dockerfile -t $DO_REGISTRY_ADDRESS .
docker push $DO_REGISTRY_ADDRESS
