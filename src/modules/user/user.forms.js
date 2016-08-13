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
      title: t('Username'),
      title_placeholder: true,
      required: true,
      attributes: {
        autocapitalize: 'none'
      }
    };
    form.elements.pass = {
      type: 'password',
      title: t('Password'),
      title_placeholder: true,
      required: true,
      attributes: {
        onkeypress: "drupalgap_form_onkeypress('" + form.id + "')"
      }
    };
    form.elements.submit = {
      type: 'submit',
      value: t('Login')
    };
    if (user_register_access()) {
      form.buttons['create_new_account'] = {
        title: t('Create new account'),
        attributes: {
          onclick: "drupalgap_goto('user/register')"
        }
      };
    }
    form.buttons['forgot_password'] = {
      title: t('Request new password'),
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
        drupalgap_goto(
            typeof form.action !== 'undefined' ?
                form.action : drupalgap.settings.front,
            { reloadPage:true }
        );
      }
    });
  }
  catch (error) { console.log('user_login_form_submit - ' + error); }
}

/**
 * The user registration form.
 * @param {Object} form
 * @param {Object} form_state
 * @return {Object}
 */
function user_register_form(form, form_state) {
  try {
    form.entity_type = 'user';
    form.bundle = null;
    var description = t('Spaces are allowed; punctuation is not allowed except for periods, hyphens, apostrophes, and underscores.');
    form.elements.name = {
      type: 'textfield',
      title: t('Username'),
      title_placeholder: true,
      required: true,
      description: description
    };
    form.elements.mail = {
      type: 'email',
      title: t('E-mail address'),
      title_placeholder: true,
      required: true
    };
    // If e-mail verification is not required, provide password fields and
    // the confirm e-mail address field.
    if (!drupalgap.site_settings.user_email_verification) {
      form.elements.conf_mail = {
        type: 'email',
        title: t('Confirm e-mail address'),
        title_placeholder: true,
        required: true
      };
      form.elements.pass = {
        type: 'password',
        title: t('Password'),
        title_placeholder: true,
        required: true
      };
      form.elements.pass2 = {
        type: 'password',
        title: t('Confirm password'),
        title_placeholder: true,
        required: true
      };
    }
    // @TODO - instead of a null bundle, it appears drupal uses the bundle 'user' instead.
    drupalgap_field_info_instances_add_to_form('user', null, form, null);
    // Add registration messages to form.
    form.user_register = {
      'user_mail_register_no_approval_required_body':
        t('Registration complete!'),
      'user_mail_register_pending_approval_required_body':
        t('Registration complete, waiting for administrator approval.'),
      'user_mail_register_email_verification_body':
        t('Registration complete, check your e-mail inbox to verify the ' +
          'account.')
    };
    // Set the auto login boolean. This only happens when the site's account
    // settings require no e-mail verification. Others can stop this from
    // happening via hook_form_alter().
    form.auto_user_login = true;
    // Add submit button.
    form.elements.submit = {
      'type': 'submit',
      'value': t('Create new account')
    };
    return form;
  }
  catch (error) { console.log('user_register_form - ' + error); }
}

/**
 * Define the form's validation function (optional).
 * @param {Object} form
 * @param {Object} form_state
 */
function user_register_form_validate(form, form_state) {
  try {
    // If e-mail verification is not required, make sure the passwords match.
    if (!drupalgap.site_settings.user_email_verification &&
      form_state.values.pass != form_state.values.pass2) {
      drupalgap_form_set_error('pass', t('Passwords do not match!'));
    }
    // If there are two e-mail address fields on the form, make sure they match.
    if (!empty(form_state.values.mail) && !empty(form_state.values.conf_mail) &&
      form_state.values.mail != form_state.values.conf_mail
    ) { drupalgap_form_set_error('mail', t('E-mail addresses do not match!')); }
  }
  catch (error) {
    console.log('user_register_form_validate - ' + error);
  }
}

/**
 * The user registration form submit handler.
 * @param {Object} form
 * @param {Object} form_state
 */
function user_register_form_submit(form, form_state) {
  try {
    var account = drupalgap_entity_build_from_form_state(form, form_state);
    user_register(account, {
      success: function(data) {
        var config = form.user_register;
        var options = {
          title: t('Registered')
        };
        var destination = typeof form.action !== 'undefined' ?
            form.action : drupalgap.settings.front;
        // Check if e-mail verification is required or not..
        if (!drupalgap.site_settings.user_email_verification) {
          // E-mail verification not needed, if administrator approval is
          // needed, notify the user, otherwise log them in.
          if (drupalgap.site_settings.user_register == '2') {
            drupalgap_alert(
              config.user_mail_register_pending_approval_required_body,
              options
            );
            drupalgap_goto(destination);
          }
          else {
            drupalgap_alert(
              config.user_mail_register_no_approval_required_body,
              options
            );
            // If we're automatically logging in do it, otherwise just go to
            // the front page.
            if (form.auto_user_login) {
              user_login(account.name, account.pass, {
                  success: function(result) {
                    drupalgap_goto('');
                  }
              });
            }
            else { drupalgap_goto(destination); }
          }
        }
        else {
          // E-mail verification needed... notify the user.
          drupalgap_alert(
            config.user_mail_register_email_verification_body,
            options
          );
          drupalgap_goto(destination);
        }
      },
      error: function(xhr, status, message) {
        // If there were any form errors, display them.
        var msg = _drupalgap_form_submit_response_errors(form, form_state, xhr,
          status, message);
        if (msg) { drupalgap_alert(msg); }
      }
    });
  }
  catch (error) { console.log('user_register_form_submit - ' + error); }
}

/**
 * The user profile form.
 * @param {Object} form
 * @param {Object} form_state
 * @param {Object} account
 * @return {Object}
 */
function user_profile_form(form, form_state, account) {
  try {
    // Setup form defaults.
    form.entity_type = 'user';
    form.bundle = null;

    // Add the entity's core fields to the form.
    drupalgap_entity_add_core_fields_to_form('user', null, form, account);

    // Add the fields for accounts to the form.
    drupalgap_field_info_instances_add_to_form('user', null, form, account);

    // If the user can't change their user name, remove access to it.
    if (!user_access('change own username')) {
      form.elements['name'].access = false;
      form.elements['name'].required = false;
    }

    // If profile pictures are disabled, remove the core field from the form.
    if (drupalgap.site_settings.user_pictures == 0) {
      delete form.elements.picture;
    }

    // Add password fields to the form. We show the current password field only
    // if the user is editing their account. We show the password and confirm
    // password field no matter what.
    if (Drupal.user.uid == account.uid) {
      form.elements.current_pass = {
        'title': t('Current password'),
        'type': 'password',
        'description': t('Enter your current password to change the E-mail ' +
          'address or Password.')
      };
    }
    form.elements.pass_pass1 = {
      'title': t('Password'),
      'type': 'password'
    };
    form.elements.pass_pass2 = {
      'title': t('Confirm password'),
      'type': 'password',
      'description': t('To change the current user password, enter the new ' +
        'password in both fields.')
    };

    // Add submit to form.
    form.elements.submit = {
      'type': 'submit',
      'value': t('Save')
    };

    // Add cancel button to form.
    form.buttons['cancel'] = {
      'title': t('Cancel'),
      attributes: {
        onclick: 'javascript:drupalgap_back();'
      }
    };

    return form;
  }
  catch (error) { console.log('user_profile_form - ' + error); }
}

/**
 * The user profile form validate handler.
 * @param {Object} form
 * @param {Object} form_state
 */
function user_profile_form_validate(form, form_state) {
  try {
    // If they entered their current password, and entered new passwords, make
    // sure the new passwords match.
    if (!empty(form_state.values['current_pass'])) {
      if (
        !empty(form_state.values['pass_pass1']) &&
        !empty(form_state.values['pass_pass2']) &&
        form_state.values['pass_pass1'] != form_state.values['pass_pass2']
      ) {
        drupalgap_form_set_error('pass_pass1', t('Passwords do not match.'));
      }
    }
    // If they didn't enter their current password and entered new passwords,
    // tell them they need to enter their current password.
    else if (
      empty(form_state.values['current_pass']) &&
      !empty(form_state.values['pass_pass1']) &&
      !empty(form_state.values['pass_pass2'])
    ) {
      drupalgap_form_set_error(
        'current_pass',
        t('You must enter your current password to change your password.')
      );
    }
  }
  catch (error) { console.log('user_profile_form_validate - ' + error); }
}

/**
 * The user profile form submit handler.
 * @param {Object} form
 * @param {Object} form_state
 */
function user_profile_form_submit(form, form_state) {
  try {
    var account = drupalgap_entity_build_from_form_state(form, form_state);
    // If they provided their current password, and their new password, prepare
    // the account submission values.
    if (
      account.current_pass &&
      !empty(account.pass_pass1) &&
      !empty(account.pass_pass2)
    ) {
      account.pass = account.pass_pass1;
      delete account.pass_pass1;
      delete account.pass_pass2;
    }
    drupalgap_entity_form_submit(form, form_state, account);
  }
  catch (error) { console.log('user_profile_form_submit - ' + error); }
}

/**
 * The request new password form.
 * @param {Object} form
 * @param {Object} form_state
 * @return {Object}
 */
function user_pass_form(form, form_state) {
  try {
    form.elements['name'] = {
      type: 'textfield',
      title: t('Username or e-mail address'),
      required: true,
      attributes: {
        onkeypress: "drupalgap_form_onkeypress('" + form.id + "')"
      }
    };
    form.elements['submit'] = {
      type: 'submit',
      value: t('E-mail new password')
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
            var msg =
              t('Further instructions have been sent to your e-mail address.');
            drupalgap_set_message(msg);
          }
          else {
            var msg =
              t('There was a problem sending an e-mail to your address.');
            drupalgap_set_message(msg, 'warning');
          }
          drupalgap_goto('user/login');
        }
    });
  }
  catch (error) { console.log('user_pass_form_submit - ' + error); }
}

