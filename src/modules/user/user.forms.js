/**
 * The user login form.
 * @param {Object} form
 * @param {Object} form_state
 * @return {Object}
 */
function user_login_form(form, form_state) {
  try {
    form.entity_type = 'user';
    form.bundle = null;
    form.elements.name = {
      type: 'textfield',
      title: 'Username',
      title_placeholder: true,
      required: true
    };
    form.elements.pass = {
      type: 'password',
      title: 'Password',
      title_placeholder: true,
      required: true
    };
    form.elements.submit = {
      type: 'submit',
      value: 'Login'
    };
    if (user_register_access()) {
      form.buttons['create_new_account'] = {
        title: 'Create new account',
        attributes: {
          onclick: "drupalgap_goto('user/register')"
        }
      };
    }
    form.buttons['forgot_password'] = {
      title: 'Request new password',
        attributes: {
          onclick: "drupalgap_goto('user/password')"
        }
    };
    return form;
  }
  catch (error) { console.log('user_login_form - ' + error); }
}

/**
 * The user login form submit handler.
 * @param {Object} form
 * @param {Object} form_state
 */
function user_login_form_submit(form, form_state) {
  try {
    user_login(form_state.values.name, form_state.values.pass, {
      success: function(result) {
        drupalgap_goto(drupalgap.settings.front);
      }
    });
  }
  catch (error) { console.log('user_login_form_submit - ' + error); }
}

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

