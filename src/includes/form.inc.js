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

