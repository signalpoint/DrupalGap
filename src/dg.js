// Initialize the DrupalGap JSON object and run the bootstrap.
var drupalgap = { };

// Configuration setting defaults.
drupalgap.settings = {
  mode: 'web-app',
  front: null
};

/**
 * Get or set a drupalgap configuration setting.
 * @param name
 * @returns {*}
 */
drupalgap.config = function(name) {
  var value = arguments[1] ? arguments[1] : null;
  if (value) {
    drupalgap.settings[name] = value;
    return;
  }
  return drupalgap.settings[name];
};

// Mode.
drupalgap.getMode = function() {
  return this.config('mode');
  //typeof drupalgap.settings.mode !== 'undefined' ?
    //drupalgap.settings.mode : 'web-app';
};
drupalgap.setMode = function(mode) {
  this.config('mode', mode);
};

// Start.
drupalgap.start = function() {
  // If we're using PhoneGap then attach their listener, otherwise proceed
  // as a web app.
  if (drupalgap.getMode() == 'phonegap') {
    document.addEventListener('deviceready', this.deviceready, false);
  }
  else { this.deviceready(); }
};

// Device ready.
drupalgap.deviceready = function() {
  this.bootstrap();
  if (!jDrupal.isReady()) {
    this.alert('Set the sitePath in the settings.js file!');
    return;
  }
  jDrupal.moduleInvokeAll('deviceready');
  var options = this.devicereadyOptions();
  jDrupal.connect(options);
};

// Device ready options.
drupalgap.devicereadyOptions = function() {
  return {
    success: function() {
      jDrupal.moduleInvokeAll('device_connected');
      drupalgap.router.check(drupalgap.router.getFragment());
    },
    error: function(xhr, status, msg) {
      var note = 'Failed connection to ' + jDrupal.sitePath();
      if (msg != '') { note += ' - ' + msg; }
      drupalgap.alert(note, {
        title: 'Unable to Connect',
        alertCallback: function() { }
      });
    }
  };
};

// Bootstrap.
drupalgap.bootstrap = function() {

  jDrupal.modules['dgUser'] = { };

  this.router.config({
    //mode: 'history',
    //root: 'discasaurus.com'
  });

  // Build the routes.
  // @TODO turn the outer portion of this procedure into a re-usable function
  // that can iterate over modules and functions within that module.
  var modules = jDrupal.modulesLoad();
  for (var module in modules) {
    if (!modules.hasOwnProperty(module) || !window[module].routing) { continue; }
    var routes = window[module].routing();
    if (!routes) { continue; }
    for (route in routes) {
      if (!routes.hasOwnProperty(route)) { continue; }
      var item = routes[route];
      //this.router.add(item.path, item.defaults._controller, item);
      this.router.add(item);
    }
  }

  // Add the default route, and start listening.
  this.router.add(function() {
    console.log('default');
  }).listen();

  console.log(this.router.getRoutes());

};