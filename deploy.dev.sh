#!/bin/bash

# ----------- CONFIG -------------
SERVER_USER=""
SERVER_HOST=""
REMOTE_PATH="/home/sotatek/apps/ai-trading-demo-app"
DOCKER_NAME="ai-trading-demo-app"
TAR_NAME="app.tar.gz"

# Build-time ENV
NEXT_PUBLIC_API_BASE_URL=https://kuestly.sotatek.works/api/v1

# ----------- BUILD & DEPLOY --------------

set -e

echo "==> Packing source code (excluding node_modules, .next, ...)"
tar --exclude-vcs -czf $TAR_NAME -X .dockerignore .

echo "==> Copying code to server..."
ssh $SERVER_USER@$SERVER_HOST "mkdir -p $REMOTE_PATH"
scp $TAR_NAME $SERVER_USER@$SERVER_HOST:$REMOTE_PATH/

echo "==> Deploying and building Docker container on server..."
ssh $SERVER_USER@$SERVER_HOST bash -c "'
  set -e
  cd $REMOTE_PATH

  echo Cleaning old files...
  find . -mindepth 1 ! -name "$TAR_NAME" -exec rm -rf {} +

  echo Extracting new code...
  tar -xzf $TAR_NAME && rm $TAR_NAME

  # Stop and remove old container if exists
  if [ \$(docker ps -aq -f name=$DOCKER_NAME) ]; then
    echo Stopping old container...
    docker stop $DOCKER_NAME || true
    docker rm $DOCKER_NAME || true
  fi

  # Build new Docker image with build-time ARGs
  echo Building Docker image...
  docker build \
    --build-arg NEXT_PUBLIC_API_BASE_URL=\"$NEXT_PUBLIC_API_BASE_URL\" \
    -t $DOCKER_NAME . -f Dockerfile.dev

  # Run new container
  echo Running new container...
  docker run -d --name $DOCKER_NAME -p 3002:3000 $DOCKER_NAME
'"

rm $TAR_NAME

echo "==> Deployment complete!"