var _system_reload_page = null;
var _system_reload_messages = null;

/**
 * Implements hook_install().
 */
function system_install() {

  // Remove any old forms from local storage, then purge the form expiration tracker.
  for (var form_id in Drupal.cache_expiration.forms) {
    if (!Drupal.cache_expiration.forms.hasOwnProperty(form_id)) { continue; }
    drupalgap_form_local_storage_delete(form_id);
  }
  Drupal.cache_expiration.forms = {};
  window.localStorage.setItem('cache_expiration', JSON.stringify(Drupal.cache_expiration));

}

/**
 * Implements hook_block_info().
 * @return {Object}
 */
function system_block_info() {
    // System blocks.
    var blocks = {
      'main': {
        'delta': 'main',
        'module': 'system'
      },
      messages: {
        delta: 'messages',
        module: 'system'
      },
      'logo': {
        'delta': 'logo',
        'module': 'system'
      },
      logout: {
        delta: 'logout',
        module: 'system'
      },
      'title': {
        'delta': 'title',
        'module': 'system'
      },
      'powered_by': {
        'delta': 'powered_by',
        'module': 'system'
      },
      'help': {
        'delta': 'help',
        'module': 'system'
      }
    };
    // Make additional blocks for each system menu.
    var system_menus = menu_list_system_menus();
    for (var menu_name in system_menus) {
        if (!system_menus.hasOwnProperty(menu_name)) { continue; }
        var menu = system_menus[menu_name];
        var block_delta = menu.menu_name;
        blocks[block_delta] = {
          name: block_delta,
          delta: block_delta,
          module: 'menu'
        };
    }
    return blocks;
}

/**
 * Implements hook_block_view().
 * @param {String} delta
 * @return {String}
 */
function system_block_view(delta) {
  try {
    switch (delta) {
      case 'main':
        // This is the main content block, it is required to be in a theme's
        // region for the content of a page to show up (nodes, users, taxonomy,
        // comments, etc). Depending on the menu link router, we need to route
        // this through the appropriate template files and functions.
        return drupalgap_render_page();
        break;
      case 'messages':
        // If there are any messages waiting to be displayed, render them, then
        // clear out the messages array.
        var html = '';
        if (drupalgap.messages.length == 0) { return html; }
        for (var index in drupalgap.messages) {
            if (!drupalgap.messages.hasOwnProperty(index)) { continue; }
            var msg = drupalgap.messages[index];
            html += '<div class="messages ' + msg.type + '">' +
              msg.message +
            '</div>';
        }
        drupalgap.messages = [];
        return html;
        break;
      case 'logo':
        if (drupalgap.settings.logo) {
          return '<div class="logo">' +
            l(theme('image', {'path': drupalgap.settings.logo}), '') +
          '</div>';
        }
        return '';
        break;
      case 'logout':
        if (Drupal.user.uid) { return theme('logout'); }
        return '';
        break;
      case 'title':
        var title_id = system_title_block_id(drupalgap_path_get());
        return '<h1 id="' + title_id + '" class="page-title"></h1>';
        break;
      case 'powered_by':
        return '<p style="text-align: center;">' + t('Powered by') + ': ' +
          l('DrupalGap', 'http://www.drupalgap.org', {InAppBrowser: true}) +
        '</p>';
        break;
      case 'help':
        return l('Help', 'http://www.drupalgap.org/support');
        break;
      default:
        return '';
        break;
    }
  }
  catch (error) { console.log('system_block_info - ' + error); }
}

/**
 * Implements hook_menu().
 * @return {Object}
 */
function system_menu() {
    var items = {
      'dashboard': {
        'title': t('Dashboard'),
        'page_callback': 'system_dashboard_page'
      },
      'error': {
        'title': t('Error'),
        'page_callback': 'system_error_page'
      },
      'offline': {
        'title': t('Offline'),
        'page_callback': 'system_offline_page'
      },
      '401': {
        title: '401 - ' + t('Not Authorized'),
        page_callback: 'system_401_page'
      },
      '404': {
        title: '404 - ' + t('Not Found'),
        page_callback: 'system_404_page'
      }
    };
    items['_reload'] = {
      title: t('Reloading') + '...',
      page_callback: 'system_reload_page',
      pageshow: 'system_reload_pageshow'
    };
    return items;
}

/**
 * Page callback for the 401 page.
 * @param {String} path
 * @return {String}
 */
function system_401_page(path) {
  return t('Sorry, you are not authorized to view this page.');
}

/**
 * Page callback for the 404 page.
 * @param {String} path
 * @return {String}
 */
function system_404_page(path) {
  return t('Sorry, the page you requested was not found.');
}

/**
 * The page callback for the reload page.
 * @return {String}
 */
function system_reload_page() {
  try {
    // Set aside any messages, then return an empty page.
    var messages = drupalgap_get_messages();
    if (!empty(messages)) {
      _system_reload_messages = messages.slice();
      drupalgap_set_messages([]);
    }
    return '';
  }
  catch (error) { console.log('system_reload_page - ' + error); }
}

/**
 * The pageshow callback for the reload page.
 */
function system_reload_pageshow() {
  try {
    // Set any messages that were set aside.
    if (_system_reload_messages && !empty(_system_reload_messages)) {
      for (var i = 0; i < _system_reload_messages.length; i++) {
        drupalgap_set_message(
          _system_reload_messages[i].message,
          _system_reload_messages[i].type
        );
      }
      _system_reload_messages = null;
    }
    drupalgap_loading_message_show();
  }
  catch (error) { console.log('system_reload_pageshow - ' + error); }
}

/**
 * Implements hook_system_drupalgap_goto_post_process().
 * @param {String} path
 */
function system_drupalgap_goto_post_process(path) {
  try {

    // To reload the "current" page, grab the path we have been requested to
    // reload, clear out our global reference to it, then go!
    // @see https://github.com/signalpoint/DrupalGap/issues/254
    if (path == '_reload') {
      if (!_system_reload_page) { return; }
      var path = '' + _system_reload_page;
      _system_reload_page = null;
      drupalgap_loading_message_show();
      drupalgap_goto(path, { reloadPage: true });
    }

  }
  catch (error) {
    console.log('system_drupalgap_goto_post_process - ' + error);
  }
}

/**
 * Page callback for the dashboard page.
 * @return {Object}
 */
function system_dashboard_page() {
  try {
    var content = {};
    content.site_info = {
      markup: '<h4 style="text-align: center;">' +
        Drupal.settings.site_path +
      '</h4>'
    };
    content.welcome = {
      markup: '<h2 style="text-align: center;">' +
        t('Welcome to DrupalGap') +
      '</h2>' +
      '<p style="text-align: center;">' +
        t('The open source application development kit for Drupal!') +
      '</p>'
    };
    if (drupalgap.settings.logo) {
      content.logo = {
        markup: '<center>' +
                 theme('image', {path: drupalgap.settings.logo}) +
               '</center>'
      };
    }
    content.get_started = {
      theme: 'button_link',
      text: t('Getting Started Guide'),
      path: 'http://www.drupalgap.org/get-started',
      options: {InAppBrowser: true}
    };
    content.support = {
      theme: 'button_link',
      text: t('Support'),
      path: 'http://www.drupalgap.org/support',
      options: {InAppBrowser: true}
    };
    return content;
  }
  catch (error) { console.log('system_dashboard_page - ' + error); }
}

/**
 * The page callback for the error page.
 * @return {Object}
 */
function system_error_page() {
    var content = {
      info: {
        markup: '<p>' + t('An unexpected error has occurred!') + '</p>'
      }
    };
    return content;
}

/**
 * Call back for the offline page.
 * @return {Object}
 */
function system_offline_page() {
  try {
    var content = {
      'message': {
        'markup': '<h2>' + t('Failed Connection') + '</h2>' +
          '<p>' + t("Oops! We couldn't connect to") + ':</p>' +
          '<p>' + Drupal.settings.site_path + '</p>'
      },
      'try_again': {
        'theme': 'button',
        'text': t('Try Again'),
        'attributes': {
          'onclick': 'javascript:offline_try_again();'
        }
      },
      'footer': {
        'markup': '<p>' +
          t("Check your device's network settings and try again.") +
        '</p>'
      }
    };
    return content;
  }
  catch (error) { console.log('system_offline_page - ' + error); }
}

/**
 * When the 'try again' button is clicked, check for a connection and if it has
 * one make a call to system connect then go to the front page, otherwise just
 * inform user the device is still offline.
 * @return {*}
 */
function offline_try_again() {
  try {
    var connection = drupalgap_check_connection();
    if (drupalgap.online) {
      system_connect({
        success: function() {
          drupalgap_goto('');
        }
      });
    }
    else {
      var msg = t('Sorry, no connection found!') + ' (' + connection + ')';
      drupalgap_alert(msg, {
          title: 'Offline'
      });
      return false;
    }
  }
  catch (error) { console.log('offline_try_again - ' + error); }
}

/**
 * Returns an array of region names defined by the system that themes must use.
 * We do this so Core and Contrib Modules can use these regions for UI needs.
 * @return {Array}
 */
function system_regions_list() {
    var regions = ['header', 'content', 'footer'];
    return regions;
}

/**
 * Add default buttons to a form and set its prefix.
 * @param {Object} form
 * @param {Object} form_state
 * @return {Object}
 */
function system_settings_form(form, form_state) {
  try {
    // Add submit button to form if one isn't present.
    if (!form.elements.submit) {
      form.elements.submit = {
        type: 'submit',
        value: t('Save configuration')
      };
    }
    // Add cancel button to form if one isn't present.
    if (!form.buttons.cancel) {
      form.buttons['cancel'] = drupalgap_form_cancel_button();
    }
    // Attach submit handler.
    form.submit.push('system_settings_form_submit');
    return form;
  }
  catch (error) { console.log('system_settings_form - ' + error); }
}

/**
 * Execute the system_settings_form.
 * @param {Object} form
 * @param {Object} form_state
 */
function system_settings_form_submit(form, form_state) {
  try {
    if (form_state.values) {
      for (var variable in form_state.values) {
          if (!form_state.values.hasOwnProperty(variable)) { continue; }
          var value = form_state.values[variable];
          variable_set(variable, value);
      }
    }
  }
  catch (error) { console.log('system_settings_form_submit - ' + error); }
}

/**
 * Returns the block id used on the system's title block.
 * @param {String} path
 * @return {String}
 */
function system_title_block_id(path) {
  try {
    var id = 'drupalgap_page_title_' + drupalgap_get_page_id(path);
    return id;
  }
  catch (error) { console.log('system_title_block_id - ' + error); }
}

/**
 * The default access callback function for the logout block. Allows the block
 * to only be shown when a user is viewing their own profile.
 * @param {Object} options
 * @return {Boolean}
 */
function system_logout_block_access_callback(options) {
  try {
    var args = arg(null, options.path);
    if (
      args &&
      args.length == 2 &&
      args[0] == 'user' &&
      args[1] == Drupal.user.uid
    ) { return true; }
    return false;
  }
  catch (error) {
    console.log('system_logout_block_access_callback - ' + error);
  }
}

