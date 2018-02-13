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
 * @param js {Object}
 *  _attributes {Object}
 *    src {String} The url or file path of the .js file.
 *    * {*} Any other attributes you'd like added to the script tag.
 */
dg.addJs = function(js) {
  dg.addToHead('js', js);
};

/**
 * Adds a .css file to the head of the DOM.
 * @param css {Object}
 *  _attributes {Object}
 *    href {String} The url or file path of the .css file.
 *    * {*} Any other attributes you'd like added to the link tag.
 */
dg.addCss = function(css) {
  dg.addToHead('css', css);
};

/**
 * @see credit: https://stackoverflow.com/a/22534608/763010
 *
 * Adds a file to the head of the DOM.
 * @param assetType {String} 'js' or 'css'
 * @param asset {Object}
 *    If assetType is 'js' @see addJsToHead().
 *    If assetType is 'css' @see addCssToHead().
 */
dg.addToHead = function(assetType, asset) {
  var head = document.getElementsByTagName('head')[0];
  var map = {
    js: 'script',
    css: 'link'
  };
  var attrMap = {
    js: 'text/javascript',
    css: 'stylesheet'
  };
  var element = document.createElement(map[assetType]);
  var attributes = asset._attributes;
  for (var name in attributes) {
    if (!attributes.hasOwnProperty(name)) { continue; }
    element[name] = attributes[name];
  }
  switch (assetType) {
    case 'js':
      if (!element.type) { element.type = attrMap[assetType]; }
      break;
    case 'css':
      if (!element.rel) { element.rel = attrMap[assetType]; }
      break;
  }

  head.appendChild(element);
};
