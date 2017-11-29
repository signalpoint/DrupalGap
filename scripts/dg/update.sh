#!/usr/bin/env bash

# Create the drupalgap_backups directory if it doesn't already exit.
mkdir -p "$APP_BACKUPS_DIRECTORY"

# Create a directory to store this round of backups.
TEMP_DIR="$APP_BACKUPS_DIRECTORY/"
TEMP_DIR+=$(date +%Y%m%d%H%M%S)
mkdir -p "$TEMP_DIR"

#==================|
# drupalgap.min.js |
#==================|

# If they didn't provide a project name, we update DrupalGap only.
if [ -z "$2" ]
  then

    # Ask them if they're sure.
    read -p "Are you sure you want to update the DrupalGap SDK? " -n 1 -r
    echo    # (optional) move to a new line
    if [[ ! $REPLY =~ ^[Yy]$ ]]
    then
      rmdir $TEMP_DIR
      exit 1
    fi


    # If drupalgap.min.js exists, make a backup copy of the current binary and remove it..
    if [ -f drupalgap.min.js ]; then
      cp drupalgap.min.js $TEMP_DIR
      rm drupalgap.min.js
    fi

    # Download the latest binary.
    wget -q "$DRUPALGAP_MIN_JS_URL" --no-check-certificate || curl -O "$DRUPALGAP_MIN_JS_URL"

    # Let the developer know what happened.
    echo -e "Updated drupalgap.min.js and saved backups to $TEMP_DIR"

    exit 1
fi

#============================|
# UPDATING SOMETHING ELSE...
#============================|

# They provided a project name, let's just update that...

# Grab the project name.
PROJECT="$2"

#================|
# jdrupal.min.js |
#================|
if [ "$PROJECT" == "jdrupal" ]; then

  # Ask them if they're sure.
    read -p "Are you sure you want to update jDrupal? " -n 1 -r
    echo    # (optional) move to a new line
    if [[ ! $REPLY =~ ^[Yy]$ ]]
    then
      rmdir $TEMP_DIR
      exit 1
    fi


    # If jdrupal.min.js exists, make a backup copy of the current binary and remove it..
    if [ -f jdrupal.min.js ]; then
      cp jdrupal.min.js $TEMP_DIR
      rm jdrupal.min.js
    fi

    # Download the latest binary.
    wget -q "$JDRUPAL_MIN_JS_URL" --no-check-certificate || curl -O "$JDRUPAL_MIN_JS_URL"

    # Let the developer know what happened.
    echo -e "Updated jdrupal.min.js and saved backups to $TEMP_DIR"

    exit 1
fi

#=================|
# CONTRIB MODULES |
#=================|


PROJECT_DIR="$APP_MODULES_CONTRIB_DIRECTORY/$PROJECT"

# Make sure the project folder exists, otherwise bail out and warn them.
if [ ! -d "$PROJECT_DIR" ]; then
  echo "Directory $PROJECT_DIR not found... can't update $PROJECT."
  exit 1
fi

# Ask them if they're sure.
    read -p "Are you sure you want to update $PROJECT? " -n 1 -r
    echo    # (optional) move to a new line
    if [[ ! $REPLY =~ ^[Yy]$ ]]
    then
      rmdir $TEMP_DIR
      exit 1
    fi

# Make a backup of the project.
cp -r $PROJECT_DIR "$TEMP_DIR/"

# Delete the project.
rm -rf $PROJECT_DIR

# Download the project.
./dg dl $PROJECT

# Let the developer know what happened.
echo -e "Updated $PROJECT and saved backups to $TEMP_DIR"
