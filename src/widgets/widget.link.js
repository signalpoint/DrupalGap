/**
 * Themes a link.
 * @param {Object} variables
 *  _text {String}
 *  _path {String}
 *  _query {Object} key/value properties to be placed in query string
 * @return {String}
 */
dg.theme_link = function(variables) {
  var text = variables._text ? variables._text : '';
  var path = variables._path;
  if (path == '') { path = dg.getFrontPagePath(); }
  if (typeof variables._attributes.href === 'undefined' && path) {
    var href = path;
    if (path.indexOf('http://') != -1 || path.indexOf('https://') != -1) { }
    else if (path.indexOf('/') == 0) { href = path; }
    else { href = '#' + path; }
    if (path == dg.getPath() && !jDrupal.inArray('active', variables._attributes.class)) {
      variables._attributes.class.push('active');
    }
    href += dg.extractQueryString(variables);
    variables._attributes.href = href;
  }
  return '<a ' + dg.attributes(variables._attributes) + '>' + text + '</a>';
};
