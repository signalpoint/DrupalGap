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
drupalgap.front = null;
drupalgap.settings.theme = {
  name: 'ava',
  path: 'themes/ava'
};
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

// Contrib modules.
//jDrupal.modules['example'] = {
//  path: 'app/modules/contrib/example'
//};

// Custom modules.
//jDrupal.modules['my_module'] = {
//  path: 'app/modules/custom/my_module'
//};