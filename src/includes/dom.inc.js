/**
 * CLASS FRIENDS
 */

dg.hasClass = function(el, className) {
  return el.classList.contains(className);
};

dg.addClass = function(el, className) {
  if (!dg.hasClass(el, className)) { el.classList.add(className); }
};

dg.removeClass = function(el, className) {
  if (dg.hasClass(el, className)) { el.classList.remove(className); }
};

dg.getBody = function() {
  return document.getElementsByTagName("BODY")[0];
};

dg.addBodyClass = function(className) {
  dg.addClass(dg.getBody(), className);
};

dg.removeBodyClass = function(className) {
  dg.removeClass(dg.getBody(), className);
};

/**
 * ATTRIBUTES
 */

/**
 * Adds attributes to an element.
 * @param el {String|Object} A document query selector string or DOM element.
 * @param vars {Object} A render element variables object containing an _attributes property.
 */
dg.addAttrs = function(el, vars) {
  if (!vars._attributes) { return; }
  el = dg.qs(el);
  for (var name in vars._attributes) {
    if (!vars._attributes.hasOwnProperty(name)) { continue; }
    var value = vars._attributes[name];
    el.setAttribute(name, dg.isArray(value) ? value.join(' ') : value );
  }
};

/**
 * ELEMENT BUDDIES
 */

dg.el = function(el) {
  console.log('DEPRECATED: dg.el(), use dg:qs() instead');
  return dg.qs(el);
};

dg.isChild = function(child, parent) {
  var node = child.parentNode;
  while (node != null) {
    if (node === parent) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
};

/**
 * A shortcut function to call document.querySelector().
 * @param el {String|Object} The element identifier or element object (as a pass through).
 * @returns {Object}
 */
dg.qs = function(el) {
  if (dg.isString(el)) { el = document.querySelector(el); } // Convert selector string to element.
  return el;
};

/**
 * A shortcut function to call document.querySelectorAll().
 * @param selectors {String} One or more CSS selctors separated by commas.
 * @returns {Object}
 */
dg.qsa = function(selectors) {
  return document.querySelectorAll(selectors);
};

dg.qsi = function(id) { return document.getElementById(id); };

/**
 * Shows an element.
 * @param el {String|Object} A css selector or element object.
 */
dg.show = function(el) {
  dg.qs(el).style.display = 'block';
};

/**
 * Hides an element.
 * @param el {String|Object} A css selector or element object.
 */
dg.hide = function(el) {
  dg.qs(el).style.display = 'none';
};

/**
 * Returns true if the given element is visible, false otherwise.
 * @param el {String|Object} A css selector or element object.
 * @returns {boolean}
 */
dg.isVisible = function(el) {
  return !dg.inArray(dg.qs(el).style.display, ['none', '']);
};

/**
 * LIBRARY GOODNESS
 */

/**
 * Adds a .js file to the head of the DOM.
 * @param options {Object}
 *  _attributes {Object}
 *    src {String} The url or file path of the .js file.
 *    * {*} Any other attributes you'd like added to the script tag.
 */
dg.addJs = function(options) {
//  console.log('...js', options._attributes.src);
  var element = document.createElement('script');
  element.type = 'text/javascript';
  dg.addToHead(element, options);
};

dg.removeJs = function(src) {
  var jsLinks = document.querySelectorAll('script[src]');
  for (var i = 0; i < jsLinks.length; i++) {
    if (jsLinks[i].src.indexOf(src) !== -1) {
//      console.log('-js', src);
      jsLinks[i].remove();
    }
  }
};

/**
 * Adds a .css file to the head of the DOM.
 * @param options {Object}
 *  _attributes {Object}
 *    href {String} The url or file path of the .css file.
 *    * {*} Any other attributes you'd like added to the link tag.
 */
dg.addCss = function(options) {
//  console.log('...css', options._attributes.href);
  var element = document.createElement('link');
  element.rel = 'stylesheet';
  dg.addToHead(element, options);
};

dg.removeCss = function(href) {
  var cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
  for (var i = 0; i < cssLinks.length; i++) {
    if (cssLinks[i].href && cssLinks[i].href.indexOf(href) !== -1) {
//      console.log('-css', href);
      cssLinks[i].remove();
    }
  }
};

/**
 * @see credit: https://stackoverflow.com/a/22534608/763010
 *
 * Adds a element to the head of the DOM.
 * @param element - an element for the DOM, e.g. createElement()
 * @param options {Object} - a typical dg8 element with _attributes
 */
dg.addToHead = function(element, options) {

  // Place the attributes onto the element.
  // - functions get placed directly on the element (because setElement() crashes when setting a value to a function)
  // - other attributes get set via setAttribute()
  var attributes = options._attributes;
  for (var name in attributes) {
    if (!dg.hop(attributes, name)) { continue; }
    if (typeof attributes[name] === 'function') { element[name] = attributes[name]; }
    else if (attributes[name] === null) { element.setAttribute(name, ''); }
    else { element.setAttribute(name, attributes[name]); }
  }

  // Append the element to the <head>.
  var head = document.getElementsByTagName('head')[0];
  head.appendChild(element);

};

dg.getJs = function() {
  var js = document.getElementsByTagName('script');
  var paths = [];
  for (var i = 0; i < js.length; i++) {
    if (js[i].src) {
      paths.push(js[i].src);
    }
  }
  return paths;
};

dg.jsIsLoaded = function(path) {
  var paths = dg.getJs();
//  console.log('jsPathIsLoaded', path, paths);
  for (var i = 0; i < paths.length; i++) {
    var loadedPath = paths[i].split('?')[0];
    if (loadedPath.indexOf(path) !== -1) {
      return true;
    }
  }
  return false;
};

dg.getCss = function() {
  var css = document.styleSheets;
  var paths = [];
  for (var i = 0; i < css.length; i++) {
    if (css[i].href) {
      paths.push(css[i].href);
    }
  }
  return paths;
};

dg.cssIsLoaded = function(path) {
  var paths = dg.getCss();
//  console.log('cssPathIsLoaded', path, paths);
  for (var i = 0; i < paths.length; i++) {
    var loadedPath = paths[i].split('?')[0];
    if (loadedPath.indexOf(path) !== -1) {
      return true;
    }
  }
  return false;
};
