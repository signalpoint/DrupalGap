function drupalgap_form_get_element_id(name) {
  try {
    if (name == null || name == '') { return ''; }
    name = 'edit-' + name.toLowerCase().replace('_','-');
    if (drupalgap.settings.debug) {
      console.log(name);
    }
    return name;
  }
  catch (error) {
    alert('drupalgap_form_get_element_id - ' + error);
  }
  return null;
}

/**
 * Given a drupalgap form id, and css selector, this loads up the drupalgap form
 * with the given id, assembles it into html5 elements, than appends the
 * elements onto the element identified by the css selector input.
 */
function drupalgap_form_render(form_id, css_selector) {
  try {
    // Load the form, render each element, and append form to container
    // identified by the incoming css selector.
    form = drupalgap_get_form(form_id);
    if (drupalgap.settings.debug) {
      console.log('drupalgap_form_render');
      console.log(JSON.stringify(form));
    }
    form_elements = '';
    $.each(form.elements, function(name, element){
        // Open the element.
        form_element = '';
        if (element.type != 'hidden') {
          form_element += '<div>';
        }
        // Add a label to all fields, except submit.
        if (element.type != 'submit' && element.type != 'hidden') {
          form_element += '<label for="' + name + '"><strong>' + element.title + '</strong></label>';
        }
        // If there wasn't a default value provided, set one.
        if (!element.default_value) {
          element.default_value = '';
        }
        // Grab the html id attribute for this element name.
        element_id = drupalgap_form_get_element_id(name);
        // Depending on the element type, render the field.
        switch (element.type) {
          case "email":
            form_element += '<input type="email" id="' + element_id + '" value="' + element.default_value + '"/>';
            break;
          case "hidden":
            form_element += '<input type="hidden" id="' + element_id + '" value="' + element.default_value + '"/>';
            break;
          case "password":
            form_element += '<input type="password" id="' + element_id + '" value="' + element.default_value + '"/>';
            break;
          case "submit":
            form_element += '<button type="button" data-theme="b" id="' + element_id + '" class="drupalgap_form_submit">' + element.value + '</button>';
            break;
          case "textfield":
            form_element += '<input type="text" id="' + element_id + '" value="' + element.default_value + '"/>';
            break;
          case "text_with_summary":
            form_element += '<textarea type="text" id="' + element_id + '">' + element.default_value + '</textarea>';
            break;
          /*case "image":
            break;
          case "taxonomy_term_reference":
            break;*/
          default:
            form_element += '<div><em>Field ' + element.type + ' not supported, yet.</em></div>';
            console.log(JSON.stringify(element));
            break;
        }
        // Added element description.
        if (element.description && element.type != 'hidden') {
          form_element += '<div>' + element.description + '</div>';
        }
        // Close element and add to form elements.
        if (element.type != 'hidden') {
          form_element += '</div><div>&nbsp;</div>';
        }
        form_elements += form_element;
    });
    // Add any form buttons to the form elements html.
    if (form.buttons && form.buttons.length != 0) {
      $.each(form.buttons, function(name, button){
          form_elements += '<button type="button" id="' + drupalgap_form_get_element_id(name) + '">' +  button.title + '</button>';
      });
    }
    // Append the form to the container.
    form_html = '<div><div id="drupalgap_form_errors"></div>' + form_elements + '</div>';
    $(css_selector).append(form_html).trigger('create');
    // Call the form loaded function if it exists.
    function_name = form_id + '_form_loaded';
    if (eval('typeof ' + function_name) == 'function') {
      form = eval(function_name + '();');
    }
  }
  catch (error) {
    alert('drupalgap_form_render - ' + error);
  }
}

function drupalgap_form_set_error(name, message) {
  try {
    drupalgap.form_errors[name] = message;
  }
  catch (error) {
    alert('drupalgap_form_set_error - ' + error);
  }
}

function drupalgap_form_state_values_assemble(form) {
  try {
    form_state = {'values':{}};
    $.each(form.elements, function(name, element) {
        if (name == 'submit') { return; }
        form_state.values[name] = $('#' + drupalgap_form_get_element_id(name)).val();
    });
    drupalgap.form_state = form_state;
    if (drupalgap.settings.debug) {
      console.log(JSON.stringify(drupalgap.form_state));
    }
    return form_state;
  }
  catch (error) {
    alert('drupalgap_form_state_values_assemble - ' + error);
  }
  drupalgap.form_state = null;
  return null;
}

function drupalgap_get_form(form_id) {
  try {
    form = {};
    function_name = form_id + '_form';
    if (eval('typeof ' + function_name) == 'function') {
      if (drupalgap.settings.debug) {
        console.log(function_name);
      }
      form = eval(function_name + '();');
    }
    drupalgap_module_invoke_all('form_alter', form, drupalgap.form_state, form_id);
    drupalgap.form = form;
    return form;
  }
  catch (error) {
    alert('drupalgap_get_form - ' + error);
  }
  return null;
}

function _drupalgap_form_submit() {
}

function _drupalgap_form_validate(form, form_state) {
  $.each(form.elements, function(name, element) {
      if (name == 'submit') { return; }
      if (element.required) {
        if (form_state.values[name] == null || form_state.values[name] == '') {
          drupalgap_form_set_error(name, 'The ' + element.title + ' field is required.');
        }
      }
  });
}

/**
 * Handles a drupalgap form's submit button click.
 */
$('.drupalgap_form_submit').live('click', function(){
    
    // Assemble the form state values.
    drupalgap_form_state_values_assemble(drupalgap.form);
    
    // Clear our previuos form errors.
    drupalgap.form_errors = {};
    
    // Call drupalgap form's api validate.
    _drupalgap_form_validate(drupalgap.form, drupalgap.form_state);
    
    // Call the form's validate function.
    validate_function = drupalgap.form.id + '_form_validate';
    if (eval('typeof ' + validate_function) == 'function') {
      if (drupalgap.settings.debug) {
        console.log(validate_function);
      }
      var fn = window[validate_function];
      fn.apply(null, Array.prototype.slice.call([drupalgap.form, drupalgap.form_state]));
    }
    
    // If there were validation errors, show the form errors and stop the
    // form submission.
    if (!jQuery.isEmptyObject(drupalgap.form_errors)) {
      if (drupalgap.settings.debug) {
        console.log(JSON.stringify(drupalgap.form_errors));
      }
      $('#drupalgap_form_errors').html('');
      $.each(drupalgap.form_errors, function(name, message){
          $('#drupalgap_form_errors').append('<li>' + message + '</li>');
      });
      return false;
    }
    
    // Call drupalgap form's api submit.
    _drupalgap_form_submit();
    
    // Call the form's submit function.
    submit_function = drupalgap.form.id + '_form_submit';
    if (eval('typeof ' + submit_function) == 'function') {
      if (drupalgap.settings.debug) {
        console.log(submit_function);
      }
      var fn = window[submit_function];
      fn.apply(null, Array.prototype.slice.call([drupalgap.form, drupalgap.form_state]));
    }
});

