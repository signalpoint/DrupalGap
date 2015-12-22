// Initialize the DrupalGap JSON object and run the bootstrap.
var dg = {}; var drupalgap = dg;

dg.activeTheme = null;
dg.regions = null; // Holds instances of regions.
dg.blocks = null; // Holds instances of blocks.

// Configuration setting defaults.
dg.settings = {
  mode: 'web-app',
  front: null,
  blocks: {}
};

/**
 * Get or set a drupalgap configuration setting.
 * @param name
 * @returns {*}
 */
dg.config = function(name) {
  var value = arguments[1] ? arguments[1] : null;
  if (value) {
    dg.settings[name] = value;
    return;
  }
  return dg.settings[name];
};

// Mode.
dg.getMode = function() { return this.config('mode'); };
dg.setMode = function(mode) { this.config('mode', mode); };

// Start.
dg.start = function() {
  if (dg.getMode() == 'phonegap') {
    document.addEventListener('deviceready', dg.deviceready, false);
  }
  else { dg.deviceready(); } // web-app
};

// Device ready.
dg.deviceready = function() {
  dg.bootstrap();
  if (!jDrupal.isReady()) {
    dg.alert('Set the sitePath in the settings.js file!');
    return;
  }
  //jDrupal.moduleInvokeAll('deviceready');
  jDrupal.connect().then(this.devicereadyGood, this.devicereadyBad);
};
dg.devicereadyGood = function() {
  //jDrupal.moduleInvokeAll('device_connected');
  dg.router.check(dg.router.getFragment());
};
dg.devicereadyBad = function() {
  var note = 'Failed connection to ' + jDrupal.sitePath();
  if (msg != '') { note += ' - ' + msg; }
  dg.alert(note, {
    title: 'Unable to Connect',
    alertCallback: function() { }
  });
};

// Bootstrap.
dg.bootstrap = function() {

  jDrupal.modules['dgSystem'] = { };
  jDrupal.modules['dgUser'] = { };

  dg.router.config({
    //mode: 'history',
    //root: 'discasaurus.com'
  });

  // Build the routes.
  // @TODO turn route building into promises.
  // @TODO turn the outer portion of this procedure into a re-usable function
  // that can iterate over modules and call a specific function within that
  // module.
  var modules = jDrupal.modulesLoad();
  for (var module in modules) {
    if (!modules.hasOwnProperty(module) || !window[module].routing) { continue; }
    var routes = window[module].routing();
    if (!routes) { continue; }
    for (route in routes) {
      if (!routes.hasOwnProperty(route)) { continue; }
      var item = routes[route];
      dg.router.add(item);
    }
  }

  // Load the theme.
  dg.themeLoad().then(function() {

    //dg.blocksLoad().then(function(blocks) {

      var blocks = dg.blocksLoad();

      // Add a default route, and start listening.
      dg.router.add(function() { }).listen();

    //});



  });

};