/**
 * Execute the page callback associated with the current path and return its
 * content.
 * @param {Object} $compile
 * @param {Object} $injector
 * @return {Object}
 */
function menu_execute_active_handler($compile, $injector) {
  try {
    //dpm('menu_execute_active_handler');
    
    var path = dg_path_get();
    
    var route = dg_route_get();
    
    // Determine the page_callback function.
    var page_callback = typeof route['$$route'].page_callback !== 'undefined' ?
      route['$$route'].page_callback : null;
    if (!page_callback || !dg_function_exists(page_callback)) { return '<p>404</p>'; }
    
    // Determine the page_arguments, if any.
    var page_arguments = typeof route['$$route'].page_arguments !== 'undefined' ?
      route['$$route'].page_arguments : null;
    
    // Call the page_callback, with or without arguments. For each page
    // argument, if the argument is an integer, grab the corresponding arg(#),
    // otherwise just push the arg onto the page arguments. Then try to prepare
    // any entity that may be present in the url so the entity is sent via the
    // page arguments to the page callback, instead of just sending the integer.
    if (!page_arguments) { return window[page_callback](); }
    var _page_args = [];
    var args = arg(null, path);
    for (var index in page_arguments) {
      if (!page_arguments.hasOwnProperty(index)) { continue; }
      var object = page_arguments[index];
      if (dg_is_int(object) && args[object]) { _page_args.push(args[object]); }
      else { _page_args.push(object); }
    }
    return window[page_callback].apply(null, Array.prototype.slice.call(_page_args));
  }
  catch (error) {
    console.log('menu_execute_active_handler - ' + error);
  }
}

/**
 * Returns an array containing the names of system-defined (default) menus.
 * @return {Object}
 */
function menu_list_system_menus() {
  try {
    var system_menus = {
      user_menu_anonymous: {
        title: t('User menu authenticated')
      },
      user_menu_authenticated: {
        title: t('User menu authenticated')
      },
      main_menu: {
        title: t('Main menu')
      },
      /*primary_local_tasks: {
        title: t('Primary Local Tasks')
      }*/
    };
    // Add the menu_name to each menu as a property.
    for (var menu_name in system_menus) {
        if (!system_menus.hasOwnProperty(menu_name)) { continue; }
        var menu = system_menus[menu_name];
        menu.menu_name = menu_name;
    }
    return system_menus;
  }
  catch (error) { console.log('menu_list_system_menus - ' + error); }
}

/**
 *
 */
function drupalgap_load_menus(drupalgapSettings) {
  try {
    if (!drupalgapSettings.menus) { return; } 
    var menus = drupalgapSettings.menus;
    for (var name in menus) {
      if (!menus.hasOwnProperty(name)) { continue; }
      var menu = menus[name];
      if (!menu.links) { menu.links = []; }
      if (!menu.attributes) { menu.attributes = {}; }
      dg_menu_set(name, menu);
    }
  }
  catch (error) { console.log('drupalgap_load_menus - ' + error); }
}

/**
 *
 */
function dg_menu_get(name) {
  try {
    return drupalgap.menus[name];
  }
  catch (error) { console.log('dg_menu_get - ' + error); }
}

/**
 *
 */
function dg_menu_set(name, menu) {
  try {
    drupalgap.menus[name] = menu;
  }
  catch (error) { console.log('dg_menu_set - ' + error); }
}
