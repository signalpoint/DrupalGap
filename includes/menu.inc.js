/**
 * Execute the page callback associated with the current path.
 */
function menu_execute_active_handler() {
  try {
    if (drupalgap.settings.debug) {
      console.log('menu_execute_active_handler()');
      console.log(JSON.stringify(arguments));
    }
    // Determine the path and delivery.
    var path = null;
    var deliver = false;
    if (arguments[0]) { path = arguments[0]; }
    if (arguments[1] != null) { deliver = arguments[1]; }
    if (!path) { path = drupalgap.path; }
    // TODO - check to make sure site it online
    // Grab the router item.
    var router_item = menu_get_item(path);
    console.log(JSON.stringify(router_item));
    alert('now what?!?!?!');
  }
  catch (error) {
    alert('menu_execute_active_handler - ' + error);
  }
}

/**
 * Gets a router item.
 */
function menu_get_item() {
  try {
    if (drupalgap.settings.debug) {
      console.log('menu_get_item()');
      console.log(JSON.stringify(arguments));
    }
    var path = null;
    var router_item = null;
    if (arguments[0]) { path = arguments[0]; }
    if (arguments[1]) { router_item = arguments[1]; }
    console.log(JSON.stringify(drupalgap.menu_links));
    if (path && drupalgap.menu_links[path]) {
      return eval('drupalgap.menu_links.' + path + ';');
    }
    else {
      return null;
    }
  }
  catch (error) {
    alert('menu_get_item - ' + error);
  }
}


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

/**
 * Sets the active path, which determines which page is loaded.
 */
function menu_set_active_item(path) {
  try {
    if (drupalgap.settings.debug) {
      console.log('menu_set_active_item(' + path + ')');
    }
    drupalgap.path = path;
  }
  catch (error) {
    alert('menu_set_active_item - ' + error);
  }
}

