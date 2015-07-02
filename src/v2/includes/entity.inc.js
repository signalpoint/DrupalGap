/**
 * Returns an array of entity type names.
 * @return {Array}
 */
function dg_entity_types() {
  try {
    var entity_types = [];
    var entity_info = dg_entity_get_info();
    for (var entity_type in entity_info) {
      if (!entity_info.hasOwnProperty(entity_type)) { continue; }
      entity_types.push(entity_type);
    }
    return entity_types;
  }
  catch (error) { console.log('dg_entity_types - ' + error); }
}

/**
 * @see https://api.drupal.org/api/drupal/includes!common.inc/function/entity_get_info/7
 * @param {String|null} entity_type
 */
function dg_entity_get_info() {
  try {
    var entity_type = typeof arguments[0] !== 'undefined' ? arguments[0] : null;
    if (entity_type) { return drupalgap.entity_info[entity_type]; }
    return drupalgap.entity_info;
  }
  catch (error) { console.log('dg_entity_get_info - ' + error); }
}