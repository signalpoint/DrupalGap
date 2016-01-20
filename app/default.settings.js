// jDrupal Settings.
jDrupal.settings = {

  // Drupal site settings.
  sitePath: '',
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

// Blocks.
drupalgap.settings.blocks = {};

// Blocks for the "ava" theme.
drupalgap.settings.blocks.ava = {
  header: { },
  content: {

    // DrupalGap's "main" content block.
    main: { }

  },
  footer: {

    // DrupalGap's administration menu block.
    admin_menu: {
      roles: [
        { role: 'administrator', mode: 'include' }
      ]
    }

  }
};
