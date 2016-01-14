// Let DrupalGap know we have a FieldWidget(s).
dg.modules.core.FieldWidget = {};

// Integer field.
// Extend the FieldWidget prototype for the Integer field.
dg.modules.core.FieldWidget.integer = function(entityType, bundle, fieldName, element, items, delta) {
  dg.FieldWidgetPrepare(this, arguments);
};
dg.modules.core.FieldWidget.integer.prototype = new dg.FieldWidget;
dg.modules.core.FieldWidget.integer.prototype.constructor = dg.modules.core.FieldWidget.integer;

dg.modules.core.FieldWidget.integer.prototype.form = function(items, delta, element, form, formState) {
  element._type = 'number';
  element._title = this.fieldDefinition.getLabel();
  element._title_placeholder = true;
  element._widgetType = 'FieldWidget';
  element._module = 'core';
  if (items && items[delta] !== 'undefined') {
    element._value = items[delta].value;
    element._attributes.value = element._value;
  }
};

// String field.
// Extend the FieldWidget prototype for the String field.
dg.modules.core.FieldWidget.string = function(entityType, bundle, fieldName, element, items, delta) {
  dg.FieldWidgetPrepare(this, arguments);
};
dg.modules.core.FieldWidget.string.prototype = new dg.FieldWidget;
dg.modules.core.FieldWidget.string.prototype.constructor = dg.modules.core.FieldWidget.string;

dg.modules.core.FieldWidget.string.prototype.form = function(items, delta, element, form, formState) {
  element._type = 'textfield';
  element._title = this.fieldDefinition.getLabel();
  element._title_placeholder = true;
  element._widgetType = 'FieldWidget';
  element._module = 'core';
  if (items && items[delta] !== 'undefined') {
    element._value = items[delta].value;
    element._attributes.value = element._value;
  }
};
