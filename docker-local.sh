#!/bin/bash

# docker build --file $2 -t $1 .
# docker run -it -p 8081:8081 $1

docker build -f Dockerfile.prd -t snkr-crawler .


docker buildx build --platform linux/amd64,linux/arm64 --push -t registry.digitalocean.com/snkr/snkr-crawler -f Dockerfile.prd .


docker run -it -p 8081:8081 snkr-crawler
