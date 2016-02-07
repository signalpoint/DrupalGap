// @inspiration http://krasimirtsonev.com/blog/article/A-modern-JavaScript-router-in-100-lines-history-api-pushState-hash-url

dg.router = {
  routes: [],
  mode: null,
  root: '/',
  config: function(options) {
    this.mode = options && options.mode && options.mode == 'history'
    && !!(history.pushState) ? 'history' : 'hash';
    this.root = options && options.root ? '/' + this.clearSlashes(options.root) + '/' : '/';
    return this;
  },
  getFragment: function() {
    var fragment = '';
    if(this.mode === 'history') {
      fragment = this.clearSlashes(decodeURI(location.pathname + location.search));
      fragment = fragment.replace(/\?(.*)$/, '');
      fragment = this.root != '/' ? fragment.replace(this.root, '') : fragment;
    } else {
      var match = window.location.href.match(/#(.*)$/);
      fragment = match ? match[1] : '';
    }
    return this.clearSlashes(fragment);
  },
  prepFragment: function(f) {
    //var fragment = f || this.getFragment();
    var frag = f || this.getFragment();
    return this.root + frag;
  },
  clearSlashes: function(path) {
    return path.toString().replace(/\/$/, '').replace(/^\//, '');
  },
  //add: function(re, handler) {
  //  if(typeof re == 'function') {
  //    handler = re;
  //    re = '';
  //  }
  //  this.routes.push({ re: re, handler: handler });
  //  return this;
  //},
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
        dg.content = content;
        dg.appRender();
        jDrupal.moduleInvokeAll('post_process_route_change', route, dg.getPath());
      };

      if (!route.defaults) { route = this.load(dg.getFrontPagePath()); }

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

        // All other routes, apply page arguments or no arguments.
        else {

          if (matches.length > 1) {
            matches.shift();
            route.defaults._controller.apply(null, matches).then(menu_execute_active_handler);
          }
          else {
            route.defaults._controller().then(menu_execute_active_handler);
          }

        }

      }

    }
    return this;
  },
  listen: function() {
    var self = this;
    var current = self.getFragment();
    var fn = function() {
      if(current !== self.getFragment()) {
        current = self.getFragment();
        self.check(current);
      }
    };
    clearInterval(this.interval);
    this.interval = setInterval(fn, 50);
    return this;
  },
  load: function(frag) {
    var matches = this.matches(frag);
    if (matches) { return this.routes[matches.i]; }
    return null;
  },
  matches: function(frag) {
    var f = this.prepFragment(frag);
    for(var i=0; i<this.routes.length; i++) {
      var match = f.match(this.routes[i].path);
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
      window.location.href = window.location.href.replace(/#(.*)$/, '') + '#' + path;
    }
    return this;
  },
  getRoutes: function() {
    return this.routes;
  }
};