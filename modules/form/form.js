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
    $.each(form.elements, function(name, element){
        form_element = '<div><div id="drupalgap_form_errors"></div>';
        if (element.type != 'submit') {
          form_element += '<label for="' + name + '">' + element.title + '</label>';
        }
        switch (element.type) {
          
          case "email":
            form_element += '<input type="email" id="' + name + '" value=""/>';
            break;
          case "password":
            form_element += '<input type="password" id="' + name + '" value=""/>';
            break;
          case "submit":
            form_element += '<button type="button" data-theme="b" id="' + name + '" class="drupalgap_form_submit">' + element.value + '</button>';
            break;
          case "textfield":
            form_element += '<input type="text" id="' + name + '" value=""/>';
            break;
          default:
            console.log(JSON.stringify(element));
            alert('drupalgap_form_render - invalid element type - ' + element.type);
            return;
            break;
        }
        form_element += '</div>';
        $('' + css_selector).append(form_element).trigger('create');
    });
  }
  catch (error) {
    alert('drupalgap_form_render - ' + error);
  }
}

function drupalgap_form_set_error(name, message) {
  drupalgap.form_errors[name] = message;
}

function drupalgap_form_state_values_assemble(form) {
  try {
    form_state = {'values':{}};
    $.each(form.elements, function(name, element) {
        if (name == 'submit') { return; }
        form_state.values[name] = $('#' + name).val();
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
  form = {};
  function_name = form_id + '_form';
  if (eval('typeof ' + function_name) == 'function') {
	  if (drupalgap.settings.debug) {
	    console.log(function_name);
		}
		form = eval(function_name + '();');
	}
	console.log(JSON.stringify(form));
	console.log(JSON.stringify(drupalgap.form_state));
	console.log(form_id);
	console.log('hook form alter time');
	drupalgap_module_invoke_all('form_alter', form, drupalgap.form_state, form_id);
	drupalgap.form = form;
  return form;
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
      eval(validate_function + '();');
    }
    // If there were validation errors, show the form errors and stop the
    // form submission.
    if (!jQuery.isEmptyObject(drupalgap.form_errors)) {
      $('#drupalgap_form_errors').html('');
      $.each(drupalgap.form_errors, function(name, message){
          $('#drupalgap_form_errors').append('<li>' + message + '</li>');
      });
      return false;
    }
    // Call drupalgap form's api submit.
    _drupalgap_form_submit();
    // Call the form's submit function.
    validate_function = drupalgap.form.id + '_form_submit';
    if (eval('typeof ' + validate_function) == 'function') {
      eval(validate_function + '();');
    }
});

