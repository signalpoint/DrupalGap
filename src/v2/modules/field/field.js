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

