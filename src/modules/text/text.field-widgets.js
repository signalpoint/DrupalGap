// Let DrupalGap know we have a FieldWidget(s).
dg.modules.text.FieldWidget = {};

// Text_with_summary field.
// Extend the FieldWidget prototype for the Text_with_summary field.
dg.modules.text.FieldWidget.text_with_summary = function(entityType, bundle, fieldName, element, items, delta) {
  dg.FieldWidgetPrepare(this, arguments);
};
dg.modules.text.FieldWidget.text_with_summary.prototype = new dg.FieldWidget;
dg.modules.text.FieldWidget.text_with_summary.prototype.constructor = dg.modules.text.FieldWidget.text_with_summary;

dg.modules.text.FieldWidget.text_with_summary.prototype.form = function(items, delta, element, form, formState) {
  element._type = 'textarea';
  element._title = this.fieldDefinition.getLabel();
  element._title_placeholder = true;
  element._widgetType = 'FieldWidget';
  element._module = 'text';
  if (items && items[delta] !== 'undefined') {
    element._value = items[delta].value;
  }
};