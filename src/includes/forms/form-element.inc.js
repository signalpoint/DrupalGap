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

dg.FormElementPrepare = function(FormElement, args) {
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

/**
 *
 * @param prop
 * @returns {null}
 */
dg.FormElement.prototype.get = function(prop) { return typeof this[prop] ? this[prop] : null; };

/**
 * Given an element name, this will return its render element.
 * @param name
 * @returns {null}
 */
dg.FormElement.prototype.getElement = function(name) {
  return typeof this.get('element')[name] ? this.get('element')[name] : null;
};

/**
 *
 * @returns {*}
 */
dg.FormElement.prototype.valueCallback = function() {
  var self = this;
  return new Promise(function(ok, err) {
    var value = null;
    var el = document.getElementById(self.id());
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
