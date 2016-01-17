// Let DrupalGap know we have a FormWidget(s).
dg.modules.core.FormWidget = {};

// @TODO the "items" args here should be prototypes of field-item-list-interface

// String textfield widget.
dg.modules.core.FormWidget.string_textfield = function(entityType, bundle, fieldName, element, items, delta) {
  dg.FormWidgetPrepare(this, arguments);
};
dg.modules.core.FormWidget.string_textfield.prototype = new dg.FormWidget;
dg.modules.core.FormWidget.string_textfield.prototype.constructor = dg.modules.core.FormWidget.string_textfield;
dg.modules.core.FormWidget.string_textfield.prototype.form = function(items, delta, element, form, formState) {
  element._type = 'textfield';
  element._title = this.fieldName;
  element._title_placeholder = true;
  element._widgetType = 'FormWidget';
  element._module = 'core';
  if (items && items[delta] !== 'undefined') {
    element._value = items[delta].value;
    element._attributes.value = element._value;
  }
};

// @TODO Move the bundle and entityID widgets to the entity module.

// Bundle widget.
dg.modules.core.FormWidget.bundle = function(entityType, bundle, fieldName, element, items, delta) {
  dg.FormWidgetPrepare(this, arguments);
};
dg.modules.core.FormWidget.bundle.prototype = new dg.FormWidget;
dg.modules.core.FormWidget.bundle.prototype.constructor = dg.modules.core.FormWidget.bundle;
dg.modules.core.FormWidget.bundle.prototype.form = function(items, delta, element, form, formState) {
  element._type = 'hidden';
  if (items && items[delta] !== 'undefined') {
    element._value = items[delta].value;
    element._attributes.value = element._value;
  }
};
dg.modules.core.FormWidget.bundle.prototype.valueCallback = function(items, form, formState) {
  var fakeEntity = new dg[jDrupal.ucfirst(this.get('entityType'))](null);
  return {
    name: fakeEntity.getEntityKey('bundle'),
    value: [ { target_id: this.get('bundle') } ]
  };
};

// entityID widget.
dg.modules.core.FormWidget.entityID = function(entityType, bundle, fieldName, element, items, delta) {
  dg.FormWidgetPrepare(this, arguments);
};
dg.modules.core.FormWidget.entityID.prototype = new dg.FormWidget;
dg.modules.core.FormWidget.entityID.prototype.constructor = dg.modules.core.FormWidget.entityID;
dg.modules.core.FormWidget.entityID.prototype.form = function(items, delta, element, form, formState) {
  element._type = 'hidden';
  if (items && items[delta] !== 'undefined') {
    element._value = items[delta].value;
    element._attributes.value = element._value;
  }
};
