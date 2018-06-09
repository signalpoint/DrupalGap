// @inspiration http://krasimirtsonev.com/blog/article/A-modern-JavaScript-router-in-100-lines-history-api-pushState-hash-url

dg.router = {
  _activeRoute: null,
  _stack: [],
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

  /**
   * @deprecated
   */
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

  /**
   * STACK
   */
  getStack: function() { return dg.router._stack; },
  stackPush: function(route, path) {
    dg.router.getStack().push({
      key: route.key,
      path: path
    });
  },
  stackPop: function() { // @TODO figure out if the user is moving backwards
    var stack = dg.router.getStack();
    return stack.length ? stack.pop() : null;
  },

  /**
   * Checks for a route to handle the path and executes the menu handler if one exists.
   * @param {String} newPath The destination path.
   * @param {String} oldPath The referral path (aka the last path).
   * @returns {dg.router}
   */
  check: function(newPath, oldPath) {

    var self = this;

    if (newPath == '') { newPath = dg.getFrontPagePath(); }

    // Give developers a chance to alter the path to check, thereby potentially rerouting.
    jDrupal.moduleInvokeAll('pre_process_route_change', newPath, oldPath).then(function(alters) {

      // If anybody altered the path, take the first one, navigate to it and return, unless we're already there, then
      // proceed with the original path.
      if (alters && alters.length) {
        for (var i = 0; i < alters.length; i++) {
          var alter = alters[i];
          if (!alter) { continue; }
          if (alter != dg.getPath()) {
            self.navigate(alter);
            return;
          }
        }
      }

      // Try to load the route for this path, or throw a 404 if nobody can handle this.
      var route = self.load(newPath);
      if (!route) { // 404
        console.log('dg.router.check() - 404?', newPath);
        return;
      }

      // We have a route to handle the path...

      // Clear out any forms from the previous route, if any.
      dg.removeForms();

      if (!route.defaults) { route = self.load(dg.getFrontPagePath()); }

      //if (!route.defaults) { route = this.load('404'); } // @TODO properly handle 404
      if (!self.meetsRequirements(route)) { route = self.load('403'); }

      if (route.defaults) {

        // Set the title.
        dg.setTitle(route.defaults._title);
        dg.setDocumentTitle(route.defaults._title);

        // Run the handler for the route and new path, when it calls back with the content we set the new active route,
        // toss the path on the stack, set the global dg.content (used by the "main" block in the system module), tell
        // the app to render itself, then give developers a chance to react to the completion of the route change.
        dg.router.execute(function(content) {
          var _newPath = dg.getPath();
          dg.router.setActiveRoute(route);
          dg.router.stackPush(route, _newPath);
          dg.content = content;
          dg.appRender();
          jDrupal.moduleInvokeAll('post_process_route_change', route, _newPath, oldPath);
        }, route, newPath);

      }

    });

    return this;

  },

  /**
   * Given a optional route and corresponding path, this will run its handler (e.g. defaults._controller or
   * defaults._form) and send the content from the handler back to the given callback.
   * @param ok {Function} A callback function for when this is done.
   * @param route {Object} Optional, defaults to the current route.
   * @param path {String} Optional, defaults to the current path.
   */
  execute: function(ok, route, path) {

    // Prep any defaults and grab the matches (if any) from the path.
    if (!route) { route = dg.getRoute(); }
    if (!path) { path = dg.getPath(); }
    var matches = dg.router.matches(path).match;

    // Handle forms, apply page arguments or no arguments.
    if (route.defaults._form) {
      var id = route.defaults._form;
      if (matches.length > 1) {
        matches.shift();
        dg.addForm(id, dg.applyToConstructor(window[id], matches)).getForm().then(ok);
      }
      else { dg.addForm(id, new window[id]).getForm().then(ok); }
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
      if (jDrupal.isPromise(controllerResult)) { controllerResult.then(ok); }
      else { ok(controllerResult); }
    }

  },

  /**
   * Listens for a change to the route, and when it detects a change it calls "check" to see if anybody wants to handle
   * the route.
   * @returns {dg.router}
   */
  listen: function() {
    var self = this;
    var current = self.getPath();
    var fn = function() {
      if(current !== self.getPath()) {
        var old = current;
        current = self.getPath();
        self.check(current, old);
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

  /**
   * Returns the active route object.
   * @returns {object}
   */
  getActiveRoute: function() {
    return this._activeRoute;
  },

  /**
   * Sets the active route object.
   * @param {object} route
   */
  setActiveRoute: function(route) {
    this._activeRoute = route;
  },

  meetsRequirements: function(route) {
    if (!route) { route = this.getActiveRoute(); }
    if (route.requirements) {
      var requirements = route.requirements;
      if (requirements._role) { return dg.hasRole(requirements._role); }
      else if (requirements._custom_access) { return requirements._custom_access(); }
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
    return index != -1 ? this.getRoutes()[index] : null;
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

  /**
   * Deletes a route object from the routes collection. Primarily used to remove routes provided by DrupalGap core.
   * Use with caution.
   * @param key {String} The route key.
   */
  deleteRoute: function(key) {
    var routeIndex = dg.router.getRouteIndex(key);
    if (routeIndex != -1) { this.getRoutes().splice(routeIndex, 1); }
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
