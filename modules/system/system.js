/**
 * Implements hook_block_info().
 */
function system_block_info() {
  try {
    if (drupalgap.settings.debug) {
      console.log('system_block_info()');
    }
    // System blocks.
    var blocks = {
      'main':{
        'delta':'main',
        'module':'system',
      },
      'logo':{
        'delta':'logo',
        'module':'system',
      },
      'title':{
        'delta':'title',
        'module':'system',
      },
      'powered_by':{
        'delta':'powered_by',
        'module':'system',
      },
      'help':{
        'delta':'help',
        'module':'system',
      },
    };
    // Make additional blocks for each system menu.
    var system_menus = menu_list_system_menus();
    $.each(system_menus, function(menu_name, menu){
        var block_delta = menu.menu_name;
        eval('blocks.' + block_delta + ' = {"name":"' + block_delta + '","delta":"' + block_delta + '","module":"menu"};');
    });
    if (drupalgap.settings.debug) {
      console.log('system_block_info() - blocks');
      console.log(JSON.stringify(blocks));
    }
    return blocks;
  }
  catch (error) {
    alert('system_block_info - ' + error);
  }
}

/**
 * Implements hook_block_view().
 */
function system_block_view(delta) {
  try {
    if (drupalgap.settings.debug) {
      console.log('system_block_view(' + delta + ')');
    }
    switch (delta) {
      case 'main':
        // This is the main content block, it is required to be in a theme's region
        // for the content of a page to show up (nodes, users, taxonomy, comments, etc).
        // Depending on the menu link router, we need to route this through the appropriate
        // template files and functions.
        return drupalgap_render_page();
        break;
      case 'logo':
        if (drupalgap.settings.logo) {
          return '<div>' + l(theme('image', {'path':drupalgap.settings.logo}), '') + '</div>';
          //return '<div><img src="' + drupalgap.settings.logo + '" /></div>';
        }
        return '';
        break;
      case 'title':
        return '<h1 id="drupalgap_page_title"></h1>';
        break;
      case 'powered_by':
        return '<p style="text-align: center;">Powered by: ' +
          l('DrupalGap','http://www.drupalgap.org', {InAppBrowser:true}) +
        '</p>';
        break;
      case 'help':
        return l('Help','http://www.drupalgap.org/support');
        break;
      default:
        return '';
        break;
    }
  }
  catch (error) {
    alert('system_block_info - ' + error);
  }
}

/**
 * Implements hook_menu().
 */
function system_menu() {
  try {
    if (drupalgap.settings.debug) { console.log('system_menu()'); }
    var items = {
      'dashboard':{
        'title':'Dashboard',
        'page_callback':'system_dashboard_page',
      },
      'error':{
        'title':'Error',
        'page_callback':'system_error_page',
      },
      'offline':{
        'title':'Offline',
        'page_callback':'system_offline_page',
      },
      '404/%':{
        title:'404 - Not Found',
        page_callback:'system_404_page',
        page_arguments:[1]
      }
    };
    return items;
  }
  catch (error) {
    alert('system_menu - ' + error);
  }
}

/**
 * Page callback for the 404 page.
 */
function system_404_page(path) {
  try {
    return "Sorry, the '" + path + "' page was not found.";
  }
  catch (error) { drupalgap_error(error); }
}

/**
 * Page callback for the dashboard page.
 */
function system_dashboard_page() {
  try {
    if (drupalgap.settings.debug) { console.log('system_dashboard_page()'); }
    var content = {};
    content.site_info = {
      markup:'<h4 style="text-align: center;">' + drupalgap.settings.site_path + '</h4>'
    };
    content.welcome = {
      markup:'<h2 style="text-align: center;">Welcome to DrupalGap</h2>' + 
             '<p>The open source mobile application development kit for Drupal!</p>'
    };
    if (drupalgap.settings.logo) {
      content.logo = {
        markup:'<center>' +
                 theme('image', {path:drupalgap.settings.logo}) +
               '</center>'
      };
    }
    content.get_started = {
      theme:'button_link',
      text:'Getting Started Guide',
      path:'http://www.drupalgap.org/get-started',
      options:{InAppBrowser:true}
    };
    content.support = {
      theme:'button_link',
      text:'Support',
      path:'http://www.drupalgap.org/support',
      options:{InAppBrowser:true}
    };
    return content;
  }
  catch (error) {
    alert('system_dashboard_page - ' + error);
  }
}

/**
 * The page callback for the error page.
 */
function system_error_page() {
  try {
    var content = {
      info:{
        markup:"<p>An unexpected error has occurred! Review console.log() " + 
               "messages for more information!</p>"
      }
    };
    return content;
  }
  catch (error) {
    alert('system_error_page - ' + error);
  }
}

/**
 * Call back for the offline page.
 */
function system_offline_page() {
  try {
    if (drupalgap.settings.debug) { console.log('system_offline_page()'); }
    var content = {
      'message':{
        'markup':'<h2>Failed Connection</h2>' + 
          "<p>Oops! We couldn't connect to:</p>" + 
          '<p>' + drupalgap.settings.site_path + '</p>',
      },
      'try_again':{
        'theme':'button',
        'text':'Try Again',
        'attributes':{
          'onclick':'javascript:offline_try_again();'
        },
      },
      'footer':{
        'markup':"<p>Check your device's network settings and try again.</p>",
      },
    };
    return content;
  }
  catch (error) { alert('system_offline_page - ' + error); }
}

/**
 * When the 'try again' button is clicked, check for a connection and if it has
 * one make a call to system connect then go to the front page, otherwise just
 * inform user the device is still offline.
 */
function offline_try_again() {
  try {
    var connection = drupalgap_check_connection();
    if (drupalgap.online) {
      drupalgap.services.drupalgap_system.connect.call({
        'success':function(){
          drupalgap_goto('');
        }
      });
    }
    else {
      navigator.notification.alert(
          'Sorry, no connection found! (' + connection + ')',
          function(){ },
          'Offline',
          'OK'
      );
      return false;
    }
  }
  catch (error) {
    alert('offline_try_again - ' + error);
  }	
};

/**
 * Returns an array of region names defined by the system that themes must use.
 * We do this so Core and Contrib Modules can use these regions for UI needs.
 */
function system_regions_list() {
  try {
    var regions = ['header', 'content', 'footer'];
    return regions;
  }
  catch (error) {
    alert('system_regions_list - ' + error);
  }
}

/**
 * Add default buttons to a form and set its prefix.
 */
function system_settings_form(form, form_state) {
  try {
    // Add submit button to form if one isn't present.
    if (!form.elements.submit) {
      form.elements.submit = {
        type:'submit',
        value:'Save configuration'
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
  catch (error) { drupalgap_error(error); }
}

/**
 * Execute the system_settings_form.
 */
function system_settings_form_submit(form, form_state) {
  try {
    if (form_state.values) {
      $.each(form_state.values, function(variable, value){
          variable_set(variable, value);
      });
    }
    alert('The configuration options have been saved.');
  }
  catch (error) { drupalgap_error(error); }
}

