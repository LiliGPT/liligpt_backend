#!/bin/bash

# This script is used to deploy the backend to a personal dev server 
# using SSH-forwarding.

# Running:
# 1.
# Create the file `devops/scripts/.env`
# using the example file at `devops/scripts/.env.example`
# 2.
# then run:
# bash devops/scripts/deploy-dev.sh

function main() {
  local HERE=$(cd $(dirname "$0") && pwd)
  local ROOT=$(cd "$HERE/../.." && pwd)

  # load env
  set -a
  source "$HERE/.env" || \
    die "Failed to load env file"
  set +a

  echo "DEV_SERVER_IP=$DEV_SERVER_IP"
  echo "DEV_SERVER_USER=$DEV_SERVER_USER"
  echo "DEV_SERVER_KEY=$DEV_SERVER_KEY"
  echo "DEV_SERVER_DEPLOY_DIR=$DEV_SERVER_DEPLOY_DIR"
  echo "APP_PUBLIC_URL=$APP_PUBLIC_URL"
  echo ""

  # build
  build_app "$ROOT" "$ROOT/dist" || \
    die "Failed to build the app"
  # rm remote `dist` folder
  run_ssh_command \
    "rm -rf $DEV_SERVER_DEPLOY_DIR/dist" 2>/dev/null
  # create dest folder if not exists
  run_ssh_command \
    "mkdir -p $DEV_SERVER_DEPLOY_DIR" || \
    die "Failed to create dest folder $DEV_SERVER_DEPLOY_DIR"
  # copy dist folder to $DEV_SERVER_DEPLOY_DIR/dist
  copy_folder \
    "$ROOT/dist" "$DEV_SERVER_DEPLOY_DIR/dist" || \
    die "Failed to copy dist folder to $DEV_SERVER_DEPLOY_DIR/dist"
  # copy docker-compose.yml artifact file
  copy_file \
    "$ROOT/devops/artifacts/docker-compose.yml" "$DEV_SERVER_DEPLOY_DIR" || \
    die "Failed to copy docker-compose.yml file"
  # copy package.json
  copy_file \
    "$ROOT/package.json" "$DEV_SERVER_DEPLOY_DIR" || \
    die "Failed to copy package.json file"
  # install
  # run_ssh_command \
  #   "cd '$DEV_SERVER_DEPLOY_DIR' && yarn install --production" || \
  #   die "Failed to install dependencies"
  # restart the container
  run_ssh_command \
    "cd '$DEV_SERVER_DEPLOY_DIR' && docker compose up -d --force-recreate" || \
    die "Failed to restart the container"
  echo ""
  echo "Open: http://$DEV_SERVER_IP:28180"
  echo ""
  echo "Done!"
}

function build_app() {
  local ROOT="$1"
  local DIST="$2"

  rm -rf "$DIST"

  echo "Building the app"
  cd "$ROOT"
  yarn build || return 1
  echo ""
}

function copy_folder() {
  local SRC="$1"
  local DEST="$2"

  echo "Copying $SRC to $DEST"
  scp -i "$DEV_SERVER_KEY" -r "$SRC" "$DEV_SERVER_USER@$DEV_SERVER_IP:$DEST"
  echo ""
}

function copy_file() {
  local SRC="$1"
  local DEST="$2"

  echo "Copying $SRC to $DEST"
  scp -i "$DEV_SERVER_KEY" "$SRC" "$DEV_SERVER_USER@$DEV_SERVER_IP:$DEST"
  echo ""
}

function run_ssh_command() {
  local COMMAND="$1"
  local FULLCOMMAND="ssh -i \"$DEV_SERVER_KEY\" \"$DEV_SERVER_USER@$DEV_SERVER_IP\" \"$COMMAND\""

  echo "Running command:"
  echo "$FULLCOMMAND"
  echo ""
  eval "$FULLCOMMAND"
}

function die() {
  echo ""
  echo "Error: $1"
  exit 1
}

main
