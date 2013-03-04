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
    var content = {};
    if (drupalgap.user.uid == 0) {
      content.login = {
        'theme':'button_link',
        'path':'user/login',
        'text':'Login',
      };
    }
    else {
      content.login = {
        'theme':'button_link',
        'path':'user/logout',
        'text':'Logout',
      };
    }
    return content;
  }
  catch (error) {
    alert('dashboard_page - ' + error);
  }
}

