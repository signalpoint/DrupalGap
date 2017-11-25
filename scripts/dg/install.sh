#!/usr/bin/env bash


# If the project has an install script run it, otherwise we're done here.
if [ -f "$MODULE_DIR"/scripts/install.sh ]; then
  ./"$MODULE_DIR"/scripts/install.sh $@
fi
