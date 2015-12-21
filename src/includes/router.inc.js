// @see http://krasimirtsonev.com/blog/article/A-modern-JavaScript-router-in-100-lines-history-api-pushState-hash-url

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

      //match.shift();

      if (!route.defaults) { route = this.load(dg.config('front')); }

      if (route.defaults) {
        // Handle forms.
        if (route.defaults._form) {
          var id = route.defaults._form;
          dg.addForm(id, new window[id]).getForm().then(dg.appRender);
        }

        // All other routes.
        else {
          route.defaults._controller().then(dg.appRender);
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
    var f = this.prepFragment(frag);
    for(var i=0; i<this.routes.length; i++) {
      var match = f.match(this.routes[i].path);
      if (match) { return this.routes[i]; }
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
  },
  getRoute: function() {

  }
};