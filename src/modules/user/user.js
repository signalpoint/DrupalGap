dgApp.directive("userLogoutCallback", function($compile, $injector) {
    return {
      controller: function(jdrupal) {
        jdrupal.user_logout().success(function(result) {
            drupalgap_goto(drupalgap.settings.front);
        });
      }
    };
});

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
 * Returns true if the current user is logged, false otherwise. While DrupalGap
 * is loading, this value may not be accurate until a System Connect call is
 * completed, so use with caution during any initialization.
 */
function user_is_logged_in() {
  try {
    if (Drupal.user.uid && Drupal.user.uid != 0) { return true; }
    return false;
  }
  catch (error) { console.log('user_is_logged_in - ' + error); }
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
        'title': t('Users'),
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
          for (var index in data.users) {
              if (!data.users.hasOwnProperty(index)) { continue; }
              var object = data.users[index];
              items.push(l(object.user.name, 'user/' + object.user.uid));
          }
          drupalgap_item_list_populate('#user_listing_items', items);
        }
      }
    );
  }
  catch (error) { console.log('user_listing_pageshow - ' + error); }
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
      'user/register': {
        'title': t('Register'),
        'page_callback': 'user_register_form',
        'access_callback': 'user_register_access',
        options: {reloadPage: true}
      },
      'user/:uid': {
        title: t('My account'),
        title_callback: 'user_view_title',
        title_arguments: [1],
        page_callback: 'user_view',
        pageshow: 'user_view_pageshow',
        page_arguments: [1]
      },
      'user/:uid/view': {
        'title': t('View'),
        'type': 'MENU_DEFAULT_LOCAL_TASK',
        'weight': -10
      },
      'user/:uid/edit': {
        'title': t('Edit'),
        'page_callback': 'entity_page_edit',
        'pageshow': 'entity_page_edit_pageshow',
        'page_arguments': ['user_profile_form', 'user', 1],
        'access_callback': 'user_edit_access',
        'access_arguments': [1],
        'weight': 0,
        'type': 'MENU_LOCAL_TASK',
        options: {reloadPage: true}
      },/*
      'user-listing': {
        'title': t('Users'),
        'page_callback': 'user_listing',
        'access_arguments': ['access user profiles'],
        'pageshow': 'user_listing_pageshow'
      }*/
    };
    /*items['user/password'] = {
      title: t('Request new password'),
      page_callback: 'drupalgap_get_form',
      page_arguments: ['user_pass_form']
    };*/
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
      for (var index in response) {
          if (!response.hasOwnProperty(index)) { continue; }
          var message = response[index];
          msg += message + '\n';
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
      return _drupalgap_entity_view('user', uid, 'view');
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

