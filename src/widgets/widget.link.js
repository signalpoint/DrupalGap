/**
 * Themes a link.
 * @param {Object} variables
 *  _text {String}
 *  _path {String}
 *  _query {Object} key/value properties to be placed in query string
 *  _inAppBrowser {Boolean|Object} @see https://drupalgap.org/project/dg_iab
 * @return {String}
 */
dg.theme_link = function(variables) {
  var text = variables._text ? variables._text : '';
  var path = variables._path;
  if (path == '') { path = dg.getFrontPagePath(); }
  var attrs = variables._attributes;
  if (typeof attrs.href === 'undefined' && path) {
    var href = path;
    if (path.indexOf('http://') != -1 || path.indexOf('https://') != -1) { }
    else if (path.indexOf('/') == 0) { href = path; }
    else { href = '#' + path; }
    if (path == dg.getPath() && !dg.inArray('active', attrs.class)) {
      attrs.class.push('active');
    }
    href += dg.extractQueryString(variables);
    attrs.href = href;
  }

  // Using InAppBrowser? Requires the dg_iab module and cordova-plugin-inappbrowser.
  if (variables._inAppBrowser && dg.isCompiled()) {
    dg_iab.init(variables);
  }

  return '<a ' + dg.attributes(attrs) + '>' + text + '</a>';
};
