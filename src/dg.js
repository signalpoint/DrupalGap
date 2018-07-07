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
  _libraries: {}, // Tracks which libraries have been loaded.
  _messages: [] // An array of individual message render elements to be displayed within the messages block.
};
// @TODO prefix all properties above with an underscore, then use dg.get() throughout the SDK.
var drupalgap = dg;

// Configuration setting defaults.
dg.settings = {
  mode: 'web-app',
  front: null,
  blocks: {}
};

/**
 * Starts the DrupalGap 8 SDK.
 */
dg.start = function() {

  // If we're in a compiled app, attach our deviceready handler as cordova's deviceready listener, otherwise just call
  // our deviceready handler to start the web application.
  if (dg.isCompiled()) { document.addEventListener('deviceready', dg.deviceready, false); }
  else { dg.deviceready(); } // web-app

};

/**
 * Handles the moment the device is ready by running the bootstrap, then invoking hook_deviceready() to see if any
 * developer wants to take over the "deviceready" process themselves, and often times no one does so by default we make
 * a Connect call to jDrupal, and upon connection simply continue onward by forcing a route change to the front page.
 */
dg.deviceready = function() {

  dg.bootstrap();

  // Invoke hook_deviceready().
  jDrupal.moduleInvokeAll('deviceready').then(function() {

    // If no one implemented the hook, continue gracefully.
    if (!jDrupal.moduleImplements('deviceready') && !dg._continued) {
      jDrupal.connect().then(dg.continue, function() {
        console.log('deviceready connect failed', arguments);
      });
    }

  });
};

/**
 * Assembles routes, loads up the theme and then tells the router to start listening for activity.
 */
dg.bootstrap = function() {

  dg.router.config({});

  // Assemble the routes provided by each module.
  var modules = jDrupal.modulesLoad();
  for (var module in modules) {
    if (!modules.hasOwnProperty(module)) { continue; }

    // Get the routes for this module.
    var routes = dg.getModuleRoutes(module);
    if (routes) {
      for (var route in routes) {
        if (!routes.hasOwnProperty(route)) { continue; }

        // Get the route item and add it to the router.
        var item = routes[route];
        item.key = route;
        dg.router.add(item);

        // If the route item has a base route specified, add the route item as a child of the base route.
        var baseRoute = dg.router.getBaseRoute(item);
        if (baseRoute) { dg.router.saveAsChildRoute(item, baseRoute); }
      }
    }

  }

  // If there's no front page specified, set it to the default dg dashboard.
  if (!dg.config('front')) { dg.config('front', 'dg'); }

  // LIBRARIES - Gather libraries provided by modules.
  // @TODO Give modules a chance to alter libraries provided by other modules.
  // In order to accommodate this, the dg._libraries object needs to be filled here during the bootstrap, but the
  // libraries need to have a boolean property to indicate if it's been loaded or not, then dg.render() can set this
  // boolean to true when the "onload" is complete.
  //var libraries = dg.getModuleLibraries(module);
  //if (libraries) {
  //  console.log(module + ' libraries', libraries);
  //  for (var libraryName in libraries) {
  //    if (!libraries.hasOwnProperty(libraryName)) { continue; }
  //    var library = libraries[libraryName];
  //  }
  //}
  //jDrupal.moduleInvokeAll('libraries_alter', dg.getModuleLibraries());

  // Load the theme, then the blocks, and then add a default route, and start listening.
  dg.themeLoad().then(function() {
    dg.blocksLoad();
    jDrupal.moduleInvokeAll('init').then(function() {
      dg.router.add(function() {}).listen();
    });
  });

};

/**
 * Forces a check on the router to refresh the current page or navigate to the current path.
 */
dg.continue = function() {

  dg._continued = true;
  dg.router.check(dg.router.getPath());
};

/**
 * SPINNER
 */
dg.spinnerShow = function() {
  dg.spinner++;
  //if (dg.spinner == 1) { document.getElementById('dgSpinner').style.display = 'block'; }
};
dg.spinnerHide = function() {
  dg.spinner--;
  //if (!dg.spinner) { document.getElementById('dgSpinner').style.display = 'none'; }
};
