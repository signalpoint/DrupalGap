// Initialize the DrupalGap JSON object.
var dg = {
  activeTheme: null, // The active theme.
  blocks: null, // Instances of blocks.
  regions: null, // Instances of regions.
  spinner: 0, // How many spinners have been thrown up.
  themes: {}, // Instances of themes.
  _title: '', // The current page title,
  _continued: false, // A marker to indicate when dg.continue() has been called at least once
  _postRenderMax: 128, // The max allowed post renders functions in the queue.
  _messages: [], // An array of individual message render elements to be displayed within the messages block.
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
  if (dg.isCompiled()) {
    document.addEventListener('deviceready', dg.deviceready, false);
  }
  else { dg.deviceready(); } // web-app
};

// Continue.
dg.continue = function() {
  // Force a check on the router (which is already listening at this point), to
  // refresh the current page or navigate to the current path.
  dg._continued = true;
  dg.router.check(dg.router.getPath());
};

// Device ready.
dg.deviceready = function() {
  // @TODO, we'll probably want a hook_bootstrap() that can resolve with a Promise.
  dg.bootstrap();

  // Invoke hook_deviceready()...
  jDrupal.moduleInvokeAll('deviceready').then(function() {

    // If no one implemented the hook, continue gracefully.
    if (!jDrupal.moduleImplements('deviceready') && !dg._continued) {
      jDrupal.connect().then(dg.continue, function() {
        console.log('deviceready connect failed', arguments);
      });
    }

  });
};
//dg.devicereadyGood = function(data) {
//
//  // Pull out any important data from the Connect resource results.
//  // @TODO move this to a jDrupal connect post processor
//  if (data) {
//    for (var d in data.drupalgap) {
//      if (!data.drupalgap.hasOwnProperty(d)) { continue; }
//      drupalgap[d] = data.drupalgap[d];
//    }
//  }
//
//
//};

// Bootstrap.
dg.bootstrap = function() {

  dg.router.config({});

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
      var baseRoute = dg.router.getBaseRoute(item);
      if (baseRoute) {
        if (!dg.router.hasChildRoutes(baseRoute)) { dg.router.initChildRoutes(baseRoute); }
        dg.router.addChildRoute(baseRoute, item.key);
        dg.router.saveRoute(baseRoute.key, baseRoute);
      }
    }
  }

  // If there's no front page specified, set it to the default dg dashboard.
  if (!dg.config('front')) { dg.config('front', 'dg'); }

  // Load the theme, then the blocks, and then add a default route, and start listening.
  dg.themeLoad().then(function() {
      var blocks = dg.blocksLoad();
    jDrupal.moduleInvokeAll('init').then(function() {
      dg.router.add(function() {}).listen();
    });
  });

};

dg.spinnerShow = function() {
  dg.spinner++;
  //if (dg.spinner == 1) { document.getElementById('dgSpinner').style.display = 'block'; }
};
dg.spinnerHide = function() {
  dg.spinner--;
  //if (!dg.spinner) { document.getElementById('dgSpinner').style.display = 'none'; }
};
