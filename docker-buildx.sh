#!/bin/bash

doctl registry login

docker buildx build --platform linux/amd64 --push -t registry.digitalocean.com/snkr/snkr-crawler -f Dockerfile .
