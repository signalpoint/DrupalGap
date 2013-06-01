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
      'header':{
        'delta':'header',
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
        return drupalgap_render_page({'path':drupalgap.path});
        break;
      case 'logo':
        if (drupalgap.settings.logo) {
          return '<div>' + l(theme('image', {'path':drupalgap.settings.logo}), '') + '</div>';
          //return '<div><img src="' + drupalgap.settings.logo + '" /></div>';
        }
        return '';
        break;
      case 'header':
        return '<h1>' + l(drupalgap_get_title(), '') + '</h1>';
        break;
      case 'powered_by':
        return '<p style="text-align: center;">Powered by: ' +
          l('DrupalGap','http://www.drupalgap.org') +
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
    if (drupalgap.settings.debug) {
      console.log('system_menu()');
    }
    var items = {
      'offline':{
        'title':'Offline',
        'page_callback':'offline_page',
      },
    };
    return items;
  }
  catch (error) {
    alert('system_menu - ' + error);
  }
}

/**
 * Call back for the offline page.
 */
function offline_page() {
  try {
    if (drupalgap.settings.debug) {
      console.log('offline_page()');
    }
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
  catch (error) {
    alert('offline_page - ' + error);
  }
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
    if (drupalgap.settings.debug) {
      console.log('system_regions_list()');
      console.log(JSON.stringify(arguments));
    }
    var regions = ['header', 'content', 'footer'];
    return regions;
  }
  catch (error) {
    alert('system_regions_list - ' + error);
  }
}

// REGION SET BUTTON

