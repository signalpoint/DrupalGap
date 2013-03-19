/**
 * Specify your DrupalGap's Mobile Application settins here. 
 */
drupalgap.settings = {
  'title':'DrupalGap',
  'site_path':'', /* e.g. http://www.example.com */
  'base_path':'/',
  'language':'und',
  'file_public_path':'sites/default/files',
  'debug':true, /* set to true to see console.log debug information */
  'debug_level':0, /* 0 = mild, 1 = medium (), 2 = spicy () */
  'front':'dashboard',
  'offline':'offline.html',
  'clean_urls':false, /* set to true if you have clean urls enabled on your site */
  'theme':'easystreet3',
  'blocks':{
    'easystreet3':{
      'header':['header'],
      'navigation':['user_menu'],
      'sub_navigation':['main_menu'],
      'content':['main'],
      'footer':['powered_by'],
    },
  },
};
drupalgap.modules.custom = [
  /*{'name':'example'},*/
];

