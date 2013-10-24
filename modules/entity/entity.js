/**
 * Given an entity type, bundle name, form and entity, this will add the entity's
 * core fields to the form via the DrupalGap forms api.
 */
function drupalgap_entity_add_core_fields_to_form(entity_type, bundle_name, form, entity) {
  try {
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
  catch (error) { drupalgap_error(error); }
}

/**
 * Returns the 'Delete' button object that is used on entity edit forms.
 */
function drupalgap_entity_edit_form_delete_button(entity_type, entity_id) {
  try {
    return {
      'title':'Delete',
      attributes:{
        onclick:"javascript:drupalgap_entity_edit_form_delete_confirmation('" + entity_type + "', " + entity_id + ");"
      }
    };
  }
  catch (error) { drupalgap_error(error); }
}

/**
 * Given an entity type and id, this will display a confirmation dialogue and
 * will subsequently delete the entity if the user confirms the dialogue box.
 * The Services module retains Drupal user permissions so users without proper
 * permissions will not be able to delete the entities from the server.
 */
function drupalgap_entity_edit_form_delete_confirmation(entity_type, entity_id) {
  try {
    if (confirm('Delete this content, are you sure? This action cannot be undone...')) {
      // Grab the service resource for this entity type, and its primary key.
      var service_resource = drupalgap_services_get_entity_resource(entity_type);
      if (!service_resource) { return false; }
      var primary_key = drupalgap_entity_get_primary_key(entity_type);
      if (!primary_key) { return false; }
      // Set up the api call arguments and success callback.
      var call_arguments = {};
      call_arguments[primary_key] = entity_id;
      call_arguments.success = function(result) {
        // Remove the entities page from the DOM, if it exists.
        var entity_page_path = entity_type + '/' + entity_id;
        var entity_page_id = drupalgap_get_page_id(entity_page_path);
        if (drupalgap_page_in_dom(entity_page_id)) {
          drupalgap_remove_page_from_dom(entity_page_id);
        }
        // Remove the entity from local storage.
        window.localStorage.removeItem(entity_local_storage_key(entity_type, entity_id));
        alert('Deleted.');
        drupalgap_goto('', {'form_submission':true});
      };
      // Call the delete resource.
      service_resource.del.call(call_arguments);
    }
  }
  catch (error) { drupalgap_error(error); }
}

/**
 * Given an entity, this will render the content of the entity and place it in
 * the entity JSON object as the 'content' property.
 */
function drupalgap_entity_render_content(entity_type, entity) {
  try {
    entity.content = '';
    // Render each field on the entity, using the default display. The fields
    // need to be appended accorind to their weight, so we'll keep track of
    // the weights and rendered field content as we iterate through the fields,
    // then at the end will append them in order onto the entity's content.
    var field_info = drupalgap_field_info_instances(entity_type, entity.type);
    var field_content = {};
    var field_weights = {};
    $.each(field_info, function(field_name, field){
        // Determine which display mode to use. The default mode will be used
        // if the drupalgap display mode is not present.
        if (!field.display) { return false; }
        var display = field.display['default'];
        if (field.display['drupalgap']) {
          display = field.display['drupalgap'];
        }
        // Save the field name and weight.
        field_weights[field_name] = display.weight;
        // Save the field content.
        field_content[field_name] = drupalgap_entity_render_field(entity_type, entity, field_name, field, display);
    });
    // Extract the field weights and sort them.
    var extracted_weights = [];
    $.each(field_weights, function(field_name, weight){
        extracted_weights.push(weight);
    });
    extracted_weights.sort(function(a, b) { return a-b; });
    // For each sorted weight, locate the field with the corresponding weight,
    // then add that field's content to the entity, if it hasn't already been
    // added.
    var completed_fields = [];
    $.each(extracted_weights, function(weight_index, target_weight){
        $.each(field_weights, function(field_name, weight){
            if (target_weight == weight) {
              if (completed_fields.indexOf(field_name) == -1) {
                completed_fields.push(field_name);
                entity.content += field_content[field_name];
                return false;
              }
            }
        });
    });
    // Give modules a chance to alter the content.
    module_invoke_all('entity_post_render_content', entity);
  }
  catch (error) { drupalgap_error(error); }
}

/**
 * Given an entity_type, the entity, a field name, and the field this will
 * render the field using the appropriate hook_field_formatter_view().
 */
function drupalgap_entity_render_field(entity_type, entity, field_name, field, display) {
  try {
    var content = '';
    // Determine module that implements the hook_field_formatter_view,
    // then determine the hook's function name, then render the field content.
    var module = display['module'];
    var function_name = module + '_field_formatter_view';
    if (drupalgap_function_exists(function_name)) {
      // Grab the field formatter function, then grab the field items
      // from the entity, then call the formatter function it and append
      // its result to the entity's content. 
      var fn = window[function_name];
      var items = null;
      if (entity[field_name]) {
        if (entity[field_name][entity.language]) {
          items = entity[field_name][entity.language];
        }
        else {
          items = entity[field_name];
        }
      }
      var elements = fn(entity_type, entity, field, null, entity.language, items, display);
      $.each(elements, function(delta, element){
          // If the element has markup, render it as is, if it is
          // themeable, then theme it.
          var element_content = '';
          if (element.markup) { element_content = element.markup; }
          else if (element.theme) {
            element_content = theme(element.theme, element);
          }
          content += '<div>' + element_content + '</div>';
      });
    }
    else {
      console.log('WARNING: drupalgap_entity_render_field - ' + function_name + '() does not exist!');
    }
    // Render the field label, if necessary.
    if (content != '' && display['label'] != 'hidden') {
      var label = '<h3>' + field.label + '</h3>';
      // Place the label above or below the field content.
      label = '<div>' + label + '</div>';
      switch (display['label']) {
        case 'below':
          content += label;
          break;
        case 'above':
        default:
          content = label + content;
          break;
      }
    }
    // Give modules a chance to alter the field content.
    var reference = {'content':content};
    module_invoke_all('entity_post_render_field', entity, field_name, field, reference);
    if (reference.content != content) {
      return reference.content;
    }
    return content;
  }
  catch (error) { drupalgap_error(error); }
}

/**
 * Given a form and form_state, this will assemble the entity based on the
 * form_state values and return the entity as a json object.
 */
function drupalgap_entity_build_from_form_state(form, form_state) {
  try {
    var entity = {};
    var language = drupalgap.settings.language;
    $.each(form_state.values, function(name, value){
        // Attach the key and value to the entity.
        var key = drupalgap_field_key(name); // e.g. value, fid, tid, nid, etc.
        if (key) {
          var allowed_values = form.elements[name].field_info_field.cardinality;
          if (allowed_values == -1) {
            allowed_values = 1; // convert unlimited value fields to one, for now...
          }
          entity[name] = {};
          entity[name][language] = [];
          for (var delta = 0; delta < allowed_values; delta++) {
            eval('entity[name][language].push({' + key + ':"' + value[language][delta] + '"});');
            //eval('entity.' + name + ' = {' + language  + ':[{' + key + ':"' + value[language][delta] + '"}]}');
          }
        }
        else {
          entity[name] = value;    
        }
    });
    return entity;
  }
  catch (error) { drupalgap_error(error); }
}

/**
 * Given a form, form_state and entity, this will call the appropriate service
 * resource to create or update the entity.
 */
function drupalgap_entity_form_submit(form, form_state, entity) {
  try {
    var service_resource = drupalgap_services_get_entity_resource(form.entity_type);
    if (!service_resource) { return false; }
    
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
    // TODO - is this a bug? Why are we setting entity_type equal to entity here?
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
      // Remove the entity from local storage, then call the update resource.
      window.localStorage.removeItem(entity_local_storage_key(form.entity_type, entity[primary_key]));
      service_resource.update.call(call_arguments);
    }
  }
  catch (error) { drupalgap_error(error); }
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
        // Add each schema field to the fields collection.
        $.each(drupalgap.entity_info[entity_type].schema_fields_sql['base table'], function(index, name){
            var field = {
              "type":"hidden",
              "required":false,
              "default_value":"",
              "title":ucfirst(name)
            };
            eval('fields.' + name + ' = field;');
        });
        // Make modifications to comment fields.
        fields['nid'].required = true;
        fields['subject'].type = 'textfield';
        fields['name'].type = 'textfield';
        fields['mail'].type = 'textfield';
        fields['homepage'].type = 'textfield';
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
          'default_value':drupalgap.settings.language,
        };
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
 * Given an entity_type, this returns the entity JSON info, if it exists, false
 * otherwise. You may optionally call this function with no arguments to
 * retrieve the JSON info for all entity types. See also 
 * http://api.drupal.org/api/drupal/includes%21common.inc/function/entity_get_info/7
 */
function drupalgap_entity_get_info() {
  try {
    if (arguments[0]) {
      var entity_type = arguments[0];
      if (entity_type && drupalgap.entity_info[entity_type]) {
        return drupalgap.entity_info[entity_type];
      }
      else {
        return false;
      }
    }
    return drupalgap.entity_info;
  }
  catch (error) { drupalgap_error('drupalgap_entity_get_info - ' + error); }
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

/**
 * Given an entity type, an entity id and a mode, this will return a render
 * object for the entity's page container.
 */
function _drupalgap_entity_page_container(entity_type, entity_id, mode) {
  try {
    var id = _drupalgap_entity_page_container_id(entity_type, entity_id, mode);
    return {
      markup:'<div id="' + id + '"></div>'
    }
  }
  catch (error) { drupalgap_error(error); }
}

/**
 * Given an entity type, an entity id, and a mode, this will return the unique
 * id to be used for the entity's page container.
 */
function _drupalgap_entity_page_container_id(entity_type, entity_id, mode) {
  try {
    return entity_type + '_' + entity_id + '_' + mode + '_container';
  }
  catch (error) { drupalgap_error(error); }
}

/**
 * Given an entity type, id, mode and page build, this will render the page
 * build and inject it into the container on the page.
 */
function _drupalgap_entity_page_container_inject(entity_type, entity_id, mode, build) {
  try {
    // Get the container id, set the drupalgap.output to the page build, then
    // inject the rendered page into the container.
    var id = _drupalgap_entity_page_container_id(entity_type, entity_id, mode);
    drupalgap.output = build;
    $('#' + id).html(drupalgap_render_page());
  }
  catch (error) { drupalgap_error(error); }
}

/**
 * The page callback for entity edit forms.
 */
function entity_page_edit(form_id, entity_type, entity_id) {
  try {
    var content = {
      container:_drupalgap_entity_page_container(entity_type, entity_id, 'edit')
    };
    return content;
  }
  catch (error) { drupalgap_error(error); }
}

/**
 * The pageshow callback for entity edit forms.
 */
function entity_page_edit_pageshow(form_id, entity_type, entity_id) {
  try {
    entity_load(entity_type, entity_id, {
        success:function(entity){
          _drupalgap_entity_page_container_inject(entity_type, entity_id, 'edit', drupalgap_get_form(form_id, entity));
        }
    });
  }
  catch (error) { drupalgap_error(error); }
}

