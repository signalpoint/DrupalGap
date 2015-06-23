/**
 *
 */
function drupalgap_get_form(form_id) {
  try {
    return drupalgap_form_render(form_id);
  }
  catch (error) { console.log('drupalgap_get_form - ' + error); }
}

/**
 *
 */
function drupalgap_form_render(form_id) {
  try {
    
    // Set up form defaults.
    var form = {
      attributes: {
        id: form_id,
        'class': []
      },
      elements: { },
      prefix: [],
      suffix: [],
      validate: [],
      submit: []
    };
    
    // Load the form from its form builder function.
    //var form = window[form_id](form);
    
    // Set up a directive attribute to handle this form.
    form.attributes[dg_get_camel_case(form_id)] = '';
    
    // Theme and return it.
    return theme('form', {
        form: form,
        //elements: drupalgap_form_render_elements(form)
    });

  }
  catch (error) { console.log('drupalgap_form_render - ' + error); }
}

