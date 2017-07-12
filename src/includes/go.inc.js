/**
 *
 * @param path {String} The router path to navigate to.
 * @param options {Object}
 *  _query: @see dg.theme_link()
 */
dg.goto = function(path, options) {
  path += dg.getQueryString(options);
  this.router.navigate(path);
};

dg.getDestination = function() {
  return { destination: dg.getDestinationPath() };
};

dg.getDestinationPath = function() {
  return dg.arg().join('/');
};

dg.getQueryString = function(variables) {
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
