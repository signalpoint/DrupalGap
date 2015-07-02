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
    // @WARNING Synchronous XMLHttpRequest on the main thread is deprecated.
    // @TODO allow a developer mode to live sync the drupalgap.json contents using an api key
    var json = JSON.parse(dg_file_get_contents('app/js/drupalgap.json'));
    for (var name in json) {
      if (!json.hasOwnProperty(name)) { continue; }
      drupalgap[name] = json[name];
    }
    drupalgap_load_blocks(drupalgapSettings);
    drupalgap_load_menus(drupalgapSettings);
  }
  catch (error) { console.log('drupalgap_onload - ' + error); }
}
