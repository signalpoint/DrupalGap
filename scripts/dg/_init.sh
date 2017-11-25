#!/usr/bin/env bash

# Make sure they provided a project name.
if [ -z "$2" ]
  then
    echo -e "Missing project name...\n"
    exit 1
fi

# Grab the project name.
PROJECT="$2"
export PROJECT

# Determine its directory.
# @TODO support custom modules.
MODULE_DIR="$APP_MODULES_CONTRIB_DIRECTORY/$PROJECT"
export MODULE_DIR
