/*! drupalgap 2015-12-13 */
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

  jDrupal.modules['dgUser'] = { };

  this.router.config({
    //mode: 'history',
    //root: 'discasaurus.com'
  });

  // Build the routes.
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

  console.log(this.router.getRoutes());

};
drupalgap.Form = function() {
  this.form_id = null;
};

drupalgap.Form.prototype.getFormId = function() {
  return null;
};
drupalgap.goto = function(path) {
  //this.router.navigate('/about');
};
/**
 * Alerts a message to the user using PhoneGap's alert. It is important to
 * understand this is an async function, so code will continue to execute while
 * the alert is displayed to the user.
 * You may optionally pass in a second argument as a JSON object with the
 * following properties:
 *   alertCallback - the function to call after the user presses OK
 *   title - the title to use on the alert box, defaults to 'Alert'
 *   buttonName - the text to place on the button, default to 'OK'
 * @param {String} message
 */
drupalgap.alert = function(message) {
  var options = null;
  if (arguments[1]) { options = arguments[1]; }
  var alertCallback = function() { };
  var title = 'Alert';
  var buttonName = 'OK';
  if (options) {
    if (options.alertCallback) { alertCallback = options.alertCallback; }
    if (options.title) { title = options.title; }
    if (options.buttonName) { buttonName = options.buttonName; }
  }
  if (
    drupalgap.getMode() != 'phonegap' ||
    typeof navigator.notification === 'undefined'
  ) { alert(message); alertCallback(); }
  else {
    navigator.notification.alert(message, alertCallback, title, buttonName);
  }
};
drupalgap.Module = function() {

};

// Extend the jDrupal Module prototype.
drupalgap.Module.prototype = new jDrupal.Module;
drupalgap.Module.prototype.constructor = drupalgap.Node;

/**
 *
 * @returns {null}
 */
drupalgap.Module.prototype.routing = function() {
  return null;
};
// @see http://krasimirtsonev.com/blog/article/A-modern-JavaScript-router-in-100-lines-history-api-pushState-hash-url

drupalgap.router = {
  routes: [],
  mode: null,
  root: '/',
  config: function(options) {
    this.mode = options && options.mode && options.mode == 'history'
    && !!(history.pushState) ? 'history' : 'hash';
    this.root = options && options.root ? '/' + this.clearSlashes(options.root) + '/' : '/';
    return this;
  },
  getFragment: function() {
    var fragment = '';
    if(this.mode === 'history') {
      fragment = this.clearSlashes(decodeURI(location.pathname + location.search));
      fragment = fragment.replace(/\?(.*)$/, '');
      fragment = this.root != '/' ? fragment.replace(this.root, '') : fragment;
    } else {
      var match = window.location.href.match(/#(.*)$/);
      fragment = match ? match[1] : '';
    }
    return this.clearSlashes(fragment);
  },
  clearSlashes: function(path) {
    return path.toString().replace(/\/$/, '').replace(/^\//, '');
  },
  //add: function(re, handler) {
  //  if(typeof re == 'function') {
  //    handler = re;
  //    re = '';
  //  }
  //  this.routes.push({ re: re, handler: handler });
  //  return this;
  //},
  add: function(item) {
    this.routes.push(item);
    return this;
  },
  remove: function(param) {
    for(var i=0, r; i<this.routes.length, r = this.routes[i]; i++) {
      if(r.path.toString() === param.toString()) {
        this.routes.splice(i, 1);
        return this;
      }
    }
    return this;
  },
  flush: function() {
    this.routes = [];
    this.mode = null;
    this.root = '/';
    return this;
  },
  check: function(f) {
    //var fragment = f || this.getFragment();
    var fragment = f || this.getFragment();
    fragment = this.root + fragment;
    for(var i=0; i<this.routes.length; i++) {
      var match = fragment.match(this.routes[i].path);
      if(match) {
        match.shift();

        console.log(this.routes[i]);

        // Handle forms.
        if (this.routes[i].defaults._form) {
          var form = new window[this.routes[i].defaults._form];
          console.log(form);
        }

        // Default routing.
        else {
          this.routes[i].defaults._controller.apply({}, [
            {
              success: function(content) {
                document.getElementById('dg-app').innerHTML = content;
              }
            }
          ]);
        }

        return this;
      }
    }
    return this;
  },
  listen: function() {
    var self = this;
    var current = self.getFragment();
    var fn = function() {
      if(current !== self.getFragment()) {
        current = self.getFragment();
        self.check(current);
      }
    };
    clearInterval(this.interval);
    this.interval = setInterval(fn, 50);
    return this;
  },
  navigate: function(path) {
    path = path ? path : '';
    if(this.mode === 'history') {
      var hPath = this.root + this.clearSlashes(path);
      history.pushState(
        null,
        null,
        hPath
      );
    } else {
      window.location.href = window.location.href.replace(/#(.*)$/, '') + '#' + path;
    }
    return this;
  },
  getRoutes: function() {
    return this.routes;
  }
};
var UserLoginForm = function() {
  this.id = 'UserLoginForm';

  this.buildForm = function(form, form_state) {
    form.name = {
      _type: 'textfield',
      _required: true
    };
  };

  this.submitForm = function(form, form_state) {

  };

};

// Extend the form prototype and attach our constructor.
UserLoginForm.prototype = new drupalgap.Form;
UserLoginForm.constructor = UserLoginForm;
dgUser = new drupalgap.Module();

dgUser.routing = function() {
  var routes = {};
  routes["user.login"] = {
    "path": "/user/login",
    "defaults": {
      "_form": 'UserLoginForm',
      "_title": "Log in"
    },
    "requirements": {
      "_user_is_logged_in": true
    }
  };
  return routes;
};
