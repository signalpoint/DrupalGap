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
  front: null, // The front page
  mode: 'web-app', // The app mode, web-app or phonegap
  title: 'DrupalGap'
};

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

    // DrupalGap's main menu block.
    main_menu: { }

  },
  content: {

    // DrupalGap's page title block.
    title: { },

    // DrupalGap's "main" content block.
    main: { }

  },
  footer: {

    // DrupalGap's administration menu block.
    admin_menu: {
      roles: [
        { target_id: 'administrator', visible: true }
      ]
    },

    // The powered by DrupalGap block.
    powered_by: { }

  }
};
