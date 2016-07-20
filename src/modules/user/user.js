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
    for (var index in account.permissions) {
        if (!account.permissions.hasOwnProperty(index)) { continue; }
        var object = account.permissions[index];
        if (object.permission == string) {
          access = true;
          break;
        }
    }
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
  var content = {};
  content['user_list'] = {
    theme: 'view',
    format: 'ul',
    path: 'drupalgap/views_datasource/drupalgap_users',
    row_callback: 'user_listing_row',
    empty_callback: 'user_listing_empty',
    attributes: {
      id: 'user_listing_' + user_password() /* make a random id */
    }
  };
  return content;
}

/**
 * The row callback for the simple user listing page.
 * @param view
 * @param row
 * @returns {String}
 */
function user_listing_row(view, row) {
  try {
    return l(t(row.name), 'user/' + row.uid);
  }
  catch (error) { console.log('user_listing_row - ' + error); }
}

/**
 * The empty callback for the simple user listing page.
 * @param view
 * @returns {String}
 */
function user_listing_empty(view) { return t('Sorry, no users were found.'); }

/**
 * The user logout page callback.
 * @return {String}
 */
function user_logout_callback() {
  return '<p>' + t('Logging out') + '...</p>';
}

/**
 * The user logout pageshow callback. This actually handles the call to the
 * user logout service resource.
 */
function user_logout_pageshow() {
  try {
    user_logout({
      success: function(data) {
        drupalgap_remove_pages_from_dom();
        drupalgap_goto(drupalgap.settings.front, { reloadPage:true });
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
        'title': t('Login'),
        'page_callback': 'drupalgap_get_form',
        'page_arguments': ['user_login_form'],
        options: {reloadPage: true}
      },
      'user/logout': {
        'title': t('Logout'),
        'page_callback': 'user_logout_callback',
        'pageshow': 'user_logout_pageshow',
        options: {reloadPage: true}
      },
      'user/register': {
        'title': t('Register'),
        'page_callback': 'drupalgap_get_form',
        'page_arguments': ['user_register_form'],
        'access_callback': 'user_register_access',
        options: {reloadPage: true}
      },
      'user/%': {
        title: t('My account'),
        title_callback: 'user_view_title',
        title_arguments: [1],
        page_callback: 'user_view',
        pageshow: 'user_view_pageshow',
        page_arguments: [1]
      },
      'user/%/view': {
        'title': t('View'),
        'type': 'MENU_DEFAULT_LOCAL_TASK',
        'weight': -10
      },
      'user/%/edit': {
        'title': t('Edit'),
        'page_callback': 'entity_page_edit',
        'pageshow': 'entity_page_edit_pageshow',
        'page_arguments': ['user_profile_form', 'user', 1],
        'access_callback': 'user_edit_access',
        'access_arguments': [1],
        'weight': 0,
        'type': 'MENU_LOCAL_TASK',
        options: {reloadPage: true}
      }
    };
    items['user-listing'] = {
      title: t('Users'),
      page_callback: 'user_listing',
      access_arguments: ['access user profiles']
    };
    items['user/password'] = {
      title: t('Request new password'),
      page_callback: 'drupalgap_get_form',
      page_arguments: ['user_pass_form']
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
    switch (drupalgap.site_settings.user_register.toString()) {
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
 * Implements hook_services_postprocess().
 * @param {Object} options
 * @param {Object} result
 */
function user_services_postprocess(options, result) {
  try {
    // Don't process any other services.
    if (options.service != 'user') { return; }
    var resources = ['login', 'logout', 'register'];
    // Only process login, logout and registration.
    if (!in_array(options.resource, resources) || (arg(0) != 'user' && !in_array(arg(1), resources))) {
      return;
    }
    // If there were any form errors, alert them to the user.
    if (!result.responseText) { return; }
    var response = JSON.parse(result.responseText);
    if ($.isArray(response)) {
      var msg = '';
      for (var index in response) {
          if (!response.hasOwnProperty(index)) { continue; }
          var message = response[index];
          msg += t(message) + '\n';
      }
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
                '<div class="user_profile_history"><h3>' +
                  t('History') +
                '</h3>' +
                '<dl><dt>' + t('Member since') + '</td></dt><dd>' +
                  (new Date(parseInt(account.created) * 1000)).toDateString() +
                '</dd></div>'
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
                'path': image_style_url(
                  drupalgap.site_settings.user_picture_style,
                  account.picture.uri
                )
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
    for (var rid in account.roles) {
        if (!account.roles.hasOwnProperty(rid)) { continue; }
        var value = account.roles[rid];
        if (role == value) {
          has_role = true;
          break;
        }
    }
    return has_role;
  }
  catch (error) { console.log('drupalgap_user_has_role - ' + error); }
}

