#!/usr/bin/env bash

# Create the drupalgap_backups directory if it doesn't already exit.
mkdir -p $APP_BACKUPS_DIRECTORY

# Create a directory to store this round of backups.
TEMP_DIR="~/$APP_BACKUPS_DIRECTORY/"
TEMP_DIR+=$(date +%Y%m%d%H%M%S)
mkdir -p $TEMP_DIR

# Ask them if they're sure?
read -p "Are you sure you want to update the DrupalGap SDK? " -n 1 -r
echo    # (optional) move to a new line
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
  rmdir $TEMP_DIR
  exit 1
fi

# Make a backup copy of the current binary.
cp -r drupalgap.min.js $TEMP_DIR

# If drupalgap.min.js exists, remove it..
if [ -f drupalgap.min.js ]; then
  rm drupalgap.min.js
fi

# Download the latest binary.
wget "$DRUPALGAP_MIN_JS_URL" --no-check-certificate || curl -O "$DRUPALGAP_MIN_JS_URL"

# Let the developer know what happened.
echo -e "Backups saved to: $TEMP_DIR\nDrupalGap SDK update complete!"
