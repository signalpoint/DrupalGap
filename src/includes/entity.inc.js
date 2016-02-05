/**
 * A proxy to create an instance of a jDrupal Node object.
 * @param nid_or_node
 * @returns {jDrupal.Node}
 * @constructor
 */
dg.Node = function(nid_or_node) { return new jDrupal.Node(nid_or_node); };

dg.entityRenderContent = function(entity) {

  return new Promise(function(ok, err) {

    var entityType = entity.getEntityType();
    var bundle = entity.getBundle();
    var label = entity.getEntityKey('label');

    // Build the render array for the entity...
    var content = {};

    // Add the entity label.
    dg.setTitle({
      _theme: 'entity_label',
      _entity: entity,
      _title: entity.label(),
      _attributes: {
        'class': [entityType + '-title']
      }
    });
    // @TODO convert this to a _title_callback on the route.
    dg.setDocumentTitle(entity.label());

    //console.log(dg.entity_view_mode);

    // Get the view mode.
    // @TODO viewMode should be turned into a prototype. Then use its functions below instead of accessing properties directly.
    var viewMode = bundle ? dg.entity_view_mode[entityType][bundle] : dg.entity_view_mode[entityType];
    if (entityType == 'user') { viewMode = viewMode[entityType]; } // Unwrap the user viewMode since there is no bundle.
    //console.log('viewMode - ' + entityType + ' / ' + bundle);
    //console.log(viewMode);

    // Iterate over each field in the drupalgap entity view mode.
    for (var fieldName in viewMode) {
      if (!viewMode.hasOwnProperty(fieldName)) { continue; }

      //console.log(fieldName);
      //console.log(viewMode[fieldName]);

      // Grab the field storage config and the module in charge of the field.
      var fieldStorageConfig = dg.fieldStorageConfig[entityType][fieldName];
      if (!fieldStorageConfig) {
        console.log('entityRenderContent - No field storage config for "' + fieldName + '"');
      }
      else {

        var module = fieldStorageConfig.module;
        var type = viewMode[fieldName].type;
        //console.log(module);
        //console.log(fieldStorageConfig);

        if (!jDrupal.moduleExists(module)) {
          var msg = 'entityRenderContent - The "' + module + '" module is not present to render the "' + fieldName + '" field.';
          console.log(msg);
          continue;
        }
        if (!dg.modules[module].FieldFormatter || !dg.modules[module].FieldFormatter[type]) {
          console.log('entityRenderContent - There is no "' + type + '" formatter in the "' + module + '" module to handle the "' + fieldName + '" field.');
          continue;
        }

        var FieldItemListInterface = new dg.FieldItemListInterface(entity.get(fieldName));
        var FieldDefinitionInterface = new dg.FieldDefinitionInterface(entityType, bundle, fieldName); // @TODO reinstantiating this is stupid. they should be globally instantiated once
        var FieldFormatter = new dg.modules[module].FieldFormatter[type](
            FieldDefinitionInterface,
            viewMode[fieldName].settings, // settings
            viewMode[fieldName].label, // label
            viewMode[fieldName], // viewMode
            viewMode[fieldName].third_party_settings // thirdPartySettings
        );
        var elements = FieldFormatter.viewElements(FieldItemListInterface, entity.language());
        if (jDrupal.isEmpty(elements)) { continue; }
        var children = {};
        if (viewMode[fieldName].label != 'hidden') {
          children.label = {
            _theme: 'form_element_label',
            _title: FieldDefinitionInterface.getLabel(),
            _title_display: 'before'
          };
        }
        children.elements = elements;
        content[fieldName] = {
          _theme: 'container',
          _children: children,
          _attributes: {
            'class': [fieldName.replace(/_/g,'-')]
          },
          _weight: viewMode[fieldName].weight
        };

      }

    }
    // @TODO move this invocation before the fields are wrapped in containers, move the container wrapper out of the
    // loop above, then make some type of after build alter invocation if anybody wants to then alter the containers.
    jDrupal.moduleInvokeAll('entity_view', content, entity).then(ok(content));

  });

};

dg.theme_entity_label = function(variables) {
  return '<h1 ' + dg.attributes(variables._attributes) + '>' + dg.t(variables._entity.label()) + '</h1>';
};