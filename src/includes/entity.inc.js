/**
 * A proxy to create an instance of a jDrupal Node object.
 * @param nid_or_node
 * @returns {jDrupal.Node}
 * @constructor
 */
dg.Node = function(nid_or_node) { return new jDrupal.Node(nid_or_node); };

dg.entityRenderContent = function(entity) {
  var entityType = entity.getEntityType();
  var bundle = entity.getBundle();
  var label = entity.getEntityKey('label');

  // Build the render array for the entity...
  var content = {};

  // Add the entity label.
  content[label] = {
    _theme: 'entity_label',
    _entity: entity,
    _attributes: {
      'class': [entityType + '-title']
    }
  };

  //console.log(dg);
  //console.log(dg.entity_view_mode);

  // Iterate over each field in the drupalgap entity view mode.
  var viewMode = bundle ? dg.entity_view_mode[entityType][bundle] : dg.entity_view_mode[entityType];
  for (var fieldName in viewMode) {
    if (!viewMode.hasOwnProperty(fieldName)) { continue; }
    console.log(fieldName);
    console.log(viewMode[fieldName]);

    // Grab the field storage config and the module in charge of the field.
    var fieldStorageConfig = dg.fieldStorageConfig[entityType][fieldName];
    if (!fieldStorageConfig) { continue; }
    console.log(fieldStorageConfig);
    var module = fieldStorageConfig.module;
    if (!jDrupal.moduleExists(module)) {
      var msg = 'WARNING - entityRenderContent - The "' + module + '" module is not present to render the "' + fieldName + '" field.';
      console.log(msg);
      continue;
    }
  }
  return content;
};

dg.theme_entity_label = function(variables) {
  return '<h2 ' + dg.attributes(variables._attributes) + '>' + variables._entity.label() + '</h2>';
};