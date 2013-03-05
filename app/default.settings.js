/**
 * Specify your DrupalGap's Mobile Application settins here. 
 */
drupalgap.settings = {
  'site_path':'', /* e.g. http://www.drupalgap.org */
  'base_path':'/',
  'language':'und',
  'theme':'easystreet3',
  'front':'dashboard',
  'offline':'offline.html',
  'file_public_path':'sites/default/files',
  'clean_urls':false, /* set to true if you have clean urls enabled on your site */
  'debug':true, /* set to true to see console.log debug information */
  'blocks':{ /* blocks configuration */
    'easystreet3':{  /* easystreet3 theme region blocks */
      'navigation':['main_menu', 'user_menu'], /* navigation region blocks */
    },
  },
};
drupalgap.modules.custom = [
  /*{'name':'example'},*/
];

