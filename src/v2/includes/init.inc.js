dgApp.config(function(drupalgapSettings) {

  //dpm('config() - initializing...');
  //console.log(arguments);

  // @WARNING only certain providers like constants are available here, no scope
  // or values available here...
  
  drupalgap_onload(drupalgapSettings);

});

/**
 *
 */
function drupalgap_onload(drupalgapSettings) {
  try {
    drupalgap_load_blocks(drupalgapSettings);
    drupalgap_load_menus(drupalgapSettings);
  }
  catch (error) { console.log('drupalgap_onload - ' + error); }
}
