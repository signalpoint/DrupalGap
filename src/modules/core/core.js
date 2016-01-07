dg.modules.core = new dg.Module();

// Let DrupalGap know we have a FieldWidget.
dg.modules.core.FieldWidget = {};

// Integer field.
dg.modules.core.FieldWidget.integer = function(entityType, bundle, fieldName) {

  this.entityType = entityType;
  this.bundle = bundle;
  this.fieldName = fieldName;
  this.fieldDefinition = new dg.FieldDefinitionInterface(entityType, bundle, fieldName);

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