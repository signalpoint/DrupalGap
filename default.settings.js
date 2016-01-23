// jDrupal Settings.
jDrupal.settings = {

  // Drupal site settings.
  sitePath: 'http://localhost',
  basePath: '/',

  // Set to true to see debug info printed to the console.log().
  debug: true

};

// DrupalGap Settings.
drupalgap.settings = {
  mode: 'web-app'
};

// The app's front page.
drupalgap.settings.front = null;

// The active theme.
drupalgap.settings.theme = {
  name: 'ava',
  path: 'themes/ava'
};

// Drupal files directory path(s)
drupalgap.settings.files = {
  publicPath: 'sites/default/files',
  privatePath: null
};

// Blocks.
drupalgap.settings.blocks = {};

// Blocks for the "ava" theme.
drupalgap.settings.blocks.ava = {
  header: {

    // DrupalGap's administration menu block.
    admin_menu: {
      roles: [
        { target_id: 'administrator', visible: true }
      ]
    }

  },
  content: {

    // DrupalGap's "main" content block.
    main: { }

  },
  footer: { }
};
