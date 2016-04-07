/**
 * Optionally use this function as an HTML DOM onkeypress handler, and it will
 * attempt to listen for the enter key being pressed and submit the form at that
 * time.
 * @param {String} form_id
 * @return {Boolean}
 */
function drupalgap_form_onkeypress(form_id) {
  try {
    var event = window.event;
    var charCode = event.which || event.keyCode;
    if (charCode != '13') { return; }
    $('#' + form_id + ' button.dg_form_submit_button').click();
    event.preventDefault();
    return false;
  }
  catch (error) { console.log('drupalgap_form_onkeypress - ' + error); }
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
      var msg = '_drupalgap_form_submit - ' + t('failed to load form') + ': ' +
        form_id;
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
        for (var index in form.validate) {
            if (!form.validate.hasOwnProperty(index)) { continue; }
            var function_name = form.validate[index];
            var fn = window[function_name];
            fn.apply(null, Array.prototype.slice.call([form, form_state]));
        }

        // Call drupalgap form's api validate.
        _drupalgap_form_validate(form, form_state);

        // If there were validation errors, show the form errors and stop the
        // form submission. Otherwise submit the form.
        if (!jQuery.isEmptyObject(drupalgap.form_errors)) {
          var html = '';
          for (var name in drupalgap.form_errors) {
              if (!drupalgap.form_errors.hasOwnProperty(name)) { continue; }
              var message = drupalgap.form_errors[name];
              html += message + '\n\n';
          }
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
        for (var index in form.submit) {
            if (!form.submit.hasOwnProperty(index)) { continue; }
            var function_name = form.submit[index];
            var fn = window[function_name];
            fn.apply(null, Array.prototype.slice.call([form, form_state]));
        }
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
 * An internal function used by the DrupalGap forms api to validate all the
 * elements on a form.
 * @param {Object} form
 * @param {Object} form_state
 */
function _drupalgap_form_validate(form, form_state) {
  try {
    for (var name in form.elements) {
        if (!form.elements.hasOwnProperty(name)) { continue; }
        var element = form.elements[name];
        if (name == 'submit') { continue; }
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
            for (var key in form_state.values[name]) {
              if (!form_state.values[name].hasOwnProperty(key)) { continue; }
              var value = form_state.values[name][key];
              if (value) { has_value = true; break; }
            }
            if (!has_value) { valid = false; }
          }
          if (!valid) {
            var field_title = name;
            if (element.title) { field_title = element.title; }
            drupalgap_form_set_error(
              name,
              t('The') + ' ' + field_title + ' ' + t('field is required') + '.'
            );
          }
        }
    }
  }
  catch (error) { console.log('_drupalgap_form_validate - ' + error); }
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
    var form_state = { values: {} };
    for (var name in form.elements) {
      if (!form.elements.hasOwnProperty(name)) { continue; }
      var element = form.elements[name];
      if (name == 'submit') { continue; } // Always skip the form 'submit'.
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
    }
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
        // the value array. It's possible for values to be updated dynamically
        // by a developer (i.e. through a pageshow handler), so it isn't safe to
        // look at the options in local storage. Instead we'll directly iterate
        // over the element option(s) in the DOM.
        value = {};
        var options = $('label[for="' + id + '"]').siblings('.ui-checkbox');
        $.each(options, function(index, option) {
          var checkbox = $(option).children('input');
          var _value = $(checkbox).attr('value');
          if ($(checkbox).is(':checked')) { value[_value] = _value; }
          else { value[_value] = 0; }
        });
        break;
      case 'list_boolean':
        var _checkbox = $(selector);
        if ($(_checkbox).is(':checked')) { value = $(_checkbox).attr('on'); }
        else { value = $(_checkbox).attr('off'); }
        break;
      case 'list_text':
        // Radio buttons.
        if (
          element.field_info_instance &&
          element.field_info_instance.widget.type == 'options_buttons'
        ) {
          selector = 'input:radio[name="' + id + '"]:checked';
        }
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
      for (var element_name in responseText.form_errors) {
          if (!responseText.form_errors.hasOwnProperty(element_name)) { continue; }
          var error_msg = responseText.form_errors[element_name];
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
      }
      if (msg != '') { return msg; }
    }
    return false;
  }
  catch (error) {
    console.log('_drupalgap_form_submit_response_errors - ' + error);
  }
}

