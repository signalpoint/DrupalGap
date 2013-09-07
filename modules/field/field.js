/**
 * Given a field name, this will return its field info.
 */
function drupalgap_field_info_field(field_name) {
  try {
    return drupalgap.field_info_fields[field_name];
  }
  catch (error) {
    alert('drupalgap_field_info_field - ' + error);
  }
}

/**
 * Returns info on all fields.
 */
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
 * Given an entity type, field name, and bundle name this will return a JSON
 * object with data for the specified field name.
 */
function drupalgap_field_info_instance(entity_type, field_name, bundle_name) {
  try {
    var instances = drupalgap_field_info_instances(entity_type, bundle_name);
    return instances[field_name];
  }
  catch (error) { drupalgap_error(error); }
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
      if (typeof drupalgap.field_info_instances[entity_type] !== 'undefined') {
        field_info_instances = drupalgap.field_info_instances[entity_type][bundle_name];  
      }
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

/**
 * Given an entity type, bundle name, form and entity, this will add the
 * entity's fields to the given form.
 */
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
        if (field_info) {
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
        }
      });
    }
  }
  catch (error) {
    alert('drupalgap_field_info_instances_add_to_form - ' + error);
  }
}

/**
 * Given a field name, this will return the key that should be used when
 * settings its value on an entity. If the field name is not a field, it returns
 * false.
 */
function drupalgap_field_key(field_name) {
  // Determine the key to use for the value. By default, most fields
  // use 'value' as the key.
  var key = false;
  var field_info = drupalgap_field_info_field(field_name);
  if (field_info) {
    key = 'value';
    // Images use fid as the key.
    if (field_info.module == 'image' && field_info.type == 'image') {
      key = 'fid';
    }
  }
  return key;
}

/**
 * Implements hook_field_formatter_view().
 */
function number_field_formatter_view(entity_type, entity, field, instance, langcode, items, display) {
  try {
    var element = {};
    // If items is a string, convert it into a single item JSON object.
    if (typeof items === 'string') {
      items = {0:{value:items}}
    }
    if (!drupalgap_empty(items)) {
      $.each(items, function(delta, item){
          element[delta] = {
            markup:item.value
          };
      });
    }
    return element;
  }
  catch (error) { drupalgap_error(error); }
}

/**
 * Implements hook_field_formatter_view().
 */
function text_field_formatter_view(entity_type, entity, field, instance, langcode, items, display) {
  try {
    var element = {};
    if (!drupalgap_empty(items)) {
      $.each(items, function(delta, item){
          element[delta] = {
            markup:item.value
          };
      });
    }
    return element;
  }
  catch (error) { drupalgap_error(error); }
}

