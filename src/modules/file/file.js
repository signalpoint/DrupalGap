/**
 * Implements hook_field_formatter_view().
 * @param {String} entity_type
 * @param {Object} entity
 * @param {Object} field
 * @param {Object} instance
 * @param {String} langcode
 * @param {Object} items
 * @param {Object} display
 */
function file_entity_field_formatter_view(entity_type, entity, field, instance, langcode, items, display) {
  try {
    //console.log(entity_type);
    //console.log(entity);
    //console.log(field);
    //console.log(instance);
    //console.log(langcode);
    //console.log(items);
    //console.log(display);

    // Special case for media module.
    if (display.type == 'file_rendered') {
      return media_field_formatter_view(entity_type, entity, field, instance, langcode, items, display);
    }

    // Iterate over each item, and place a widget onto the render array.
    var content = {};
    for (var delta in items) {
        if (!items.hasOwnProperty(delta)) { continue; }
        var item = items[delta];

        switch (display.type) {
          default:
            console.log('file_entity_field_formatter_view() - unsupported display type: ' + display.type);
            break;
        }
    }
    return content;
  }
  catch (error) { console.log('file_entity_field_formatter_view - ' + error); }
}

