dg.FieldDefinitionInterface = function(entityType, bundle, fieldName) {
  this.entityType = entityType;
  this.bundle = bundle;
  this.fieldName = fieldName;
  // Unwrap user entities from the bundle, leave all others as is.
  this.fieldDefinition = entityType == 'user' ?
      dg.fieldDefinitions[entityType][fieldName] : dg.fieldDefinitions[entityType][bundle][fieldName];
};
dg.FieldDefinitionInterface.prototype.get = function(prop) {
  return typeof this.fieldDefinition[prop] ? this.fieldDefinition[prop] : null;
};
dg.FieldDefinitionInterface.prototype.getLabel = function() {
  return this.get('label');
};
