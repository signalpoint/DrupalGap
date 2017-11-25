#!/usr/bin/env bash

# If the module is enabled, disable it (aka remove it's min.js file from the index.html file).
File=index.html
if grep -q "$PROJECT".min.js "$File"; then

  # Ask for confirmation to disable.
  read -p "Disable $PROJECT, are you sure? " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]
    then
      exit 1
  fi

  # We got confirmation, remove the project from the index.html file.
  grep -v "$PROJECT" index.html > index-dg.html; mv index-dg.html index.html

  # Inform the user what happened.
  echo "$PROJECT disabled."
  echo "Removed from index.html <= $PROJECT"

else
  echo "$PROJECT is not enabled."
fi