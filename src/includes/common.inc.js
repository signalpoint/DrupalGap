/**
 * Get or set a drupalgap configuration setting.
 * @param {String} name
 * @returns {*}
 */
dg.config = function(name, value) {
  if (typeof value !== 'undefined') {
    dg.settings[name] = value;
    return;
  }
  return typeof dg.settings[name] !== 'undefined' ? dg.settings[name] : null;
};

/**
 * Returns the current mode, which is either "web-app" or "phonegap".
 * @returns {String}
 */
dg.getMode = function() { return this.config('mode'); };

/**
 * Sets the current mode, which must be either "web-app" or "phonegap".
 * @param {String} mode
 */
dg.setMode = function(mode) { this.config('mode', mode); };

/**
 * Returns true if the app is in 'phonegap' or 'cordova' mode, false otherwise.
 * @return {Boolean}
 */
dg.isCompiled = function() {
  return dg.inArray(dg.getMode(), ['phonegap', 'cordova']);
};

/**
 * Returns 'web' if running as a web application, otherwise it returns the platform name, e.g. 'android', 'ios'
 * @returns {string}
 */
dg.platform = function() {
  return dg.isCompiled() ? device.platform.toLowerCase() : 'web';
};

/**
 * Returns true if the device has a connection, false otherwise.
 * @see https://github.com/apache/cordova-plugin-network-information
 * @returns {boolean}
 */
dg.hasConnection = function() {
  return dg.isCompiled() ?
    navigator.connection.type != Connection.NONE :
    true; // Assume web-apps always have connection, for now.
};

/**
 * Returns the current route.
 * @returns {Object}
 */
dg.getRoute = function() {
  return dg.router.load(dg.getPath());
};

/**
 * Returns the current route's path.
 * @returns {String}
 */
dg.getPath = function() {
  var frag = dg.router.getPath();
  if (frag == '') { frag = dg.getFrontPagePath(); }
  return frag;
};

dg.getUrl = function() {
  return window.location.href;
};

/**
 * Returns the path to the app's front page route.
 * @returns {String}
 */
dg.getFrontPagePath = function() {
  var front = dg.config('front');
  if (front == null) { front = 'dg'; }
  return front;
};

dg.arg = function(i, path) {
  if (!path) { path = dg.getPath(); }
  var parts = path.split('/');
  if (typeof i === 'undefined' || i === null) { return parts; }
  return typeof parts[i] !== 'undefined' ? parts[i] : null;
};

/**
 *
 * @param xhr
 * @param status
 * @param msg
 * @param options
 */
dg.error = function(xhr, status, msg, options) {

  if (msg) { console.log(msg); }

  // Try to load a route to handle the error status.
  var route = dg.router.loadRoute('system.' + status); // @TODO add example docs for people to add/edit an error page.
  if (!route) {
    console.log(status, arguments);
    dg.alert(msg);
    return;
  }

  // @TODO this could use some handy hooks for other devs.

  // @TODO instead of taking over the whole "main" block, allow someone to decide what to do

  dg.setTitle(route.defaults._title);
  route.defaults._controller().then(function(content) {
    dg.blockSetContent('main', content);
  });

};

/**
 * Returns true if the current page's route is the app's front page route.
 * @returns {boolean}
 */
dg.isFrontPage = function() {

  // @TODO I don't think this works properly when navigating between pages, maybe it depends on when you call it.

  return dg.getFrontPagePath() == dg.getPath() || dg.getPath() == '';
};

/**
 * Gets the current page's title.
 * @returns {String}
 */
dg.getTitle = function() { return dg._title; };

/**
 * Given something, this will return true if it an object, false otherwise.
 * @param thing {*} The thing.
 * @returns {boolean}
 */
dg.isObject = function(thing) {
  return typeof thing === 'object';
};

/**
 * Given something, this will return true if it an string, false otherwise.
 * @param thing {*} The thing.
 * @returns {boolean}
 */
dg.isString = function(thing) {
  return typeof thing === 'string';
};

/**
 * Given something, this will return true if it is undefined, false otherwise.
 * @param thing {*} The thing.
 * @returns {boolean}
 */
dg.isUndefined = function(thing) {
  return typeof thing === 'undefined'
};

/**
 *
 * @param prop
 * @param obj
 * @returns {boolean}
 */
dg.isProperty = function(prop, obj) {
  return obj.hasOwnProperty(prop) && prop.charAt(0) == '_';
};

dg.removeFromArray = function(needle, haystack) {
  for (var i = haystack.length - 1; i >= 0; i--) {
    if (haystack[i] === needle) {
      haystack.splice(i, 1);
      break;
    }
  }
};

/**
 * Sets the current page title.
 * @param {String} title The title to set.
 * @param {Boolean} updateDocument If set, set's the document title as well, defaults to true.
 */
dg.setTitle = function(title, updateDocument, updatePage) {
  if (typeof updateDocument === 'undefined') { updateDocument = true; }
  if (typeof updatePage === 'undefined') { updatePage = true; }
  title = !title ? '' : title;
  if (typeof title === 'object') { title = title._title ? title._title : ''; }
  dg._title = title;
  if (updateDocument) { dg.setDocumentTitle(title); }
  if (updatePage) { dg.setPageTitle(title); }
};

/**
 * Gets the current document title.
 * @returns {*}
 */
dg.getDocumentTitle = function() { return document.title; };

/**
 * Sets the current document title.
 * @param title
 */
dg.setDocumentTitle = function(title) {
  title = !title ? dg.config('title') : title;
  document.title = dg.theme('document_title', { _title: dg.t(title) });
};

dg.setPageTitle = function(title) {
  // @TODO this is wrong, we need to run it through the block render layer so hook alterations can be applied.
  // @TODO we now have some handy functions for refreshing a block, use them to solve the issue mentioned above.
  var titleDiv = document.getElementById('title');
  if (titleDiv) { titleDiv.innerHTML = typeof title === 'string' ?
      dg.theme('title', { _title: title }) : dg.render(title); }
};

/**
 * A proxy function to quickly call `dg.attributes(variables._attributes)`, instead you can
 * just call `dg.attrs(variables);`.
 * @param variables
 * @returns {string}
 */
dg.attrs = function(variables) {
  var attrs = variables._attributes;
  return attrs ? dg.attributes(attrs) : '';
};

/**
 *
 * @param attributes
 * @returns {string}
 */
dg.attributes = function(attributes) {
  var attrs = '';
  if (attributes) {
    for (var name in attributes) {
      if (!attributes.hasOwnProperty(name)) { continue; }
      var value = attributes[name];
      if (Array.isArray(value) && value.length) {
        attrs += name + '="' + value.join(' ') + '" ';
      }
      else if (value === null) { attrs += ' ' + name + ' '; }
      else if (value != '') {
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
 * Given a render element, this will initialize the _attributes object for it.
 * @param element {Object} A typical render element or widget.
 */
dg.attributesInit = function(element) {
  var attrs = element._attributes ? element._attributes : {};
  if (!attrs.class) { attrs.class = []; }
  else if (typeof attrs.class === 'string') { attrs.class = [attrs.class]; }
  element._attributes = attrs;
};

/**
 * Given a name and value, this will save the value to local storage, keyed by name.
 * @param name {String}
 * @param value {*}
 */
dg.setVar = function(name, value) {
  window.localStorage.setItem(name, JSON.stringify(value));
};

/**
 * Given a name, this will return its value from local storage, or null if it doesn't exist. Optionally pass in a
 * default value to have it be saved in local storage when there is no value yet saved in local storage. This default
 * value will be returned to you if you use it.
 * @param name {String} The name to save the value under in local storage.
 * @param defaultValue {*} Optional value to replace a null value.
 * @returns {*}
 */
dg.getVar = function(name, defaultValue) {
  var currentValue = JSON.parse(window.localStorage.getItem(name));
  if (currentValue === null && typeof defaultValue !== 'undefined') {
    dg.setVar(name, defaultValue);
    return defaultValue;
  }
  return currentValue;
};

/**
 * Given a name, delete its value from local storage.
 * @param name {String}
 */
dg.deleteVar = function(name) {
  return window.localStorage.removeItem(name);
};

/**
 *
 * @param constructor
 * @param argArray
 * @returns {*}
 * @credit http://stackoverflow.com/a/14378462/763010
 */
dg.applyToConstructor = function(constructor, argArray) {
  var args = [null].concat(argArray);
  var factoryFunction = constructor.bind.apply(constructor, args);
  return new factoryFunction();
};

/**
 *
 * @param id
 * @returns {string}
 */
dg.cleanCssIdentifier = function(id) {
  return id.replace(/_/g, '-').toLowerCase();
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

dg.extend = function(obj1, obj2) {
  for (var name in obj2) {
    if (!obj2.hasOwnProperty(name)) { continue; }
    var val = obj2[name];
    if (!jDrupal.isEmpty(val)) { obj1[name] = val; }

  }
  return obj1;
};

/**
 *
 * @param str
 * @param separator
 * @returns {string}
 */
dg.killCamelCase = function(str, separator) {
  if (!separator) { separator = '-'; }
  return jDrupal.lcfirst(str).replace(/([A-Z])/g, separator + '$1').toLowerCase();
};

dg.inArray = function(needle, haystack) { return jDrupal.inArray(needle, haystack); };

/**
 * Given a drupal image file uri, this will return the path to the image on the Drupal site.
 * @param uri
 * @returns {*}
 */
dg.imagePath = function(uri) {
  var src = dg.restPath() + uri;
  if (src.indexOf('public://') != -1) {
    src = src.replace('public://', dg.config('files').publicPath + '/');
  }
  else if (src.indexOf('private://') != -1) {
    src = src.replace('private://', dg.config('files').privatePath + '/');
  }
  return src;
};

/**
 * @param element
 */
dg.elementAttributesInit = function(element) {
  dg.attributesInit(element);
};

/**
 * Returns html for a simple button.
 * @param text
 * @param path
 * @param options
 * @returns {String}
 */
dg.b = function(text, options) {
  if (!options) { options = {}; }
  if (!options._value) { options._value = text; }
  return dg.theme('button', options);
};

/**
 * Returns html for a simple link.
 * @param text
 * @param path
 * @param options
 * @returns {String}
 */
dg.l = function(text, path, options) {
  if (!options) { options = {}; }
  if (!options._text) { options._text = text; }
  if (!options._path) { options._path = path; }
  return dg.theme('link', options);
};

/**
 * Returns html for a button link.
 * @param text
 * @param path
 * @param options
 * @returns {String}
 */
dg.bl = function(text, path, options) { return this.l.apply(this, arguments); };

/**
 * Given an id, this will remove its element from the DOM.
 * @param id
 */
dg.removeElement = function(id) {
  var el = dg.qs('#' + id);
  if (el) { el.parentElement.removeChild(el); }
};

/**
 *
 * @param text
 * @returns {*}
 */
dg.t = function(text, args, options) {
  if (args) {
    for (var name in args) {
      if (!args.hasOwnProperty(name)) { continue; }
      text = text.replace(name, args[name]);
    }
  }
  return text;
};

/**
 * Formats a string containing a count of items.
 * @see TranslationInterface::formatPlural in Drupal 8
 * @param count {Number} e.g. The number of apples.
 * @param singular {String} e.g. Apple
 * @param plural {String} e.g. Apples
 * @returns {String}
 */
dg.formatPlural = function(count, singular, plural) {
  return parseInt(count) == 1 ?  singular : plural;
};
