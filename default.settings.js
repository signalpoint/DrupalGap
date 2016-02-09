/**
 * jDrupal Settings.
 * @see http://jdrupal.easystreet3.com
 */
jDrupal.settings = {

  // Drupal site settings.
  sitePath: '',
  basePath: '/',

  // Set to true to see debug info printed to the console.log().
  debug: true

};

// App mode.
dg.settings.mode = 'web-app'; // web-app or phonegap

// App title.
dg.settings.title = 'DrupalGap';

// App front page.
dg.settings.front = null;

// App logo (render element).
/*dg.settings.logo = {
  _theme: 'image',
  _path: 'modules/custom/my_module/images/logo.jpg' // or http://example.com/logo.jpg
};*/

/**
 * The active theme.
 * @see http://docs.drupalgap.org/8/Themes
 */
dg.settings.theme = {
  name: 'ava',
  path: 'themes/ava'
};

// Drupal files directory path(s).
dg.settings.files = {
  publicPath: 'sites/default/files',
  privatePath: null
};

/**
 * Blocks for the active theme.
 * @see http://docs.drupalgap.org/8/Blocks
 */
dg.settings.blocks[dg.config('theme').name] = {
  header: {

    // DrupalGap's logo block.
    //logo: { },

    // DrupalGap's main menu block.
    main_menu: { },

    // The user login form provided by DrupalGap.
    user_login: {
      _roles: [
        { target_id: 'anonymous', visible: true }
      ]
    },

    // The user menu provided by DrupalGap.
    user_menu: {
      _roles: [
        { target_id: 'authenticated', visible: true }
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

    // DrupalGap's administration menu block.
    admin_menu: {
      _roles: [
        { target_id: 'administrator', visible: true }
      ]
    },

    // The powered by DrupalGap block.
    powered_by: { }

  }
};
