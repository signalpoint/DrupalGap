#!/usr/bin/env bash

# Ask for confirmation to enable.
read -p "Enable $PROJECT, are you sure? " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]
  then
    exit 1
fi

# If the module hasn't yet been downloaded, ask them if they'd like to download it. If they disagree, then exit.
# Check to see if the project already exists.
if [ ! -d "$MODULE_DIR" ]
  then
    read -p "The $PROJECT project does not exist, download it? " -n 1 -r
    echo    # (optional) move to a new line
    if [[ ! $REPLY =~ ^[Yy]$ ]]
      then
        exit 1
    else
      ./scripts/dg/download.sh $@
    fi
fi

# The module has been downloaded...
if [ -d "$MODULE_DIR" ]; then

  # Check to see if the module is already enabled (aka it's min.js file is in the index.html file) , if it is
  # warn the user and exit.
  File=index.html
  if grep -q "$PROJECT".min.js "$File"; then
   echo "$PROJECT is already enabled."
   exit 1
  fi

  # Enable the module by adding it's min.js file to the index.html file...

  # Build the path to the module's .min.js file.
  FILE_URI="$MODULE_DIR/$PROJECT.min.js"

  # Add to index.html.
  source scripts/dg/functions/add-js-to-index-html.sh
  add_js_to_index_html $FILE_URI

  # If the module has a .min.css file, add it to the index.html file as well.
  CSS_FILE_URI="$MODULE_DIR/$PROJECT.min.css"
  if [ -f "$CSS_FILE_URI" ]; then
    INSERT_LINE=$(( `cat index.html | grep -n "settings.js" | awk '{ print $1 }' | tr -d ':'` +2 ))
    sed -i "${INSERT_LINE}i \    <link rel=\"stylesheet\" href=\"$CSS_FILE_URI\" />" index.html
      echo "Added to index.html => $CSS_FILE_URI"
  fi

  # If the module has an installation script, run it.
  ./scripts/dg/install.sh $@

  # Let the developer know we have modified the index.html file.
  echo "$PROJECT enabled."

fi
