/**
 * Given a field name, this will return its field info.
 * @param {String} field_name
 * @return {Object}
 */
function drupalgap_field_info_field(field_name) {
  try {
    return drupalgap.field_info_fields[field_name];
  }
  catch (error) { console.log('drupalgap_field_info_field - ' + error); }
}

/**
 * Returns info on all fields.
 * @return {Object}
 */
function drupalgap_field_info_fields() {
  try {
    return drupalgap.field_info_fields;
  }
  catch (error) { console.log('drupalgap_field_info_fields - ' + error); }
}

/**
 * Given an entity type, field name, and bundle name this will return a JSON
 * object with data for the specified field name.
 * @param {String} entity_type
 * @param {String} field_name
 * @param {String} bundle_name
 * @return {Object}
 */
function drupalgap_field_info_instance(entity_type, field_name, bundle_name) {
  try {
    var instances = drupalgap_field_info_instances(entity_type, bundle_name);
    if (!instances) {
      var msg = 'WARNING: drupalgap_field_info_instance - instance was null ' +
      'for entity (' + entity_type + ') bundle (' + bundle_name + ') using ' +
      'field (' + field_name + ')';
      console.log(msg);
      return null;
    }
    if (!instances[field_name]) {
      var msg = 'WARNING: drupalgap_field_info_instance - ' +
        '"' + field_name + '" does not exist for entity (' + entity_type + ')' +
        ' bundle (' + bundle_name + ')';
      console.log(msg);
      return null;
    }
    return instances[field_name];
  }
  catch (error) { console.log('drupalgap_field_info_instance - ' + error); }
}

/**
 * Given an entity type and/or a bundle name, this returns the field info
 * instances for the entity or the bundle.
 * @param {String} entity_type
 * @param {String} bundle_name
 * @return {Object}
 */
function drupalgap_field_info_instances(entity_type, bundle_name) {
  try {
    var field_info_instances;
    // If there is no bundle, pull the fields out of the wrapper.
    // @TODO there appears to be a special case with commerce_products, in that
    // they aren't wrapped like normal entities (see the else statement when a
    // bundle name isn't present). Or do we have a bug here, and we shouldn't
    // be expecting the wrapper in the first place?
    if (!bundle_name) {
      if (entity_type == 'commerce_product') {
        field_info_instances =
          drupalgap.field_info_instances[entity_type];
      }
      else {
        field_info_instances =
          drupalgap.field_info_instances[entity_type][entity_type];
      }
    }
    else {
      if (typeof drupalgap.field_info_instances[entity_type] !== 'undefined') {
        field_info_instances =
          drupalgap.field_info_instances[entity_type][bundle_name];
      }
    }
    return field_info_instances;
  }
  catch (error) { console.log('drupalgap_field_info_instances - ' + error); }
}

/**
 * Given an entity type, bundle, form and entity, this will add the
 * entity's fields to the given form.
 * @param {String} entity_type
 * @param {String} bundle
 * @param {Object} form
 * @param {Object} entity
 */
function drupalgap_field_info_instances_add_to_form(entity_type, bundle, form, entity) {
  try {
    // Grab the field info instances for this entity type and bundle.
    var fields = drupalgap_field_info_instances(entity_type, bundle);
    // If there is no bundle, pull the fields out of the wrapper.
    //if (!bundle) { fields = fields[entity_type]; }
    // Use the default language, unless the entity has one specified.
    var language = language_default();
    if (entity && entity.language) { language = entity.language; }
    // Iterate over each field in the entity and add it to the form. If there is
    // a value present in the entity, then set the field's form element default
    // value equal to the field value.
    if (fields) {
      for (var name in fields) {
        if (!fields.hasOwnProperty(name)) { continue; }
        var field = fields[name];
        // The user registration form is a special case, in that we only want
        // to place fields that are set to display on the user registration
        // form. Skip any fields not set to display.
        if (form.id == 'user_register_form' &&
          !field.settings.user_register_form) {
          continue;
        }
        var field_info = drupalgap_field_info_field(name);
        if (field_info) {
          form.elements[name] = {
            type: field_info.type,
            title: field.label,
            required: field.required,
            description: field.description
          };
          var default_value = field.default_value;
          var cardinality = parseInt(field_info.cardinality);
          if (cardinality == -1) {
            cardinality = 1; // we'll just add one element for now, until we
                             // figure out how to handle the 'add another
                             // item' feature.
          }
          if (entity && entity[name] && entity[name].length != 0) {

            // Make sure the field has some type of language code on it, or just skip it. An entity will sometimes have
            // a language code that a field doesn't have, so fall back to und on the field if the language code isn't
            // present.
            if (!entity[name][language]) {
              if (!entity[name].und) { continue; }
              language = 'und';
            }

            if (!form.elements[name][language]) { form.elements[name][language] = {}; }

            for (var delta = 0; delta < cardinality; delta++) {

              // @TODO - is this where we need to use the idea of the
              // value_callback property present in Drupal's FAPI? That way
              // each element knows how to map the entity data to its element
              // value property.
              if (
                entity[name][language][delta] &&
                typeof entity[name][language][delta].value !== 'undefined'
              ) { default_value = entity[name][language][delta].value; }

              // If the default_value is null, set it to an empty string.
              if (default_value == null) { default_value = ''; }

              // Note, not all fields have a language code to use here, e.g. taxonomy term reference fields do not.
              form.elements[name][language][delta] = {
                value: default_value
              };

              // Place the field item onto the element.
              if (entity[name][language][delta]) {
                form.elements[name][language][delta].item =
                  entity[name][language][delta];
              }

            }

            // Set the language back to the entity's language in case it was temporarily changed because of an un
            // translated field.
            if (entity && entity.language) { language = entity.language; }

          }

          // Give module's a chance to alter their own element during the form
          // build, that way element properties will be saved to local storage
          // and then available during hook_field_widget_form() and the form
          // submission process.
          var fn = field.widget.module + '_field_info_instance_add_to_form';
          if (drupalgap_function_exists(fn)) {
            window[fn](entity_type, bundle, form, entity, form.elements[name]);
          }

        }
      }
    }
  }
  catch (error) {
    console.log('drupalgap_field_info_instances_add_to_form - ' + error);
  }
}

/**
 * Given a field name, this will return the key that should be used when
 * setting its value on an entity. If the field name is not a field, it returns
 * false.
 * @param {String} field_name
 * @return {String}
 */
function drupalgap_field_key(field_name) {
  try {
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
      else if (
        field_info.module == 'taxonomy' &&
        field_info.type == 'taxonomy_term_reference'
      ) { key = 'tid'; }
    }
    return key;
  }
  catch (error) { console.log('drupalgap_field_key - ' + error); }
}

/**
 * Implements hook_field_formatter_view().
 * @param {String} entity_type
 * @param {Object} entity
 * @param {Object} field
 * @param {Object} instance
 * @param {String} langcode
 * @param {Object} items
 * @param {*} display
 * @return {Object}
 */
function list_field_formatter_view(entity_type, entity, field, instance, langcode, items, display) {
  try {
    var element = {};
    if (!empty(items)) {
      for (var delta in items) {
          if (!items.hasOwnProperty(delta)) { continue; }
          var item = items[delta];
          var markup = '';
          // list_default or list_key
          if (display.type == 'list_default') {
            markup = instance.settings.allowed_values[item.value];
            // Single on/off checkboxes need an empty space as their markup so
            // just the label gets rendered.
            if (
              instance.type == 'list_boolean' &&
              field.widget.type == 'options_onoff'
            ) { markup = '&nbsp;'; }
          }
          else { markup = item.value; }
          element[delta] = { markup: markup };
      }
    }
    return element;
  }
  catch (error) { console.log('list_field_formatter_view - ' + error); }
}

/**
 * Implements hook_assemble_form_state_into_field().
 * @param {Object} entity_type
 * @param {String} bundle
 * @param {String} form_state_value
 * @param {Object} field
 * @param {Object} instance
 * @param {String} langcode
 * @param {Number} delta
 * @param {Object} field_key
 *
 * @return {*}
 */
function list_assemble_form_state_into_field(entity_type, bundle, form_state_value, field, instance, langcode, delta, field_key) {
  try {
    var result = form_state_value;
    switch (field.type) {
      case 'list_boolean':
        // For single on/off checkboxes, if the checkbox is unchecked, then we
        // send a null value on the language code. We know the checkbox is
        // unchecked if the form_state_value is equal to the first allowed value
        // on the field.
        if (instance.widget.type == 'options_onoff') {
          var index = 0;
          var on = true;
          for (var value in field.settings.allowed_values) {
              if (!field.settings.allowed_values.hasOwnProperty(value)) { continue; }
              var label = field.settings.allowed_values[value];
              if (form_state_value == value && index == 0) {
                on = false;
                break;
              }
              index++;
          }
          if (!on) {
            field_key.use_delta = false;
            field_key.use_wrapper = false;
            result = null;
          }
        }
        else {
          console.log(
            'WARNING: list_assemble_form_state_into_field - unknown widget (' +
              field.type +
            ') on list_boolean'
          );
        }
        break;
      case 'list_text':
        // For radio buttons on the user entity form, field values must be
        // "flattened", i.e. this field_foo: { und: [ { value: 123 }]}, should
        // be turned into field_foo: { und: 123 }
        if (
          entity_type == 'user' &&
          instance.widget.type == 'options_buttons'
        ) {
          field_key.use_delta = false;
          field_key.use_wrapper = false;
        }
        break;
      default:
        console.log(
          'WARNING: list_assemble_form_state_into_field - unknown type (' +
            field.type +
          ')'
        );
        break;
    }
    return result;
  }
  catch (error) {
    console.log('list_assemble_form_state_into_field - ' + error);
  }
}

/**
 * Implements hook_views_exposed_filter().
 * @param {Object} form
 * @param {Object} form_state
 * @param {Object} element
 * @param {Object} filter
 * @param {Object} field
 */
function list_views_exposed_filter(form, form_state, element, filter, field) {
  try {

    //console.log('list_views_exposed_filter');
    //console.log(form);
    //console.log(form_state);
    //console.log(element);
    //console.log(filter);
    //console.log(field);

    var widget = filter.options.group_info.widget;

    // List fields.
    if (widget == 'select') {

      // Set the element value if we have one in the filter.
      if (!empty(filter.value)) { element.value = filter.value[0]; }

      // Set the options, then depending on whether or not it is required, set
      // the default value accordingly.
      element.options = filter.value_options;
      if (!element.required) {
        element.options['All'] = '- ' + t('Any') + ' -';
        if (typeof element.value === 'undefined') { element.value = 'All'; }
      }

    }
    else {
      console.log('WARNING: list_views_exposed_filter - unsupported widget:' + widget);
    }
  }
  catch (error) { console.log('list_views_exposed_filter - ' + error); }
}

/**
 * Implements hook_field_formatter_view().
 * @param {String} entity_type
 * @param {Object} entity
 * @param {Object} field
 * @param {Object} instance
 * @param {String} langcode
 * @param {Object} items
 * @param {*} display
 * @return {Object}
 */
function number_field_formatter_view(entity_type, entity, field, instance, langcode, items, display) {
  try {
    var element = {};
    // If items is a string, convert it into a single item JSON object.
    if (typeof items === 'string') {
      items = {0: {value: items}};
    }
    if (!empty(items)) {
      var prefix = '';
      if (!empty(field.settings.prefix)) { prefix = field.settings.prefix; }
      var suffix = '';
      if (!empty(field.settings.suffix)) { suffix = field.settings.suffix; }
      for (var delta in items) {
          if (!items.hasOwnProperty(delta)) { continue; }
          var item = items[delta];
          element[delta] = {
            markup: prefix + item.value + suffix
          };
      }
    }
    return element;
  }
  catch (error) { console.log('number_field_formatter_view - ' + error); }
}

/**
 * Implements hook_field_widget_form().
 * @param {Object} form
 * @param {Object} form_state
 * @param {Object} field
 * @param {Object} instance
 * @param {String} langcode
 * @param {Object} items
 * @param {Number} delta
 * @param {Object} element
 */
function number_field_widget_form(form, form_state, field, instance, langcode, items, delta, element) {
  try {
    switch (element.type) {
      case 'number_integer':
      case 'number_float':
      case 'number_decimal':
      case 'range':
        // Change the form element into a number, unless we're using a range
        // slider. Then set its min/max attributes along with the step.
        if (element.type != 'range') { items[delta].type = 'number'; }
        if (!empty(instance.settings.max)) {
          items[delta].options.attributes['min'] = instance.settings.min;
        }
        if (!empty(instance.settings.max)) {
          items[delta].options.attributes['max'] = instance.settings.max;
        }
        var step = 1;
        if (element.type == 'number_float') { step = 0.01; }
        if (element.type == 'number_decimal') { step = 0.01; }
        items[delta].options.attributes['step'] = step;
        break;
      default:
        console.log(
          'number_field_widget_form - element type not supported (' +
            element.type +
          ')'
        );
        break;
    }
  }
  catch (error) { console.log('number_field_widget_form - ' + error); }
}

/**
 * Implements hook_field_widget_form().
 * @param {Object} form
 * @param {Object} form_state
 * @param {Object} field
 * @param {Object} instance
 * @param {String} langcode
 * @param {Object} items
 * @param {Number} delta
 * @param {Object} element
 * @return {*}
 */
function options_field_widget_form(form, form_state, field, instance, langcode, items, delta, element) {
  try {
    switch (element.type) {
      case 'checkbox':
        // If the checkbox has a default value of 1, check the box.
        if (items[delta].default_value == 1) { items[delta].checked = true; }
        break;
      case 'radios':
        break;
      case 'list_boolean':
        switch (instance.widget.type) {
          case 'options_onoff':
            // Switch an on/off boolean to a checkbox and place its on/off
            // values as attributes. Depending on the allowed values, we may
            // have to iterate over an array, or an object to get the on/off
            // values.
            items[delta].type = 'checkbox';
            var off = null;
            var on = null;
            if ($.isArray(field.settings.allowed_values)) {
              for (var key in field.settings.allowed_values) {
                if (off === null) { off = key; }
                else { on = key; }
              }
            }
            else {
              for (var value in field.settings.allowed_values) {
                  if (!field.settings.allowed_values.hasOwnProperty(value)) { continue; }
                  var label = field.settings.allowed_values[value];
                  if (off === null) { off = value; }
                  else { on = value; }
              }
            }
            items[delta].options.attributes['off'] = off;
            items[delta].options.attributes['on'] = on;
            // If the value equals the on value, then check the box.
            if (
              typeof items[delta] !== 'undefined' && items[delta].value == on
            ) { items[delta].options.attributes['checked'] = 'checked'; }
            break;
          default:
            console.log(
              'WARNING: options_field_widget_form list_boolean with ' +
              'unsupported type (' + instance.widget.type + ')'
            );
            break;
        }
        break;
      case 'select':
      case 'list_text':
      case 'list_float':
      case 'list_integer':
        if (instance) {
          switch (instance.widget.type) {
            case 'options_select':
              items[delta].type = 'select';
              // If the select list is required, add a 'Select' option and set
              // it as the default.  If it is optional, place a "none" option
              // for the user to choose from.
              var text = '- None -';
              if (items[delta].required) {
                text = '- ' + t('Select a value') + ' -';
              }
              items[delta].options[''] = text;
              if (empty(items[delta].value)) { items[delta].value = ''; }
              // If more than one value is allowed, turn it into a multiple
              // select list.
              if (field.cardinality != 1) {
                items[delta].options.attributes['data-native-menu'] = 'false';
                items[delta].options.attributes['multiple'] = 'multiple';
              }
              break;
            case 'options_buttons':
              // If there is one value allowed, we turn this into radio
              // button(s), otherwise they will become checkboxes.
              var type = 'checkboxes';
              if (field.cardinality == 1) { type = 'radios'; }
              items[delta].type = type;
              break;
            default:
              console.log(
                'WARNING: options_field_widget_form - unsupported widget (' +
                instance.widget.type + ')'
              );
              return false;
              break;
          }
          // If there are any allowed values, place them on the options
          // list. Then check for a default value, and set it if necessary.
          if (field && field.settings.allowed_values) {
            for (var key in field.settings.allowed_values) {
                if (!field.settings.allowed_values.hasOwnProperty(key)) { continue; }
                var value = field.settings.allowed_values[key];
                // Don't place values that are objects onto the options
                // (i.e. commerce taxonomy term reference fields).
                if (typeof value === 'object') { continue; }
                // If the value already exists in the options, then someone
                // else has populated the list (e.g. commerce), so don't do
                // any processing.
                if (typeof items[delta].options[key] !== 'undefined') {
                  break;
                }
                // Set the key and value for the option.
                items[delta].options[key] = value;
            }
            if (instance.default_value && instance.default_value[delta] &&
              typeof instance.default_value[delta].value !== 'undefined') {
                items[delta].value = instance.default_value[delta].value;
            }
          }
        }
        break;
      case 'taxonomy_term_reference':
          // Change the item type to a hidden input.
          items[delta].type = 'hidden';
          // What vocabulary are we using?
          var machine_name = field.settings.allowed_values[0].vocabulary;
          var taxonomy_vocabulary =
            taxonomy_vocabulary_machine_name_load(machine_name);

          var widget_type = false;
          if (instance.widget.type == 'options_select') {
            widget_type = 'select';
          }
          else {
            console.log(
              'WARNING: options_field_widget_form() - ' + instance.widget.type +
              ' not yet supported for ' + element.type + ' form elements!'
            );
            return false;
          }
          var widget_id = items[delta].id + '-' + widget_type;
          // If the select list is required, add a 'Select' option and set
          // it as the default.  If it is optional, place a "none" option
          // for the user to choose from.
          var text = '- ' + t('None') + ' -';
          if (items[delta].required) {
            text = '- ' + t('Select a value') + ' -';
          }
          items[delta].children.push({
              type: widget_type,
              attributes: {
                id: widget_id,
                onchange: "_theme_taxonomy_term_reference_onchange(this, '" +
                  items[delta].id +
                "');"
              },
              options: { '': text }
          });
          // Attach a pageshow handler to the current page that will load the
          // terms into the widget.
          var options = {
            'page_id': drupalgap_get_page_id(drupalgap_path_get()),
            'jqm_page_event': 'pageshow',
            'jqm_page_event_callback':
              '_theme_taxonomy_term_reference_load_items',
            'jqm_page_event_args': JSON.stringify({
                'taxonomy_vocabulary': taxonomy_vocabulary,
                'widget_id': widget_id
            })
          };
          // Pass the field name so the page event handler can be called for
          // each item.
          items[delta].children.push({
              markup: drupalgap_jqm_page_event_script_code(
                  options,
                  field.field_name
              )
          });
        break;
      default:
          var msg = 'options_field_widget_form - unknown widget type: ' + element.type;
          console.log(msg);
        break;
    }
  }
  catch (error) { console.log('options_field_widget_form - ' + error); }
}

/**
 * Implements hook_field_formatter_view().
 * @param {String} entity_type
 * @param {Object} entity
 * @param {Object} field
 * @param {Object} instance
 * @param {String} langcode
 * @param {Object} items
 * @param {*} display
 * @return {Object}
 */
function text_field_formatter_view(entity_type, entity, field, instance, langcode, items, display) {
  try {
    var element = {};
    if (items.length) {
      for (var delta in items) {
        if (!items.hasOwnProperty(delta)) { continue; }

        // Grab the item, then grab the field value or its safe_value if we have it.
        var item = items[delta];
        var value = typeof item.safe_value !== 'undefined' ? item.safe_value : item.value;

        // Any trim?
        if (display.type == 'text_summary_or_trimmed') {
          var length = display.settings.trim_length;
          value = value.length > length ? value.substring(0, length - 3) + "..." : value.substring(0, length);
        }

        element[delta] = { markup: value };
      }
    }
    return element;
  }
  catch (error) { console.log('text_field_formatter_view - ' + error); }
}

/**
 * Implements hook_field_widget_form().
 * @param {Object} form
 * @param {Object} form_state
 * @param {Object} field
 * @param {Object} instance
 * @param {String} langcode
 * @param {Object} items
 * @param {Number} delta
 * @param {Object} element
 */
function text_field_widget_form(form, form_state, field, instance, langcode, items, delta, element) {
  try {
    // Determine the widget type, then set the delta item's type property.
    var type = null;
    switch (element.type) {
      case 'search': type = 'search'; break;
      case 'text': type = 'textfield'; break;
      case 'textarea':
      case 'text_long':
      case 'text_with_summary':
      case 'text_textarea':
        type = 'textarea';
        break;
    }
    items[delta].type = type;

    // If the item has a value and its attribute value hasn't yet been set, then set the attribute value.
    if (
        typeof items[delta].value !== 'undefined' &&
        typeof items[delta].options.attributes.value === 'undefined'
    ) { items[delta].options.attributes.value = items[delta].value; }
  }
  catch (error) { console.log('text_field_widget_form - ' + error); }
}

