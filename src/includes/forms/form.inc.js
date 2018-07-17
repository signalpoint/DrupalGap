dg.forms = {}; // A global storage for active forms.

/**
 * Given a form id, this will return an empty placeholder for the form. It then uses a `_postRender` to dynamically
 * load and inject the form's html into the waiting placeholder container.
 * @param {Object} variables
 *  _id {Number} The form id, e.g. UserLoginForm, MyCustomForm
 *  _node {Object} Optional, attach a node to include its node id in the form context's id.
 * @returns {String}
 */
dg.theme_form = function(variables) {
  var debugPrefix = 'dg.theme_form - '; // Helps developers with broken forms.

  // Validate variables and figure out the Form instance's function name.
  var msg = '';
  if (!variables._id) { msg = 'missing _id'; }
  var factoryFunctionName = variables._id;
  var factoryFunction = window[factoryFunctionName];
  if (!factoryFunction) { msg = 'form id not found: ' + factoryFunctionName; }
  if (msg != '') { console.log(debugPrefix + msg); return ''; }

  // Figure out an id for the form's wrapper div. If a node is attached to the form, use its node id for additional
  // context on the wrapper div's id. This helps one form power many nodes (e.g. webforms).
  var formWrapperIdSuffix = dg.killCamelCase(factoryFunctionName, '-');
  variables._attributes.id = 'form-wrapper-' + formWrapperIdSuffix;
  if (variables._node) { variables._attributes.id += '-' + variables._node.nid; }
  var formWrapperId = variables._attributes.id;

  // Render the empty wrapper for the form, then use a post render to load and inject the form into the DOM.
  return dg.render({
    _markup: '<div ' + dg.attrs(variables) + '></div>',
    _postRender: [function() {

      // Assemble the Form instance.
      var formObj = dg.addForm(factoryFunctionName, dg.applyToConstructor(factoryFunction));

      // WARNING: don't do any customizations between the addForm() and getForm() calls here, put any extra stuff into
      // getForm() so it's picked up by any usage of dg.theme_form() too.

      // Get the form's html.
      formObj.getForm(variables).then(function(html) {

        // Extract the form object.
        var form = formObj.form;

        // Set the form's html in the DOM.
        var formWrapper = dg.qs('#' + formWrapperId);
        if (formWrapper) { formWrapper.innerHTML = html; }
        else { console.log(debugPrefix + 'form wrapper missing: ' + formWrapperId); return; }

        // If the form has actions, attach submission handlers.
        if (dg.formHasActions(form)) {
          dg.formAttachSubmissionHandler(form._attributes.id);
        }

        // Run any post renders for good luck.
        dg.runPostRenders();

      });
    }]
  });

};

/**
 * Given a form id, this will return the id that will be used in the DOM.
 * @param {String} formId
 * @returns {string}
 */
dg.formDomIdFromId = function(formId) {
  return dg.killCamelCase(formId, '-').toLowerCase();
};

/**
 * The Form prototype.
 * @param id
 * @constructor
 */
dg.Form = function(id) {

  this.id = id;

  // @TODO this should be turned into a prototype (e.g. FormInterface), that way when this is passed into validate
  // and submit handlers it'll be much easier to work with. However, why aren't we just passing the Form prototype
  // into the validate and submit handlers right now? Currently we're sending in this JSON object which isn't
  // very helpful. We should still turn this into a FormInterface, and then pass in the Form prototype to the
  // handlers.
  this.form = {
    _attributes: {
      id: dg.formDomIdFromId(id),
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
 * Returns the form's id to be used in the DOM.
 * @returns {String}
 */
dg.Form.prototype.getFormDomId = function() {
  return this.form._attributes.id;
};

/**
 * Returns the html output for a form, via a Promise.
 * @returns {Promise}
 */
dg.Form.prototype.getForm = function() {
  var self = this;
  var selfArguments = arguments;

  return new Promise(function(ok, err) {
    var done = function() {

      // Attach the factory function name (aka the original form id) to the form's attributes, that way in the submit
      // handler we have easy access to the original factory function name in case the developer attached a node context
      // to the form.
      self.form._attributes['data-id'] = self.id;

      // Set up default values across each element.
      // @TODO this should be the FormElementPrepare prototype, or combination of.
      for (var name in self.form) {
        if (!dg.isFormElement(name, self.form)) { continue; }
        var el = self.form[name];
        if (el._type == 'actions') {
          dg.setFormElementDefaults(name, el);
          for (var _name in el) {
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

          // Set any missing default values.
          if (!element._type) { element._type = 'markup'; }
          if (!element._widgetType) { element._widgetType = 'FormElement'; }

          // Reset the attribute value to that of the element value if it changed during form alteration.
          // @TODO this is weird... why would we want to overwrite an alteration?
          //if (element._attributes.value != element._value) { element._attributes.value = element._value; }

          // Depending on the type of widget/element...
          switch (element._widgetType) {

            // @TODO move support for FieldWidget and FormWidget into a contrib module.
            case 'FieldWidget':
            case 'FormWidget':

              //console.log(element._widgetType);
              //console.log(name);

              // Instantiate the widget using the element's module.
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

              // Build the element form and then add it to the form as a container.
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

              // Determine constructor by looking for any FormElement implementations.
              var constructorName = element._widgetType;
              if (element._type) {
                var nameToCheck = jDrupal.ucfirst(dg.getCamelCase(element._type)) + 'Element';
                if (dg[nameToCheck]) { constructorName = nameToCheck; }
              }

              // Instantiate a new form element given the current buildForm element for the Form.
              var el = new dg[constructorName](name, element, self);
              self.elements[name] = el;

              // Hidden and markup elements need nothing more.
              if (jDrupal.inArray(element._type,  ['hidden', 'markup'])) { continue; }

              // Place the potential label, and element, as children to a container.
              var children = {
                _attributes: {
                  'class': []
                }
              };
              if (element._title && !element._attributes.placeholder) {
                if (element._type == 'checkbox') { /* single checkboxes provide their own label */ }
                else {
                  children.label = {
                    _theme: 'form_element_label',
                    _title: element._title,
                    _attributes: {
                      'class': [],
                      'for': element._attributes.id
                    }
                  };
                }
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

    };

    // If there are arguments send them along to the form, otherwise just build the form.
    if (selfArguments.length) {
      var formArgs = [self.form, self.form_state];
      for (var i = 0; i < selfArguments.length; i++) { formArgs.push(selfArguments[i]); }
      self.buildForm.apply(this, formArgs).then(done);
    }
    else { self.buildForm(self.form, self.form_state).then(done); }

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

/**
 * Submits the form.
 */
dg.Form.prototype.submit = function() {
  return this._submission();
};

// dg core form UX submission handler
dg.Form.prototype._submission = function() {
  var self = this;
  self.disableSubmitButton();

  return new Promise(function(ok, err) {

    // Get the form state controller, and have it set the actual form state...
    var formState = self.getFormState();
    formState.setFormState().then(function() {

      // Clear any previous errors.
      formState.clearErrors();

      // Validate the form...
      self._validateForm().then(function() {

        // If there are any errors, enable the submit button and show the errors.
        if (formState.hasAnyErrors()) {
          self.enableSubmitButton();
          formState.displayErrors();
          err();
          return;
        }

        // Form state is valid, run the form's submission handler...
        self._submitForm(self, formState).then(function() {

          // Figure out our destination, or fallback to the form action, if any.
          var destination = dg._GET('destination') ? dg._GET('destination') : null;
          if (!destination && self.form._action) { destination = self.form._action; }

          // If there was a destination specified, go there (keep in mind the router will then remove the form from
          // dg.forms upon route change) and then resolve. Otherwise just resolve (which leaves the dg.forms entry in
          // place).
          if (destination) { dg.goto(destination); }
          ok();

        }).catch(function() { self.enableSubmitButton(); });

      });
    });
  });
};

// dg core form validation handler
dg.Form.prototype._validateForm = function() {
  var self = this;
  var formState = self.getFormState();

  // Prepare to handle any validation errors.
  var setError = function(name) {
    formState.setErrorByName(name, dg.t('The @name field is required.', { '@name': name }));
  };

  // Verify required elements have values. Keep in mind that most (if not all) form elements have been wrapped in a
  // container by this point.
  for (var name in self.form) {
    if (!dg.isFormElement(name, self.form)) { continue; }
    var el = self.form[name];
    if (el._theme && el._theme == 'container') {
      if (typeof el._children.element.get !== 'function') { continue; }
      if (el._children.element.get('element')._required && !el._children.element.validateValue(formState.getValue(name))) {
        setError(name);
      }
    }
    else {
      if (typeof el._required !== 'undefined' && el._required) {
        if (jDrupal.isEmpty(formState.getValue(name))) {
          console.log('_validateForm - we should be invoking validateValue here if possible');
          setError(name);
        }
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

dg.Form.prototype.getSubmitButtonSelector = function() {
  return '#' + this.getFormDomId() + ' #' + dg.formSubmitButtonId(this);
};

dg.Form.prototype.getSubmitButton = function() {
  return dg.qs(this.getSubmitButtonSelector());
};

/**
 * Disables the submit button on the form.
 */
dg.Form.prototype.enableSubmitButton = function() {
  var btn = this.getSubmitButton();
  if (btn) { btn.disabled = false; }
};

/**
 * Enables the submit button on the form.
 */
dg.Form.prototype.disableSubmitButton = function() {
  var btn = this.getSubmitButton();
  if (btn) { dg.qs(btn).disabled = true; }
};

/**
 * Given a Form, this will return its' submit button id as a string, or null if it can't find it.
 * @param {dg.Form} form
 * @returns {string}
 */
dg.formSubmitButtonId = function(form) {
  if (form.elements && form.elements.actions) {
    var element = form.elements.actions.element;
    for (var action in element) {
      if (!element.hasOwnProperty(action)) { continue; }
      var _action = element[action];
      if (!_action) { continue; }
      if (!dg.isFormElement(action, element)) { continue; }
      if (_action._type == 'submit') { return _action._attributes.id; }
    }
  }
  return null;
};

/**
 * Given a form id, and a function to build the form (function contains e.g. buildForm, validateForm, submitForm) this
 * will instantiate a new dg.Form, set its id as a global variable and then return the dg.Form.
 * @param {String} formId
 * @param {Function }form
 * @returns {dg.Form}
 */
dg.createForm = function(formId, form) {
  form.prototype = new dg.Form(formId);
  form.constructor = form;
  window[formId] = form;
  return form;
};

dg.addForm = function(id, form) {
  dg.forms[id] = form;
  return dg.forms[id];
};

/**
 * Given a form id, this will return true if its form builder function exists, false otherwise.
 * @param id
 * @returns {*}
 */
dg.formExists = function(id) { return jDrupal.functionExists(id); };

/**
 * Given a form id, this will return its Form instance if it exists, null otherwise.
 * @param id
 * @returns {Form|null}
 */
dg.loadForm = function(id) { return dg.forms[id] ? dg.forms[id] : null; };

dg.loadForms = function() { return dg.forms; };
dg.removeForm = function(id) { delete dg.forms[id]; };
dg.removeForms = function() { dg.forms = {}; };

/**
 * Given a form, this will return true if it has an 'actions' element, false otherwise.
 * @param form {Object} A form after it has been built, aka all elements are wrapped in containers.
 * @returns {boolean}
 */
dg.formHasActions = function(form) {
  var hasActions = false;
  for (var name in form) {
    if (!form.hasOwnProperty(name)) { continue; }
    var element = form[name];
    if (!element || !element._theme || element._theme != 'container' || !element._children) { continue; }
    for (var _name in element._children) {
      if (!element._children.hasOwnProperty(_name)) { continue; }
      var _element = element._children[_name];
      if (_element.name == 'actions') {
        hasActions = true;
        break;
      }
    }
    if (hasActions) { break; }
  }
  return hasActions;
};

/**
 * Given a form id from the DOM, this will attach the internal submission handler event via JavaScript. The handler
 * function waits until submission then invokes DrupalGap's core form validation and submission system.
 */
dg.formAttachSubmissionHandler = function(id) {
  var form = dg.qs('#' + id);
  if (!form) {
    //console.log('formAttachSubmissionHandler - failed to find form in DOM: ' + id);
    // @TODO why does this moment cause all the submission values to get set into the URL query string?
    return false;
  }
  function processForm(e) {
    if (e.preventDefault) e.preventDefault();
    var factoryFunctionName = form.getAttribute('data-id');
    var _form = dg.loadForm(factoryFunctionName);
    _form.submit().then(
        function() { },
        function() { }
    );
    return false; // Prevent default form behavior.
  }
  if (form.attachEvent) { form.attachEvent("submit", processForm); }
  else { form.addEventListener("submit", processForm); }
  return true;
};

/**
 * Given a form interface that is normally passed to a form's validate and submit handlers, this will return
 * the corresponding Form prototype instance associated with the form interface.
 * @param form
 */
dg.loadFormFromInterface = function(form) {
  return dg.loadForm(jDrupal.ucfirst(dg.getCamelCase(form._attributes.id)));
};

/**
 * Given a form element name and a form, this will return true if an element on the form exists that matches the given
 * name, false otherwise.
 * @param name {*}
 * @param form {Object}
 * @returns {boolean}
 */
dg.isFormElement = function(name, form) {
  return typeof form == 'object' && form.hasOwnProperty(name) && name.charAt(0) != '_';
};

/**
 * Given a form element name and a form, this will return true if an property on the form exists that matches the given
 * name, false otherwise.
 * @param name {*}
 * @param form {Object}
 * @returns {boolean}
 */
dg.isFormProperty = function(name, form) {
  return form.hasOwnProperty(name) && name.charAt(0) == '_';
};

dg.setFormElementDefaults = function(name, el) {
  var attrs = el._attributes ? el._attributes : {};
  if (!attrs.id) { attrs.id = dg.formElementDomIdFromName(name); }
  if (!attrs.name) { attrs.name = name; }
  if (!attrs.class) { attrs.class = []; }
  if (!attrs.value && el._value) { attrs.value = el._value; }
  if (typeof el._default_value !== 'undefined') { attrs.value = el._default_value; }
  if (!el._widgetType) { el._widgetType = 'FormElement'; }
  if (el._title_placeholder) { attrs.placeholder = el._title; }
  el._attributes = attrs;
};

/**
 * Given a form element name, this will return the id to be used for it in the DOM.
 * @param {String} name
 * @returns {string}
 */
dg.formElementDomIdFromName = function(name) {
  return 'edit-' + name.toLowerCase().replace(/_/g, '-');
};
