/**
 * Returns an array containing the names of system-defined (default) menus.
 */
function menu_list_system_menus() {
  try {
    if (drupalgap.settings.debug) {
      console.log('menu_list_system_menus()');
      console.log(JSON.stringify(arguments));
    }
    var system_menus = {
      'navigation':{
        'menu_name':'navigation',
        'title':'Navigation'
      },
      'management':{
        'menu_name':'management',
        'title':'Management'
      },
      'user_menu':{
        'menu_name':'user_menu',
        'title':'User menu'
      },
      'main_menu':{
        'menu_name':'main_menu',
        'title':'Main menu'
      },
    };
    return system_menus;
  }
  catch (error) {
    alert('menu_list_system_menus - ' + error);
  }
}

