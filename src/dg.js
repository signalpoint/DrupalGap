// Initialize the DrupalGap JSON object and run the bootstrap.
var drupalgap = {};

// Mode.
drupalgap.getMode = function() {
  return typeof drupalgap.settings.mode !== 'undefined' ?
    drupalgap.settings.mode : 'web-app';
};
drupalgap.setMode = function(mode) { drupalgap.settings.mode = mode; };

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
      drupalgap.goto('');
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

  this.router.config({
    //mode: 'history',
    //root: 'discasaurus.com'
  });

  // Build the routes.
  var modules = jDrupal.modulesLoad();
  for (var module in modules) {
    if (!modules.hasOwnProperty(module)) { continue; }
    var routes = window[module].routing();
    if (!routes) { continue; }
    for (route in routes) {
      if (!routes.hasOwnProperty(route)) { continue; }
      var item = routes[route];
      this.router.add(item.path, item.defaults._controller);
    }
  }

  //var routing = jDrupal.moduleInvokeAll('routing');
  //for (var i = 0; i < routing.length; i++) {
  //  for (var route in routing[i]) {
  //    if (!routing[i].hasOwnProperty(route)) { continue; }
  //    drupalgap.router.add(routing[i][route].path + '/');
  //  }
  //}
  // Add the default route, and start listening.
  this.router.add(function() {
    console.log('default');
  }).listen();

};