#!/usr/bin/env bash

# Make sure they provided a project name.
if [ -z "$2" ]
  then
    echo -e "Missing project name... try this:\n./dg dl foo"
    exit 1
fi

# Create default directories if they don't exist.
mkdir -p "$APP_MODULES_DIRECTORY"
mkdir -p "$APP_MODULES_CONTRIB_DIRECTORY"

# Grab the project name and determine the destination directory for it.
PROJECT="$2"
MODULE_DIR="$APP_MODULES_CONTRIB_DIRECTORY/$PROJECT"

# Check to see if the project already exists.
if [ -d "$MODULE_DIR" ]; then
  read -p "The $PROJECT project already exists, overwrite it? " -n 1 -r
  echo    # (optional) move to a new line
  if [[ ! $REPLY =~ ^[Yy]$ ]]
  then
    exit 1
  else
    rm -rf "$MODULE_DIR"
    echo "Removed $MODULE_DIR directory"
  fi
fi

# TODO lookup default branch

# Determine which branch to download.
BRANCH="8.x-1.x"
if [ $# -eq 3 ]; then
  BRANCH=$3
fi

# Figure out the github.com zip file url.
ZIP_FILE_NAME="$BRANCH.zip"
USER_NAME="signalpoint"
URL="https://github.com/$USER_NAME/$PROJECT/archive/$ZIP_FILE_NAME"

# Go into the modules directory, then download and unzip the project,
# renaming it to the project name and then delete the zip file.
cd "$APP_MODULES_CONTRIB_DIRECTORY"
wget -q "$URL" --no-check-certificate || curl -O "$URL"
unzip -q "$BRANCH"
rm "$ZIP_FILE_NAME"
mv "$PROJECT-$BRANCH" "$PROJECT"
echo "Downloaded $PROJECT to $MODULE_DIR"
