function drupalgap_entity_add_core_fields_to_form(entity_type, bundle_name, form, entity) {
  try {
    if (drupalgap.settings.debug) {
      console.log('drupalgap_entity_add_core_fields_to_form');
    }
    // Grab the core fields for this entity type and bundle.
    var fields = drupalgap_entity_get_core_fields(entity_type);
    // Iterate over each core field in the entity and add it to the form. If there is
    // a value present in the entity, then set the field's form element default
    // value equal to the core field value.
    $.each(fields, function(name, field){
      var default_value = field.default_value;
      if (entity[name]) {
        default_value = entity[name];
      }
      form.elements[name] = {
        'type':field.type,
        'title':field.title,
        'required':field.required,
        'default_value':default_value,
        'description':field.description,
      };
    });
    console.log(JSON.stringify(form));
    alert('drupalgap_entity_add_core_fields_to_form');
  }
  catch (error) {
    alert('drupalgap_entity_add_core_fields_to_form - ' + error);
  }
}

/**
 *
 */
function drupalgap_entity_build_from_form_state() {
  try {
    if (drupalgap.settings.debug) {
      console.log('drupalgap_entity_build_from_form_state');
    }
    var entity = {};
    //var entity_edit = drupalgap_entity_get_edit_object(drupalgap.form.entity_type);
    /*var entity_edit = drupalgap.entity_edit;
    if (!entity_edit) {
      alert('drupalgap_entity_build_from_form_state - failed to get entity_edit - ' + drupalgap.form.entity_type);
      return null;
    }
    if (drupalgap.settings.debug) {
      console.log(JSON.stringify(entity_edit));
    }*/
    // Use the default language, unless the entity has one specified.
    /*var language = drupalgap.settings.language;
    if (entity_edit.language) {
      language = entity_edit.language;
    }*/
    $.each(drupalgap.form_state.values, function(name, value){
      field_info = drupalgap_field_info_field(name);
      if (field_info) {
        eval('entity.' + name + ' = {};');
        entity[name][drupalgap.settings.language] = [{"value":value}];
      }
      else {
        entity[name] = value;  
      }
    });
    console.log(JSON.stringify(entity));
    alert('drupalgap_entity_build_from_form_state');
    return entity;
  }
  catch (error) {
    alert('drupalgap_entity_build_from_form_state - ' + error);
  }
}

/**
 *
 */
function drupalgap_entity_form_submit(entity) {
  try {
    if (drupalgap.settings.debug) {
      console.log('drupalgap_entity_form_submit');
      console.log(JSON.stringify(entity));
    }
    alert('drupalgap_entity_form_submit');
    var service_resource = null;
    var service_entity = null;
    switch (drupalgap.form.entity_type) {
      case 'comment':
        service_resource = drupalgap.services.comment;
        //service_entity = drupalgap.comment;
        break;
      case 'node':
        service_resource = drupalgap.services.node;
        //service_entity = drupalgap.node;
        break;
      case 'taxonomy_vocabulary':
        service_resource = drupalgap.services.taxonomy_vocabulary;
        //service_entity = drupalgap.taxonomy_vocabulary;
        break;
      case 'taxonomy_term':
        service_resource = drupalgap.services.taxonomy_term;
        //service_entity = drupalgap.taxonomy_term;
        break;
      default:
        alert('drupalgap_entity_form_submit - unsported entity type - ' + drupalgap.form.entity_type);
        return null;
        break;
    }
    var primary_key = drupalgap_entity_get_primary_key(drupalgap.form.entity_type);
    //var entity_edit = drupalgap.entity_edit;
    var editing = false;
    //if (eval('entity_edit.' + primary_key)) {
    if (entity[primary_key] && entity[primary_key] != '') {
      editing = true;
    }
    var call_arguments = {};
    call_arguments[drupalgap.form.entity_type] = entity;
    call_arguments.success = function(result) {
      drupalgap_goto(drupalgap.form.entity_type + '/' + eval('result.' + primary_key));
    };
    console.log(JSON.stringify(call_arguments));
    alert('drupalgap_entity_form_submit - editing = ' + editing);
    if (!editing) {
      // Creating a new entity.   
      service_resource.create.call(call_arguments);
    }
    else {
      // Update an existing entity.
      //eval('entity.' + primary_key + ' = entity_edit.' + primary_key + ';');
      service_resource.update.call(call_arguments);
    }
  }
  catch (error) {
    alert('drupalgap_entity_form_submit - ' + error);
  }
}

/**
 *
 */
function drupalgap_entity_get_core_fields(entity_type) {
  try {
    if (drupalgap.settings.debug) {
      console.log('drupalgap_entity_get_core_fields()');
      console.log(JSON.stringify(arguments));
    }
    var fields = {};
    switch (entity_type) {
      case 'node':
        fields.nid = {
          'type':'hidden',
          'required':false,
          'default_value':'',
        };
        fields.title = {
          'type':'textfield',
          'title':'Title',
          'required':true,
          'default_value':'',
          'description':'',
        };
        fields.type = {
          'type':'hidden',
          'required':true,
          'default_value':'',
        };
        fields.language = {
          'type':'hidden',
          'required':true,
          'default_value':'und', // TODO - not sure about this, need to learn
        };                       // more about international sites.
        break;
      default:
        alert('drupalgap_entity_get_core_fields - entity type not supported yet (' + entity_type + ')');
        break;
    }
    return fields;
  }
  catch (error) {
    alert('drupalgap_entity_get_core_fields - ' + error);
  }
}

/**
 * Given an entity type (node, comment, etc), this will return the current
 * entity edit json object inside the drupalgap var. 
 */
function drupalgap_entity_get_edit_object(entity_type) {
  try {
    alert('drupalgap_entity_get_edit_object -  this function is depcreated, it just returns drupalgap.entity_edit');
    return drupalgap.entity_edit;
  }
  catch (error) {
    alert('drupalgap_entity_get_edit_object - ' + error);
  }
}

function drupalgap_entity_get_info(entity_type) {
  try {
    if (drupalgap.settings.debug) {
      console.log('drupalgap_entity_get_info - ' + entity_type);
      console.log(JSON.stringify(drupalgap.entity_info[entity_type]));
    }
    if (drupalgap.entity_info && drupalgap.entity_info.length > 0) {
      if (entity_type) {
        return drupalgap.entity_info[entity_type];
      }
      else {
        return drupalgap.entity_info;
      }
    }
    return null;
  }
  catch (error) {
    alert('drupalgap_entity_get_info - ' + error);
  }
}

function drupalgap_entity_get_primary_key(entity_type) {
  try {
    var primary_key = null;
    switch (entity_type) {
      case 'comment':
        primary_key = 'cid';
        break;
      case 'file':
        primary_key = 'fid';
        break;
      case 'node':
        primary_key = 'nid';
        break;
      case 'taxonomy_term':
        primary_key = 'tid';
        break;
      case 'taxonomy_vocabulary':
        primary_key = 'vid';
        break;
      case 'user':
        primary_key = 'uid';
        break;
      default:
        alert('drupalgap_entity_get_primary_key - unsported entity type - ' + entity_type);
        break;
    }
    return primary_key;
  }
  catch (error) {
    alert('drupalgap_entity_get_primary_key - ' + error);
  }
}

// DEPRECATED!
function drupalgap_entity_load_into_form(entity_type, bundle, entity, form) {
  try {
    if (drupalgap.settings.debug) {
      console.log('drupalgap_entity_load_into_form()');
      console.log(JSON.stringify(arguments));
    }
    
    // Since entities are now going to be loaded and passed directly to the form,
    // the form's element values can be filled in before the form is rendered, hooray!
    alert('drupalgap_entity_load_into_form - this function is deprecated!');
    return false;
    
  }
  catch (error) {
    alert('drupalgap_entity_load_into_form - ' + error);
  }
}

