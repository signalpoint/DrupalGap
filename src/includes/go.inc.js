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

/**
 * Given a path, this will remove the query string from it.
 * @param path {String}
 * @return {String}
 */
dg.removeQueryString = function(path) {
  var queryIndex = path.indexOf('?');
  return queryIndex != -1 ? path.substr(0, queryIndex) : path;
};

dg.nextPage = function() {
  var page = dg._GET('page') ? parseInt(dg._GET('page')) : 0;
  dg.goto(dg.getPath(), {
    _query: {
      page: page + 1
    }
  });
};

dg.previousPage = function() {
  var page = dg._GET('page') ? parseInt(dg._GET('page')) : 0;
  dg.goto(dg.getPath(), {
    _query: {
      page: page - 1
    }
  });
};
