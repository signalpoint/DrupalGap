/*! drupalgap 2015-12-14 */
// Initialize the DrupalGap JSON object and run the bootstrap.
var dg = {}; var drupalgap = dg;

// Configuration setting defaults.
dg.settings = {
  mode: 'web-app',
  front: null
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
dg.getMode = function() {
  return this.config('mode');
  //typeof dg.settings.mode !== 'undefined' ?
    //dg.settings.mode : 'web-app';
};
dg.setMode = function(mode) {
  this.config('mode', mode);
};

// Start.
dg.start = function() {
  // If we're using PhoneGap then attach their listener, otherwise proceed
  // as a web app.
  if (dg.getMode() == 'phonegap') {
    document.addEventListener('deviceready', this.deviceready, false);
  }
  else { this.deviceready(); }
};

// Device ready.
dg.deviceready = function() {
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
dg.devicereadyOptions = function() {
  return {
    success: function() {
      jDrupal.moduleInvokeAll('device_connected');
      dg.router.check(dg.router.getFragment());
    },
    error: function(xhr, status, msg) {
      var note = 'Failed connection to ' + jDrupal.sitePath();
      if (msg != '') { note += ' - ' + msg; }
      dg.alert(note, {
        title: 'Unable to Connect',
        alertCallback: function() { }
      });
    }
  };
};

// Bootstrap.
dg.bootstrap = function() {

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
      this.router.add(item);
    }
  }

  // Add a default route, and start listening.
  this.router.add(function() { }).listen();

};
/**
 * Given a string separated by underscores or hyphens, this will return the
 * camel case version of a string. For example, given "foo_bar" or "foo-bar",
 * this will return "fooBar".
 * @see http://stackoverflow.com/a/2970667/763010
 */
dg.getCamelCase = function(str) {
  return str.replace(/[-_]([a-z])/g, function (g) { return g[1].toUpperCase(); });
};

/**
 *
 */
dg.killCamelCase = function(str, separator) {
  return jDrupal.lcfirst(str).replace(/([A-Z])/g, separator + '$1');
};

function theme_actions(variables) {
  var html = '';
  for (prop in variables) {
    if (!dg.isFormElement(prop, variables)) { continue; }
    html += dg.render(variables[prop]);

  }
  return html;
}
function theme_password(variables) {
  variables._attributes.type = 'password';
  return '<input ' + dg.attributes(variables._attributes) + ' />';
}
function theme_submit(variables) {
  variables._attributes.type = 'submit';
  var value = 'Submit';
  if (!variables._attributes.value) {
    if (typeof variables._value !== 'undefined') {
      value = variables._value
    }
  }
  variables._attributes.value = value;
  return '<input ' + dg.attributes(variables._attributes) + '/>';
}
function theme_textfield(variables) {
  variables._attributes.type = 'text';
  return '<input ' + dg.attributes(variables._attributes) + '/>';
}
dg.Form = function(id) {
  this.id = id;
  this.form = {
    _attributes: {
      id: dg.killCamelCase(id, '-').toLowerCase()
    }
  };
  this.form_state = {};
};

dg.Form.prototype.getFormId = function() {
  return this.id;
};

dg.Form.prototype.getForm = function(options) {
  var self = this;
  self.buildForm(self.form, self.form_state, {
    success: function() {
      for (var element in self.form) {
        if (!dg.isFormElement(element, self.form)) { continue; }
        var attrs = self.form[element]._attributes ? self.form[element]._attributes : {};
        if (!attrs.id) { attrs.id = 'edit-' + element; }
        if (!attrs.name) { attrs.name = element; }
        self.form[element]._attributes = attrs;
      }
      options.success('<form ' + dg.attributes(self.form._attributes) + '>' +
        dg.render(self.form) +
      '</form>');
    }
  });
};

dg.Form.prototype.buildForm = function(form, form_state, options) {
  options.success();
};

dg.isFormElement = function(prop, obj) {
  return obj.hasOwnProperty(prop) && prop.charAt(0) != '_';
};
dg.isFormProperty = function(prop, obj) {
  return obj.hasOwnProperty(prop) && prop.charAt(0) == '_';
};
dg.goto = function(path) {
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
dg.alert = function(message) {
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
    dg.config('mode') != 'phonegap' ||
    typeof navigator.notification === 'undefined'
  ) { alert(message); alertCallback(); }
  else {
    navigator.notification.alert(message, alertCallback, title, buttonName);
  }
};
dg.Module = function() {

};

// Extend the jDrupal Module prototype.
dg.Module.prototype = new jDrupal.Module;
dg.Module.prototype.constructor = dg.Module;

/**
 *
 * @returns {null}
 */
dg.Module.prototype.routing = function() {
  return null;
};
dg.render = function(content) {
  try {
    var type = typeof content;
    if (type === 'string') { return content; }
    var html = '';
    var _html = null;
    if (type === 'object') {
      var prefix = content._prefix ? content._prefix : '';
      var suffix = content._suffix ? content._suffix : '';
      if (content._markup) {
        return prefix + content._markup + suffix;
      }
      if (content._theme) {
        return prefix + dg.theme(content._theme, content) + suffix;
      }
      if (content._type) {
        return prefix + dg.theme(content._type, content) + suffix;
      }
      html += prefix;
      for (var index in content) {
        if (
          !content.hasOwnProperty(index) ||
          index == '_prefix' || index == '_suffix'
        ) { continue; }
        var piece = content[index];
        var _type = typeof piece;
        if (_type === 'object') { html += dg.render(piece); }
        else if (_type === 'array') {
          for (var i = 0; i < piece.length; i++) {
            html += dg.render(piece[i]);
          }
        }
      }
      html += suffix;
    }
    else if (type === 'array') {
      for (var i = 0; i < content.length; i++) {
        html += dg.render(content[i]);
      }
    }
    return html;
  }
  catch (error) { console.log('dg.render - ' + error); }
};
// @see http://krasimirtsonev.com/blog/article/A-modern-JavaScript-router-in-100-lines-history-api-pushState-hash-url

dg.router = {
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
  prepFragment: function(f) {
    //var fragment = f || this.getFragment();
    var frag = f || this.getFragment();
    return this.root + frag;
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


    var route = this.load(f);
    if (route) {

      //match.shift();

      // Route completion callback.
      var options = {
        success: function(content) {
          document.getElementById('dg-app').innerHTML = dg.render(content);
        }
      };

      if (!route.defaults) { route = this.load(dg.config('front')); }

      if (route.defaults) {
        // Handle forms.
        if (route.defaults._form) {
          var form = new window[route.defaults._form];
          form.getForm(options);
        }

        // All other routes.
        else {
          route.defaults._controller.apply({}, [options]);
        }
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
  load: function(frag) {
    var f = this.prepFragment(frag);
    for(var i=0; i<this.routes.length; i++) {
      var match = f.match(this.routes[i].path);
      if (match) { return this.routes[i]; }
    }
    return null;
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
  },
  getRoute: function() {

  }
};
dg.attributes = function(attributes) {
  var attrs = '';
  if (attributes) {
    for (var name in attributes) {
      if (!attributes.hasOwnProperty(name)) { continue; }
      var value = attributes[name];
      if (value != '') {
        // @todo - if someone passes in a value with double quotes, this
        // will break. e.g.
        // 'onclick':'_drupalgap_form_submit("' + form.id + "');'
        // will break, but
        // 'onclick':'_drupalgap_form_submit(\'' + form.id + '\');'
        // will work.
        attrs += name + '="' + value + '" ';
      }
      else {
        // The value was empty, just place the attribute name on the
        // element, unless it was an empty class.
        if (name != 'class') { attrs += name + ' '; }
      }
    }
  }
  return attrs;
};

/**
 * Implementation of theme().
 * @param {String} hook
 * @param {Object} variables
 * @return {String}
 */
dg.theme = function(hook, variables) {
  try {

    // If there is HTML markup present, just return it as is. Otherwise, run
    // the theme hook and send along the variables.
    if (!variables) { variables = {}; }
    if (variables._markup) { return variables._markup; }
    var content = '';

    // First see if the current theme implements the hook, if it does use it, if
    // it doesn't fallback to the core theme implementation of the hook.
    //var theme_function = drupalgap.settings.theme + '_' + hook;
    //if (!function_exists(theme_function)) {
      var theme_function = 'theme_' + hook;
      if (!jDrupal.functionExists(theme_function)) {
        var caller = null;
        if (arguments.callee.caller) {
          caller = arguments.callee.caller.name;
        }
        var msg = 'WARNING: ' + theme_function + '() does not exist.';
        if (caller) { msg += ' Called by: ' + caller + '().' }
        console.log(msg);
        return content;
      }
    //}

    // Set default attributes.
    if (!variables._attributes) { variables._attributes = {}; }

    // If there is no class name array, set an empty one.
    if (!variables._attributes['class']) { variables._attributes['class'] = []; }
    return window[theme_function].call(null, variables);
  }
  catch (error) { console.log('dg.theme - ' + error); }
};
var UserLoginForm = function() {
  //this.id = 'UserLoginForm';

  this.buildForm = function(form, form_state, options) {
    form.name = {
      _type: 'textfield',
      _title: 'Username',
      _required: true,
      _title_placeholder: true
    };
    form.pass = {
      _type: 'password',
      _title: 'Password',
      _required: true,
      _title_placeholder: true
    };
    form.actions = {
      _type: 'actions',
      submit: {
        _type: 'submit',
        _value: 'Log in',
        _button_type: 'primary'
      }
    };
    options.success(form);
  };

  this.submitForm = function(form, form_state) {
    console.log('submit town!');
  };

};

// Extend the form prototype and attach our constructor.
UserLoginForm.prototype = new dg.Form('UserLoginForm');
UserLoginForm.constructor = UserLoginForm;
var dgUser = new dg.Module();

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
