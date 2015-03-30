/**
 * The request new password form.
 * @param {Object} form
 * @param {Object} form_state
 */
function user_pass_form(form, form_state) {
  try {
    form.elements['name'] = {
      type: 'textfield',
      title: 'Username or e-mail address',
      required: true
    };
    form.elements['submit'] = {
      type: 'submit',
      value: 'E-mail new password'
    };
    return form;
  }
  catch (error) { console.log('user_pass_form - ' + error); }
}

/**
 * The request new password form submission handler.
 * @param {Object} form
 * @param {Object} form_state
 */
function user_pass_form_submit(form, form_state) {
  try {
    user_request_new_password(form_state.values['name'], {
        success: function(result) {
          if (result[0]) {
            drupalgap_set_message('Further instructions have been sent to your e-mail address.');
            drupalgap_goto('user/login');
          }
        }
    });
  }
  catch (error) { console.log('user_pass_form_submit - ' + error); }
}

