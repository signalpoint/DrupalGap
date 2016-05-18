/**
 * Implements hook_install().
 */
function entity_install() {
  entity_clean_local_storage();
}

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
    var fields = drupalgap_entity_get_core_fields(entity_type, bundle);
    // Iterate over each core field in the entity and add it to the form. If
    // there is a value present in the entity, then set the field's form element
    // default value equal to the core field value.
    for (var name in fields) {
      if (!fields.hasOwnProperty(name)) { continue; }
      var field = fields[name];
      var default_value = field.default_value;
      if (entity && entity[name]) { default_value = entity[name]; }
      form.elements[name] = field;
      form.elements[name].default_value = default_value;
    }
  }
  catch (error) {
    console.log('drupalgap_entity_add_core_fields_to_form - ' + error);
  }
}

/**
 * Deprecated! Given an entity type, the bundle, the entity (assembled from form
 * state values) and any options, this assembles the ?data= string for the
 * entity service resource call URLs.
 * @param {String} entity_type
 * @param {String} bundle
 * @param {Object} entity
 * @param {Object} options
 */
function drupalgap_entity_assemble_data(entity_type, bundle, entity, options) {
  try {
    console.log('WARNING: drupalgap_entity_assemble_data() has been ' +
      'deprecated! Now just call e.g. node_save() for auto assembly.');
    return;
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
    return {
      title: t('Delete'),
      attributes: {
        onclick: "javascript:drupalgap_entity_edit_form_delete_confirmation('" +
          entity_type + "', " + entity_id +
        ');'
      }
    };
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
      t('Delete this content, are you sure? This action cannot be undone...');
    drupalgap_confirm(confirm_msg, {
        confirmCallback: function(button) {
          if (button == 2) { return; }
          // Change the jQM loader mode to deleting.
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
            // Go to the front page, unless a form action path was specified.
            var form = drupalgap_form_local_storage_load('node_edit');
            var destination = form.action ? form.action : '';
            drupalgap_goto(destination, {
              reloadPage: true,
              form_submission: true
            });
          };
          // Call the delete function.
          var name = services_get_resource_function_for_entity(
            entity_type,
            'delete'
          );
          var fn = window[name];
          fn(entity_id, call_arguments);
        }
    });
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

    // Figure out the bundle.
    var bundle = entity.type;
    if (entity_type == 'comment') { bundle = entity.bundle; }
    else if (entity_type == 'taxonomy_term') { bundle = entity.vocabulary_machine_name; }

    // Load the field info for this entity and bundle combo.
    var field_info = drupalgap_field_info_instances(entity_type, bundle);
    if (!field_info) { return; }

    // Give modules a chance to pre build the content.
    module_invoke_all('entity_pre_build_content', entity, entity_type, bundle);

    // Render each field on the entity, using the drupalgap or default display.
    var field_weights = {};
    var field_displays = {};
    for (var field_name in field_info) {
        if (!field_info.hasOwnProperty(field_name)) { continue; }
        var field = field_info[field_name];

        // Determine which display mode to use. The default mode will be used if the drupalgap display mode is not
        // present, unless a view mode has been specified in settings.js then we'll use that config for the current
        // entity/bundle combo. If a module isn't listed on a custom display, use the default display's module.
        if (!field.display) { break; }
        var display = field.display['default'];
        var view_mode = drupalgap_entity_view_mode(entity_type, bundle);
        if (field.display[view_mode]) {
          display = field.display[view_mode];
          if (typeof display.module === 'undefined' && typeof field.display['default'].module !== 'undefined'
          ) { display.module = field.display['default'].module; }
        }

        // Skip hidden fields.
        if (display.type == 'hidden') { continue; }

        // Save the field display and weight. Use the weight from the field's render element if it's available,
        // otherwise fallback to the weight mentioned in the display.
        field_displays[field_name] = display;
        field_weights[field_name] = typeof entity[field_name].weight !== 'undefined' ?
            entity[field_name].weight : display.weight;
    }

    // Give modules a chance to alter the build content.
    module_invoke_all('entity_post_build_content', entity, entity_type, bundle);

    // Extract the field weights and sort them.
    var extracted_weights = [];
    for (var field_name in field_weights) {
        if (!field_weights.hasOwnProperty(field_name)) { continue; }
        var weight = field_weights[field_name];
        extracted_weights.push(weight);
    }
    extracted_weights.sort(function(a, b) { return a - b; });

    // Give modules a chance to pre alter the content.
    module_invoke_all('entity_pre_render_content', entity, entity_type, bundle);

    // For each sorted weight, locate the field with the corresponding weight,
    // then render it's field content.
    var completed_fields = [];
    for (var weight_index in extracted_weights) {
        if (!extracted_weights.hasOwnProperty(weight_index)) { continue; }
        var target_weight = extracted_weights[weight_index];
        for (var field_name in field_weights) {
            if (!field_weights.hasOwnProperty(field_name) || typeof entity[field_name] === 'undefined') { continue; }
            if (typeof entity[field_name].access !== 'undefined' && !entity[field_name].access) { continue; }
            var weight = field_weights[field_name];
            if (target_weight == weight) {
              if (completed_fields.indexOf(field_name) == -1) {
                completed_fields.push(field_name);
                entity.content += drupalgap_entity_render_field(
                  entity_type,
                  entity,
                  field_name,
                  field_info[field_name],
                  field_displays[field_name]
                );
                break;
              }
            }
        }
    }

    // Give modules a chance to alter the content.
    module_invoke_all('entity_post_render_content', entity, entity_type, bundle);

    // Update this entity in local storage so the content property sticks.
    if (entity_caching_enabled(entity_type, bundle)) {
      _entity_local_storage_save(
        entity_type,
        entity[entity_primary_key(entity_type)],
        entity
      );
    }

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
    // If there wasn't a module specified in the display, look to the module
    // specified in the field widget. If we still don't find it, then just
    // return.
    var module = display['module'];
    if (!module) {
      if (!field.widget.module) {
        var msg = 'drupalgap_entity_render_field - ' +
          'unable to locate the module for the field (' + field_name + ')';
        console.log(msg);
        return content;
      }
      else { module = field.widget.module; }
    }
    var function_name = module + '_field_formatter_view';
    if (drupalgap_function_exists(function_name)) {
      // Grab the field formatter function, then grab the field items
      // from the entity, then call the formatter function and append its result
      // to the entity's content.
      var fn = window[function_name];
      var items = null;
      // Check to see if translated content based on app's language setting
      // is present or not. If yes, then use that language as per setting.
      // Determine the language code. Note, multi lingual sites may have a
      // language code on the entity, but still have 'und' on the field, so
      // fall back to 'und' if the field's language code doesn't match the
      // entity's language code.

      var default_lang = language_default();
      var language = entity.language;
      if (entity[field_name]) {
        if (entity[field_name][default_lang]) {
          items = entity[field_name][default_lang];
        }
        else if (entity[field_name][language]) {
          items = entity[field_name][language];
        }
        else if (entity[field_name]['und']) {
          items = entity[field_name]['und'];
          language = 'und';
        }
        else { items = entity[field_name]; }
      }
      // @TODO - We've been sending 'field' as the instance
      // (drupalgap_field_info_instance), and the 'instance' as the field
      // (drupalgap_field_info_field). This is backwards, and should be
      // reversed. All contrib modules with field support will need to be
      // udpated to reflect this. Lame.
      var elements = fn(
        entity_type,
        entity,
        field, /* This is actually the instance, doh! (I think) */
        drupalgap_field_info_field(field_name),
        language,
        items,
        display
      );
      for (var delta in elements) {
          if (!elements.hasOwnProperty(delta)) { continue; }
          var element = elements[delta];
          // If the element has markup, render it as is, if it is
          // themeable, then theme it.
          var element_content = '';
          if (element.markup) { element_content = element.markup; }
          else if (element.theme) {
            element_content = theme(element.theme, element);
          }
          content += element_content;
      }
    }
    else {
      console.log(
        'WARNING: drupalgap_entity_render_field - ' + function_name + '() ' +
        'does not exist! (' + field_name + ')'
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
    // Finally, wrap the rendered field in a div, and set the field name as the
    // class name on the wrapper.
    content = '<div class="' + field_name + '">' + content + '</div>';
    // Give modules a chance to alter the field content.
    var reference = {'content': content};
    module_invoke_all(
      'entity_post_render_field', entity, field_name, field, reference
    );
    if (reference.content != content) { return reference.content; }
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
    for (var name in form_state.values) {
        if (!form_state.values.hasOwnProperty(name)) { continue; }
        var value = form_state.values[name];

        // Skip elements with restricted access.
        if (
          typeof form.elements[name].access !== 'undefined' &&
          !form.elements[name].access
        ) { continue; }

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

        // Retrieve the potential key for the element, if we don't get one
        // then it is a flat field that should be attached as a property to the
        // entity. Otherwise attach the key and value to the entity.
        var key = drupalgap_field_key(name); // e.g. value, fid, tid, nid, etc.
        if (key) {

          // Determine how many allowed values for this field.
          var allowed_values = form.elements[name].field_info_field.cardinality;

          // Convert unlimited value fields to one, for now...
          if (allowed_values == -1) { allowed_values = 1; }

          // Make sure there is at least one value before creating the form
          // element on the entity.
          if (typeof value[language][0] === 'undefined') { continue; }

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
            if (typeof value[language][delta] !== 'undefined') {

              // @TODO - the way values are determined here is turning into
              // spaghetti code. Every form element needs its own
              // value_callback, just like Drupal's FAPI. Right now DG has
              // something similar going on with the use of
              // hook_assemble_form_state_into_field(). So replace any spaghetti
              // below with a value_callback. Provide a deprecated hook warning
              // for any fields not haven't caught up yet, and fallback to the
              // hook for a while.
              // @UPDATE - Actually, the DG FAPI
              // hook_assemble_form_state_into_field() is a good idea, and
              // should be used by all field form elements, then in
              // drupalgap_field_info_instances_add_to_form(), that function
              // should use the value_callback idea to properly map entity data
              // to the form element's value.

              // Extract the value.
              var field_value = value[language][delta];

              // By default, we'll assume we'll be attaching this element item's
              // value according to a key (usually 'value' is the default key
              // used by Drupal fields). However, we'll give modules that
              // implement hook_assemble_form_state_into_field() an opportunity
              // to specify no usage of a key if their item doesn't need one.
              // The geofield module is an example of field that doesn't use a
              // key. The use_wrapper flag allows others to completely override
              // the use of a wrapper around the field value, e.g. taxonomy term
              // reference autocomplete. We'll attach any other helpful
              // variables here as well (element name, form id, etc).
              var field_key = {
                value: 'value',
                use_key: true,
                use_wrapper: true,
                use_delta: use_delta,
                name: name,
                form_id: form.id,
                element_id: form.elements[name][language][delta].id
              };

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
                  delta,
                  field_key,
                  form
                );
              }

              // If someone updated the key, use it.
              if (key != field_key.value) { key = field_key.value; }

              // If we don't need a delta value, place the field value using the
              // key, if posible. If we're using a delta value, push the key
              // and value onto the field to indicate the delta.
              if (!field_key.use_delta) {
                if (!field_key.use_wrapper) {
                  entity[name][language] = field_value;
                }
                else {
                  if ($.isArray(entity[name][language])) {
                    console.log(
                      'WARNING: drupalgap_entity_build_from_form_state - ' +
                      'cannot use key (' + key + ') on field (' + name + ') ' +
                      'language code array, key will be ignored.'
                    );
                    entity[name][language].push(field_value);
                  }
                  else { entity[name][language][key] = field_value; }
                }
              }
              else {
                if (field_key.use_key) {
                  var item = {};
                  item[key] = field_value;
                  entity[name][language].push(item);
                }
                else {
                  entity[name][language].push(field_value);
                }
              }

              // If the field value was null, we won't send along the field, so
              // just remove it. Except for list_boolean fields, they need a
              // null value to set the field value to false.
              if (
                field_value === null &&
                typeof entity[name] !== 'undefined' &&
                form.elements[name].type != 'list_boolean'
              ) {
                if (is_field) {
                  if (delta == 0) { delete entity[name]; }
                  else if (typeof entity[name][language][delta] !== 'undefined') {
                    delete entity[name][language][delta];
                  }
                }
                else { delete entity[name]; }
              }

              // If we had an optional select list, and no options were
              // selected, delete the empty field from the assembled entity.
              // @TODO - will this cause multi value issues?
              if (
                is_field && !use_delta &&
                form.elements[name].field_info_instance.widget.type ==
                  'options_select' && !form.elements[name].required &&
                field_value === '' && typeof entity[name] !== 'undefined'
              ) { delete entity[name]; }

            }
          }
      }
      else if (typeof value !== 'undefined') { entity[name] = value; }
    }
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
        // Is there a destination URL query parameter overwriting the action?
        if (_GET('destination')) { destination = _GET('destination'); }
        // Set up the default goto options, and use any options provided by the
        // form.
        var goto_options = { form_submission: true };
        if (form.action_options) {
          goto_options = $.extend({}, goto_options, form.action_options);
        }
        // Finally goto our destination.
        drupalgap_goto(destination, goto_options);
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
        if (msg) { drupalgap_alert(msg); }
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
 * @param {String} bundle
 * @return {Object}
 */
function drupalgap_entity_get_core_fields(entity_type, bundle) {
  try {
    // @todo - was this function what we were tyring to accomplish with the
    // early entity_info hook imitations?
    // @todo - And why is this function not populated dynamically via Drupal?
    var fields = {};
    switch (entity_type) {
      case 'comment':
        var content_type = bundle.replace('comment_node_', '');
        // Add each schema field to the field collection.
        var base_table = drupalgap.entity_info[entity_type].schema_fields_sql['base table'];
        for (var index in base_table) {
            if (!base_table.hasOwnProperty(index)) { continue; }
            var name = base_table[index];
            var field = {
              type: 'hidden',
              required: false,
              default_value: '',
              title: ucfirst(name)
            };
            fields[name] = field;
        }
        // Make the node id required.
        fields['nid'].required = true;
        // Only anonymous users can fill out the name field, authenticated users
        // have their name auto filled and disabled.
        fields['name'].type = 'textfield';
        if (Drupal.user.uid != 0) {
          fields['name'].default_value = Drupal.user.name;
          fields['name'].disabled = true;
        }
        // If the 'Allow comment title' is enabled on the content type, show
        // the comment subject field.
        if (drupalgap.content_types_list[content_type].comment_subject_field) {
          fields['subject'].type = 'textfield';
        }
        // Depending on this content type's comment settings, let's make
        // modifications to the form elements.
        // admin/structure/types/manage/article
        // 0 = Anonymous posters may not enter their contact information
        // 1 = Anonymous posters may leave their contact information
        // 2 = Anonymous posters must leave their contact information
        var comment_anonymous =
          drupalgap.content_types_list[content_type].comment_anonymous;
        switch (comment_anonymous) {
          case '0':
            delete(fields['mail']);
            delete(fields['homepage']);
            break;
          case '1':
            break;
          case '2':
            fields['mail'].required = true;
            fields['homepage'].required = true;
            break;
        }
        // Only anonymous users get the mail and homepage fields.
        if (Drupal.user.uid == 0) {
          if (fields['mail']) { fields['mail'].type = 'textfield'; }
          if (fields['homepage']) { fields['homepage'].type = 'textfield'; }
        }
        break;
      case 'node':
        fields.nid = {
          'type': 'hidden',
          'required': false,
          'default_value': ''
        };
        fields.title = {
          'type': 'textfield',
          'title': t('Title'),
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
          'title': t('Username'),
          'required': true,
          'default_value': '',
          'description': ''
        };
        fields.mail = {
          'type': 'email',
          'title': t('E-mail address'),
          'required': true,
          'default_value': '',
          'description': ''
        };
        fields.picture = {
          'type': 'image',
          'widget_type': 'imagefield_widget',
          'title': t('Picture'),
          'required': false,
          'value': t('Add Picture')
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
            'title': t('Name'),
            'required': true,
            'default_value': ''
          },
          'description': {
            'type': 'textarea',
            'title': t('Description'),
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
            'title': t('Name'),
            'required': true,
            'default_value': ''
          },
          'machine_name': {
            'type': 'textfield',
            'title': t('Machine Name'),
            'required': true,
            'default_value': ''
          },
          'description': {
            'type': 'textarea',
            'title': t('Description'),
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
 * @see http://api.drupal.org/api/drupal/includes%21common.inc/function/entity_get_info/7
 * @return {Object|Boolean}
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
    var attrs = {
      id: id,
      'class': entity_type + ' ' + entity_type + '-' + mode
    };
    return {
      markup: '<div ' + drupalgap_attributes(attrs) + '></div>'
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
    return entity_type + '_' + entity_id + '_' + mode + '_container';
}

/**
 * Given an entity type, id, mode and page build, this will render the page
 * build and inject it into the container on the page.
 * @param {String} entity_type
 * @param {Number} entity_id
 * @param {String} mode
 * @param {Object} build
 */
function _drupalgap_entity_page_container_inject(entity_type, entity_id, mode, build) {
  try {
    // Get the container id, set the drupalgap.output to the page build, then
    // inject the rendered page into the container.
    var id = _drupalgap_entity_page_container_id(entity_type, entity_id, mode);
    module_invoke_all('entity_view_alter', entity_type, entity_id, mode, build);
    drupalgap.output = build;
    $('#' + id).html(drupalgap_render_page()).trigger('create');
    _drupalgap_entity_page_add_css_class_names(entity_type, entity_id, build);
  }
  catch (error) {
    console.log('_drupalgap_entity_page_container_inject - ' + error);
  }
}

/**
 * An internal function used to add css class names to an entity's jQM page container.
 * @param {String} entity_type
 * @param {Number} entity_id
 * @param {Object} build
 * @private
 */
function _drupalgap_entity_page_add_css_class_names(entity_type, entity_id, build) {
  try {
    var className = entity_type;
    var bundleName = entity_get_bundle(entity_type, build[entity_type]);
    if (bundleName) { className += '-' + bundleName; }
    className += ' ' + entity_type.replace(/_/g, '-') + '-' + entity_id;
    $('#' + drupalgap_get_page_id()).addClass(className);
  }
  catch (error) { console.log('_drupalgap_entity_page_add_css_class_names - ' + error); }
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
 * Returns an entity type's primary title key.
 * @param {String} entity_type
 * @return {String}
 */
function entity_primary_key_title(entity_type) {
  try {
    var key;
    switch (entity_type) {
      case 'comment': key = 'subject'; break;
      case 'file': key = 'filename'; break;
      case 'node': key = 'title'; break;
      case 'taxonomy_term': key = 'name'; break;
      case 'taxonomy_vocabulary': key = 'name'; break;
      case 'user': key = 'name'; break;
      default:
        console.log(
          'entity_primary_key_title - unsupported entity type (' +
            entity_type +
          ')'
        );
        break;
    }
    return key;
  }
  catch (error) { console.log('entity_primary_key_title - ' + error); }
}

/**
 * Implements hook_services_request_pre_postprocess_alter().
 * @param {Object} options
 * @param {*} result
 */
function entity_services_request_pre_postprocess_alter(options, result) {
  try {
    // If we're retrieving an entity, render the entity's content, if it isn't
    // already set.
    if (
      options.resource == 'retrieve' &&
      in_array(options.service, entity_types()
    )) {
      // @TODO - does this condition ever evaluate to true?
      if (typeof result.content !== 'undefined') { return; }
      drupalgap_entity_render_content(options.service, result);
    }
    // If we're indexing comments, render its content, if it isn't already set.
    else if (options.service == 'comment' && options.resource == 'index') {
      for (var index in result) {
          if (!result.hasOwnProperty(index)) { continue; }
          var object = result[index];
          // @TODO - does this condition ever evaluate to true?
          if (typeof object.content !== 'undefined') { continue; }
          drupalgap_entity_render_content(options.service, result[index]);
      }
    }
  }
  catch (error) {
    console.log('entity_services_request_pre_postprocess_alter - ' + error);
  }
}

