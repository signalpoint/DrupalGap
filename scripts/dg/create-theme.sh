#!/usr/bin/env bash

THEME_NAME="$3";
THEME_CLASS_NAME="${THEME_NAME^}"
THEME_DIRECTORY="$APP_THEMES_DIRECTORY/$THEME_NAME"
FILE_URI="$THEME_DIRECTORY/$THEME_NAME.js"

# Create the app/themes directory if it doesn't exist.
if [ ! -d "$APP_THEMES_DIRECTORY" ]; then
  mkdir $APP_THEMES_DIRECTORY
fi

# Create the theme's directory, or warn if it already exists.
if [ -d "$THEME_DIRECTORY" ]; then
  echo "$THEME_NAME already exists..."
  exit
fi

mkdir $THEME_DIRECTORY


# WARNING: any changes here should be reflected in the "create a custom theme" docs.

echo "// The $THEME_NAME theme constructor.
dg.themes.$THEME_CLASS_NAME = function() {
  this.regions = {
    header: { },
    content: { },
    footer: { }
  };
};
// Extend the DrupalGap Theme prototype.
dg.themes.$THEME_CLASS_NAME.prototype = new dg.Theme;
dg.themes.$THEME_CLASS_NAME.prototype.constructor = dg.themes.$THEME_CLASS_NAME;" > "$FILE_URI"

echo "1. Include it in the index.html file:

<script src=\"$FILE_URI\"></script>

2. Set it as the active theme in the settings.js file:

// The active theme.
drupalgap.settings.theme = {
  name: '$THEME_NAME',
  path: 'themes/$THEME_NAME'
};

3. Add some blocks to the theme's regions in the settings.js file:

drupalgap.settings.blocks[dg.config('theme').name] = {
  header: {

    // DrupalGap's administration menu block.
    admin_menu: {
      roles: [
        { target_id: 'administrator', visible: true }
      ]
    }

  },
  content: {

    // DrupalGap's page title block.
    title: { },

    // DrupalGap's "main" content block.
    main: { }

  },
  footer: {

    // The powered by DrupalGap block.
    powered_by: { }

  }
};

Created theme in $THEME_DIRECTORY, follow the 1, 2, 3 listed above to use it.

"