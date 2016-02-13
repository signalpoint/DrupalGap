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
      id: dg.killCamelCase(id, '-').toLowerCase(),
      'class': []
    },
    _validate: [id + '.validateForm'],
    _submit: [id + '.submitForm'],
    _after_build: []
  };
  this.form_state = new dg.FormStateInterface(this);
  this.elements = {}; // Holds FormElement instances.
  // Remember, a form is a render element at the end of the day, so it will inherit render element defaults later.

};

/**
 * Given a form's property name, this will return it.
 * @param name
 * @returns {null}
 */
dg.Form.prototype.get = function(name) {
  return typeof this[name] !== 'undefined' ? this[name] : null;
};

/**
 * Returns the form's id.
 * @returns {String}
 */
dg.Form.prototype.getFormId = function() { return this.get('id'); };

/**
 * Returns the html output for a form, via a Promise.
 * @returns {Promise}
 */
dg.Form.prototype.getForm = function() {
  var self = this;
  return new Promise(function(ok, err) {
    self.buildForm(self.form, self.form_state).then(function() {

      // Set up default values across each element.
      for (name in self.form) {
        if (!dg.isFormElement(name, self.form)) { continue; }
        var el = self.form[name];
        if (el._type == 'actions') {
          dg.setFormElementDefaults(name, el);
          for (_name in el) {
            if (!dg.isFormElement(_name, el)) { continue; }
            dg.setFormElementDefaults(_name, el[_name]);
          }
        }
        else { dg.setFormElementDefaults(name, el); }
      }

      // Allow form alterations, and set up the resolve to instantiate the form
      // elements and resolve the rendered form.
      // @TODO should this alter be moved after the widget assembly? Then we won't have to pass the element by reference
      // to its widget form builder.
      var alters = jDrupal.moduleInvokeAll('form_alter', self.form, self.getFormState(), self.getFormId());
      var render = function() {
        var form = '';
        for (var name in self.form) {
          if (!dg.isFormElement(name, self.form)) { continue; }

          // Grab the render element for the form element.
          var element = self.form[name];
          //console.log(name + ': ' + element._widgetType);
          //console.log(element);

          // Reset the attribute value to that of the element value if it changed during form alteration.
          if (element._attributes.value != element._value) { element._attributes.value = element._value; }
          switch (element._widgetType) {
            case 'FieldWidget':
            case 'FormWidget':

              //console.log(element._widgetType);
              //console.log(name);

                // Instantiate the widget using the element's module, then build the element form and then add it to the
                // form as a container.
                var items = self.form._entity.get(name);
                var delta = 0;
                var widget = new dg.modules[element._module][element._widgetType][element._type](
                  self.form._entityType,
                  self.form._bundle,
                  name,
                  element,
                  items,
                  delta
                );
                self.elements[name] = widget;
                widget.form(items, delta, element, self.form, self.form_state);
                // Wrap elements in containers, except for hidden elements.
                if (element._type == 'hidden') {
                  self.form[name] = element;
                  continue;
                }
                var children = {};
                if (element._title) {
                  children.label = {
                    _theme: 'form_element_label',
                    _title: element._title
                  };
                }
                children.element = element;
                var container = {
                  _theme: 'container',
                  _children: children,
                  _weight: element._weight
                };
                self.form[name] = container;
              break;
            case 'FormElement':
            default:

              // Instantiate a new form element given the current buildForm element for the Form.
              // Wrap elements in containers, except for hidden elements.
              var el = new dg[element._widgetType](name, element, self);

              self.elements[name] = el;
              if (el._type == 'hidden') {
                self.elements[name] = el;
                continue;
              }
              var children = {
                _attributes: {
                  'class': []
                }
              };
              if (element._title && !element._attributes.placeholder) {
                children.label = {
                  _theme: 'form_element_label',
                  _title: element._title,
                  _attributes: {
                    'class': [],
                    'for': element._attributes.id
                  }
                };
              }
              children.element = el;
              var container = { // @TODO we desperately need a function to instantiate a RenderElement
                _theme: 'container',
                _children: children,
                _attributes: {
                  'class': []
                },
                _weight: element._weight
              };
              self.form[name] = container;

              break;
          }

        }
        
        // Run the after builds, if any. Then finally resolve the rendered form.
        var promises = [];
        for (var i = 0; i < self.form._after_build.length; i++) {
          var parts = self.form._after_build[i].split('.');
          var module = parts[0];
          var method = parts[1];
          if (!dg.modules[module] || !dg.modules[module][method]) { continue; }
          promises.push(dg.modules[module][method].apply(self, [self.form, self.getFormState()]));
        }
        Promise.all(promises).then(function() {
          ok('<form ' + dg.attributes(self.form._attributes) + '>' + dg.render(self.form) + '</form>');
        });

      };
      if (!alters) { render(); }
      else { alters.then(render); }

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

// dg core form UX submission handler
dg.Form.prototype._submission = function() {
  var self = this;
  return new Promise(function(ok, err) {
    var formState = self.getFormState();
    formState.setFormState().then(function() {
      formState.clearErrors();
      self._validateForm().then(function() {
        if (formState.hasAnyErrors()) {
          formState.displayErrors();
          err();
          return;
        }
        self._submitForm(self, formState).then(function() {
          if (self.form._action) { dg.goto(self.form._action); }
          dg.removeForm(self.getFormId());
          ok();
        });
      });
    });
  });
};

// dg core form validation handler
dg.Form.prototype._validateForm = function() {
  var self = this;
  // Verify required elements have values, otherwise set a form state error on it. Keep in mind that most (if not all)
  // form elements have been wrapped in a container by this point.
  var formState = self.getFormState();
  var setError = function(name) {
    formState.setErrorByName(name, dg.t('The "' + name + '" field is required'));
  };
  for (var name in self.form) {
    if (!dg.isFormElement(name, self.form)) { continue; }
    var el = self.form[name];
    if (el._theme && el._theme == 'container') {
      if (typeof el._children.element.get !== 'function') { continue; }
      if (
          typeof el._children.element.get('element')._required !== 'undefined' &&
          el._children.element.get('element')._required &&
          jDrupal.isEmpty(formState.getValue(name))
      ) { setError(name);  }
    }
    else {
      if (typeof el._required !== 'undefined' && el._required && jDrupal.isEmpty(formState.getValue(name))) {
        setError(name);
      }
    }
  }
  // Run through any validation handlers attached to the form, if any.
  var promises = [];
  for (var i = 0; i < self.form._validate.length; i++) {
    var parts = self.form._validate[i].split('.');
    var obj = parts[0];
    var method = parts[1];
    // Handle prototype validation handler, if any.
    if (obj == this.getFormId() && method == 'validateForm') {
      promises.push(this[method].apply(self, [self.form, self.getFormState()]));
      continue;
    }
    // Handle external validation handlers, if any.
    if (!window[obj] || !window[obj][method]) { continue; }
    promises.push(window[obj][method].apply(self, [self.form, self.getFormState()]));
  }
  return Promise.all(promises);
};

// dg core form submit handler
dg.Form.prototype._submitForm = function() {
  var self = this;
  var promises = [];
  for (var i = 0; i < self.form._submit.length; i++) {
    var parts = self.form._submit[i].split('.');
    var module = parts[0];
    var method = parts[1];
    // Handle prototype submission handler, if any.
    if (module == this.getFormId() && method == 'submitForm') {
      promises.push(this[method].apply(self, [self.form, self.getFormState()]));
      continue;
    }
    // Handle external submission handlers, if any.
    if (!dg.modules[module] || !dg.modules[module][method]) { continue; }
    promises.push(dg.modules[module][method].apply(self, [self.form, self.getFormState()]));
  }
  return Promise.all(promises);
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
dg.setFormElementDefaults = function(name, el) {
  var attrs = el._attributes ? el._attributes : {};
  if (!attrs.id) { attrs.id = 'edit-' + name.toLowerCase().replace(/_/g, '-'); }
  if (!attrs.name) { attrs.name = name; }
  if (!attrs.class) { attrs.class = []; }
  if (!attrs.value && el._value) { attrs.value = el._value; }
  if (!el._widgetType) { el._widgetType = 'FormElement'; }
  if (el._title_placeholder) { attrs.placeholder = el._title; }
  el._attributes = attrs;
};
