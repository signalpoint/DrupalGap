/**
 * Specify your DrupalGap's Mobile Application settins here. 
 */
drupalgap.settings = {
  'site_path':'', /* e.g. http://www.example.com */
  'base_path':'/',
  'language':'und',
  'file_public_path':'sites/default/files',
  'debug':true, /* set to true to see console.log debug information */
  'front':'dashboard',
  'offline':'offline.html',
  'clean_urls':false, /* set to true if you have clean urls enabled on your site */
  'theme':'easystreet3',
  'blocks':{
    'easystreet3':{
      'navigation':['main_menu', 'user_menu'],
      'content':['main'],
      'footer':['powered_by'],
    },
  },
};
drupalgap.modules.custom = [
  /*{'name':'example'},*/
];

