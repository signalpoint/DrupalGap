function drupalgap_field_info_field(field_name) {
  return drupalgap.field_info_fields[field_name];
}

function drupalgap_field_info_fields() {
  try {
    if (drupalgap.settings.debug) {
      console.log(JSON.stringify(drupalgap.field_info_fields));
    }
    return drupalgap.field_info_fields;
  }
  catch (error) {
    alert('drupalgap_field_info_fields - ' + error);
  }
}

function drupalgap_field_info_instances(entity_type, bundle_name) {
  try {
    if (!bundle_name) {
      if (drupalgap.settings.debug) {
        console.log(entity_type);
        console.log(JSON.stringify(drupalgap.field_info_instances[entity_type]));
      }
      return drupalgap.field_info_instances[entity_type];
    }
    else {
      if (drupalgap.settings.debug) {
        console.log(entity_type);
        console.log(bundle_name);
        console.log(JSON.stringify(drupalgap.field_info_instances[entity_type][bundle_name]));
      }
      return drupalgap.field_info_instances[entity_type][bundle_name];
    }
  }
  catch(error) {
    alert('drupalgap_field_info_instances - ' + error);
  }
}

function drupalgap_field_info_instances_add_to_form(entity_type, bundle_name, form) {
  try {
    var fields = drupalgap_field_info_instances(entity_type, bundle_name);
    $.each(fields, function(name, field){
      var field_info = drupalgap_field_info_field(name);
      form.elements[name] = {
        'type':field_info.type,
        'title':field.label,
        'required':field.required,
        'default_value':field.default_value,
        'description':field.description,
      };
    });
  }
  catch (error) {
    alert('drupalgap_field_info_instances_add_to_form - ' + error);
  }
}

