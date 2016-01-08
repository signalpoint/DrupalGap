// Let DrupalGap know we have a FormWidget(s).
dg.modules.core.FormWidget = {};

// String textfield field.
dg.modules.core.FormWidget.string_textfield = function(entityType, bundle, fieldName, fieldFormMode) {

  dg.FormWidgetPrepare(this, arguments);

  this.form = function(items, form, formState) {
    return {
      _type: 'textfield',
      _title: this.fieldName,
      _title_placeholder: true
    };
  };

};
// Extend the FormWidget prototype for the string_textfield field.
dg.modules.core.FormWidget.string_textfield.prototype = new dg.FormWidget;
dg.modules.core.FormWidget.string_textfield.prototype.constructor = dg.modules.core.FormWidget.string_textfield;
