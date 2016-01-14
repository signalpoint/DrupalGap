// @see https://api.drupal.org/api/drupal/core!modules!field!field.api.php/group/field_widget/8
// @see http://capgemini.github.io/drupal/writing-custom-fields-in-drupal-8/
dg.FieldWidget = function(entityType, bundle, fieldName, element, items, delta) {
  // Any default constructor behavior lives in FieldWidgetPrepare
};
// Extend the FormElement prototype.
dg.FieldWidget.prototype = new dg.FormElement;
dg.FieldWidget.prototype.constructor = dg.FieldWidget;
/**
 * Used to prepare a Field Widget default constructor.
 * @param FieldWidget
 * @param args
 * @constructor
 */
dg.FieldWidgetPrepare = function(FieldWidget, args) {
  FieldWidget.widgetType = 'FieldWidget';
  FieldWidget.entityType = args[0];
  FieldWidget.bundle = args[1];
  FieldWidget.fieldName = args[2];
  FieldWidget.name = FieldWidget.fieldName;
  FieldWidget.element = args[3];
  FieldWidget.items = args[4];
  FieldWidget.delta = args[5];
  FieldWidget.fieldDefinition = new dg.FieldDefinitionInterface(
      FieldWidget.entityType,
      FieldWidget.bundle,
      FieldWidget.fieldName
  );
  FieldWidget.fieldFormMode = FieldWidget.element._fieldFormMode;
};
dg.FieldWidget.prototype.getSetting = function(prop) {
  return typeof this.settings[prop] ? this.settings[prop] : null;
};
dg.FieldWidget.prototype.setSetting = function(prop, val) {
  this.settings[property] = val;
};
dg.FieldWidget.prototype.getSettings = function() {
  return this.settings;
};
dg.FieldWidget.prototype.setSettings = function(val) {
  this.settings = val;
};

dg.FieldWidget.prototype.valueCallback = function() {
  var self = this;
  return new Promise(function(ok, err) {
    var value = null;
    var el = document.getElementById(self.id());
    if (el) { value = el.value; }
    ok({
      name: self.get('name'),
      value: [ { value: value }  ]
    });
  });
};
