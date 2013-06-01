/**
 * Implements hook_menu().
 */
function dashboard_menu() {
  try {
    if (drupalgap.settings.debug) {
      console.log('dashboard_menu()');
      console.log(JSON.stringify(arguments));
    }
    var items = {
      'dashboard':{
        'title':'Dashboard',
        'page_callback':'dashboard_page',
      },
    };
    return items;
  }
  catch (error) {
    alert('dashboard_menu - ' + error);
  }
}

/**
 * Page callback for the dashboard page.
 */
function dashboard_page() {
  try {
    if (drupalgap.settings.debug) {
      console.log('dashboard_page()');
      console.log(JSON.stringify(arguments));
    }
    // TODO - Show site logo and the most recent published node that is promoted
    // to front page. Actually it would be neat if the Dashboard links could be
    // controlled through the Drupal UI. Or some type of settings.js stuff so
    // users can have their own custom dashboard.
    return '';
    /*var content = {
      'users':{
        'theme':'button_link',
        'path':'user-listing',
        'text':'View Users',
      },
    };*/
    return content;
  }
  catch (error) {
    alert('dashboard_page - ' + error);
  }
}

/**
 * Implements hook_theme().
 */
function dashboard_theme() {
  try {
    if (drupalgap.settings.debug) {
      console.log('dashboard_theme()');
    }
    return {
      'dashboard':{
        'template':'smashboard',
      },
    };
  }
  catch (error) {
    alert('dashboard_theme - ' + error);
  }
}
