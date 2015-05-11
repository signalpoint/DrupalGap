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
      'title': t('Cancel'),
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
      var msg = 'drupalgap_get_form - ' + t('failed to get form') +
        ' (' + form_id + ')';
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
      var error_msg = 'drupalgap_form_load - ' + t('no callback function') +
        ' (' + function_name + ') ' + t('available for form') +
        ' (' + form_id + ')';
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

