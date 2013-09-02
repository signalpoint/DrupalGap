/* Specify DrupalGap Mobile Application Settings Here */
drupalgap.settings = {};

/***************|
 * Drupal Paths |
 ***************/
 
// Site Path
drupalgap.settings.site_path = ''; // e.g. http://www.example.com

// Base Path
drupalgap.settings.base_path = '/';

// Default Services Endpoint Path
drupalgap.settings.default_services_endpoint = 'drupalgap';

// Public Files Directory Path
drupalgap.settings.file_public_path = 'sites/default/files';

// Clean URLs (optional)
drupalgap.settings.clean_urls = false; // Setting to false is recommended.

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

// Language
drupalgap.settings.language = 'und';

// Loading Animation - http://view.jquerymobile.com/1.3.2/dist/demos/widgets/loader/
drupalgap.settings.loading = {
  text: 'Loading...',
  textVisible: true,
  theme:'a'
};

/*****************************************|
 * Modules - http://drupalgap.org/node/74 |
 *****************************************/

// Contributed Modules - www/app/modules
drupalgap.modules.contrib = [
  /*{name:'example'},*/
];

// Custom Modules - www/app/modules/custom
drupalgap.modules.custom = [
  /*{name:'example'},*/
];

/***************************************|
 * Menus - http://drupalgap.org/node/85 |
 ***************************************/
drupalgap.settings.menus = {};

// User Menu Anonymous
drupalgap.settings.menus['user_menu_anonymous'] = {
  links:[
    {title:'Login','path':'user/login'},
    {title:'Register','path':'user/register'}
  ]
};

// User Menu Authenticated
drupalgap.settings.menus['user_menu_authenticated'] = {
  links:[
    {title:'My Account','path':'user'},
    {title:'Logout','path':'user/logout'}
  ]
};

// Main Menu
drupalgap.settings.menus['main_menu'] = {
  links:[
    {
      title:'Content',
      path:'node',
      options:{
        attributes:{
          'data-icon':'star'
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
drupalgap.settings.blocks = {};

// Easy Street 3 Theme Blocks
drupalgap.settings.blocks.easystreet3 = {
  header:{
    title:{}
  },
  navigation:{
    user_menu_anonymous:{
      roles:{
        value:['anonymous user'],
        mode:'include',
      }
    },
    user_menu_authenticated:{
      roles:{
        value:['authenticated user'],
        mode:'include',
      }
    }
  },
  sub_navigation:{
    main_menu:{
      roles:{
        value:['administrator'],
        mode:'include',
      }
    },
    primary_local_tasks:{},
  },
  content:{
    main:{}
  },
  footer:{
    powered_by:{}
  }
};

/****************************************************|
 * Region Menu Links - http://drupalgap.org/node/173 |
 ****************************************************/
drupalgap.settings.menus.regions = {};

// Header Region Links
drupalgap.settings.menus.regions['header'] = {
  links:[
    /* Home Button */
    {
      title:'Home',
      path:'',
      options:{
        attributes:{
          "data-icon":"home",
          "class":"ui-btn-left"
        }
      },
      pages:{
        value:[''],
        mode:"exclude"
      }
    },
    /* Back Button */
    {
      title:'Back',
      options:{
        attributes:{
          "data-icon":"back",
          "class":"ui-btn-right",
          "onclick":"javascript:drupalgap_back();"
        }
      },
      pages:{
        value:[''],
        mode:"exclude"
      }
    }
  ]
};

/*********|
 * Camera |
 **********/
drupalgap.settings.camera = {
  quality:50
};

/**************|
 * Development |
 **************/

// Debug
drupalgap.settings.debug = false; /* Set to true to see console.log debug
                                     information. Set to false when publishing
                                     app! */

// Debug Level
drupalgap.settings.debug_level = 0; /* 0 = mild, just a little debugging
                                       1 = medium
                                       2 = spicy, lots of debugging */

/***********************|
 * Performance Settings |
 ***********************/
drupalgap.settings.cache = {};

// Theme Registry - Set to true to load the page.tpl.html contents from cache.
drupalgap.settings.cache.theme_registry = true;

// Entities - Allow entities retrieved from the Drupal server to be cached on
//            the mobile device using local storage.
drupalgap.settings.cache.entity = {
  enabled:true,   /* Set to true to enable entity local storage caching. */
  expiration:3600 /* Number of seconds before cached copy of entity expires. Set
                     to 0 to cache forever, set to 60 for one minute, etc. */
};

