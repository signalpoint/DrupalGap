/**
 * Specify your DrupalGap's Mobile Application settings here. 
 */
drupalgap.settings = {
  
  /* Paths */
  'site_path':'', /* e.g. http://www.example.com */
  'base_path':'/',
  'default_services_endpoint':'drupalgap',
  'clean_urls':false, /* set to true if you have clean urls enabled on your site */
  
  /* App Title */
  'title':'DrupalGap',
  
  /* App Front Page */
  'front':'dashboard',
  
  /* Language */
  'language':'und',
  
  /* Files */
  'file_public_path':'sites/default/files',
  
  /* Debug */
  'debug':false, /* Set to true to see console.log debug information. Set to
                   false when publishing app! */
  'debug_level':0, /* 0 = mild, 1 = medium (), 2 = spicy () */
  
  /* Theme */
  'theme':'easystreet3',
  
  /* Logo */
  'logo':'themes/easystreet3/images/drupalgap.jpg',
  
  /* Cache Performance Settings */
  'cache':{
    
    /* Set to true to load the page.tpl.html contents from cache */
    theme_registry:true,
    
    /* Allow entities retrieved from the Drupal server to be cached on the
       device using local storage.  */
    entity:{
      enabled:true, /* Set to true to enable entity local storage caching. */
      expiration:3600 /* Number of seconds before cached copy of entity expires. 
                       Set to 0 to cache forever, set to 60 for one minute, etc.  */
    },

  },
  
  /* Blocks */
  'blocks':{
    'easystreet3':{
      'header':{
        'header':{}
      },
      'navigation':{
        'user_menu_anonymous':{
          'roles':{
            'value':['anonymous user'],
            'mode':'include',
          }
        },
        'user_menu_authenticated':{
          'roles':{
            'value':['authenticated user'],
            'mode':'include',
          }
        }
      },
      'sub_navigation':{
        'main_menu':{
          'roles':{
            'value':['administrator'],
            'mode':'include',
          }
        },
        'primary_local_tasks':{},
      },
      'content':{
        'main':{}
      },
      'footer':{
        'powered_by':{}
      },
    },
  },
  
  /* Menus */
  'menus':{
    'main_menu':{
      'links':[
        {'title':'Content','path':'node','options':{'attributes':{'data-icon':'star'}}},
        {'title':'Taxonomy','path':'taxonomy/vocabularies','options':{'attributes':{'data-icon':'grid'}}},
        {'title':'Users','path':'user-listing','options':{'attributes':{'data-icon':'info'}}},
      ],
    },
    'user_menu_anonymous':{
      'links':[
        {'title':'Login','path':'user/login'},
        {'title':'Register','path':'user/register'},
      ],
    },
    'user_menu_authenticated':{
      'links':[
        {'title':'My Account','path':'user'},
        {'title':'Logout','path':'user/logout'},
      ],
    },
    /* Region menu links. */
    'regions':{
      'header':{
        'links':[
          /* Home Button */
          {
            'title':'Home',
            'path':'',
            "options":{"attributes":{"data-icon":"home", "class":"ui-btn-left"}},
            "pages":{
              "value":[''],
              "mode":"exclude",
            }
          },
          /* Back Button */
          {
            'title':'Back',
            "options":{
              "attributes":{
                "data-icon":"back",
                "class":"ui-btn-right",
                "onclick":"javascript:drupalgap_back();"
              }
            },
            "pages":{
              "value":[''],
              "mode":"exclude",
            }
          }
        ],
      },
    }
  },
};

/* Custom Modules */
drupalgap.modules.custom = [
  /*{'name':'example'},*/
];

/* Contrib Modules */
drupalgap.modules.contrib = [
  /*{'name':'example'},*/
];

