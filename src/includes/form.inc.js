dg.forms = {}; // A global storage for active forms.

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
    },
    _validate: [id + '.validateForm'],
    _submit: [id + '.submitForm']
  };
  this.form_state = new dg.FormStateInterface(this);
  this.elements = {}; // Holds FormElement instances.
};

dg.Form.prototype.getFormId = function() { return this.id; };

dg.Form.prototype.getForm = function() {
  var self = this;
  return new Promise(function(ok, err) {
    self.buildForm(self.form, self.form_state).then(function() {
      for (var name in self.form) {
        if (!dg.isFormElement(name, self.form)) { continue; }
        self.elements[name] = new dg.FormElement(name, self.form[name], self);
      }
      var html = '<form ' + dg.attributes(self.form._attributes) + '>' +
        dg.render(self.form) +
        '</form>';
      ok(html);
    });
  });
};

dg.Form.prototype.getFormState = function() {
  return this.form_state;
};

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

// dg core form submission handler
dg.Form.prototype._submitForm = function() {
  var self = this;
  return new Promise(function(ok, err) {
    var formState = self.getFormState();
    formState.setFormState().then(function() {

      self._validateForm().then(function() {

        if (formState.hasAnyErrors()) {
          var msg = '';
          var errors = formState.getErrors();
          for (error in errors) {
            if (!errors.hasOwnProperty(error)) { continue; }
            msg += error + ' - ' + errors[error];
          }
          dg.alert(msg);
          err();
        }
        else {
          console.log('holy smokes!');
        }


      });

      //self.validateForm(self, formState).then(function() {
      //  self.submitForm(self, formState).then(function() {
      //    if (self.form._action) { dg.goto(self._action); }
      //    dg.removeForm(self.getFormId());
      //    ok();
      //  });
      //});

    });
  });
};

// dg core form validation handler
dg.Form.prototype._validateForm = function() {
  var self = this;
  var promises = [];
  for (var i = 0; i < self.form._validate.length; i++) {
    var parts = self.form._validate[i].split('.');
    console.log(parts);
    var obj = parts[0];
    var method = parts[1];
    if (!window[obj] || !window[obj][method]) { continue; }
    promises.push(window[obj][method].apply(self, [self, self.getFormState()]));
  }
  return Promise.all(promises).then(function() {
    console.log('All promises fulfilled dude');
  });
};

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

dg.isFormElement = function(prop, obj) {
  return obj.hasOwnProperty(prop) && prop.charAt(0) != '_';
};
dg.isFormProperty = function(prop, obj) {
  return obj.hasOwnProperty(prop) && prop.charAt(0) == '_';
};