// @inspiration http://krasimirtsonev.com/blog/article/A-modern-JavaScript-router-in-100-lines-history-api-pushState-hash-url

// @TODO an individual Route item should be a JS Prototype instantiated by dg.bootstrap(),
// and many of the helper functions below belong on that item prototype instead of in this
// main router object.

dg.router = {
  _activeRoute: null,
  routes: [],
  mode: null,
  root: '/',
  config: function(options) {
    this.mode = options && options.mode && options.mode == 'history'
    && !!(history.pushState) ? 'history' : 'hash';
    this.root = options && options.root ? '/' + this.clearSlashes(options.root) + '/' : '/';
    return this;
  },

  /**
   * Gets the current path.
   * @returns {String}
   */
  getPath: function() {
    var fragment = '';
    if(this.mode === 'history') {
      fragment = this.clearSlashes(decodeURI(location.pathname + location.search));
      fragment = fragment.replace(/\?(.*)$/, '');
      fragment = this.root != '/' ? fragment.replace(this.root, '') : fragment;
    } else {
      var match = window.location.href.match(/#(.*)$/);
      fragment = match ? match[1] : '';
    }
    return dg.removeQueryString(this.clearSlashes(fragment));
  },
  getFragment: function() {
    console.log('WARNING: getFragment() is deprecated, use getPath() instead.');
    return this.getPath();
  },
  prepFragment: function(f) {
    var frag = f || this.getPath();
    return this.root + frag;
  },
  clearSlashes: function(path) {
    return path.toString().replace(/\/$/, '').replace(/^\//, '');
  },
  add: function(item) {
    this.routes.push(item);
    return this;
  },
  remove: function(param) {
    for(var i=0, r; i<this.routes.length, r = this.routes[i]; i++) {
      if(r.path.toString() === param.toString()) {
        this.routes.splice(i, 1);
        return this;
      }
    }
    return this;
  },
  flush: function() {
    this.routes = [];
    this.mode = null;
    this.root = '/';
    return this;
  },

  check: function(f) {

    var route = this.load(f);
    if (route) {

      dg.removeForms();

      var matches = this.matches(f).match;

      var menu_execute_active_handler = function(content) {
        dg.router.setActiveRoute(route);
        dg.content = content;
        dg.appRender();
        jDrupal.moduleInvokeAll('post_process_route_change', route, dg.getPath());
      };

      if (!route.defaults) { route = this.load(dg.getFrontPagePath()); }

      //if (!route.defaults) { route = this.load('404'); } // @TODO properly handle 404
      if (!this.meetsRequirements(route)) { route = this.load('403'); }

      if (route.defaults) {

        // Set the title.
        dg.setTitle(route.defaults._title);
        dg.setDocumentTitle(route.defaults._title);

        // Handle forms, apply page arguments or no arguments.
        if (route.defaults._form) {
          var id = route.defaults._form;
          if (matches.length > 1) {
            matches.shift();
            dg.addForm(id, dg.applyToConstructor(window[id], matches)).getForm().then(menu_execute_active_handler);
          }
          else {
            dg.addForm(id, new window[id]).getForm().then(menu_execute_active_handler);
          }
        }

        // All other routes, apply page arguments or no arguments. We accept both render elements and
        // promises to be returned from a controller.
        else {
          var controllerResult = null;
          if (matches.length > 1) {
            matches.shift();
            controllerResult = route.defaults._controller.apply(null, matches);
          }
          else { controllerResult = route.defaults._controller(); }
          if (jDrupal.isPromise(controllerResult)) { controllerResult.then(menu_execute_active_handler); }
          else { menu_execute_active_handler(controllerResult); }
        }

      }

    }
    return this;
  },
  listen: function() {
    var self = this;
    var current = self.getPath();
    var fn = function() {
      if(current !== self.getPath()) {
        current = self.getPath();
        self.check(current);
      }
    };
    clearInterval(this.interval);
    this.interval = setInterval(fn, 50);
    return this;
  },

  /**
   * Given a path, this will return the router object or null if it doesn't exist.
   * @param path {String}
   * @returns {String|null}
   */
  load: function(path) {
    var matches = this.matches(path);
    return matches ? this.routes[matches.i] : null;
  },

  /**
   * Given a path, this will look over all the routes and return regex matches (if any, null otherwise), that can handle
   * the path. Most notably it contains the index on the routes array.
   * @param frag {String} A path to a page.
   * @returns {Object|null}
   */
  matches: function(frag) {
    // Strip off the query string when looking for matches.
    var f = dg.removeQueryString(this.prepFragment(frag));

    for(var i=0; i<this.routes.length; i++) {
      if (!this.routes[i]) { continue; }
      var path = this.routes[i].path;
      // Make sure the path has the same number of slashes, otherwise it can be skipped.
      // @TODO the slash match count on the "path" could be done during the routes assembly, that way
      // it only has to be computed once during bootstrap, then only the "f" needs to compute
      // a match count here.
      if (path && (
          (f.match(/\//g) || []).length !=
          (path.match(/\//g) || []).length
      )) { continue; }
      var match = f.match(path);
      if (match) {
        return {
          match: match,
          i: i
        };
      }
    }
    return null;
  },
  navigate: function(path) {
    path = path ? path : '';
    if(this.mode === 'history') {
      var hPath = this.root + this.clearSlashes(path);
      history.pushState(
        null,
        null,
        hPath
      );
    } else {
      if (dg.getPath() == path) { dg.reload(); } // Reload page.
      else { // Navigate to page.
        window.location.href = window.location.href.replace(/#(.*)$/, '') + '#' + path;
      }
    }
    return this;
  },
  getRoutes: function() {
    return this.routes;
  },
  setActiveRoute: function(route) {
    this._activeRoute = route;
  },
  meetsRequirements: function(route) {
    if (!route) { route = this.getActiveRoute(); }
    if (route.requirements) {
      var requirements = route.requirements;
      if (requirements._role) { return dg.hasRole(requirements._role); }
    }
    return true;
  },

  /**
   * Resolves a route to a path by filling in its argument placeholders utilizing the current path.
   * @param route {Object}
   * @returns {string}
   */
  resolvePath: function(route) {
    var path = dg.router.clearSlashes(dg.router.getRoutePath(route));

    // Is there an argument pattern present?
    var pattern = '(.*)';
    var argIndex = path.indexOf(pattern);
    var argPresent = argIndex != -1;

    // If there is an arg present, locate its position by counting how many '/' are before it.
    while (argPresent) {
      var argPosition = 0;
      for (var i = 0; i < argIndex; i++) {
        if (path.charAt(i) == '/') { argPosition++; }
      }

      // Replace the pattern with the arg, then try to locate the next pattern.
      path = path.replace(pattern, dg.arg(argPosition));
      argIndex = path.indexOf(pattern);
      argPresent = argIndex != -1;
    }

    return path;
  },

  getActiveRoute: function() {
    return this._activeRoute;
  },
  getRouteIndex: function(key) {
    var routes = this.getRoutes();
    for (var i = 0; i < routes.length; i++) {
      if (routes[i].key == key) { return i; }
    }
    return -1;
  },

  /**
   * Loads and returns a route object given a route key.
   * @param key {String} The route key declared by a module's routing() function.
   * @returns {Object|null}
   */
  loadRoute: function(key) {
    var index = this.getRouteIndex(key);
    return  index != -1 ? this.getRoutes()[index] : null;
  },

  /**
   * Saves a route object onto the routes collection, overriding any previous values
   * for the given route key.
   * @param key {String} The route key declared by a module's routing() function.
   * @param route {Object} The route object.
   */
  saveRoute: function(key, route) {
    var index = this.getRouteIndex(key);
    if (index != -1) { this.getRoutes()[index] = route; }
    else { this.getRoutes().push(route); }
  },

  hasBaseRoute: function(route) {
    if (!route) { route = this.getActiveRoute(); }
    return route.defaults._base_route ? true : false;
  },

  getBaseRoute: function(route) {
    if (!route) { route = this.getActiveRoute(); }
    return this.hasBaseRoute(route) ?
        dg.router.loadRoute(route.defaults._base_route) : null;
  },

  hasChildRoutes: function(route) {
    if (!route) { route = this.getActiveRoute(); }
    return route.defaults._child_routes ? true : false;
  },

  initChildRoutes: function(route) {
    route.defaults._child_routes = []
  },

  getChildRoutes: function(route) {
    if (!route) { route = this.getActiveRoute(); }
    return this.hasChildRoutes(route) ?
        route.defaults._child_routes : null;
  },

  addChildRoute: function(route, childKey) {
    this.getChildRoutes(route).push(childKey);
  },

  /**
   * Saves a route as a child of a base route.
   * @param route {String|Object} A child route key or object.
   * @param baseRoute {String|Object} A base route key or object to use as the parent.
   */
  saveAsChildRoute: function(route, baseRoute) {
    if (typeof route === 'string') { route = dg.router.loadRoute(route); }
    if (typeof baseRoute === 'string') { baseRoute = dg.router.loadRoute(baseRoute); }
    if (!route || !baseRoute) { return; }
    if (!route.defaults._base_route) { route.defaults._base_route = baseRoute.key; }
    if (!dg.router.hasChildRoutes(baseRoute)) { dg.router.initChildRoutes(baseRoute); }
    dg.router.addChildRoute(baseRoute, route.key);
    dg.router.saveRoute(baseRoute.key, baseRoute);
  },

  getRouteKey: function(route) {
    if (!route) { route = this.getActiveRoute(); }
    return route.key;
  },

  getRoutePath: function(route) {
    if (!route) { route = this.getActiveRoute(); }
    return route.path;
  },

  getRouteTitle: function(route) {
    if (!route) { route = this.getActiveRoute(); }
    return route.defaults._title;
  }

};

 /**
 * Get the value of a query string
 * @see https://gomakethings.com/how-to-get-the-value-of-a-querystring-with-native-javascript/
 * @param  {String} field The field to get the value of
 * @param  {String} url   The URL to get the value from (optional)
 * @return {String}       The field value
 */
dg._GET = function ( field, url ) {
  var href = url ? url : window.location.href;
  var reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
  var string = reg.exec(href);
  return string ? string[1] : null;
};
