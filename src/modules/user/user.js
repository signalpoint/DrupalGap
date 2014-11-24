/**
 * Determine whether the user has a given privilege. Optionally pass in a user
 * account JSON object for the second paramater to check that particular
 * account.
 * @param {String} string The permission, such as "administer nodes", being
 *                        checked for.
 * @return {Boolean}
 */
function user_access(string) {
  try {
    var account;
    if (arguments[1]) { account = arguments[1]; }
    else { account = Drupal.user; }
    if (account.uid == 1) { return true; }
    var access = false;
    $.each(account.permissions, function(index, object) {
        if (object.permission == string) {
          access = true;
          return false;
        }
    });
    return access;
  }
  catch (error) { console.log('user_access - ' + error); }
}

/**
 * The access callback for the user/%/edit page.
 * @param {Object} account
 * @return {Boolean}
 */
function user_edit_access(account) {
  try {
    // If the current user is looking at their own account, or if they have the
    // 'administer users' permission, then they are allowed to edit the account.
    if (Drupal.user.uid == account.uid || user_access('administer users')) {
      return true;
    }
    return false;
  }
  catch (error) { console.log('user_edit_access - ' + error); }
}

/**
 * A page call back function to display a simple list of drupal users.
 * @return {Object}
 */
function user_listing() {
    // Place an empty item list that will hold a list of users.
    var content = {
      'user_listing': {
        'theme': 'jqm_item_list',
        'title': 'Users',
        'items': [],
        'attributes': {'id': 'user_listing_items'}
      }
    };
    return content;
}

/**
 * The pageshow callback handler for the user listing page.
 */
function user_listing_pageshow() {
  try {
    // Grab some users and display them.
    views_datasource_get_view_result(
      'drupalgap/views_datasource/drupalgap_users',
      {
        success: function(data) {
          // Extract the users into items, then drop them in the list.
          var items = [];
          $.each(data.users, function(index, object) {
              items.push(l(object.user.name, 'user/' + object.user.uid));
          });
          drupalgap_item_list_populate('#user_listing_items', items);
        }
      }
    );
  }
  catch (error) { console.log('user_listing_pageshow - ' + error); }
}

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
 * The user logout page callback.
 * @return {String}
 */
function user_logout_callback() {
  return '<p>Logging out...</p>';
}

/**
 * The user logout pageshow callback. This actually handles the call to the
 * user logout service resource.
 */
function user_logout_pagechange() {
  try {
    user_logout({
      success: function(data) {
        drupalgap_goto(drupalgap.settings.front);
      }
    });
  }
  catch (error) { console.log('user_logout_pagechange - ' + error); }
}

/**
 * Implements hook_menu().
 * @return {Object}
 */
function user_menu() {
    var items = {
      'user': {
        'page_callback': 'user_page'
      },
      'user/login': {
        'title': 'Login',
        'page_callback': 'drupalgap_get_form',
        'page_arguments': ['user_login_form'],
        options: {reloadPage: true}
      },
      'user/logout': {
        'title': 'Logout',
        'page_callback': 'user_logout_callback',
        'pagechange': 'user_logout_pagechange',
        options: {reloadPage: true}
      },
      'user/register': {
        'title': 'Register',
        'page_callback': 'drupalgap_get_form',
        'page_arguments': ['user_register_form'],
        'access_callback': 'user_register_access',
        options: {reloadPage: true}
      },
      'user/%': {
        title: 'My account',
        title_callback: 'user_view_title',
        title_arguments: [1],
        page_callback: 'user_view',
        pageshow: 'user_view_pageshow',
        page_arguments: [1]
      },
      'user/%/view': {
        'title': 'View',
        'type': 'MENU_DEFAULT_LOCAL_TASK',
        'weight': -10
      },
      'user/%/edit': {
        'title': 'Edit',
        'page_callback': 'entity_page_edit',
        'pageshow': 'entity_page_edit_pageshow',
        'page_arguments': ['user_profile_form', 'user', 1],
        'access_callback': 'user_edit_access',
        'access_arguments': [1],
        'weight': 0,
        'type': 'MENU_LOCAL_TASK',
        options: {reloadPage: true}
      },
      'user-listing': {
        'title': 'Users',
        'page_callback': 'user_listing',
        'access_arguments': ['access user profiles'],
        'pageshow': 'user_listing_pageshow'
      }
    };
    return items;
}

/**
 * Page callback for the user page.
 * @return {String}
 */
function user_page() {
    // NOTE, this page call back isn't actually used, because the 'user' path
    // in DrupalGap is redirected to either 'user/login' or e.g.
    // 'user/123'.
    return 'user_page()';
}

/**
 * Access callback for the user registration page.
 * @return {Boolean}
 */
function user_register_access() {
  try {
    switch (drupalgap.site_settings.user_register) {
      case '0': // admins only can register
        return false;
        break;
      case '1': // visitors can register
      case '2': // visitors can register, but admin approval is needed
        return true;
        break;
    }
  }
  catch (error) { console.log('user_register_access - ' + error); }
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
    form.elements.name = {
      type: 'textfield',
      title: 'Username',
      title_placeholder: true,
      required: true,
      description: 'Spaces are allowed; punctuation is not allowed except ' +
        'for periods, hyphens, apostrophes, and underscores.'
    };
    form.elements.mail = {
      type: 'email',
      title: 'E-mail address',
      title_placeholder: true,
      required: true
    };
    // If e-mail verification is not requred, provide password fields and
    // the confirm e-mail address field.
    if (!drupalgap.site_settings.user_email_verification) {
      form.elements.conf_mail = {
        type: 'email',
        title: 'Confirm e-mail address',
        title_placeholder: true,
        required: true
      };
      form.elements.pass = {
        type: 'password',
        title: 'Password',
        title_placeholder: true,
        required: true
      };
      form.elements.pass2 = {
        type: 'password',
        title: 'Confirm password',
        title_placeholder: true,
        required: true
      };
    }
    // @todo - instead of a null bundle, it appears drupal uses the bundle
    // 'user' instead.
    drupalgap_field_info_instances_add_to_form('user', null, form, null);
    // Add registration messages to form.
    form.user_register = {
      'user_mail_register_no_approval_required_body': 'Registration complete!',
      'user_mail_register_pending_approval_required_body':
        'Registration complete, waiting for administrator approval.',
      'user_mail_register_email_verification_body':
        'Registration complete, check your e-mail inbox to verify the account.'
    };
    // Set the auto login boolean. This only happens when the site's account
    // settings require no e-mail verification. Others can stop this from
    // happening via hook_form_alter().
    form.auto_user_login = true;
    // Add submit button.
    form.elements.submit = {
      'type': 'submit',
      'value': 'Create new account'
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
      drupalgap_form_set_error('pass', 'Passwords do not match!');
    }
    // If there are two e-mail address fields on the form, make sure they match.
    if (!empty(form_state.values.mail) && !empty(form_state.values.conf_mail) &&
      form_state.values.mail != form_state.values.conf_mail
    ) { drupalgap_form_set_error('mail', 'E-mail addresses do not match!'); }
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
        // Check if e-mail verification is required or not..
        if (!drupalgap.site_settings.user_email_verification) {
          // E-mail verification not needed, if administrator approval is
          // needed, notify the user, otherwise log them in.
          if (drupalgap.site_settings.user_register == '2') {
            drupalgap_alert(
            form.user_register.user_mail_register_pending_approval_required_body
            );
            drupalgap_goto('');
          }
          else {
            drupalgap_alert(
              form.user_register.user_mail_register_no_approval_required_body
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
            else { drupalgap_goto(''); }
          }
        }
        else {
          // E-mail verification needed... notify the user.
          drupalgap_alert(
            form.user_register.user_mail_register_email_verification_body
          );
          drupalgap_goto('');
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

    // Add password fields to the form. We show the current password field only
    // if the user is editing their account. We show the password and confirm
    // password field no matter what.
    if (Drupal.user.uid == account.uid) {
      form.elements.current_pass = {
        'title': 'Current password',
        'type': 'password',
        'description': 'Enter your current password to change the E-mail ' +
          'address or Password.'
      };
    }
    form.elements.pass_pass1 = {
      'title': 'Password',
      'type': 'password'
    };
    form.elements.pass_pass2 = {
      'title': 'Confirm password',
      'type': 'password',
      'description': 'To change the current user password, enter the new ' +
        'password in both fields.'
    };

    // Add submit to form.
    form.elements.submit = {
      'type': 'submit',
      'value': 'Save'
    };

    // Add cancel button to form.
    form.buttons['cancel'] = {
      'title': 'Cancel',
      attributes: {
        onclick: 'javascript:drupalgap_back();'
      }
    };

    return form;
  }
  catch (error) { console.log('user_profile_form - ' + error); }
}

/**
 * The user profile form submit handler.
 * @param {Object} form
 * @param {Object} form_state
 */
function user_profile_form_submit(form, form_state) {
  try {
    var account = drupalgap_entity_build_from_form_state(form, form_state);
    drupalgap_entity_form_submit(form, form_state, account);
  }
  catch (error) { console.log('user_profile_form_submit - ' + error); }
}

/**
 * Implements hook_services_postprocess().
 * @param {Object} options
 * @param {Object} result
 */
function user_services_postprocess(options, result) {
  try {
    // Don't process any other services.
    if (options.service != 'user') { return; }
    // Only process login, logout and registration.
    if (!in_array(options.resource, ['login', 'logout', 'register'])) {
      return;
    }
    // If there were any form errors, alert them to the user.
    if (!result.responseText) { return; }
    var response = JSON.parse(result.responseText);
    if ($.isArray(response)) {
      var msg = '';
      $.each(response, function(index, message) {
          msg += message + '\n';
      });
      if (msg != '') { drupalgap_alert(msg); }
    }
  }
  catch (error) { console.log('user_services_postprocess - ' + error); }
}

/**
 * Implements hook_theme().
 * @return {Object}
 */
function user_theme() {
    return {
      user_picture: {
        template: 'user-picture'
      },
      user_profile: {
        template: 'user-profile'
      }
    };
}

/**
 * Page callback for user/%.
 * @param {Number} uid
 * @return {Object}
 */
function user_view(uid) {
  try {
    if (uid) {
      var content = {
        container: _drupalgap_entity_page_container('user', uid, 'view')
      };
      return content;
    }
    else { console.log('user_view - No user id provided!'); }
  }
  catch (error) { console.log('user_view - ' + error); }
}

/**
 * jQM pageshow handler for node/% pages.
 * @param {Number} uid
 */
function user_view_pageshow(uid) {
  try {
    user_load(uid, {
        success: function(account) {
          // Determine the incoming arguments, and set defaults if necessary.
          var view_mode = 'full';
          var langcode = null;
          if (arguments[1]) { view_mode = arguments[1]; }
          if (arguments[2]) { langcode = arguments[2]; }
          if (!langcode) { langcode = language_default(); }
          if (account) {
            var build = {
              'theme': 'user_profile',
              'account': account,
              'view_mode': view_mode,
              'language': langcode,
              'name': {'markup': account.name},
              'created': {
                markup:
                  (new Date(parseInt(account.created) * 1000)).toDateString()
              }
            };
            // Any content?
            if (typeof account.content !== 'undefined') {
              build.content = { markup: account.content };
            }
            // Any picture?
            if (account.picture && account.picture.fid) {
              build.picture = {
                'theme': 'image',
                'path': account.picture.url
              };
            }
            _drupalgap_entity_page_container_inject(
              'user', account.uid, 'view', build
            );
          }
        }
    });
  }
  catch (error) { console.log('user_view_pageshow - ' + error); }
}

/**
 * Title callback for the user profile view page.
 * @param {Function} callback
 * @param {Number} uid
 */
function user_view_title(callback, uid) {
  try {
    user_load(uid, {
        success: function(account) {
          callback.call(null, account.name);
        }
    });
  }
  catch (error) { console.log('user_view_title - ' + error); }
}

/**
 * Given a user role (string), this determines if the current user has the role.
 * Returns true if the user has the role, false otherwise. You may pass in a
 * user account object to check against a certain account, instead of the
 * current user.
 * @param {String} role
 * @return {Boolean}
 */
function drupalgap_user_has_role(role) {
  try {
    var has_role = false;
    var account = null;
    if (arguments[1]) { account = arguments[1]; }
    else { account = Drupal.user; }
    $.each(account.roles, function(rid, value) {
        if (role == value) {
          has_role = true;
          return false;
        }
    });
    return has_role;
  }
  catch (error) { console.log('drupalgap_user_has_role - ' + error); }
}

