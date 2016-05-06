/**************|
 * Development |
 **************/

// Uncomment to clear the app's local storage cache each time the app loads.
//window.localStorage.clear();

// Set to true to see console.log() messages. Set to false when publishing app.
Drupal.settings.debug = true;

/****************************************|
 * Drupal Settings (provided by jDrupal) |
 ****************************************/

/* DRUPAL PATHS */
 
// Site Path (do not use a trailing slash)
Drupal.settings.site_path = ''; // e.g. http://www.example.com

// Default Services Endpoint Path
Drupal.settings.endpoint = 'drupalgap';

// Files Directory Paths (use one or the other)
Drupal.settings.file_public_path = 'sites/default/files';
//Drupal.settings.file_private_path = 'system/files';

// The Default Language Code
Drupal.settings.language_default = 'und';

/* CACHING AND PERFORMANCE */

// Entity Caching
Drupal.settings.cache.entity = {

  /* Globals (will be used if not overwritten below) */
  enabled: false,
  expiration: 60, // # of seconds to cache, set to 0 to cache forever

  /* Entity types */
  entity_types: {

    /* Comments */
    /*comment: {
     bundles: {}
     },*/

    /* Files */
    /*file: {
     bundles: {}
     },*/

    // Nodes
    /*node: {

      // Node Globals (will be used if not overwritten below)
      enabled: true,
      expiration: 120,

      // Content types (aka bundles)
      bundles: {

        article: {
          expiration: 3600
        },
        page: {
          enabled: false
        }

      }
    },*/

    /* Terms */
    /*taxonomy_term: {
     bundles: {}
     },*/

    /* Vocabularies */
    /*taxonomy_vocabulary: {
     bundles: {}
     },*/

    /* Users */
    /*user: {
     bundles: {}
     }*/

  }

};

/* Views Caching */

Drupal.settings.cache.views = {
  enabled: false,
  expiration: 3600
};

/*********************|
 * DrupalGap Settings |
 *********************/

// DrupalGap Mode (defaults to 'web-app')
//  'web-app' - use this mode to build a web application for a browser window
//  'phonegap' - use this mode to build a mobile application with phonegap
drupalgap.settings.mode = 'web-app';

// Language Files - locale/[language-code].json
drupalgap.settings.locale = {
   /* es: { } */
};

/*************|
 * Appearance |
 *************/

// App Title
drupalgap.settings.title = 'DrupalGap';
 
// App Front Page
drupalgap.settings.front = 'dashboard';

// Theme
drupalgap.settings.theme = 'easystreet3';

// Logo
drupalgap.settings.logo = 'themes/easystreet3/images/drupalgap.jpg';

// Offline Warning Message. Set to false to hide message.
drupalgap.settings.offline_message = 'No connection found!';

// Exit app message.
drupalgap.settings.exit_message = 'Exit ' + drupalgap.settings.title + '?';

// Loader Animations - http://demos.jquerymobile.com/1.4.0/loader/
drupalgap.settings.loader = {
  loading: {
    text: 'Loading...',
    textVisible: true,
    theme: 'b'
  },
  saving: {
    text: 'Saving...',
    textVisible: true,
    theme: 'b'
  },
  deleting: {
    text: 'Deleting...',
    textVisible: true,
    theme: 'b'
  }
};

/*****************************************|
 * Modules - http://drupalgap.org/node/74 |
 *****************************************/

/** Contributed Modules - www/app/modules **/

//Drupal.modules.contrib['example'] = {};

/** Custom Modules - www/app/modules/custom **/

//Drupal.modules.custom['my_module'] = {};

/***************************************|
 * Menus - http://drupalgap.org/node/85 |
 ***************************************/
drupalgap.settings.menus = {}; // Do not remove this line.

// User Menu Anonymous
drupalgap.settings.menus['user_menu_anonymous'] = {
  options: menu_popup_get_default_options(),
  links: [
    {
      title: 'Login',
      path: 'user/login',
      options: {
        attributes: {
          'data-icon': 'lock',
          'class': 'ui-btn ui-btn-icon-right'
        }
      }
    },
    {
      title: 'Create new account',
      path: 'user/register',
      options: {
        attributes: {
          'data-icon': 'plus'
        }
      }
    }
  ]
};

// User Menu Authenticated
drupalgap.settings.menus['user_menu_authenticated'] = {
  options: menu_popup_get_default_options(),
  links: [
    {
      title: 'My Account',
      path: 'user',
      options: {
        attributes: {
          'data-icon': 'user',
          'class': 'ui-btn ui-btn-icon-right'
        }
      }
    },
    {
      title: 'Logout',
      path: 'user/logout',
      options: {
        attributes: {
          'data-icon': 'delete'
        }
      }
    }
  ]
};

// Main Menu
drupalgap.settings.menus['main_menu'] = {
  options: menu_popup_get_default_options(),
  links: [
    {
      title:'Content',
      path:'node',
      options:{
        attributes: {
          'data-icon': 'star',
          'class': 'ui-btn ui-btn-icon-right'
        }
      }
    },
    {
      title:'Taxonomy',
      path:'taxonomy/vocabularies',
      options:{
        attributes:{
          'data-icon':'grid'
        }
      }
    },
    {
      title:'Users',
      path:'user-listing',
      options:{
        attributes:{
          'data-icon':'info'
        }
      }
    }
  ]
};

/****************************************|
 * Blocks - http://drupalgap.org/node/83 |
 ****************************************/
drupalgap.settings.blocks = {}; // Do not remove this line.

// Easy Street 3 Theme Blocks
drupalgap.settings.blocks.easystreet3 = {
  header: {
    user_menu_anonymous: {
      roles: {
        value: ['anonymous user'],
        mode: 'include',
      }
    },
    user_menu_authenticated: {
      roles: {
        value: ['authenticated user'],
        mode: 'include',
      }
    },
    main_menu: { }
  },
  sub_header: {
    title: { }
  },
  navigation: {
    primary_local_tasks: { }
  },
  content: {
    messages: { },
    main: { }
  },
  footer: {
    powered_by: { }
  }
};

/****************************************************|
 * Region Menu Links - http://drupalgap.org/node/173 |
 ****************************************************/
drupalgap.settings.menus.regions = {}; // Do not remove this line.

// Header Region Links
drupalgap.settings.menus.regions['header'] = {
  links:[
    /* Main Menu Popup Menu Button */
    {
      options: {
        popup: true,
        popup_delta: 'main_menu',
        attributes: {
          'class': 'ui-btn-left',
          'data-icon': 'bars'
        }
      }
    },
    /* Home Button */
    {
      path: '',
      options: {
        attributes: {
          'data-icon': 'home',
          'data-iconpos': 'notext',
          'class': 'ui-btn-left'
        }
      },
      pages: {
        value: [''],
        mode: 'exclude'
      }
    },
    /* Anonymous User Popup Menu Button */
    {
      options: {
        popup: true,
        popup_delta: 'user_menu_anonymous',
        attributes: {
          'class': 'ui-btn-right',
          'data-icon': 'user'
        }
      },
      roles: {
        value: ['anonymous user'],
        mode: 'include',
      }
    },
    /* Authenticated User Popup Menu Button */
    {
      options: {
        popup: true,
        popup_delta: 'user_menu_authenticated',
        attributes: {
          'class': 'ui-btn-right',
          'data-icon': 'user'
        }
      },
      roles: {
        value: ['authenticated user'],
        mode: 'include',
      }
    }
  ]
};

// Footer Region Links
drupalgap.settings.menus.regions['footer'] = {
  links: [
    /* Back Button */
    {
      options: {
        attributes: {
          'data-icon': 'back',
          'data-iconpos': 'notext',
          'class': 'ui-btn-right',
          'onclick': 'javascript:drupalgap_back();'
        }
      },
      pages: {
        value: [''],
        mode: 'exclude'
      }
    }
  ]
};

/*********|
 * Camera |
 **********/
drupalgap.settings.camera = {
  quality: 90
};

/***********************|
 * Performance Settings |
 ***********************/
drupalgap.settings.cache = {}; // Do not remove this line.

// Theme Registry - Set to true to load the page.tpl.html contents from cache.
drupalgap.settings.cache.theme_registry = true;

