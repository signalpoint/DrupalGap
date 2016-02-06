// Initialize the DrupalGap JSON object and run the bootstrap.
var dg = {
  activeTheme: null, // The active theme.
  blocks: null, // Instances of blocks.
  regions: null, // Instances of regions.
  spinner: 0, // How many spinners have been thrown up.
  themes: {}, // Instances of themes.
  _title: '' // The current page title
};
// @TODO prefixing all properties above with an underscore, then use dg.get() throughout the SDK
var drupalgap = dg;

// Configuration setting defaults.
dg.settings = {
  mode: 'web-app',
  front: null,
  blocks: {}
};

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
dg.devicereadyGood = function(data) {
  // Pull out any important data from the Connect resource results.
  for (var d in data.drupalgap) {
    if (!data.drupalgap.hasOwnProperty(d)) { continue; }
    drupalgap[d] = data.drupalgap[d];
  }
  // Force a check on the router (which is already listening at this point), to
  // refresh the current page or navigate to the current path.
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
    if (!modules.hasOwnProperty(module) || !modules[module].routing) { continue; }
    var routes = modules[module].routing();
    if (!routes) { continue; }
    for (route in routes) {
      if (!routes.hasOwnProperty(route)) { continue; }
      var item = routes[route];
      item.key = route;
      dg.router.add(item);
    }
  }

  // Load the theme, then the blocks, and then add a default route, and start listening.
  dg.themeLoad().then(function() {
      var blocks = dg.blocksLoad();
      dg.router.add(function() { }).listen();
  });

};

dg.spinnerShow = function() {
  dg.spinner++;
  if (dg.spinner == 1) { document.getElementById('dgSpinner').style.display = 'block'; }
};
dg.spinnerHide = function() {
  dg.spinner--;
  if (!dg.spinner) { document.getElementById('dgSpinner').style.display = 'none'; }
};