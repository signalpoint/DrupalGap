function drupalgap_form_get_element_id(name, form_id) {
  try {
    if (name == null || name == '') { return ''; }
    name =
      'edit-' +
      form_id.toLowerCase().replace(/_/g, '-') + '-' +
      name.toLowerCase().replace(/_/g,'-');
    if (drupalgap.settings.debug) { console.log(name); }
    return name;
  }
  catch (error) {
    alert('drupalgap_form_get_element_id - ' + error);
  }
}

/**
 * Given a drupalgap form id, a jQM page id, and a child container css selector
 * for an element inside the jQM page, this loads up the drupalgap form
 * with the given form id, assembles it into html5 elements, than appends the
 * elements onto the jQM page inside the container element.
 */
function drupalgap_form_render(options) {
  try {
    if (drupalgap.settings.debug) {
      console.log('drupalgap_form_render()');
      console.log(JSON.stringify(options));
    }
    if (!options.form_id) { alert('drupalgap_form_render - missing form_id'); }
    if (!options.page_id) { alert('drupalgap_form_render - missing page_id'); }
    if (!options.container) { alert('drupalgap_form_render - missing container'); }
    var form_id = options.form_id;
    var page_id = options.page_id;
    var container = options.container;
    // Load the form, render each element, and append form to container
    // identified by the incoming css selector.
    form = drupalgap_get_form(form_id);
    if (drupalgap.settings.debug) {
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
        element_id = drupalgap_form_get_element_id(name, form.id);
        // Depending on the element type, render the field.
        switch (element.type) {
          case "email":
            form_element += '<input type="email" id="' + element_id + '" value="' + element.default_value + '"/>';
            break;
          case 'image':
            // Set the default button text, and if a value was provided,
            // overwrite the button text.
            var button_text = 'Add Image';
            if (element.value) {
              button_text = element.value;
            }
            // Place variables into document for PhoneGap image processing.
            var element_id_base = element_id.replace(/-/g, '_'); 
            var image_field_source = element_id_base + '_imagefield_source';
            var imagefield_destination_type = element_id_base + '_imagefield_destination_type';
            var imagefield_data = element_id_base + '_imagefield_data';
            eval('var ' + image_field_source + ' = null;');
            eval('var ' + imagefield_destination_type + ' = null;');
            eval('var ' + imagefield_data + ' = null;');
            // Build an imagefield widget with PhoneGap. Contains a message
            // div, an image element, and button to add an image.
            form_element += '<div>' + 
              '<div id="' + element_id + '-imagefield-msg"></div>' + 
              '<img id="' + element_id + '-imagefield" />' + 
              '<a href="#" data-role="button" id="' + element_id + '">' + element.value + '</a>' + 
            '</div>';
            // Open extra javascript declaration.
            form_element += '<script type="text/javascript">';
            // Add device ready listener for PhoneGap camera.
            var event_listener = element_id_base +  '_imagefield_ready';
            form_element += '$("#' + options.page_id + '").on("pageshow",function(){' +
              'document.addEventListener("deviceready", ' + event_listener + ', false);' +
            '});' + 
            'function ' + event_listener +  '() {' +
              image_field_source + ' = navigator.camera.PictureSourceType;' +
              imagefield_destination_type + ' = navigator.camera.DestinationType;' +
            '}';
            // Define error callback function.
            var imagefield_error = element_id_base + '_error';
            form_element += 'function ' + imagefield_error + '(message) {' +
              'if (message != "Camera cancelled.") {' +
                'alert("' + imagefield_error + ' - " + message);' +
              '}' +
            '}';
            // Define success callback function.
            var imagefield_success = element_id_base + '_success';
            form_element += 'function ' + imagefield_success + '(message) {' +
              'alert("success!");' +
            '}';
            // Add click handler for photo button.
            form_element += '$("#' + element_id + '").on("click",function(){' +
              'var photo_options = {' +
                'quality: 50,' +
                'destinationType: ' + imagefield_destination_type + '.DATA_URL,' +
                'correctOrientation: true' +
              '};' +
              'navigator.camera.getPicture(' + imagefield_success + ', ' + imagefield_error + ', photo_options);' +
            '});';
            // Close extra javascript declaration.
            form_element += '</script>';
            console.log(form_element);
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
          case 'textarea':
          case 'text_long':
          case "text_with_summary":
            form_element += '<textarea type="text" id="' + element_id + '">' + element.default_value + '</textarea>';
            break;
          /*case "image":
            break;
          case "taxonomy_term_reference":
            break;*/
          default:
            form_element += '<div><em>Field ' + element.type + ' not supported, yet.</em></div>';
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
          form_elements += '<button type="button" id="' + drupalgap_form_get_element_id(name, form.id) + '">' +  button.title + '</button>';
      });
    }
    // Append the form to the container.
    form_html = '<div><div id="drupalgap_form_errors"></div>' + form_elements + '</div>';
    $('#' + page_id + ' ' + container).append(form_html).trigger('create');
    // Call the form's loaded unction if it is implemented.
    function_name = form_id + '_loaded';
    if (eval('typeof ' + function_name) == 'function') {
      form = eval(function_name + '();');
      //var fn = window[function_name];
      //fn.apply(null, form, form_state);
      //fn.apply(null, form);
    }
    else if (drupalgap.settings.debug) {
      console.log('Skipping ' + function_name + ', does not exist.');
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

/**
 * Given a form, this function iterates over the form's elements and assembles
 * each element and value and places them into the form state's values. This
 * is similar to $form_state['values'] in Drupal.
 */
function drupalgap_form_state_values_assemble(form) {
  try {
    form_state = {'values':{}};
    $.each(form.elements, function(name, element) {
      if (name == 'submit') { return; } // Always skip the form 'submit'.
      form_state.values[name] = $('#' + drupalgap_form_get_element_id(name, form.id)).val();
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
    function_name = form_id;
    if (drupalgap.settings.debug) {
      console.log('Getting form: ' + function_name);
    }
    if (eval('typeof ' + function_name) == 'function') {
      form = eval(function_name + '();');
      drupalgap_module_invoke_all('form_alter', form, drupalgap.form_state, form_id);
      drupalgap.form = form;
    }
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
    validate_function = drupalgap.form.id + '_validate';
    if (eval('typeof ' + validate_function) == 'function') {
      if (drupalgap.settings.debug) {
        console.log(validate_function);
      }
      var fn = window[validate_function];
      fn.apply(null, Array.prototype.slice.call([drupalgap.form, drupalgap.form_state]));
    }
    else if (drupalgap.settings.debug) {
      console.log('Skipping ' + validate_function + ', does not exist.');
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
    submit_function = drupalgap.form.id + '_submit';
    if (eval('typeof ' + submit_function) == 'function') {
      if (drupalgap.settings.debug) {
        console.log(submit_function);
      }
      var fn = window[submit_function];
      fn.apply(null, Array.prototype.slice.call([drupalgap.form, drupalgap.form_state]));
    }
    else if (drupalgap.settings.debug) {
      console.log('Skipping ' + submit_function + ', does not exist.');
    }
});

