#!/bin/bash

# Globals
APP_MODULES_DIRECTORY="app/modules"
APP_MODULES_CUSTOM_DIRECTORY="$APP_MODULES_DIRECTORY/custom"
APP_BACKUPS_DIRECTORY=".drupalgap-backups"
DRUPALGAP_JS_URL="https://raw.githubusercontent.com/signalpoint/DrupalGap/7.x-1.x/bin/drupalgap.js"
DRUPALGAP_MIN_JS_URL="https://raw.githubusercontent.com/signalpoint/DrupalGap/7.x-1.x/bin/drupalgap.min.js"

# DL | DOWNLOAD
function drupalgap_download_project() {

  # Make sure they provided a project name.
  if [ -z "$1" ]
    then
      echo -e "Missing project name... try this:\n./drupalgap dl foo"
      exit 1
  fi

  # @TODO support Macs with curl instead of wget

  # Grab the project name and determine the destination directory for it.
  PROJECT="$1"
  MODULE_DIR="$APP_MODULES_DIRECTORY/$PROJECT"

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

  # Determine which branch to download.
  BRANCH="7.x-1.x"
  if [ $# -eq 2 ]; then
    BRANCH=$2
  fi

  # Figure out the github.com zip file url.
  ZIP_FILE_NAME="$BRANCH.zip"
  USER_NAME="signalpoint"
  URL="https://github.com/$USER_NAME/$PROJECT/archive/$ZIP_FILE_NAME"

  # Go into the modules directory, then download and unzip the project,
  # renaming it to the project name and then delete the zip file.
  cd "$APP_MODULES_DIRECTORY"
  wget "$URL" --no-check-certificate
  unzip "$BRANCH"
  rm "$ZIP_FILE_NAME"
  mv "$PROJECT-$BRANCH" "$PROJECT"
  echo "Downloaded $PROJECT to $MODULE_DIR"

}

# UPDATE
function drupalgap_update() {

  # Create the drupalgap_backups directory if it doesn't already exit.
  if [ ! -d "$APP_BACKUPS_DIRECTORY" ]
    then
      mkdir $APP_BACKUPS_DIRECTORY
  fi

  # Create a directory to store this round of backups.
  TEMP_DIR="$APP_BACKUPS_DIRECTORY/"
  TEMP_DIR+=$(date +%Y%m%d%H%M%S)
  mkdir $TEMP_DIR

  # Ask them if they're sure?
  read -p "Are you sure you want to update the DrupalGap SDK? " -n 1 -r
  echo    # (optional) move to a new line
  if [[ ! $REPLY =~ ^[Yy]$ ]]
  then
    rmdir $TEMP_DIR
    exit 1
  fi

  # Make a copy of the current bin directory.
  cp -r bin $TEMP_DIR

  # If drupalgap.js or drupalgap.min.js exist in the bin directory, remove them.
  if [ -f bin/drupalgap.js ]; then
    rm bin/drupalgap.js
  fi
  if [ -f bin/drupalgap.min.js ]; then
    rm bin/drupalgap.min.js
  fi

  # Download the latest binaries.
  cd bin
  wget "$DRUPALGAP_JS_URL" --no-check-certificate
  wget "$DRUPALGAP_MIN_JS_URL" --no-check-certificate
  cd ..

  # Let the developer know what happened.
  echo -e "Backups saved to: $TEMP_DIR\nDrupalGap SDK update complete!"

  # Warn the developer if their index.html file needs to be updated.
  FOUND_BIN=false
  if grep -Fq "bin/drupalgap.js"  index.html
  then
      FOUND_BIN=true
  fi
  if ! $FOUND_BIN && grep -Fq "bin/drupalgap.min.js" index.html
  then
      FOUND_BIN=true
  fi
  if ! $FOUND_BIN
  then
    echo "NOTE, update the index.html file to load: bin/drupalgap.min.js"
  fi

}

# MODULE CREATE
function drupalgap_module_create() {

  MODULE_NAME="$1";
  MODULE_DIRECTORY="$APP_MODULES_CUSTOM_DIRECTORY/$MODULE_NAME"
  HOOK_MENU="$MODULE_NAME"
  HOOK_MENU+="_menu"
  PAGE_CALLBACK="$MODULE_NAME"
  PAGE_CALLBACK+="_page"
  FILE_URI="$MODULE_DIRECTORY/$MODULE_NAME.js"

  # Create the app/modules directory if it doesn't exist.
  if [ ! -d "$APP_MODULES_DIRECTORY" ]; then
    mkdir $APP_MODULES_DIRECTORY
  fi

  # Create the app/modules directory if it doesn't exist.
  if [ ! -d "$APP_MODULES_CUSTOM_DIRECTORY" ]; then
    mkdir $APP_MODULES_CUSTOM_DIRECTORY
  fi

  # Create the module's directory, or warn if it already exists.
  if [ -d "$MODULE_DIRECTORY" ]; then
    echo "$MODULE_NAME already exists..."
    exit
  fi

  mkdir $MODULE_DIRECTORY
  echo "/**
 * Implements hook_menu(),
 */
function $HOOK_MENU() {
  var items = {};
  items['hello'] = {
    title: 'Hello',
    page_callback: '$PAGE_CALLBACK'
  };
  return items;
}

/**
 *
 */
function $PAGE_CALLBACK() {
  try {
    var content = {};
    content['my_button'] = {
      theme: 'button',
      text: 'Hello World',
      attributes: {
        onclick: \"drupalgap_alert(t('Hi!'))\"
      }
    };
    return content;
  }
  catch (error) { console.log('$PAGE_CALLBACK - ' + error); }
}
" > "$FILE_URI"
  echo "
Created module in $MODULE_DIRECTORY"

}

# ...

# Check for an input argument command, let them know it is ready if they
# didn't supply one.
if [ -z "$1" ]
  then
    echo "The DrupalGap CLI is ready!"
    exit 1
fi

# Determine the command and call its handler.
case "$1" in
module)    
  case "$2" in
    create) drupalgap_module_create $3;;
  esac
  ;;
download|dl) drupalgap_download_project $2 $3;;
update|up) drupalgap_update;;
-*) usage "bad argument $1";;
esac
