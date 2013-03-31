function drupalgap_field_info_field(field_name) {
  try {
    return drupalgap.field_info_fields[field_name];
  }
  catch (error) {
    alert('drupalgap_field_info_field - ' + error);
  }
}

function drupalgap_field_info_fields() {
  try {
    if (drupalgap.settings.debug) {
      console.log('drupalgap_field_info_fields');
    }
    return drupalgap.field_info_fields;
  }
  catch (error) {
    alert('drupalgap_field_info_fields - ' + error);
  }
}

/**
 * Given an entity type and/or a bundle name, this returns the field info
 * instances for the entity or the bundle.
 */
function drupalgap_field_info_instances(entity_type, bundle_name) {
  try {
    if (drupalgap.settings.debug) {
      console.log('drupalgap_field_info_instances');
    }
    var field_info_instances;
    if (drupalgap.settings.debug) {
      console.log('drupalgap_field_info_instances()');
      console.log(JSON.stringify(arguments));
      console.log('drupalgap.field_info_instances[' + entity_type + ']');
      console.log(JSON.stringify(drupalgap.field_info_instances[entity_type]));
    }
    if (!bundle_name) {
      field_info_instances = drupalgap.field_info_instances[entity_type];
    }
    else {
      field_info_instances = drupalgap.field_info_instances[entity_type][bundle_name];
    }
    if (drupalgap.settings.debug) {
      console.log('drupalgap_field_info_instances()');
      console.log(JSON.stringify(field_info_instances));
    }
    return field_info_instances;
  }
  catch(error) {
    alert('drupalgap_field_info_instances - ' + error);
  }
}

function drupalgap_field_info_instances_add_to_form(entity_type, bundle_name, form, entity) {
  try {
    if (drupalgap.settings.debug) {
      console.log('drupalgap_field_info_instances_add_to_form');
    }
    // Grab the field info instances for this entity type and bundle.
    var fields = drupalgap_field_info_instances(entity_type, bundle_name);
    // Use the default language, unless the entity has one specified.
    var language = drupalgap.settings.language;
    if (entity && entity.language) {
      language = entity.language;
    }
    // Iterate over each field in the entity and add it to the form. If there is
    // a value present in the entity, then set the field's form element default
    // value equal to the field value.
    if (fields) {
      $.each(fields, function(name, field){
        var field_info = drupalgap_field_info_field(name);
        var default_value = field.default_value;
        if (entity[name] && entity[name].length != 0 && entity[name][language][0].value) {
          default_value = entity[name][language][0].value;
        }
        form.elements[name] = {
          'type':field_info.type,
          'title':field.label,
          'required':field.required,
          'default_value':default_value,
          'description':field.description,
        };
      });
    }
  }
  catch (error) {
    alert('drupalgap_field_info_instances_add_to_form - ' + error);
  }
}

