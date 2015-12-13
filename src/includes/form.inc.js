drupalgap.Form = function(id) {
  this.id = id;
  this.form = null;
};

drupalgap.Form.prototype.getFormId = function() {
  return this.id;
};

drupalgap.Form.prototype.getForm = function(options) {
  this.buildForm({}, {}, {
    success: function() {
      for (var element in this.form) {
        if (!modules.hasOwnProperty(module) || !window[module].routing) { continue; }
        var routes = window[module].routing();
        if (!routes) { continue; }
        for (route in routes) {
          if (!routes.hasOwnProperty(route)) { continue; }
          var item = routes[route];
          //this.router.add(item.path, item.defaults._controller, item);
          this.router.add(item);
        }
      }
      options.success('here is your form ya jerk');
    }
  });
};

drupalgap.Form.prototype.buildForm = function(form, form_state, options) {
  options.success();
};