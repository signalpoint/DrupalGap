function drupalgap_entity_build_from_form_state() {
  try {
    var entity = {};
    var entity_edit = drupalgap_entity_get_edit_object(drupalgap.form.entity_type);
    if (!entity_edit) {
      alert('drupalgap_entity_build_from_form_state - failed to get entity_edit - ' + drupalgap.form.entity_type);
      return null;
    }
    if (drupalgap.settings.debug) {
      console.log(JSON.stringify(entity_edit));
    }
    $.each(drupalgap.form_state.values, function(name, value){
      field_info = drupalgap_field_info_field(name);
      if (field_info) {
        eval('entity.' + name + ' = {};');
        entity[name][entity_edit.language] = [{"value":value}];
      }
      else {
        entity[name] = value;  
      }
    });
    return entity;
  }
  catch (error) {
    alert('drupalgap_entity_build_from_form_state - ' + error);
  }
}

function drupalgap_entity_form_submit(entity) {
  try {
    var service_resource = null;
    switch (drupalgap.form.entity_type) {
      case 'comment':
        service_resource = drupalgap.services.comment;
        break;
      case 'node':
        service_resource = drupalgap.services.node;
        break;
      case 'taxonomy_vocabulary':
        service_resource = drupalgap.services.taxonomy_vocabulary;
        break;
      case 'taxonomy_term':
        service_resource = drupalgap.services.taxonomy_term;
        break;
      default:
        alert('drupalgap_entity_form_submit - unsported entity type - ' + drupalgap.form.entity_type);
        return null;
        break;
    }
    var primary_key = drupalgap_entity_get_primary_key(drupalgap.form.entity_type);
    var entity_edit = drupalgap_entity_get_edit_object(drupalgap.form.entity_type);
    var editing = false;
    if (eval('entity_edit.' + primary_key)) {
      editing = true;
    }
    var call_arguments = {};
    call_arguments[drupalgap.form.entity_type] = entity;
    call_arguments.success = function(result) {
      drupalgap_changePage(drupalgap.form.action);
    };
    if (!editing) {
      // Creating a new entity.   
      service_resource.create.call(call_arguments);
    }
    else {
      // Update an existing entity.
      eval('entity.' + primary_key + ' = entity_edit.' + primary_key + ';');
      service_resource.update.call(call_arguments);
    }
  }
  catch (error) {
    alert('drupalgap_entity_form_submit - ' + error);
  }
}

function drupalgap_entity_get_edit_object(entity_type) {
  try {
    var entity_edit = null;
    switch (entity_type) {
      case 'comment':
        entity_edit = drupalgap.comment_edit;
        break;
      case 'node':
        entity_edit = drupalgap.node_edit;
        break;
      case 'taxonomy_term':
        entity_edit = drupalgap.taxonomy_term_edit;
        break;
      case 'taxonomy_vocabulary':
        entity_edit = drupalgap.taxonomy_vocabulary_edit;
        break;
      default:
        alert('drupalgap_entity_get_edit_object - unsported entity type - ' + drupalgap.form.entity_type);
        return null;
        break;
    }
    return entity_edit;
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

function drupalgap_entity_load_into_form(entity_type, bundle, entity, form) {
  try {
    switch (entity_type) {
      case 'node':
      case 'comment':
      case 'taxonomy_vocabulary':
        break;
      default:
        alert('drupalgap_entity_load_into_form - unsupported entity type - ' + entity_type);
        return;
        break;
    }
    // Get the fields for this content type, iterate over each and add each
    // of their values to their corresponding form element.
    fields = drupalgap_field_info_instances(entity_type, bundle);
    console.log(JSON.stringify(fields));
    $.each(fields, function(name, field){
        console.log(name);
        console.log(JSON.stringify(field));
        console.log(JSON.stringify(entity[name]));
        if (entity[name] &&
            entity[name][entity.language] &&
            entity[name][entity.language].length != 0
        ) {
          var css_id = drupalgap_form_get_element_id(name, drupalgap.form.id); 
          $('#' + css_id).val(entity[name][entity.language][0].value);
        }
    });
  }
  catch (error) {
    alert('drupalgap_entity_load_into_form - ' + error);
  }
}

