/**
 * Given an entity type, bundle name, form and entity, this will add the entity's
 * core fields to the form via the DrupalGap forms api.
 */
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
      if (entity && entity[name]) {
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
  }
  catch (error) {
    alert('drupalgap_entity_add_core_fields_to_form - ' + error);
  }
}

/**
 * Given a form and form_state, this will assemble the entity based on the
 * form_state values and return the entity as a json object.
 */
function drupalgap_entity_build_from_form_state(form, form_state) {
  try {
    if (drupalgap.settings.debug) {
      console.log('drupalgap_entity_build_from_form_state');
    }
    var entity = {};
    // Use the default language, unless the entity has one specified.
    /*var language = drupalgap.settings.language;
    if (entity_edit.language) {
      language = entity_edit.language;
    }*/
    $.each(form_state.values, function(name, value){
      field_info = drupalgap_field_info_field(name);
      if (field_info) {
        eval('entity.' + name + ' = {};');
        entity[name][drupalgap.settings.language] = [{"value":value}];
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

/**
 * Given a form, form_state and entity, this will call the appropriate service
 * resource c.r.u.d. operation.
 */
function drupalgap_entity_form_submit(form, form_state, entity) {
  try {
    if (drupalgap.settings.debug) {
      console.log('drupalgap_entity_form_submit');
      console.log(JSON.stringify(arguments));
    }
    var service_resource = null;
    switch (form.entity_type) {
      case 'comment':
        service_resource = drupalgap.services.comment;
        break;
      case 'node':
        service_resource = drupalgap.services.node;
        break;
      case 'taxonomy_term':
        service_resource = drupalgap.services.taxonomy_term;
        break;
      case 'taxonomy_vocabulary':
        service_resource = drupalgap.services.taxonomy_vocabulary;
        break;
      case 'user':
        service_resource = drupalgap.services.user;
        break;
      default:
        alert('drupalgap_entity_form_submit - unsupported entity type - ' + form.entity_type);
        return null;
        break;
    }
    
    // Grab the primary key name for this entity type.
    var primary_key = drupalgap_entity_get_primary_key(form.entity_type);
    
    // Determine if we are editing an entity or creating a new one.
    var editing = false;
    if (entity[primary_key] && entity[primary_key] != '') {
      editing = true;
    }
    
    // Let's set up the api call arguments.
    var call_arguments = {};
    
    // Attach the entity to the call arguments, keyed by its type. There is a
    // special case for the user entity type, we want to call it 'account' so
    // CRUD understands it.
    var entity_type = form.entity_type;
    if (entity_type == 'user') {
      entity_type = 'account'; 
    }
    call_arguments[entity_type] = entity;
    
    // Setup the success call back to go back to the entity page view.
    call_arguments.success = function(result) {
      
      // By default we'll try to redirect to [entity-type]/[entity-id]. Note,
      // this doesn't work for taxonomy_vocabulary and taxonomy_term since
      // they have paths of taxonomy/vocabulary and taxonomy/term. So once
      // all of the entity forms have an action, we can get rid of this default
      // setting and just use the action.
      var destination = form.entity_type + '/' + eval('result.' + primary_key);
      if (form.action) {
        destination = form.action;
      }
      // TODO - this drupalgap_goto probably shouldn't be here... the drupalgap
      // form submission handler should be the one who handles the call to
      // drupalgap_goto. We're going to need to make a separate call back
      // function in form.js to handle these entity async callbacks (and
      // every other developer).
      drupalgap_goto(destination, {'form_submission':true});
    };
    
    // Depending on if we are creating a new entity, or editing an existing one,
    // call the appropriate service resource.
    if (!editing) {
      service_resource.create.call(call_arguments);
    }
    else {
      service_resource.update.call(call_arguments);
    }
  }
  catch (error) {
    alert('drupalgap_entity_form_submit - ' + error);
  }
}

/**
 * Given an entity type, this returns its core fields as forms api elements.
 */
function drupalgap_entity_get_core_fields(entity_type) {
  try {
    if (drupalgap.settings.debug) {
      console.log('drupalgap_entity_get_core_fields()');
      console.log(JSON.stringify(arguments));
    }
    // TODO - was this function what we were tyring to accomplish with the early
    // entity_info hook imitations?
    // TODO - And why is this function not populated dynamically via Drupal? WTF?!
    var fields = {};
    switch (entity_type) {
      case 'comment':
        fields = {
          'cid':{
            'type':'hidden',
            'required':false,
            'default_value':'',
          },
          'nid':{
            'type':'hidden',
            'required':true,
            'default_value':'',
          },
          'subject':{
            'type':'textfield',
            'title':'Subject',
            'required':false,
            'default_value':'',
          },
        };
        break;
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
      case 'user':
        fields.uid = {
          'type':'hidden',
          'required':false,
          'default_value':'',
        };
        fields.name = {
          'type':'textfield',
          'title':'Username',
          'required':true,
          'default_value':'',
          'description':'',
        };
        fields.mail = {
          'type':'email',
          'title':'E-mail address',
          'required':true,
          'default_value':'',
          'description':'',
        };
        fields.picture = {
          'type':'image',
          'widget_type':'imagefield_widget',
          'title':'Picture',
          'required':false,
          'value':'Add Picture',
        };
        break;
      case 'taxonomy_term':
        fields = {
          'vid':{
            'type':'hidden',
            'required':true,
            'default_value':'',
          },
          'tid':{
            'type':'hidden',
            'required':false,
            'default_value':'',
          },
          'name':{
            'type':'textfield',
            'title':'Name',
            'required':true,
            'default_value':'',
          },
          'description':{
            'type':'textarea',
            'title':'Description',
            'required':false,
            'default_value':'',
          }
        };
        break;
      case 'taxonomy_vocabulary':
        fields = {
          'vid':{
            'type':'hidden',
            'required':false,
            'default_value':'',
          },
          'name':{
            'type':'textfield',
            'title':'Name',
            'required':true,
            'default_value':'',
          },
          'machine_name':{
            'type':'textfield',
            'title':'Machine Name',
            'required':true,
            'default_value':'',
          },
          'description':{
            'type':'textarea',
            'title':'Description',
            'required':false,
            'default_value':'',
          }
        };
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

/**
 * Given an entity_type, this returns the entity information. See also 
 * http://api.drupal.org/api/drupal/includes%21common.inc/function/entity_get_info/7
 */
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

/**
 * Given an entity type, this returns the primary key identifier for it.
 */
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

