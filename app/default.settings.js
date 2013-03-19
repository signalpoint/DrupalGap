/**
 * Specify your DrupalGap's Mobile Application settins here. 
 */
drupalgap.settings = {
  /* Site Information */
  'title':'DrupalGap',
  'front':'dashboard',
  'offline':'offline.html',
  /* Paths */
  'site_path':'', /* e.g. http://www.example.com */
  'base_path':'/',
  'clean_urls':false, /* set to true if you have clean urls enabled on your site */
  /* Language */
  'language':'und',
  /* Files */
  'file_public_path':'sites/default/files',
  /* Debug */
  'debug':true, /* set to true to see console.log debug information */
  'debug_level':0, /* 0 = mild, 1 = medium (), 2 = spicy () */
  /* Theme */
  'theme':'easystreet3',
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
            'include':true,
          }
        },
        'user_menu_authenticated':{
          'roles':{
            'value':['authenticated user'],
            'include':true,
          }
        }
      },
      'sub_navigation':{
        'main_menu':{}
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
  },
};
drupalgap.modules.custom = [
  /*{'name':'example'},*/
];

