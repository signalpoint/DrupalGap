#!/usr/bin/env bash

MODULE_NAME="$3";
MODULE_DIRECTORY="$APP_MODULES_CUSTOM_DIRECTORY/$MODULE_NAME"
FILE_URI="$MODULE_DIRECTORY/$MODULE_NAME.js"
TEMPLATE_DIR="scripts/dg/templates/modules/gulp"

# Create the app/modules directory if it doesn't exist.
if [ ! -d "$APP_MODULES_DIRECTORY" ]; then
  mkdir $APP_MODULES_DIRECTORY
fi

# Create the app/modules/custom directory if it doesn't exist.
if [ ! -d "$APP_MODULES_CUSTOM_DIRECTORY" ]; then
  mkdir $APP_MODULES_CUSTOM_DIRECTORY
fi

# Create the module's directory, or warn if it already exists.
if [ -d "$MODULE_DIRECTORY" ]; then
  echo "$MODULE_NAME already exists."
  exit
fi

mkdir $MODULE_DIRECTORY

while :; do
  case $4 in
    --gulp)

      # A more complex module with a package.json and gulpfile.js with a src directory...

      # Create _[module-name].js file.
      mkdir "$MODULE_DIRECTORY/src"
      echo "dg.createModule('$MODULE_NAME');" > "$MODULE_DIRECTORY/src/_$MODULE_NAME.js"

      # Copy in the template package.json file.
      cp "$TEMPLATE_DIR/package.json" "$MODULE_DIRECTORY/"

      # Copy in the template gulpfile.js file.
      cp "$TEMPLATE_DIR/gulpfile.js" "$MODULE_DIRECTORY/"

      # Copy in the template src directory.
      cp -r "$TEMPLATE_DIR/src" "$MODULE_DIRECTORY/"

      # Replace occurrences of 'example' with the module name.
      cd $MODULE_DIRECTORY
      find . -type f -exec sed -i "s/example/$MODULE_NAME/g" {} +
      cd -

      # Add to index.html.
      source scripts/dg/functions/add-js-to-index-html.sh
      add_js_to_index_html "$MODULE_DIRECTORY/$MODULE_NAME.min.js"

      echo "Now run these terminal commands to compile the $MODULE_NAME.min.js file:

cd $MODULE_DIRECTORY
npm install
gulp"

      break
      ;;
    *)

      # A simple module...

      echo "dg.createModule('$MODULE_NAME');

$MODULE_NAME.routing = function() {
  var routes = {};

  routes['$MODULE_NAME.foo'] = {
    path: '/hello-world',
    defaults: {
      _title: 'Hello World',
      _controller: $MODULE_NAME.fooController
    }
  };

  return routes;
};

$MODULE_NAME.fooController = function() {

  // Make a greeting for the current user.
  var account = dg.currentUser();
  var msg = account.isAuthenticated() ?
    'Hello ' + account.getAccountName() :
    'Hello World';

  // Prepare our page's render element.
  var element = {};

  // Add a message as markup to the render element.
  element['my_widget'] = {
    _markup: '<p>' + msg + '</p>'
  };

  // Return the element to be rendered on the page.
  return element;

};" > "$FILE_URI"

      # Find the line number after the settings.js include.
      INSERT_LINE=$(( `cat index.html | grep -n "settings.js" | awk '{ print $1 }' | tr -d ':'` +1 ))
      # insert the module include at that line
      sed -i "${INSERT_LINE}i \    <script src=\"$FILE_URI\"></script>" index.html

      echo "
Created module in $MODULE_DIRECTORY

The following has been added to your index.html:

<script src=\"$FILE_URI\"></script>
"


      break
  esac
done
