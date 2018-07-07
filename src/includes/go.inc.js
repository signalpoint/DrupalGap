/**
 *
 * @param path {String} The router path to navigate to.
 * @param options {Object}
 *  _query: @see dg.theme_link()
 */
dg.goto = function(path, options) {
  path += dg.extractQueryString(options);
  dg.router.navigate(path);
};

dg.reload = function() {
  location.reload();
};

dg.getDestination = function() {
  return { destination: dg.getDestinationPath() };
};

dg.getDestinationPath = function() {
  return dg.arg().join('/');
};

/**
 * Retrieves the query string from a url.
 * @param url {String} Optional, defaults to current url.
 * @returns {String|null}
 */
dg.getQueryString = function(url) {
  if (!url) { url = dg.getUrl(); }
  var queryIndex = url.indexOf('?');
  return queryIndex != -1 ?
      url.substr(queryIndex, (url.length - queryIndex) + 1) :
      null;
};

/**
 * Extracts a query string from a render element and returns it as a string.
 * @param variables {Object}
 * @returns {String}
 */
dg.extractQueryString = function(variables) {
  if (variables && variables._query) {
    var query = variables._query;
    var queries = [];
    for (var name in query) {
      if (!query.hasOwnProperty(name)) { continue; }
      queries.push(name + '=' + query[name]);
    }
    if (queries.length) { return '?' + queries.join('&'); }
  }
  return '';
};

/**
 * Given a path, this will remove the query string from it.
 * @param path {String}
 * @return {String}
 */
dg.removeQueryString = function(path) {
  var queryIndex = path.indexOf('?');
  return queryIndex != -1 ? path.substr(0, queryIndex) : path;
};
