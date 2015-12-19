/**
 * The Form Element prototype.
 * @param {String} name
 * @param {Object} element
 * @param {Object} form
 * @constructor
 */
dg.FormElement = function(name, element, form) {
  this.name = name;
  this.element = element;
  this.form = form;
  var attrs = element._attributes ? element._attributes : {};
  if (!attrs.id) { attrs.id = 'edit-' + name; }
  if (!attrs.name) { attrs.name = name; }
  element._attributes = attrs;
};
dg.FormElement.prototype.id = function() { return this.element._attributes.id; };
dg.FormElement.prototype.getForm = function() { return this.form; };
dg.FormElement.prototype.get = function(property) {
  return typeof this[property] ? this[property] : null;
};

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