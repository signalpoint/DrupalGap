/**
 * Given a field name, this will return its field info.
 * @param {String} field_name
 * @return {Object}
 */
function dg_field_info_field(field_name) {
  try {
    return drupalgap.field_info_fields[field_name];
  }
  catch (error) { console.log('dg_field_info_field - ' + error); }
}

/**
 * Given an entity type and/or a bundle name, this returns the field info
 * instances for the entity or the bundle.
 * @param {String} entity_type
 * @param {String} bundle_name
 * @return {Object}
 */
function drupalgap_field_info_instances(entity_type, bundle_name) {
  try {
    var field_info_instances = null;
    // If there is no bundle, pull the fields out of the wrapper.
    // @TODO there appears to be a special case with commerce_products, in that
    // they aren't wrapped like normal entities (see the else statement when a
    // bundle name isn't present). Or do we have a bug here, and we shouldn't
    // be expecting the wrapper in the first place?
    if (!bundle_name) {
      if (entity_type == 'commerce_product') {
        field_info_instances =
          drupalgap.field_info_instances[entity_type];
      }
      else if (
        typeof drupalgap.field_info_instances[entity_type] !== 'undefined' &&
        typeof drupalgap.field_info_instances[entity_type][entity_type] !== 'undefined'
      ) {
        field_info_instances =
          drupalgap.field_info_instances[entity_type][entity_type];
      }
    }
    else {
      if (typeof drupalgap.field_info_instances[entity_type] !== 'undefined') {
        field_info_instances =
          drupalgap.field_info_instances[entity_type][bundle_name];
      }
    }
    return field_info_instances;
  }
  catch (error) { console.log('drupalgap_field_info_instances - ' + error); }
}

