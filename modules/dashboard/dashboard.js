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
  return {
    'users':{
      'theme':'link',
      'path':'http://www.drupalgap.org',
      'text':'Users',
      'attributes':{
        'data-role':'button',
      },
    },
  };
  //return 'hello dashboard page';
}

