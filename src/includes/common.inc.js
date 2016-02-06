/**
 * Get or set a drupalgap configuration setting.
 * @param {String} name
 * @returns {*}
 */
dg.config = function(name) {
  var value = typeof arguments[1] !== 'undefined' ? arguments[1] : null;
  if (value) {
    dg.settings[name] = value;
    return;
  }
  return dg.settings[name];
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
 * Returns the current route.
 * @returns {Object}
 */
dg.getRoute = function() {
  //return dg.router.load(dg.getPath())
  return dg.router.load(dg.getPath())
};

/**
 * Returns the current route's path.
 * @returns {String}
 */
dg.getPath = function() {
  var frag = dg.router.getFragment();
  if (frag == '') { frag = dg.getFrontPagePath(); }
  return frag;
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
 *
 * @param prop
 * @param obj
 * @returns {boolean}
 */
dg.isProperty = function(prop, obj) {
  return obj.hasOwnProperty(prop) && prop.charAt(0) == '_';
};

/**
 * Sets the current page title.
 * @param title
 */
dg.setTitle = function(title) {
  title = !title ? '' : title;
  if (typeof title === 'object') { title = title._title ? title._title : ''; }
  dg._title = title;
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

/**
 *
 * @param str
 * @param separator
 * @returns {string}
 */
dg.killCamelCase = function(str, separator) {
  return jDrupal.lcfirst(str).replace(/([A-Z])/g, separator + '$1').toLowerCase();
};

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
  var elem = document.getElementById(id);
  elem.parentElement.removeChild(elem);
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
