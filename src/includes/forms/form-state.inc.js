// @see https://api.drupal.org/api/drupal/core!lib!Drupal!Core!Form!FormStateInterface.php/interface/FormStateInterface/8

/**
 *
 * @constructor
 */
dg.FormStateInterface = function(form) {
  this.form = form;
  this.values = {};
  this.errors = {};
};

dg.FormStateInterface.prototype.get = function(property) {
  return typeof this[property] !== 'undefined' ? this[property] : null;
};
dg.FormStateInterface.prototype.set = function(property, value) {
  this[property] = value;
};
dg.FormStateInterface.prototype.setFormState = function() {
  var self = this;
  var form = self.get('form');
  var promises = [];
  for (var name in form.elements) {
    if (!form.elements.hasOwnProperty(name) || name == 'actions') { continue; }
    if (form.elements[name].element._type == 'markup') { continue; }
    promises.push(form.elements[name].valueCallback());
  }
  return Promise.all(promises).then(function(values) {
    for (var i = 0; i < values.length; i++) {
      self.setValue(values[i].name, values[i].value);
    }
  });
};
dg.FormStateInterface.prototype.setErrorByName = function(name, msg) {
  this.errors[name] = msg;
};
dg.FormStateInterface.prototype.getErrors = function() {
  return this.errors;
};
dg.FormStateInterface.prototype.hasAnyErrors = function() {
  var hasError = false;
  var errors = this.getErrors();
  for (error in errors) {
    if (!errors.hasOwnProperty(error)) { continue; }
    hasError = true;
    break;
  }
  return hasError;
};

/**
 * Gets the forms error messages and returns them in an array, or null if there are none.
 * @returns {Array}
 */
dg.FormStateInterface.prototype.getErrorMessages = function() {
  var errors = this.getErrors();
  var messages = [];
  for (error in errors) {
    if (!errors.hasOwnProperty(error)) { continue; }
    messages.push(errors[error]);
  }
  return messages.length ? messages : null;
};

/**
 * This will display the form errors (if any) in the messages block.
 * @TODO this won't work when a form is loaded in a dg_modal, the message block won't be visible there!
 */
dg.FormStateInterface.prototype.displayErrors = function() {
  var messages = this.getErrorMessages();
  if (messages) {
    messages.forEach(function(message) { dg.setMessage(message, 'error'); });
    dg.blockRefresh('messages');
    var messagesBlock = dg.getBlockFromDom('messages');
    if (messagesBlock) { messagesBlock.scrollIntoView(false); }
  }
};

/**
 * Clears the form state errors.
 * @returns {dg.FormStateInterface}
 */
dg.FormStateInterface.prototype.clearErrors = function() {
  this.errors = {};
};

dg.FormStateInterface.prototype.getValue = function(key, default_value) {
  return typeof this.get('values')[key] !== 'undefined' ?
    this.get('values')[key] : default_value;
};
dg.FormStateInterface.prototype.setValue = function(key, value) {
  this.values[key] = value;
};
dg.FormStateInterface.prototype.getValues = function() {
  return this.get('values');
};
dg.FormStateInterface.prototype.setValues = function(values) {
  this.values = values;
};