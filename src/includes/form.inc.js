// @TODO form elements need to be turned into prototypes!

dg.forms = {}; // A global storage for active forms.
dg.addForm = function(id, form) {
  this.forms[id] = form;
  return this.forms[id];
};
dg.loadForm = function(id) {
  return this.forms[id] ? this.forms[id] : null;
};
dg.loadForms = function() { return this.forms; }
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

dg.Form.prototype.getForm = function(options) {
  var self = this;
  self.buildForm(self.form, self.form_state, {
    success: function() {
      for (var name in self.form) {
        if (!dg.isFormElement(name, self.form)) { continue; }
        var attrs = self.form[name]._attributes ? self.form[name]._attributes : {};
        if (!attrs.id) { attrs.id = 'edit-' + name; }
        if (!attrs.name) { attrs.name = name; }
        self.form[name]._attributes = attrs;
      }
      options.success('<form ' + dg.attributes(self.form._attributes) + '>' +
        dg.render(self.form) +
      '</form>');
    }
  });
};

dg.Form.prototype.getFormState = function() { return this.form_state; };

dg.Form.prototype.buildForm = function(form, form_state, options) {
  // abstract
};
dg.Form.prototype.validateForm = function(options) {
  options.success();
};
dg.Form.prototype.submitForm = function(form, form_state, options) {
  // abstract
};
dg.Form.prototype._submit = function(options) {
  var self = this;
  this.formStateAssemble({
    success: function() {
      self.validateForm({
        success: function() {
          self.submitForm({
            success: function() {
              if (self.form._action) { dg.goto(self._action); }
              dg.removeForm(self.getFormId());
              options.success();
            }
          })
        },
        error: function (xhr, status, msg) {

        }
      })
    }
  });
};
dg.Form.prototype.formStateAssemble = function(options) {
  this.form_state = { values: {} };
  for (var name in this.form) {
    if (!dg.isFormElement(name, this.form)) { continue; }
    var element = this.form[name];
    var el = document.getElementById(element._attributes.id);
    if (el) { this.form_state.values[name] = el.value; }
  }
  options.success();
};

dg.isFormElement = function(prop, obj) {
  return obj.hasOwnProperty(prop) && prop.charAt(0) != '_';
};
dg.isFormProperty = function(prop, obj) {
  return obj.hasOwnProperty(prop) && prop.charAt(0) == '_';
};