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
      'navigation':{'title':'Navigation'},
      'management':{'title':'Management'},
      'user-menu':{'title':'User menu'},
      'main-menu':{'title':'Main menu'},
    };
    return system_menus;
  }
  catch (error) {
    alert('menu_list_system_menus - ' + error);
  }
}

