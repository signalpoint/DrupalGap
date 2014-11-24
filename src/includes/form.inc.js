/**
 * Internal function used to dynamically add another element item to a form for
 * unlimited value fields.
 * @param {String} form_id
 * @param {String} name
 * @param {Number} delta
 */
function _drupalgap_form_add_another_item(form_id, name, delta) {
  try {
    // Locate the last item, load the form, extract the element from
    // the form, generate default variables for the new item, determine the next
    // delta value.
    var selector = '.' + drupalgap_form_get_element_container_class(name) +
      ' .drupalgap_form_add_another_item';
    var add_another_item_button = $(selector);
    var form = drupalgap_form_local_storage_load(form_id);
    var language = language_default();
    var item = drupalgap_form_element_item_create(
      name,
      form,
      language,
      delta + 1
    );
    form.elements[name][language][delta + 1] = item;
    var element = form.elements[name];
    var variables = {
      attributes: {},
      field_info_field: element.field_info_field,
      field_info_instance: element.field_info_instance
    };
    var field_widget_form_function =
      element.field_info_instance.widget.module + '_field_widget_form';
    window[field_widget_form_function].apply(
      null,
      _drupalgap_form_element_items_widget_arguments(
        form,
        null,
        element,
        language,
        delta + 1
      )
    );
    drupalgap_form_local_storage_save(form);
    $(add_another_item_button).before(
      _drupalgap_form_render_element_item(form, element, variables, item)
    );
  }
  catch (error) { console.log('_drupalgap_form_add_another_item - ' + error); }
}

/**
 * Returns a 'Cancel' button object that can be used on most forms.
 * @return {Object}
 */
function drupalgap_form_cancel_button() {
    return {
      'title': 'Cancel',
      attributes: {
        onclick: 'javascript:drupalgap_back();'
      }
    };
}

/**
 * Given a jQuery selector to a form, this will clear all the elements on
 * the UI.
 * @see http://stackoverflow.com/a/6364313/763010
 */
function drupalgap_form_clear(form_selector) {
  try {
    $(':input', form_selector)
     .not(':button, :submit, :reset, :hidden')
     .val('')
     .removeAttr('checked')
     .removeAttr('selected');
  }
  catch (error) { console.log('drupalgap_form_clear - ' + error); }
}

/**
 * Given a form id, this will assemble and return the default form JSON object.
 * @param {String} form_id
 * @return {Object}
 */
function drupalgap_form_defaults(form_id) {
  try {
    var form = {};
    // Set the form id, elements, buttons, options and attributes.
    form.id = form_id;
    form.elements = {};
    form.buttons = {};
    form.options = {
      attributes: {
        'class': ''
      }
    };
    // Create a prefix and suffix.
    form.prefix = '';
    form.suffix = '';
    // Create empty arrays for the form's validation and submission handlers,
    // then add the default call back functions to their respective array, if
    // they exist.
    form.validate = [];
    form.submit = [];
    var validate_function_name = form.id + '_validate';
    if (drupalgap_function_exists(validate_function_name)) {
      form.validate.push(validate_function_name);
    }
    var submit_function_name = form.id + '_submit';
    if (drupalgap_function_exists(submit_function_name)) {
      form.submit.push(submit_function_name);
    }
    // Finally, return the form.
    return form;
  }
  catch (error) { console.log('drupalgap_form_defaults - ' + error); }
}

/**
 * Given a form element, this will return true if access to the element is
 * permitted, false otherwise.
 * @param {Object} element
 * @return {Boolean}
 */
function drupalgap_form_element_access(element) {
  try {
    var access = true;
    if (element.access == false) { access = false; }
    return access;
  }
  catch (error) { console.log('drupalgap_form_element_access - ' + error); }
}

/**
 * Given a form element type, this will return the name of the module that
 * implements the hook_field_widget_form() for the element. Keep in mind for now
 * some of the module names don't exist, and are actually implemented inside
 * the field module. If no module is found, it returns false.
 * @param {String} type
 * @return {String}
 */
function drupalgap_form_element_get_module_name(type) {
  try {
    var module = false;
    switch (type) {
      case 'checkbox':
      case 'radios':
      case 'select':
        module = 'options';
        break;
      case 'image':
        module = 'image';
        break;
    }
    return module;
  }
  catch (error) {
    console.log('drupalgap_form_element_get_module_name - ' + error);
  }
}

/**
 * Given a form element name and the form_id, this generates an html id
 * attribute value to be used in the DOM. An optional third argument is a
 * string language code to use. An optional fourth argument is an integer delta
 * value to use on field elements.
 * @param {String} name
 * @param {String} form_id
 * @return {String}
 */
function drupalgap_form_get_element_id(name, form_id) {
  try {
    if (name == null || name == '') { return ''; }
    var id =
      'edit-' +
      form_id.toLowerCase().replace(/_/g, '-') + '-' +
      name.toLowerCase().replace(/_/g, '-');
    // Any language code to append to the id?
    if (arguments[2]) { id += '-' + arguments[2]; }
    // Any delta value to append to the id?
    if (typeof arguments[3] !== 'undefined') {
      id += '-' + arguments[3] + '-value';
    }
    return id;
  }
  catch (error) { console.log('drupalgap_form_get_element_id - ' + error); }
}

/**
 * Given an element name, this will return the class name to use on the
 * element's container.
 * @param {String} name
 * @return {String}
 */
function drupalgap_form_get_element_container_class(name) {
  try {
    return 'form-item field-name-' + name.replace(/_/g, '-');
  }
  catch (error) {
    console.log('drupalgap_form_get_element_container_class - ' + error);
  }
}

/**
 * Given a drupalgap form, this renders the form html and returns it.
 * @param {Object} form
 * @return {String}
 */
function drupalgap_form_render(form) {
  try {
    // @TODO - we may possibly colliding html element ids!!! For example, I
    // think the node edit page gets an id of "node_edit" and possibly so does
    // the node edit form, which also may get an id of "node_edit". We may want
    // to prefix both the template page and form ids with prefixes, e.g.
    // drupalgap_page_* and drupalgap_form_*, but adding these prefixes could
    // get annoying for css selectors used in jQuery and CSS. What to do?

    // If no form id is provided, warn the user.
    if (!form.id) {
      return '<p>drupalgap_form_render() - missing form id!</p>' +
        JSON.stringify(form);
    }
    // If the form already exists in the DOM, remove it.
    if ($('form#' + form.id).length) { $('form#' + form.id).remove(); }
    // Render the prefix and suffix and wrap them in their own div.
    var prefix = form.prefix;
    if (!empty(prefix)) {
      prefix = '<div class="form_prefix">' + prefix + '</div>';
    }
    var suffix = form.suffix;
    if (!empty(suffix)) {
      suffix = '<div class="form_suffix">' + suffix + '</div>';
    }
    // Render the form's input elements.
    var form_elements = _drupalgap_form_render_elements(form);
    var form_attributes = drupalgap_attributes(form.options.attributes);
    // Return the form html.
    var form_html = '<form id="' + form.id + '" ' + form_attributes + '>' +
      prefix +
      '<div id="drupalgap_form_errors"></div>' +
      form_elements +
      suffix +
    '</form>';
    return form_html;
  }
  catch (error) { console.log('drupalgap_form_render - ' + error); }
}

/**
 * Given a form element name and an error message, this attaches the error
 * message to the drupalgap.form_errors array, keyed by the form element name.
 * @param {String} name
 * @param {String} message
 */
function drupalgap_form_set_error(name, message) {
  try {
    drupalgap.form_errors[name] = message;
  }
  catch (error) { console.log('drupalgap_form_set_error - ' + error); }
}

/**
 * Given a form, this function iterates over the form's elements and assembles
 * each element and value and places them into the form state's values. This
 * is similar to $form_state['values'] in Drupal.
 * @param {Object} form
 * @return {Object}
 */
function drupalgap_form_state_values_assemble(form) {
  try {
    var lng = language_default();
    var form_state = {'values': {}};
    $.each(form.elements, function(name, element) {
      if (name == 'submit') { return; } // Always skip the form 'submit'.
      var id = null;
      if (element.is_field) {
        form_state.values[name] = {};
        form_state.values[name][lng] = {};
        var allowed_values = element.field_info_field.cardinality;
        if (allowed_values == -1) {
          allowed_values = 1; // Convert unlimited value field to one for now...
        }
        for (var delta = 0; delta < allowed_values; delta++) {
          id = drupalgap_form_get_element_id(name, form.id, lng, delta);
          form_state.values[name][lng][delta] =
            _drupalgap_form_state_values_assemble_get_element_value(
              id,
              element
            );
        }
      }
      else {
        id = drupalgap_form_get_element_id(name, form.id);
        form_state.values[name] =
          _drupalgap_form_state_values_assemble_get_element_value(
            id,
            element
          );
      }
    });
    // Attach the form state to drupalgap.form_states keyed by the form id.
    drupalgap.form_states[form.id] = form_state;
    return form_state;
  }
  catch (error) {
    console.log('drupalgap_form_state_values_assemble - ' + error);
  }
}

/**
 *
 * @param {String} id
 * @param {Object} element
 * @return {String|Number}
 */
function _drupalgap_form_state_values_assemble_get_element_value(id, element) {
  try {
    // If a value_callback is specified on the element, call that function to
    // retrieve the element's value. Ohterwise, we'll use the default techniques
    // implemented to extract a value for the form state.
    if (element.value_callback && function_exists(element.value_callback)) {
      var fn = window[element.value_callback];
      return fn(id, element);
    }
    // Figure out the value, depending on the element type.
    var value = null;
    var selector = '';
    if (element.type == 'radios') {
      selector = 'input:radio[name="' + id + '"]:checked';
    }
    else { selector = '#' + id; }
    switch (element.type) {
      case 'checkbox':
        var _checkbox = $(selector);
        if ($(_checkbox).is(':checked')) { value = 1; }
        else { value = 0; }
        break;
      case 'checkboxes':
        // Iterate over each option, and see if it is checked, then pop it onto
        // the value array.
        value = {};
        $.each(element.options, function(_value, _label) {
            if (_value == 'attributes') { return; } // Skip attributes.
            if (empty(_label)) { _label = _value; }
            selector = 'input[name="' + element.name + '[' + _value + ']"]';
            if (!$(selector).is(':checked')) { value[_value] = 0; }
            else { value[_value] = _value; }
        });
        break;
      case 'list_boolean':
        var _checkbox = $(selector);
        if ($(_checkbox).is(':checked')) { value = $(_checkbox).attr('on'); }
        else { value = $(_checkbox).attr('off'); }
        break;
    }
    if (value === null) { value = $(selector).val(); }
    if (typeof value === 'undefined') { value = null; }
    return value;
  }
  catch (error) {
    console.log(
      '_drupalgap_form_state_values_assemble_get_element_value - ' +
      error
    );
  }
}

/**
 * Given a form id, this will render the form and return the html for the form.
 * Any additional arguments will be sent along to the form.
 * @param {String} form_id
 * @return {String}
 */
function drupalgap_get_form(form_id) {
  try {
    var html = '';
    var form = drupalgap_form_load.apply(
      null,
      Array.prototype.slice.call(arguments)
    );
    if (form) {
      // Render the form.
      html = drupalgap_form_render(form);
    }
    else {
      var msg = 'drupalgap_get_form - failed to get form (' + form_id + ')';
      drupalgap_alert(msg);
    }
    return html;
  }
  catch (error) { console.log('drupalgap_get_form - ' + error); }
}

/**
 * Given a form id, this will return the form JSON object assembled by the
 * form's call back function. If the form fails to load, this returns false.
 * @param {String} form_id
 * @return {Object}
 */
function drupalgap_form_load(form_id) {
  try {

    var form = drupalgap_form_defaults(form_id);

    // The form's call back function will be equal to the form id.
    var function_name = form_id;
    if (drupalgap_function_exists(function_name)) {

      // Grab the form's function.
      var fn = window[function_name];

      // Determine the language code.
      var language = language_default();

      // Build the form arguments by iterating over each argument then adding
      // each to to the form arguments, afterwards remove the argument at index
      // zero because that is the form id.
      var form_arguments = [];
      $.each(arguments, function(index, argument) {
            form_arguments.push(argument);
      });
      form_arguments.splice(0, 1);

      // Attach the form arguments to the form object.
      form.arguments = form_arguments;

      // If there were no arguments to pass along, call the function directly to
      // retrieve the form, otherwise call the function and pass along any
      // arguments to retrieve the form.
      if (form_arguments.length == 0) { form = fn(form, null); }
      else {
        // We must consolidate the form, form_state and arguments into one array
        // and then pass it along to the form builder.
        var consolidated_arguments = [];
        var form_state = null;
        consolidated_arguments.push(form);
        consolidated_arguments.push(form_state);
        $.each(form_arguments, function(index, argument) {
          consolidated_arguments.push(argument);
        });
        form = fn.apply(
          null,
          Array.prototype.slice.call(consolidated_arguments)
        );
      }

      // Set empty options and attributes properties on each form element if the
      // element does not yet have any. This allows others to more easily modify
      // options and attributes on an element without having to worry about
      // testing for nulls and creating empty properties first.
      $.each(form.elements, function(name, element) {
          // If this element is a field, load its field_info_field and
          // field_info_instance onto the element.
          var element_is_field = false;
          var field_info_field = drupalgap_field_info_field(name);
          if (field_info_field) {
            element_is_field = true;
            form.elements[name].field_info_field = field_info_field;
            form.elements[name].field_info_instance =
              drupalgap_field_info_instance(
                form.entity_type,
                name,
                form.bundle
              );
          }
          form.elements[name].is_field = element_is_field;
          // Set the name property on the element if it isn't already set.
          if (!form.elements[name].name) { form.elements[name].name = name; }
          // If the element is a field, we'll append a language code and delta
          // value to the element id, along with the field items appended
          // onto the element using the language code and delta values.
          var id = null;
          if (element_is_field) {
            // What's the number of allowed values (cardinality) on this field?
            // A cardinality of -1 means the field has unlimited values.
            var cardinality = parseInt(element.field_info_field.cardinality);
            if (cardinality == -1) {
              cardinality = 1; // we'll just add one element for now, until we
                               // figure out how to handle the 'add another
                               // item' feature.
            }
            // Initialize the item collections language code if it hasn't been.
            if (!form.elements[name][language]) {
              form.elements[name][language] = {};
            }
            // Prepare the item(s) for this element.
            for (var delta = 0; delta < cardinality; delta++) {
              // Prepare some item defaults.
              var item = drupalgap_form_element_item_create(
                name,
                form,
                language,
                delta
              );
              // If the delta for this item hasn't been created on the element,
              // create it using the default item values. Otherwise, merge the
              // default values into the pre existing item on the element.
              if (!form.elements[name][language][delta]) {
                form.elements[name][language][delta] = item;
              }
              else {
                $.extend(true, form.elements[name][language][delta], item);
              }
            }
          }
          else {
            // This element is not a field, setup default options if none
            // have been provided. Then set the element id.
            if (!element.options) {
              form.elements[name].options = {attributes: {}};
            }
            else if (!element.options.attributes) {
              form.elements[name].options.attributes = {};
            }
            id = drupalgap_form_get_element_id(name, form.id);
            form.elements[name].id = id;
            form.elements[name].options.attributes.id = id;
          }
      });

      // Give modules an opportunity to alter the form.
      module_invoke_all('form_alter', form, null, form_id);

      // Place the assembled form into local storage so _drupalgap_form_submit
      // will have access to the assembled form.
      drupalgap_form_local_storage_save(form);
    }
    else {
      var error_msg = 'drupalgap_form_load - no callback function (' +
                       function_name + ') available for form (' + form_id + ')';
      drupalgap_alert(error_msg);
    }
    return form;
  }
  catch (error) { console.log('drupalgap_form_load - ' + error); }
}

/**
 * Given a form id, this will delete the form from local storage.
 * If the form isn't in local storage, this returns false.
 * @param {String} form_id
 * @return {Object}
 */
function drupalgap_form_local_storage_delete(form_id) {
  try {
    var result = window.localStorage.removeItem(
      drupalgap_form_id_local_storage_key(form_id)
    );
    return result;
  }
  catch (error) {
    console.log('drupalgap_form_local_storage_delete - ' + error);
  }
}

/**
 * Given a form id, this will load the form from local storage and return it.
 * If the form isn't in local storage, this returns false.
 * @param {String} form_id
 * @return {Object}
 */
function drupalgap_form_local_storage_load(form_id) {
  try {
    var form = false;
    form = window.localStorage.getItem(
      drupalgap_form_id_local_storage_key(form_id)
    );
    if (!form) { form = false; }
    else { form = JSON.parse(form); }
    return form;
  }
  catch (error) { console.log('drupalgap_form_local_storage_load - ' + error); }
}

/**
 * Given a form, this will save the form to local storage, overwriting any
 * previously saved forms.
 * @param {Object} form
 */
function drupalgap_form_local_storage_save(form) {
  try {
    window.localStorage.setItem(
      drupalgap_form_id_local_storage_key(form.id),
      JSON.stringify(form)
    );
  }
  catch (error) { console.log('drupalgap_form_local_storage_save - ' + error); }
}

/**
 * Given a form id, this will return the local storage key used by DrupalGap
 * to save the assembled form to the device's local storage.
 * @param {String} form_id
 * @return {String}
 */
function drupalgap_form_id_local_storage_key(form_id) {
    return 'drupalgap_form_' + form_id;
}

/**
 * Renders all the input elements in a form.
 * @param {Object} form
 * @return {String}
 */
function _drupalgap_form_render_elements(form) {
  try {
    var content = '';
    var content_sorted = '';
    var content_weighted = [];
    // For each form element, if the element objects name property isn't set,
    // set it, then render the element if access is permitted. While rendering
    // the elements, set them aside according to their widget weight so they
    // can be appended to the content string in the correct order later.
    $.each(form.elements, function(name, element) {
        if (!element.name) { element.name = name; }
        if (drupalgap_form_element_access(element)) {
          if (element.is_field && element.field_info_instance.widget.weight) {
            content_weighted[element.field_info_instance.widget.weight] =
              _drupalgap_form_render_element(form, element);
          }
          else {
            // Extract the bundle. Note, on comments the bundle is prefixed with
            // 'comment_node_' so we need to remove that to correctly map to the
            // potential extra fields data.
            var bundle = null;
            if (form.bundle) {
              bundle = form.bundle;
              if (
                form.entity_type == 'comment' &&
                form.bundle.indexOf('comment_node_') != -1
              ) { bundle = form.bundle.replace('comment_node_', ''); }
            }
            // This is not a field, if it has a weight in
            // field_info_extra_fields use it, otherwise just append it to the
            // content.
            if (
              form.entity_type && bundle &&
              typeof drupalgap.field_info_extra_fields[bundle][name] !==
                'undefined' &&
              typeof
                drupalgap.field_info_extra_fields[bundle][name].weight !==
                'undefined'
            ) {
              var weight =
                drupalgap.field_info_extra_fields[bundle][name].weight;
              content_weighted[weight] =
              _drupalgap_form_render_element(form, element);
            }
            else { content += _drupalgap_form_render_element(form, element); }
          }
        }
    });
    // Prepend the weighted elements to the content.
    if (!empty(content_weighted)) {
      for (var weight in content_weighted) {
        content_sorted += content_weighted[weight] + '\n';
      }
      // Attach sorted content.
      content = content_sorted + '\n' + content;
    }
    // Add any form buttons to the form elements html, if access to the button
    // is permitted.
    if (form.buttons && form.buttons.length != 0) {
      $.each(form.buttons, function(name, button) {
          if (drupalgap_form_element_access(button)) {
            var attributes = {
              type: 'button',
              id: drupalgap_form_get_element_id(name, form.id)
            };
            if (button.attributes) { $.extend(attributes, button.attributes); }
            content += '<button ' + drupalgap_attributes(attributes) + '">' +
              button.title +
            '</button>';
          }
      });
    }
    return content;
  }
  catch (error) { console.log('_drupalgap_form_render_elements - ' + error); }
}

/**
 * Renders an input element for a form.
 * @param {Object} form
 * @param {Object} element
 * @return {String}
 */
function _drupalgap_form_render_element(form, element) {
  try {
    var html = '';

    if (!element) { return html; }

    // Extract the element name.
    var name = element.name;

    // Grab the language.
    var language = language_default();

    // We'll assume the element has no items (e.g. title, nid, vid, etc), unless
    // we determine later that this element is a field, then it'll have items.
    var items = false;

    // If this element is a field, extract the items from the language code and
    // determine what module and hook will handle the items. If the element is
    // not a field, just flatten it into a single item collection and determine
    // which module handles this element type. Keep in mind not all the modules
    // actually exist, and we've placed implementations into the field module.
    var module = false;
    var field_widget_form_function_name = false;
    var field_widget_form_function = false;
    if (element.is_field) {
      items = element[language];
      module = element.field_info_instance.widget.module;
    }
    else {
      items = {0: element};
      module = drupalgap_form_element_get_module_name(element.type);
    }
    if (module) {
      field_widget_form_function_name = module + '_field_widget_form';

      if (drupalgap_function_exists(field_widget_form_function_name)) {
        field_widget_form_function = window[field_widget_form_function_name];
      }
      else {
        console.log(
          'WARNING: _drupalgap_form_render_element() - ' +
          field_widget_form_function_name +
          '() does not exist for the "' + element.type + '" form element!'
        );
      }
    }

    // If there were no items, just return.
    if (!items || items.length == 0) { return html; }

    // Generate default variables.
    var variables = {
      attributes: {}
    };

    // Grab the info instance and info field for the field, then attach them
    // both to the variables object so all theme functions will have access
    // to that data.
    variables.field_info_field = element.field_info_field;
    variables.field_info_instance = element.field_info_instance;

    // Render the element item(s). Remember the final delta value for later.
    var delta = 0;
    var item_html = '';
    var item_label = '';
    var render_item = null;
    $.each(items, function(delta, item) {

        // We'll render the item, unless we prove otherwise.
        render_item = true;

        // Overwrite the variable's attributes id with the item's id.
        variables.attributes.id = item.id;

        // Attach the item as the element onto variables.
        variables.element = item;

        // Create an array for the item's children if it doesn't exist already.
        // This is used by field widget forms to extend form elements.
        if (!items[delta].children) { items[delta].children = []; }

        // Generate the label for field items on delta zero only. Keep in mind
        // rendered labels, with an element title_placeholder set to true,
        // will not be appended to the result html later.
        if (element.is_field && delta == 0) {
          item.title = element.title;
          item_label = theme('form_element_label', {'element': item});
        }

        // If the element's title is set to be a placeholder, set the
        // placeholder attribute equal to the title on the current item, unless
        // someone already set it. If it is a required element, mark it as such.
        if (
          delta == 0 && typeof element.title_placeholder !== 'undefined' &&
          element.title_placeholder &&
          typeof variables.attributes['placeholder'] === 'undefined'
        ) {
          var placeholder = element.title;
          // @TODO show a better required marker for placeholders.
          /*if (element.required) {
            placeholder += ' ' + theme('form_required_marker', { });
          }*/
          variables.attributes['placeholder'] = placeholder;
        }

        // If there wasn't a default value provided, set one. Then set the
        // default value into the variables' attributes. Although, if we have an
        // item value, just use that.
        if (!item.default_value) { item.default_value = ''; }
        variables.attributes.value = item.default_value;
        if (typeof item.value !== 'undefined') {
          variables.attributes.value = item.value;
        }

        // Call the hook_field_widget_form() if necessary. Merge any changes
        // to the item back into this item.
        if (field_widget_form_function) {
          field_widget_form_function.apply(
            null, [
              form,
              null,
              element.field_info_field,
              element.field_info_instance,
              language,
              items,
              delta,
              element
          ]);
          // @TODO - sometimes an item gets merged without a type here, why?
          // @UPDATE - did the recursive extend fix this?
          item = $.extend(true, item, items[delta]);
          // If the item type got lost, replace it.
          if (!item.type && element.type) { item.type = element.type; }
        }

        // Merge element attributes into the variables object.
        if (item.options && item.options.attributes) {
          variables.attributes = $.extend(
            true,
            variables.attributes,
            item.options.attributes
          );
        }

        // Render the element item, unless it wasn't supported.
        item_html = _drupalgap_form_render_element_item(
          form,
          element,
          variables,
          item
        );
        if (!item_html) {
          render_item = false;
          return false;
        }
    });

    // Are we skipping the render of the item?
    if (!render_item) { return ''; }

    // Show the 'Add another item' button on unlimited value fields.
    /*if (element.field_info_field &&
      element.field_info_field.cardinality == -1) {
      var add_another_item_variables = {
        text: 'Add another item',
        attributes: {
          'class': 'drupalgap_form_add_another_item',
          onclick:
            "javascript:_drupalgap_form_add_another_item('" +
              form.id + "', '" +
              element.name + "', " +
              delta +
            ')'
        }
      };
      html += theme('button', add_another_item_variables);
    }*/

    // Is this element wrapped? We won't wrap hidden inputs by default, unless
    // someone is overriding it.
    var wrapped = true;
    if (typeof element.wrapped !== 'undefined' && !element.wrapped) {
      wrapped = false;
    }
    if (element.type == 'hidden') {
      wrapped = false;
      if (element.wrapped) { wrapped = true; }
    }

    // If there is an element prefix, place it in the html.
    if (element.prefix) { html += element.prefix; }

    // Open the element container.
    var container_attributes = {
      'class': drupalgap_form_get_element_container_class(name)
    };
    if (wrapped) {
      html += '<div ' + drupalgap_attributes(container_attributes) + '>';
    }

    // Add a label to the element, except submit and hidden elements. Any field
    // labels have already been rendered, other element labels must be manually
    // rendered here. Don't attach the label if the element's title_placeholder
    // is set to true.
    if (element.type != 'submit' && element.type != 'hidden') {
      if (
        typeof element.title_placeholder !== 'undefined' &&
        element.title_placeholder
      ) { /* Skip label for placeholders. */ }
      else {
        if (element.is_field) { html += item_label; }
        else {
          html += theme('form_element_label', {'element': element});
        }
      }
    }

    // Add the item html if it isn't empty.
    if (item_html != '') { html += item_html; }

    // Add element description.
    if (element.description && element.type != 'hidden') {
      html += '<div>' + element.description + '</div>';
    }

    // Close the element container.
    if (wrapped) { html += '</div>'; }

    // If there is an element suffix, place it in the html.
    if (element.suffix) { html += element.suffix; }

    // Return the element html.
    return html;

  }
  catch (error) { console.log('_drupalgap_form_render_element - ' + error); }
}

/**
 * Given a form, an element, the variables for a theme function, and the element
 * item, this will return the html rendering of the element item.
 * @param {Object} form
 * @param {Object} element
 * @param {Object} variables
 * @param {Object} item
 * @return {*}
 */
function _drupalgap_form_render_element_item(form, element, variables, item) {
  try {
    var html = '';
    // Depending on the element type, if necessary, adjust the variables and/or
    // theme function to be used, then render the element by calling its theme
    // function.
    // @TODO - this block of code should be moved into their respective
    // implementations of hook_field_widget_form().
    switch (item.type) {
      case 'text':
        item.type = 'textfield';
        break;
      case 'list_text':
      case 'list_float':
      case 'list_integer':
        item.type = 'select';
        break;
    }

    // Set the theme function.
    var theme_function = item.type;

    // If the element is disabled, add the 'disabled' attribute.
    if (element.disabled) { variables.attributes.disabled = ''; }

    // Make any preprocess modifications to the elements so they will map
    // cleanly to their theme function.
    // @todo A hook_field_widget_form() should be used instead here.
    if (item.type == 'submit') {
      variables.attributes.onclick =
        '_drupalgap_form_submit(\'' + form.id + '\');';
      if (!variables.attributes['data-theme']) {
        variables.attributes['data-theme'] = 'b';
      }
      if (typeof variables.attributes.type === 'undefined') {
        variables.attributes.type = 'button';
      }
    }

    // Merge the item into variables.
    $.extend(true, variables, item);

    // If a value isn't set on variables, try to set it with the default value
    // on the item.
    if (typeof variables.value === 'undefined' || variables.value == null) {
      if (typeof item.default_value !== 'undefined') {
        variables.value = item.default_value;
      }
    }

    // Run the item through the theme system if a theme function exists, or try
    // to use the item markup, or let the user know the field isn't supported.
    if (drupalgap_function_exists('theme_' + theme_function)) {
      html += theme(theme_function, variables);
    }
    else {
      if (item.markup || item.markup == '') { html += item.markup; }
      else {
        // @todo - the reason for this warning sometimes happens because the
        // item.type is lost with $.extend in _drupalgap_form_render_element().
        // @update - if an item doesn't have a type, it gets set by the parent
        // element, so we should now always have a type available here.
        var msg = 'Field ' + item.type + ' not supported.';
        console.log('WARNING: _drupalgap_form_render_element_item() - ' + msg);
        dpm(item);
        return null;
      }
    }

    // Render any item children. If the child has markup, just use the html,
    // otherwise run the child through theme().
    if (item.children && item.children.length > 0) {
      for (var i = 0; i < item.children.length; i++) {
        if (item.children[i].markup) { html += item.children[i].markup; }
        else if (item.children[i].type || item.children[i].theme) {
          var theme_type = item.children[i].type;
          if (!theme_type) { theme_type = item.children[i].theme; }
          // Is there a title for a label?
          if (item.children[i].title) {
            html += theme('form_element_label', {
                element: item.children[i]
            });
          }
          // Render the child with the theme system.
          if (item.children[i].prefix) { html += item.children[i].prefix; }
          html += theme(theme_type, item.children[i]);
          if (item.children[i].suffix) { html += item.children[i].suffix; }
        }
        else {
          console.log(
            'WARNING: _drupalgap_form_render_element_item - ' +
            'failed to render child ' + i + ' for ' + element.name
          );
        }
      }
    }

    return html;
  }
  catch (error) {
    console.log('_drupalgap_form_render_element_item - ' + error);
  }
}

/**
 * Given an element name, the form, a language code and a delta value, this
 * will return default values that can be used to place an item element into a
 * Forms API object.
 * @param {String} name
 * @param {Object} form
 * @param {String} language
 * @param {Number} delta
 * @return {Object}
 */
function drupalgap_form_element_item_create(name, form, language, delta) {
  try {
    // Generate the id for this element field item and set it and
    // some default options onto the element item.
    var id = drupalgap_form_get_element_id(name, form.id, language, delta);
    return {
      id: id,
      options: {
        attributes: {
          id: id
        }
      },
      required: form.elements[name].required
    };
  }
  catch (error) {
    console.log('drupalgap_form_element_item_create - ' + error);
  }
}

/**
 *
 * @param {Object} form
 * @param {Object} form_state
 * @param {Object} element
 * @param {String} language
 * @param {Number} delta
 * @return {Array}
 */
function _drupalgap_form_element_items_widget_arguments(form, form_state,
  element, language, delta) {
  try {
    var widget_arguments = [];
    widget_arguments.push(form); // form
    widget_arguments.push(form_state); // form state
    widget_arguments.push(element.field_info_field); // field
    widget_arguments.push(element.field_info_instance); // instance
    widget_arguments.push(language); // language
    widget_arguments.push(form.elements[element.name][language]); // items
    widget_arguments.push(delta); // delta
    widget_arguments.push(element); // element
    return widget_arguments;
  }
  catch (error) {
    console.log('_drupalgap_form_element_items_widget_arguments - ' + error);
  }
}

/**
 * Handles a drupalgap form's submit button click.
 * @param {String} form_id
 * @return {*}
 */
function _drupalgap_form_submit(form_id) {
  try {
    // Load the form from local storage.
    var form = drupalgap_form_local_storage_load(form_id);
    if (!form) {
      var msg = '_drupalgap_form_submit - failed to load form: ' + form_id;
      drupalgap_alert(msg);
      return false;
    }

    // Assemble the form state values.
    var form_state = drupalgap_form_state_values_assemble(form);

    // Clear out previous form errors.
    drupalgap.form_errors = {};

    // Build the form validation wrapper function.
    var form_validation = function() {
      try {

        // Call the form's validate function(s), if any.
        $.each(form.validate, function(index, function_name) {
            var fn = window[function_name];
            fn.apply(null, Array.prototype.slice.call([form, form_state]));
        });

        // Call drupalgap form's api validate.
        _drupalgap_form_validate(form, form_state);

        // If there were validation errors, show the form errors and stop the
        // form submission. Otherwise submit the form.
        if (!jQuery.isEmptyObject(drupalgap.form_errors)) {
          var html = '';
          $.each(drupalgap.form_errors, function(name, message) {
              html += message + '\n\n';
          });
          drupalgap_alert(html);
        }
        else { form_submission(); }
      }
      catch (error) {
        console.log('_drupalgap_form_submit - form_validation - ' + error);
      }
    };

    // Build the form submission wrapper function.
    var form_submission = function() {
      try {
        // Call the form's submit function(s), if any.
        $.each(form.submit, function(index, function_name) {
            var fn = window[function_name];
            fn.apply(null, Array.prototype.slice.call([form, form_state]));
        });
        // Remove the form from local storage.
        // @todo - we can't do this here because often times a form's submit
        // handler makes asynchronous calls (i.e. user login) and although the
        // form validated, server side may say the input was invalid, so the
        // user will still be on the form, except we already removed the form.
        //drupalgap_form_local_storage_delete(form_id);
      }
      catch (error) {
        console.log('_drupalgap_form_submit - form_submission - ' + error);
      }
    };

    // Get ready to validate and submit the form, but first...

    // If this is an entity form, and there is an image field on the form, we
    // need to asynchronously process the image field, then continue onward
    // with normal form validation and submission.
    if (form.entity_type &&
      image_fields_present_on_entity_type(form.entity_type, form.bundle)
    ) {
      _image_field_form_process(form, form_state, {
          success: form_validation
      });
    }
    else {
      // There were no image fields on the form, proceed normally with form
      // validation, which will in turn process the submission if there are no
      // validation errors.
      form_validation();
    }
  }
  catch (error) { console.log('_drupalgap_form_submit - ' + error); }
}

/**
 * When a service call results in an error, this function is used to extract the
 * request's response form errors into a human readble string and returns it. If
 * there are no form errors, it will return false.
 * @param {Object} form
 * @param {Object} form_state
 * @param {Object} xhr
 * @param {String} status
 * @param {String} message
 * @return {String|Boolean}
 */
function _drupalgap_form_submit_response_errors(form, form_state, xhr, status,
  message) {
  try {
    var responseText = JSON.parse(xhr.responseText);
    if (typeof responseText === 'object' && responseText.form_errors) {
      var msg = '';
      $.each(responseText.form_errors, function(element_name, error_msg) {
          if (error_msg != '') {
            // The element name tends to come back weird, e.g.
            // "field_art_type][und", so let's trim anything at and after
            // the first "]".
            var pos = element_name.indexOf(']');
            if (pos != -1) {
              element_name = element_name.substr(0, pos);
            }
            var label = element_name;
            if (
              form.elements[element_name] &&
              form.elements[element_name].title
            ) { label = form.elements[element_name].title; }
            msg += $('<div>(' + label + ') - ' +
              error_msg + '</div>').text() + '\n';
          }
      });
      if (msg != '') { return msg; }
    }
    return false;
  }
  catch (error) {
    console.log('_drupalgap_form_submit_response_errors - ' + error);
  }
}

/**
 * An internal function used by the DrupalGap forms api to validate all the
 * elements on a form.
 * @param {Object} form
 * @param {Object} form_state
 */
function _drupalgap_form_validate(form, form_state) {
  try {
    $.each(form.elements, function(name, element) {
        if (name == 'submit') { return; }
        if (element.required) {
          var valid = true;
          var value = null;
          if (element.is_field) {
            value = form_state.values[name][language_default()][0];
          }
          else { value = form_state.values[name]; }
          // Check for empty values.
          if (empty(value)) { valid = false; }
          // Validate a required select list.
          else if (
            element.type == 'select' && element.required && value == ''
          ) { valid = false; }
          else if (element.type == 'checkboxes' && element.required) {
            var has_value = false;
            $.each(form_state.values[name], function(key, value) {
                if (value) { has_value = true; return false; }
            });
            if (!has_value) { valid = false; }
          }
          if (!valid) {
            var field_title = name;
            if (element.title) { field_title = element.title; }
            drupalgap_form_set_error(
              name,
              'The ' + field_title + ' field is required.'
            );
          }
        }
    });
  }
  catch (error) { console.log('_drupalgap_form_validate - ' + error); }
}

/**
 * Themes a checkbox input.
 * @param {Object} variables
 * @return {String}
 */
function theme_checkbox(variables) {
  try {
    variables.attributes.type = 'checkbox';
    // Check the box?
    if (variables.checked) {
      variables.attributes.checked = 'checked';
    }
    var output = '<input ' + drupalgap_attributes(variables.attributes) + ' />';
    return output;
  }
  catch (error) { console.log('theme_checkbox - ' + error); }
}

/**
 * Themes checkboxes input.
 * @param {Object} variables
 * @return {String}
 */
function theme_checkboxes(variables) {
  try {
    var html = '';
    variables.attributes.type = 'checkboxes';
    $.each(variables.options, function(value, label) {
        if (value == 'attributes') { return; } // Skip attributes.
        var _label = value;
        if (!empty(label)) { _label = label; }
        html += '<label>' + theme('checkbox', {
            value: value,
            attributes: {
              name: variables.name + '[' + value + ']'
            }
        }) + '&nbsp;' + label + '</label>';
    });
    // Check the box?
    /*if (variables.checked) {
      variables.attributes.checked = 'checked';
    }*/
    return html;
  }
  catch (error) { console.log('theme_checkbox - ' + error); }
}

/**
 * Themes a email input.
 * @param {Object} variables
 * @return {String}
 */
function theme_email(variables) {
  try {
    variables.attributes.type = 'email';
    var output = '<input ' + drupalgap_attributes(variables.attributes) + ' />';
    return output;
  }
  catch (error) { console.log('theme_email - ' + error); }
}

/**
 * Themes a form element label.
 * @param {Object} variables
 * @return {String}
 */
function theme_form_element_label(variables) {
  try {
    var element = variables.element;
    if (empty(element.title)) { return ''; }
    // Any elements with a title_placeholder set to true
    // By default, use the element id as the label for, unless the element is
    // a radio, then use the name.
    var label_for = '';
    if (element.id) { label_for = element.id; }
    else if (element.attributes && element.attributes['for']) {
      label_for = element.attributes['for'];
    }
    if (element.type == 'radios') { label_for = element.name; }
    // Render the label.
    var html =
      '<label for="' + label_for + '"><strong>' + element.title + '</strong>';
    if (element.required) { html += theme('form_required_marker', { }); }
    html += '</label>';
    return html;
  }
  catch (error) { console.log('theme_form_element_label - ' + error); }
}

/**
 * Themes a marker for a required form element label.
 * @param {Object} variables
 * @return {String}
 */
function theme_form_required_marker(variables) {
    return '*';
}

/**
 * Themes a number input.
 * @param {Object} variables
 * @return {String}
 */
function theme_number(variables) {
  try {
    variables.attributes.type = 'number';
    var output = '<input ' + drupalgap_attributes(variables.attributes) + ' />';
    return output;
  }
  catch (error) { console.log('theme_number - ' + error); }
}

/**
 * Themes a hidden input.
 * @param {Object} variables
 * @return {String}
 */
function theme_hidden(variables) {
  try {
    variables.attributes.type = 'hidden';
    if (!variables.attributes.value && variables.value != null) {
      variables.attributes.value = variables.value;
    }
    var output = '<input ' + drupalgap_attributes(variables.attributes) + ' />';
    return output;
  }
  catch (error) { console.log('theme_hidden - ' + error); }
}

/**
 * Themes a password input.
 * @param {Object} variables
 * @return {String}
 */
function theme_password(variables) {
  try {
    variables.attributes.type = 'password';
    var output = '<input ' + drupalgap_attributes(variables.attributes) + ' />';
    return output;
  }
  catch (error) { console.log('theme_password - ' + error); }
}

/**
 * Themes radio buttons.
 * @param {Object} variables
 * @return {String}
 */
function theme_radios(variables) {
  try {
    var radios = '';
    if (variables.options) {
      variables.attributes.type = 'radio';
      // Determine an id prefix to use.
      var id = 'radio';
      if (variables.attributes.id) {
        id = variables.attributes.id;
        delete variables.attributes.id;
      }
      // Set the radio name equal to the id if one doesn't exist.
      if (!variables.attributes.name) {
        variables.attributes.name = id;
      }
      // Init a delta value so each radio button can have a unique id.
      var delta = 0;
      $.each(variables.options, function(value, label) {
          if (value == 'attributes') { return; } // Skip the attributes.
          var checked = '';
          if (variables.value && variables.value == value) {
            checked = ' checked="checked" ';
          }
          var input_id = id + '_' + delta.toString();
          var input_label =
            '<label for="' + input_id + '">' + label + '</label>';
          radios += '<input id="' + input_id + '" value="' + value + '" ' +
                                 drupalgap_attributes(variables.attributes) +
                                 checked + ' />' + input_label;
          delta++;
      });
    }
    return radios;
  }
  catch (error) { console.log('theme_radios - ' + error); }
}

/**
 * Themes a range input.
 * @param {Object} variables
 * @return {String}
 */
function theme_range(variables) {
  try {
    variables.attributes.type = 'range';
    if (typeof variables.attributes.value === 'undefined') {
      variables.attributes.value = variables.value;
    }
    var output = '<input ' + drupalgap_attributes(variables.attributes) + ' />';
    return output;
  }
  catch (error) { console.log('theme_range - ' + error); }
}

/**
 * Themes a search input.
 * @param {Object} variables
 * @return {String}
 */
function theme_search(variables) {
  try {
    variables.attributes.type = 'search';
    var output = '<input ' + drupalgap_attributes(variables.attributes) + ' />';
    return output;
  }
  catch (error) { console.log('theme_search - ' + error); }
}

/**
 * Themes a select list input.
 * @param {Object} variables
 * @return {String}
 */
function theme_select(variables) {
  try {
    var options = '';
    if (variables.options) {
      $.each(variables.options, function(value, label) {
          if (value == 'attributes') { return; } // Skip the attributes.
          // Is the option selected?
          var selected = '';
          if (
            typeof variables.value !== 'undefined' &&
            variables.value == value
          ) { selected = ' selected '; }
          // Render the option.
          options += '<option value="' + value + '" ' + selected + '>' +
            label +
          '</option>';
      });
    }
    return '<select ' + drupalgap_attributes(variables.attributes) + '>' +
      options +
    '</select>';
  }
  catch (error) { console.log('theme_select - ' + error); }
}

/**
 * Themes a telephone input.
 * @param {Object} variables
 * @return {String}
 */
function theme_tel(variables) {
  try {
    variables.attributes['type'] = 'tel';
    var output = '<input ' + drupalgap_attributes(variables.attributes) + ' />';
    return output;
  }
  catch (error) { console.log('theme_tel - ' + error); }
}

/**
 * Themes a text input.
 * @param {Object} variables
 * @return {String}
 */
function theme_textfield(variables) {
  try {
    variables.attributes.type = 'text';
    var output = '<input ' + drupalgap_attributes(variables.attributes) + ' />';
    return output;
  }
  catch (error) { console.log('theme_textfield - ' + error); }
}

/**
 * Themes a textarea input.
 * @param {Object} variables
 * @return {String}
 */
function theme_textarea(variables) {
  try {
    var output =
      '<div><textarea ' + drupalgap_attributes(variables.attributes) + '>' +
        variables.value +
      '</textarea></div>';
    return output;
  }
  catch (error) { console.log('theme_textarea - ' + error); }
}

