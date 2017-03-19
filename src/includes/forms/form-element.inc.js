/**
 * @see https://api.drupal.org/api/drupal/core!lib!Drupal!Core!Render!Element!FormElementInterface.php/interface/FormElementInterface/8
 * @see https://api.drupal.org/api/drupal/core!lib!Drupal!Core!Render!Element!FormElement.php/class/FormElement/8
 */

/**
 * The Form Element prototype.
 * @param {String} name
 * @param {Object} element
 * @param {Object} form
 * @constructor
 */
dg.FormElement = function(name, element, form) {
  if (arguments.length) { dg.FormElementPrepare(this, arguments); }
};

/**
 *
 * @param FormElement
 * @param args
 */
dg.FormElementPrepare = function(FormElement, args) {

  // List of overrides for future reference.
  // Radio
  // Radios

  // Grab defaults.
  dg._formElementPrepare(FormElement, args);

};
dg._formElementPrepare = function(FormElement, args) {
  FormElement.name = args[0];
  FormElement.element = args[1]; // Holds the form element JSON object provided by the form builder.
  FormElement.form = args[2];
  //FormElement.widgetType = 'FormElement';
};

/**
 *
 * @returns {null}
 */
dg.FormElement.prototype.id = function() { return this.element ? this.element._attributes.id : null; };

/**
 *
 * @returns {Object|*}
 */
dg.FormElement.prototype.getForm = function() { return this.form; };

dg.FormElement.prototype.getFormDomId = function() {
  return this.getForm().getFormDomId();
};

/**
 *
 * @param prop
 * @returns {null}
 */
dg.FormElement.prototype.get = function(prop) { return typeof this[prop] ? this[prop] : null; };

dg.FormElement.prototype.getQuerySelector = function() {
  return '#' + this.getFormDomId() + ' #' + this.id();
};

/**
 * Given an element name, this will return its render element.
 * @param name
 * @returns {null}
 */
dg.FormElement.prototype.getElement = function(name) {
  return typeof this.get('element')[name] ? this.get('element')[name] : null;
};

dg.FormElement.prototype.getDomElement = function() {
  return document.querySelector(this.getQuerySelector());
};

dg.FormElement.prototype.validateValue = function(value) {
  return !jDrupal.isEmpty(value);
};

/**
 *
 * @returns {*}
 */
dg.FormElement.prototype.valueCallback = function() {
  var self = this;
  return new Promise(function(ok, err) {
    var value = null;
    var el = self.getDomElement();
    if (el) { value = el.value; }
    ok({
      name: self.get('name'),
      value: value
    });
  });
};

/**
 * Theme's a form element label.
 * @param variables
 * @returns {string}
 * @see https://api.drupal.org/api/drupal/core!modules!system!templates!form-element-label.html.twig/8
 */
dg.theme_form_element_label = function(variables) {
  return '<label ' + dg.attributes(variables._attributes) + '>' + variables._title + '</label>';
};
