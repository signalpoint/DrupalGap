// @see https://api.drupal.org/api/drupal/core!modules!field!field.api.php/group/field_widget/8
// @see http://capgemini.github.io/drupal/writing-custom-fields-in-drupal-8/
dg.FieldWidget = function(entityType, bundle, fieldName) {

  // DON"T DELETE THESE, THEY ARE NEEDED FOR EACH FIELD
  //this.entityType = entityType;
  //this.bundle = bundle;
  //this.fieldName = fieldName;
  //this.fieldDefinition = new dg.FieldDefinitionInterface(entityType, bundle, fieldName);

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