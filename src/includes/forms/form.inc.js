/**
 * @TODO the fact that you're using "self" all over the place is sketchy, and I believe instead we should be using
 * .call() and/or .apply() to properly set "this" instead of getting/settings "self" all over the place.
 */

dg.forms = {}; // A global storage for active forms.

/**
 * Given a form id, this will return an empty placeholder for the form. It then uses a `_postRender` to dynamically
 * load and inject the form's html into the waiting placeholder container.
 * @param {Object} variables
 *  _id - The form id, e.g. UserLoginForm, MyCustomForm
 * @returns {String}
 */
dg.theme_form = function(variables) {
  // Validate variables.
  var msg = '';
  if (!variables._id) { msg = 'missing _id'; }
  var factoryFunction = window[variables._id];
  if (!factoryFunction) { msg = 'form id not found: ' + variables._id; }
  if (msg != '') { console.log('dg.theme_form - ' + msg); return ''; }

  // Add an empty div for the form's wrapper, then use a post render to load and inject the form into the DOM.
  var formDomId = dg.killCamelCase(variables._id, '-');
  variables._attributes.id = 'form-wrapper-' + formDomId;
  return dg.render({
    _markup: '<div ' + dg.attributes(variables._attributes) + '></div>',
    _postRender: [function() {
      dg.addForm(variables._id, dg.applyToConstructor(factoryFunction)).getForm(variables).then(function(html) {
        document.getElementById(variables._attributes.id).innerHTML = html;
        dg.formAttachSubmissionHandler(formDomId);
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
dg.formDomIdFromId = function(formId) { return dg.killCamelCase(formId, '-').toLowerCase(); };

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
dg.Form.prototype.getFormDomId = function() { return dg.formDomIdFromId(this.getFormId()); };

/**
 * // Set up default values across each element.
 * @param form
 */
dg.Form.prototype.prepareFormElements = function(self) {
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
};

dg.Form.prototype.removeElements = function() {
  for (var name in this.form) {
    if (!dg.isFormElement(name, this.form)) { continue; }
    delete this.form[name];
  }
};

dg.Form.prototype.goToNextPage = function() {
  try {

    // Grab the form's DOM Id.
    var formDomId = this.getFormDomId();
    console.log('formDomId', formDomId);
    console.log('going to next page...');

    // Determine the current page and the next page.
    var page = this.pageNumber();
    var nextPage = page + 1;
    console.log('page', page);
    console.log('nextPage', nextPage);

    // Determine the next page's buildForm function name.
    var buildName = 'buildForm' + (nextPage + 1);
    console.log('buildName', buildName);

    // Validate the buildForm function's existance.
    if (this[buildName]) {

      // Remove previous page's form elements.
      this.removeElements();

      // Call the page's formBuild to get the Promise.
      var builtForm = this._formBuild(buildName);
      console.log('builtForm', builtForm);

      var self = this;

      if (builtForm) {

        builtForm.then(function() {

          // The form's page has been built, now we handling it's Promise's resolution...

          console.log('builtForm resolved', arguments);

          self.prepareFormElements(self);

          self.alterThenRender(self, function(html) {
            console.log('html => ' + formDomId, html);
            document.getElementById(formDomId).innerHTML = html;
            //dg.formAttachSubmissionHandler(formDomId);
            //dg.runPostRenders();
          }, function() { console.log(arguments) });

        });
      }
    }
  }
  catch (error) { console.log('goToNextPage ERROR', error); }
};

dg.Form.prototype.alterThenRender = function(self, ok, err) {
  var alters = jDrupal.moduleInvokeAll('form_alter', self.form, self.getFormState(), self.getFormId());
  var alterDone = function() { self._render(self, ok, err); };
  if (!alters) { alterDone(); }
  else { alters.then(alterDone); }
};

dg._dgGetFormFlood = 0;
dg._dgGetFormFloodMax = 10;
/**
 * Returns the html output for a form, via a Promise.
 * @returns {Promise}
 */
dg.Form.prototype.getForm = function() {
  dg._dgGetFormFlood++;
  if (dg._dgGetFormFlood > dg._dgGetFormFloodMax) {
    console.log('killing the runaway form flood!');
    return;
  }
  var self = this;
  //var selfArguments = arguments;
  this.setBuildArguments(arguments);
  var selfArguments = this.getBuildArguments();
  console.log('selfArguments', arguments, selfArguments);


  return new Promise(function(ok, err) {
    var done = function() {

      self.prepareFormElements(self);

      self.alterThenRender(self, ok, err);

      // Allow form alterations, and set up the resolve to instantiate the form
      // elements and resolve the rendered form.
      // @TODO should this alter be moved after the widget assembly? Then we won't have to pass the element by reference
      // to its widget form builder.
      //var alters = jDrupal.moduleInvokeAll('form_alter', self.form, self.getFormState(), self.getFormId());
      //var alterDone = function() {
      //  self._render(self, ok, err);
      //};
      //if (!alters) { alterDone(); }
      //else { alters.then(alterDone); }

    };

    // If there are arguments send them along to the form, otherwise just build the form.
    var builtForm = self._formBuild();
    if (builtForm) { builtForm.then(done); }
    //var builtForm = null;
    //if (selfArguments.length) {
    //  var formArgs = [self.form, self.form_state];
    //  for (var i = 0; i < selfArguments.length; i++) { formArgs.push(selfArguments[i]); }
    //  builtForm = self.buildForm.apply(this, formArgs);
    //}
    //else { builtForm = self.buildForm(self.form, self.form_state); }
    //builtForm.then(done);

  });
};

dg.Form.prototype._render = function(self, ok, err) {
  //var form = '';
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

dg.Form.prototype.setBuildArguments = function(args) { this._buildArguments = args; };

dg.Form.prototype.getBuildArguments = function() { return this._buildArguments; };

dg.Form.prototype._formBuild = function(buildName) {
  if (!buildName) { buildName = 'buildForm'; }
  var buildArguments = this.getBuildArguments();
  var builtForm = null;
  if (buildArguments && buildArguments.length) {
    var formArgs = [this.form, this.form_state];
    for (var i = 0; i < buildArguments.length; i++) { formArgs.push(buildArguments[i]); }
    builtForm = this[buildName].apply(this, formArgs);
  }
  else { builtForm = this[buildName](this.form, this.form_state); }
  return builtForm;
};

dg.Form.prototype.getFormState = function() {
  return this.form_state;
};

/**
 * Given a boolean, this will mark the form as multi page or not. If you skip the argument, then it will return true if
 * the form is set as a multi page form, false otherwise, defaults to false.
 * @returns {boolean}
 */
dg.Form.prototype.multiPage = function() {
  // Setting the value?
  if (arguments.length) { this._multiPage = arguments[0]; }
  // Checking the value?
  else { return typeof this._multiPage !== 'undefined' ? this._multiPage : false; }
};

dg.Form.prototype.pageCount = function() {
  var count = 0;
  var buildFunctionNameBase = 'buildForm';
  var buildFunctionNameCheck = buildFunctionNameBase;
  while (this[buildFunctionNameCheck]) {
    count++;
    buildFunctionNameCheck = buildFunctionNameBase + (count + 1);
  }
  console.log('pageCount', count);
  return count;
};

dg.Form.prototype.pageNumber = function() {
  // Setting the value?
  if (arguments.length) { this._pageNumber = arguments[0]; }
  // Checking the value?
  else { return typeof this._pageNumber !== 'undefined' ? this._pageNumber : 0; }
};

dg.Form.prototype.onFirstPage = function() {
  return this.pageNumber() == 0;
};

dg.Form.prototype.onLastPage = function() {
  return this.pageCount() == (this.pageNumber() - 1);
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
  self.disableSubmitButton();
  return new Promise(function(ok, err) {
    var formState = self.getFormState();
    formState.setFormState().then(function() {
      formState.clearErrors();
      self._validateForm().then(function() {
        if (formState.hasAnyErrors()) {
          self.enableSubmitButton();
          formState.displayErrors();
          err();
          return;
        }
        self._submitForm(self, formState).then(function() {

          var done = function() {
            if (self.form._action) { dg.goto(self.form._action); }
            //dg.removeForm(self.getFormId());
            ok();
          };

          if (self.multiPage()) {

            if (self.onLastPage()) { done(); }
            else {
              console.log('not on last page! ' + (self.pageNumber() + 1) + '/' + self.pageCount());

              self.goToNextPage();
              done();

            }

          }
          else { done(); }
        }).catch(function() {
          self.enableSubmitButton();
        });
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
    formState.setErrorByName(name, dg.t('The "' + name + '" field is required'));
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
  return '#' + dg.killCamelCase(this.getFormId()) + ' #' + dg.formSubmitButtonId(this);
};

/**
 * Disables the submit button on the form.
 */
dg.Form.prototype.enableSubmitButton = function() {
  document.querySelector(this.getSubmitButtonSelector()).disabled = false;
};
/**
 * Enables the submit button on the form.
 */
dg.Form.prototype.disableSubmitButton = function() {
  document.querySelector(this.getSubmitButtonSelector()).disabled = true;
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
 * Given a form id from the DOM, this will attach the internal submission handler event via JavaScript. The handler
 * function waits until submission then invokes DrupalGap's core form validation and submission system.
 */
dg.formAttachSubmissionHandler = function(id) {
  var form_html_id = dg.killCamelCase(id, '-');
  var form = document.getElementById(form_html_id);
  if (!form) { return false; }
  function processForm(e) {
    // @TODO if any developer has a JS error during form submission, form state values are
    // placed into the url for all to see, yikes, wtf.
    if (e.preventDefault) e.preventDefault();
    var _form = dg.loadForm(jDrupal.ucfirst(dg.getCamelCase(this.id)));
    _form._submission().then(
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

dg.isFormElement = function(prop, obj) {
  return typeof obj == 'object' && obj.hasOwnProperty(prop) && prop.charAt(0) != '_';
};
dg.isFormProperty = function(prop, obj) {
  return obj.hasOwnProperty(prop) && prop.charAt(0) == '_';
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
