// Let DrupalGap know we have a FieldWidget(s).
dg.modules.text.FieldWidget = {};

// Text_with_summary field.
// Extend the FieldWidget prototype for the Text_with_summary field.
dg.modules.text.FieldWidget.text_with_summary = function(entityType, bundle, fieldName, element) {
  dg.FieldWidgetPrepare(this, arguments);
};
dg.modules.text.FieldWidget.text_with_summary.prototype = new dg.FieldWidget;
dg.modules.text.FieldWidget.text_with_summary.prototype.constructor = dg.modules.text.FieldWidget.text_with_summary;

dg.modules.text.FieldWidget.text_with_summary.prototype.form = function(items, form, formState) {
  return {
    _type: 'textarea',
    _title: this.fieldDefinition.getLabel(),
    _title_placeholder: true,
    _widgetType: 'FieldWidget',
    _module: 'text'
  };
};