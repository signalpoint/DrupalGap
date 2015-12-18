// @TODO form elements need to be turned into prototypes!

dg.forms = {}; // A global storage for active forms.
dg.addForm = function(id, form) {
  this.forms[id] = form;
  return this.forms[id];
};
dg.loadForm = function(id) {
  return this.forms[id] ? this.forms[id] : null;
};
dg.loadForms = function() { return this.forms; };
dg.removeForm = function(id) { delete this.forms[id]; };
dg.removeForms = function() { this.forms = {}; };

/**
 * The Form prototype.
 * @param id
 * @constructor
 */
dg.Form = function(id) {
  this.id = id;
  this.form = {
    _attributes: {
      id: dg.killCamelCase(id, '-').toLowerCase()
    }
  };
  this.form_state = {};
};

dg.Form.prototype.getFormId = function() {
  return this.id;
};

dg.Form.prototype.getForm = function() {
  var self = this;
  return new Promise(function(ok, err) {
    self.buildForm(self.form, self.form_state).then(function() {
      for (var name in self.form) {
        if (!dg.isFormElement(name, self.form)) { continue; }
        var attrs = self.form[name]._attributes ? self.form[name]._attributes : {};
        if (!attrs.id) { attrs.id = 'edit-' + name; }
        if (!attrs.name) { attrs.name = name; }
        self.form[name]._attributes = attrs;
      }
      var html = '<form ' + dg.attributes(self.form._attributes) + '>' +
        dg.render(self.form) +
        '</form>';
      ok(html);
    });
  });
};

dg.Form.prototype.getFormState = function() { return this.form_state; };

dg.Form.prototype.buildForm = function(form, form_state, options) {
  // abstract
  return new Promise(function(ok, err) {
    ok();
  });
};
dg.Form.prototype.validateForm = function(options) {
  // abstract
  return new Promise(function(ok, err) {
    ok();
  });
};
dg.Form.prototype.submitForm = function(form, form_state, options) {
  // abstract
  return new Promise(function(ok, err) {
    ok();
  });
};

// dg core form submit handler
dg.Form.prototype._submit = function() {
  var self = this;
  return new Promise(function(ok, err) {
    self.formStateAssemble().then(function() {
      self.validateForm().then(function() {
        self.submitForm().then(function() {
          if (self.form._action) { dg.goto(self._action); }
          dg.removeForm(self.getFormId());
          ok();
        });
      });
    });
  });
};
dg.Form.prototype.formStateAssemble = function(options) {
  var self = this;
  self.form_state = { values: {} };
  return new Promise(function(ok, err) {
    for (var name in self.form) {
      if (!dg.isFormElement(name, self.form)) { continue; }
      var element = self.form[name];
      var el = document.getElementById(element._attributes.id);
      if (el) { self.form_state.values[name] = el.value; }
    }
    ok();
  });
};

dg.isFormElement = function(prop, obj) {
  return obj.hasOwnProperty(prop) && prop.charAt(0) != '_';
};
dg.isFormProperty = function(prop, obj) {
  return obj.hasOwnProperty(prop) && prop.charAt(0) == '_';
};