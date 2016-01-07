// Let DrupalGap know we have a FieldWidget(s).
dg.modules.core.FieldWidget = {};

// Integer field.
dg.modules.core.FieldWidget.integer = function(entityType, bundle, fieldName) {

  dg.FieldWidgetPrepare(this, arguments);

  this.form = function(items, form, formState) {
    return {
      _type: 'number',
      _title: this.fieldDefinition.getLabel(),
      _title_placeholder: true
    };
  };

};
// Extend the FieldWidget prototype for the Integer field.
dg.modules.core.FieldWidget.integer.prototype = new dg.FieldWidget;
dg.modules.core.FieldWidget.integer.prototype.constructor = dg.modules.core.FieldWidget.integer;

// String field.
dg.modules.core.FieldWidget.string = function(entityType, bundle, fieldName) {

  dg.FieldWidgetPrepare(this, arguments);

  this.form = function(items, form, formState) {
    return {
      _type: 'textfield',
      _title: this.fieldDefinition.getLabel(),
      _title_placeholder: true
    };
  };

};
// Extend the FieldWidget prototype for the String field.
dg.modules.core.FieldWidget.string.prototype = new dg.FieldWidget;
dg.modules.core.FieldWidget.string.prototype.constructor = dg.modules.core.FieldWidget.string;
