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
