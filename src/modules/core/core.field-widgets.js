// Let DrupalGap know we have a FieldWidget(s).
dg.modules.core.FieldWidget = {};

// Integer field.
// Extend the FieldWidget prototype for the Integer field.
dg.modules.core.FieldWidget.integer = function(entityType, bundle, fieldName, element) {
  dg.FieldWidgetPrepare(this, arguments);
};
dg.modules.core.FieldWidget.integer.prototype = new dg.FieldWidget;
dg.modules.core.FieldWidget.integer.prototype.constructor = dg.modules.core.FieldWidget.integer;

dg.modules.core.FieldWidget.integer.prototype.form = function(items, form, formState) {
  return {
    _type: 'number',
    _title: this.fieldDefinition.getLabel(),
    _title_placeholder: true,
    _widgetType: 'FieldWidget',
    _module: 'core'
  };
};

// String field.
// Extend the FieldWidget prototype for the String field.
dg.modules.core.FieldWidget.string = function(entityType, bundle, fieldName, element) {
  dg.FieldWidgetPrepare(this, arguments);
};
dg.modules.core.FieldWidget.string.prototype = new dg.FieldWidget;
dg.modules.core.FieldWidget.string.prototype.constructor = dg.modules.core.FieldWidget.string;

dg.modules.core.FieldWidget.string.prototype.form = function(items, form, formState) {
  return {
    _type: 'textfield',
    _title: this.fieldDefinition.getLabel(),
    _title_placeholder: true,
    _widgetType: 'FieldWidget',
    _module: 'core'
  };
};
