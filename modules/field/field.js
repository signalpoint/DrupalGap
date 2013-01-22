function drupalgap_field_info_field(field_name) {
  return drupalgap.field_info_fields[field_name];
}

function drupalgap_field_info_fields() {
  return drupalgap.field_info_fields;
}

function drupalgap_field_info_instances(entity_type, bundle_name) {
  try {
    //console.log(JSON.stringify(drupalgap.field_info_instances));
    if (entity_type != 'node') {
      alert('drupalgap_field_info_instances - only the node entity_type is supported right now');
      return null;
    }
    else {
      if (!bundle_name) {
        return drupalgap.field_info_instances[entity_type];
      }
      else {
        return drupalgap.field_info_instances[entity_type][bundle_name];
      }
    }
  }
  catch(error) {
    alert('drupalgap_field_info_instances - ' + error);
  }
}

