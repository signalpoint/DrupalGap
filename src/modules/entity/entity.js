/**
 * Given an entity type, bundle name, form and entity, this will add the
 * entity's core fields to the form via the DrupalGap forms api.
 * @param {String} entity_type
 * @param {String} bundle
 * @param {Object} form
 * @param {Object} entity
 */
function drupalgap_entity_add_core_fields_to_form(entity_type, bundle,
  form, entity) {
  try {
    // Grab the core fields for this entity type and bundle.
    var fields = drupalgap_entity_get_core_fields(entity_type);
    // Iterate over each core field in the entity and add it to the form. If
    // there is a value present in the entity, then set the field's form element
    // default value equal to the core field value.
    $.each(fields, function(name, field) {
      var default_value = field.default_value;
      if (entity && entity[name]) {
        default_value = entity[name];
      }
      form.elements[name] = {
        'type': field.type,
        'title': field.title,
        'required': field.required,
        'default_value': default_value,
        'description': field.description
      };
    });
  }
  catch (error) {
    console.log('drupalgap_entity_add_core_fields_to_form - ' + error);
  }
}

/**
 * Given an entity type, the bundle, the entity (assembled from form state
 * values) and any options, this assembles the ?data= string for the entity
 * service resource call URLs.
 * @param {String} entity_type
 * @param {String} bundle
 * @param {Object} entity
 * @param {Object} options
 * @return {String}
 */
function drupalgap_entity_assemble_data(entity_type, bundle, entity, options) {
  try {

    console.log('WARNING: drupalgap_entity_assemble_data() has been ' +
      'deprecated! Now just call e.g. node_save() for auto assembly.');
    return;

    var data = '';
    var lng = language_default();

    switch (entity_type) {
      case 'node':
        data = 'node[language]=' + encodeURIComponent(lng);
        if (entity.type) {
          data += '&node[type]=' + encodeURIComponent(entity.type);
        }
        if (entity.title) {
          data += '&node[title]=' + encodeURIComponent(entity.title);
        }
        break;
      default:
        console.log(
          'WARNING - drupalgap_entity_assemble_data(): ' + entity_type +
          ' is not supported yet!'
        );
        return false;
        break;
    }

    // Iterate over the fields on this entity and add them to the data string.
    var fields = drupalgap_field_info_instances(entity_type, bundle);
    $.each(fields, function(field_name, field) {
        var key = drupalgap_field_key(field_name);
        if (key) {
          // Iterate over each delta value in the field cardinality.
          var field_info_field = drupalgap_field_info_field(field_name);
          var allowed_values = field_info_field.cardinality;
          if (allowed_values == -1) {
            // Convert unlimited value fields to one, for now...
            allowed_values = 1;
          }
          for (var delta = 0; delta < allowed_values; delta++) {

            // Skip fields without values.
            // @todo - someone is passing a 'null' string instead of null, but
            // who?
            if (typeof entity[field_name][lng][delta][key] === 'undefined' ||
                !entity[field_name][lng][delta][key] ||
                entity[field_name][lng][delta][key] == '' ||
                entity[field_name][lng][delta][key] == 'null') { continue; }

            // Add the key and value to the data string.

            // Determine the hook_field_data_string function name. If it exists,
            // use it to populate the data string, otherwise just fall back to
            // a default data string.
            var function_name = field.widget.module + '_field_data_string';
            if (!drupalgap_function_exists(function_name)) {
              console.log(
                'WARNING: drupalgap_entity_assemble_data() - ' + function_name +
                '() doesn\'t exist, using core field data string assembly.'
              );

              // Encode the value.
              var value = encodeURIComponent(
                entity[field_name][lng][delta][key]
              );
              if (!value) { continue; }
              data += '&' + entity_type + '[' + field_name + '][' + lng + ']' +
                '[' + delta + '][' + key + ']=' + value;
            }
            else {
              var fn = window[function_name];
              var field_data_string = fn.call(
                undefined,
                entity_type,
                bundle,
                entity,
                field_info_field,
                field,
                lng,
                delta,
                options
              );
              if (field_data_string && field_data_string != '') {
                data += '&' + field_data_string;
              }
            }
          }
        }
    });

    // Return the data string.
    //dpm(data);
    return data;
  }
  catch (error) { console.log('drupalgap_entity_assemble_data - ' + error); }
}

/**
 * Returns the 'Delete' button object that is used on entity edit forms.
 * @param {String} entity_type
 * @param {Number} entity_id
 * @return {Object}
 */
function drupalgap_entity_edit_form_delete_button(entity_type, entity_id) {
  try {
    return {
      'title': 'Delete',
      attributes: {
        onclick: "javascript:drupalgap_entity_edit_form_delete_confirmation('" +
          entity_type + "', " + entity_id +
        ');'
      }
    };
  }
  catch (error) {
    console.log('drupalgap_entity_edit_form_delete_button - ' + error);
  }
}

/**
 * Given an entity type and id, this will display a confirmation dialogue and
 * will subsequently delete the entity if the user confirms the dialogue box.
 * The Services module retains Drupal user permissions so users without proper
 * permissions will not be able to delete the entities from the server.
 * @param {String} entity_type
 * @param {Number} entity_id
 * @return {*}
 */
function drupalgap_entity_edit_form_delete_confirmation(entity_type,
  entity_id) {
  try {
    var confirm_msg =
      'Delete this content, are you sure? This action cannot be undone...';
    if (confirm(confirm_msg)) {
      // Change the jQM loader mode to saving.
      drupalgap.loader = 'deleting';
      // Set up the api call arguments and success callback.
      var call_arguments = {};
      call_arguments.success = function(result) {
        // Remove the entities page from the DOM, if it exists.
        var entity_page_path = entity_type + '/' + entity_id;
        var entity_page_id = drupalgap_get_page_id(entity_page_path);
        if (drupalgap_page_in_dom(entity_page_id)) {
          drupalgap_remove_page_from_dom(entity_page_id);
        }
        // Remove the entity from local storage.
        // @todo - this should be moved to jDrupal.
        window.localStorage.removeItem(
          entity_local_storage_key(entity_type, entity_id)
        );
        // Go to the front page.
        drupalgap_goto('', {'form_submission': true});
      };
      // Call the delete function.
      var name = services_get_resource_function_for_entity(
        entity_type,
        'delete'
      );
      var fn = window[name];
      fn(entity_id, call_arguments);
    }
  }
  catch (error) {
    console.log('drupalgap_entity_edit_form_delete_confirmation - ' + error);
  }
}

/**
 * Given an entity, this will render the content of the entity and place it in
 * the entity JSON object as the 'content' property.
 * @param {String} entity_type
 * @param {Object} entity
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
    $.each(field_info, function(field_name, field) {
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
        field_content[field_name] = drupalgap_entity_render_field(
          entity_type, entity, field_name, field, display
        );
    });
    // Extract the field weights and sort them.
    var extracted_weights = [];
    $.each(field_weights, function(field_name, weight) {
        extracted_weights.push(weight);
    });
    extracted_weights.sort(function(a, b) { return a - b; });
    // For each sorted weight, locate the field with the corresponding weight,
    // then add that field's content to the entity, if it hasn't already been
    // added.
    var completed_fields = [];
    $.each(extracted_weights, function(weight_index, target_weight) {
        $.each(field_weights, function(field_name, weight) {
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
  catch (error) {
    console.log('drupalgap_entity_render_content - ' + error);
  }
}

/**
 * Given an entity_type, the entity, a field name, and the field this will
 * render the field using the appropriate hook_field_formatter_view().
 * @param {String} entity_type
 * @param {Object} entity
 * @param {String} field_name
 * @param {Object} field
 * @param {*} display
 * @return {String}
 */
function drupalgap_entity_render_field(entity_type, entity, field_name,
  field, display) {
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
      var elements = fn(
        entity_type, entity, field, null, entity.language, items, display
      );
      $.each(elements, function(delta, element) {
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
      console.log(
        'WARNING: drupalgap_entity_render_field - ' + function_name + '()' +
        'does not exist!'
      );
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
    var reference = {'content': content};
    module_invoke_all(
      'entity_post_render_field', entity, field_name, field, reference
    );
    if (reference.content != content) {
      return reference.content;
    }
    return content;
  }
  catch (error) { console.log('drupalgap_entity_render_field - ' + error); }
}

/**
 * Given a form and form_state, this will assemble an entity from the form_state
 * values and return the entity as a JSON object.
 * @param {Object} form
 * @param {Object} form_state
 * @return {Object}
 */
function drupalgap_entity_build_from_form_state(form, form_state) {
  try {
    var entity = {};
    var language = language_default();
    $.each(form_state.values, function(name, value) {

        // Determine wether or not this element is a field. If it is, determine
        // it's module and field assembly hook.
        var is_field = false;
        var module = false;
        var hook = false;
        if (form.elements[name].is_field) {
          is_field = true;
          module = form.elements[name].field_info_field.module;
          hook = module + '_assemble_form_state_into_field';
          if (!function_exists(hook)) { hook = false; }
        }

        // Attach the key and value to the entity.
        var key = drupalgap_field_key(name); // e.g. value, fid, tid, nid, etc.
        if (key) {

          // Determine how many allowed values for this field.
          var allowed_values = form.elements[name].field_info_field.cardinality;

          // Convert unlimited value fields to one, for now...
          if (allowed_values == -1) { allowed_values = 1; }

          // Make sure there is at least one value before creating the form
          // element on the entity.
          if (empty(value[language][0])) { return; }

          // Create an empty object to house the field on the entity.
          entity[name] = {};

          // Some fields do not use a delta value in the service call, so we
          // prepare for that here.
          // @todo - Do all options_select widgets really have no delta value?
          // Or is it only single value fields that don't have it? We need to
          // test this.
          var use_delta = true;
          if (
            form.elements[name].type ==
              'taxonomy_term_reference' ||
            form.elements[name].field_info_instance.widget.type ==
              'options_select'
          ) {
            use_delta = false;
            entity[name][language] = {};
          }
          else { entity[name][language] = []; }

          // Now iterate over each delta on the form element, and add the value
          // to the entity.
          for (var delta = 0; delta < allowed_values; delta++) {
            if (!empty(value[language][delta])) {

              // Extract the value.
              var field_value = value[language][delta];

              // If this element is a field, give the field's module an
              // opportunity to assemble its own value, otherwise we'll just
              // use the field value extracted above.
              if (is_field && hook) {
                var fn = window[hook];
                field_value = fn(form.entity_type,
                  form.bundle,
                  field_value,
                  form.elements[name].field_info_field,
                  form.elements[name].field_info_instance,
                  language,
                  delta
                );
              }

              // If we don't need a delta value, place the field value using the
              // key. If we're using a delta value, push the key and value onto
              // the field to indicate the delta.
              if (!use_delta) {
                entity[name][language][key] = field_value;
              }
              else {
                var item = {};
                item[key] = field_value;
                entity[name][language].push(item);
              }
            }
          }
        }
        else if (!empty(value)) { entity[name] = value; }
    });
    return entity;
  }
  catch (error) {
    console.log('drupalgap_entity_build_from_form_state - ' + error);
  }
}

/**
 * Given a form, form_state and entity, this will call the appropriate service
 * resource to create or update the entity.
 * @param {Object} form
 * @param {Object} form_state
 * @param {Object} entity
 * @return {*}
 */
function drupalgap_entity_form_submit(form, form_state, entity) {
  try {

    // Grab the primary key name for this entity type.
    var primary_key = entity_primary_key(form.entity_type);

    // Determine if we are editing an entity or creating a new one.
    var editing = false;
    if (entity[primary_key] && entity[primary_key] != '') {
      editing = true;
    }

    // Let's set up the api call arguments.
    var call_arguments = {};

    // Setup the success call back to go back to the entity page view.
    call_arguments.success = function(result) {
      try {
        // If no one has provided a form.action to submit this form to,
        // by default we'll try to redirect to [entity-type]/[entity-id] to view
        // the entity. For taxonomy, we replace the underscore with a forward
        // slash in the path.
        var destination = form.action;
        if (!destination) {
          var prefix = form.entity_type;
          if (prefix == 'taxonomy_vocabulary' || prefix == 'taxonomy_term') {
            prefix = prefix.replace('_', '/');
          }
          destination = prefix + '/' + result[primary_key];
        }
        drupalgap_goto(destination, {'form_submission': true});
      }
      catch (error) {
        console.log('drupalgap_entity_form_submit - success - ' + error);
      }
    };

    // Setup the error call back.
    call_arguments.error = function(xhr, status, message) {
      try {
        // If there were any form errors, display them in an alert.
        var msg = _drupalgap_form_submit_response_errors(form, form_state, xhr,
          status, message);
        if (msg) { alert(msg); }
      }
      catch (error) {
        console.log('drupalgap_entity_form_submit - error - ' + error);
      }
    };

    // Change the jQM loader mode to saving.
    drupalgap.loader = 'saving';

    // Depending on if we are creating a new entity, or editing an existing one,
    // call the appropriate service resource.
    var crud = 'create';
    if (editing) {
      crud = 'update';
      // Remove the entity from local storage.
      // @todo This should be moved to jDrupal.
      window.localStorage.removeItem(
        entity_local_storage_key(form.entity_type, entity[primary_key])
      );
    }
    var fn = window[
      services_get_resource_function_for_entity(form.entity_type, crud)
    ];
    fn(entity, call_arguments);
  }
  catch (error) { console.log('drupalgap_entity_form_submit - ' + error); }
}

/**
 * Given an entity type, this returns its core fields as forms api elements.
 * @param {String} entity_type
 * @return {Object}
 */
function drupalgap_entity_get_core_fields(entity_type) {
  try {
    // @todo - was this function what we were tyring to accomplish with the
    // early entity_info hook imitations?
    // @todo - And why is this function not populated dynamically via Drupal?
    // WTF?!
    var fields = {};
    switch (entity_type) {
      case 'comment':
        // Add each schema field to the fields collection.
        $.each(
          drupalgap.entity_info[entity_type].schema_fields_sql['base table'],
          function(index, name) {
            var field = {
              'type': 'hidden',
              'required': false,
              'default_value': '',
              'title': ucfirst(name)
            };
            eval('fields.' + name + ' = field;');
          }
        );
        // Make modifications to comment fields.
        fields['nid'].required = true;
        fields['subject'].type = 'textfield';
        fields['name'].type = 'textfield';
        fields['mail'].type = 'textfield';
        fields['homepage'].type = 'textfield';
        break;
      case 'node':
        fields.nid = {
          'type': 'hidden',
          'required': false,
          'default_value': ''
        };
        fields.title = {
          'type': 'textfield',
          'title': 'Title',
          'required': true,
          'default_value': '',
          'description': ''
        };
        fields.type = {
          'type': 'hidden',
          'required': true,
          'default_value': ''
        };
        fields.language = {
          'type': 'hidden',
          'required': true,
          'default_value': language_default()
        };
        break;
      case 'user':
        fields.uid = {
          'type': 'hidden',
          'required': false,
          'default_value': ''
        };
        fields.name = {
          'type': 'textfield',
          'title': 'Username',
          'required': true,
          'default_value': '',
          'description': ''
        };
        fields.mail = {
          'type': 'email',
          'title': 'E-mail address',
          'required': true,
          'default_value': '',
          'description': ''
        };
        fields.picture = {
          'type': 'image',
          'widget_type': 'imagefield_widget',
          'title': 'Picture',
          'required': false,
          'value': 'Add Picture'
        };
        break;
      case 'taxonomy_term':
        fields = {
          'vid': {
            'type': 'hidden',
            'required': true,
            'default_value': ''
          },
          'tid': {
            'type': 'hidden',
            'required': false,
            'default_value': ''
          },
          'name': {
            'type': 'textfield',
            'title': 'Name',
            'required': true,
            'default_value': ''
          },
          'description': {
            'type': 'textarea',
            'title': 'Description',
            'required': false,
            'default_value': ''
          }
        };
        break;
      case 'taxonomy_vocabulary':
        fields = {
          'vid': {
            'type': 'hidden',
            'required': false,
            'default_value': ''
          },
          'name': {
            'type': 'textfield',
            'title': 'Name',
            'required': true,
            'default_value': ''
          },
          'machine_name': {
            'type': 'textfield',
            'title': 'Machine Name',
            'required': true,
            'default_value': ''
          },
          'description': {
            'type': 'textarea',
            'title': 'Description',
            'required': false,
            'default_value': ''
          }
        };
        break;
      default:
        console.log(
          'drupalgap_entity_get_core_fields - entity type not supported yet (' +
            entity_type +
          ')'
        );
        break;
    }
    return fields;
  }
  catch (error) { console.log('drupalgap_entity_get_core_fields - ' + error); }
}

/**
 * Given an entity_type, this returns the entity JSON info, if it exists, false
 * otherwise. You may optionally call this function with no arguments to
 * retrieve the JSON info for all entity types. See also
 * http://api.drupal.org/api/drupal/includes%21common.inc/function/entity_get_info/7
 * @return {Object,Boolean}
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
  catch (error) { console.log('drupalgap_entity_get_info - ' + error); }
}

/**
 * @deprecated Since 7.x-1.7-alpha you should use entity_primary_key() instead.
 * Given an entity type, this returns the primary key identifier for it.
 * @param {String} entity_type
 * @return {String}
 */
function drupalgap_entity_get_primary_key(entity_type) {
  try {
    console.log(
      'WARNING: drupalgap_entity_get_primary_key() is deprecated! ' +
      'Use entity_primary_key() instead.'
    );
    return entity_primary_key(entity_type);
  }
  catch (error) { console.log('drupalgap_entity_get_primary_key - ' + error); }
}

/**
 * Given an entity type, an entity id and a mode, this will return a render
 * object for the entity's page container.
 * @param {String} entity_type
 * @param {Number} entity_id
 * @param {String} mode
 * @return {Object}
 */
function _drupalgap_entity_page_container(entity_type, entity_id, mode) {
  try {
    var id = _drupalgap_entity_page_container_id(entity_type, entity_id, mode);
    return {
      markup: '<div id="' + id + '"></div>'
    };
  }
  catch (error) { console.log('_drupalgap_entity_page_container - ' + error); }
}

/**
 * Given an entity type, an entity id, and a mode, this will return the unique
 * id to be used for the entity's page container.
 * @param {String} entity_type
 * @param {Number} entity_id
 * @param {String} mode
 * @return {String}
 */
function _drupalgap_entity_page_container_id(entity_type, entity_id, mode) {
  try {
    return entity_type + '_' + entity_id + '_' + mode + '_container';
  }
  catch (error) {
    console.log('_drupalgap_entity_page_container_id - ' + error);
  }
}

/**
 * Given an entity type, id, mode and page build, this will render the page
 * build and inject it into the container on the page.
 * @param {String} entity_type
 * @param {Number} entity_id
 * @param {String} mode
 * @param {Object} build
 */
function _drupalgap_entity_page_container_inject(entity_type, entity_id, mode,
  build) {
  try {
    // Get the container id, set the drupalgap.output to the page build, then
    // inject the rendered page into the container.
    var id = _drupalgap_entity_page_container_id(entity_type, entity_id, mode);
    drupalgap.output = build;
    $('#' + id).html(drupalgap_render_page());
  }
  catch (error) {
    console.log('_drupalgap_entity_page_container_inject - ' + error);
  }
}

/**
 * The page callback for entity edit forms.
 * @param {String} form_id
 * @param {String} entity_type
 * @param {Number} entity_id
 * @return {Object}
 */
function entity_page_edit(form_id, entity_type, entity_id) {
  try {
    var content = {
      container: _drupalgap_entity_page_container(
        entity_type,
        entity_id,
        'edit'
      )
    };
    return content;
  }
  catch (error) { console.log('entity_page_edit - ' + error); }
}

/**
 * The pageshow callback for entity edit forms.
 * @param {String} form_id
 * @param {String} entity_type
 * @param {Number} entity_id
 */
function entity_page_edit_pageshow(form_id, entity_type, entity_id) {
  try {
    entity_load(entity_type, entity_id, {
        success: function(entity) {
          _drupalgap_entity_page_container_inject(
            entity_type,
            entity_id,
            'edit',
            drupalgap_get_form(form_id, entity)
          );
        }
    });
  }
  catch (error) { console.log('entity_page_edit_pageshow - ' + error); }
}

/**
 * Implements hook_services_request_pre_postprocess_alter().
 * @param {Object} options
 * @param {*} result
 */
function entity_services_request_pre_postprocess_alter(options, result) {
  try {
    // If we're retrieving an entity, render the entity's content.
    if (
      options.resource == 'retrieve' &&
      in_array(options.service, entity_types()
    )) { drupalgap_entity_render_content(options.service, result); }
  }
  catch (error) {
    console.log('entity_services_request_pre_postprocess_alter - ' + error);
  }
}


