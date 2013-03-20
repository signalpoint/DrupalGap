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
    //var deliver = false;
    if (arguments[0]) { path = arguments[0]; }
    //if (arguments[1] != null) { deliver = arguments[1]; }
    if (!path) { path = drupalgap.path; }
    // Get the router path.
    var routher_path = drupalgap_get_menu_link_router_path(path);
    if (routher_path) {
      // Call the page call back for this router path and send along any arguments.
      var function_name = drupalgap.menu_links[routher_path].page_callback;
      if (drupalgap_function_exists(function_name)) {
        var fn = window[function_name];
        if (drupalgap.menu_links[routher_path].page_arguments) {  
          var page_arguments = [];
          var args = arg(null, path);
          // For each page argument, if the argument is an integer, grab the
          // corresponding arg(#), otherwise just push the arg onto the page
          // arguments. 
          $.each(drupalgap.menu_links[routher_path].page_arguments, function(index, object){
              if (is_int(object) && args[object]) {
                page_arguments.push(args[object]);
              }
              else {
                page_arguments.push(object);
              }
          });
          return fn.apply(null, Array.prototype.slice.call(page_arguments));
        }
        else {
          return fn();
        }
      }
      else {
        console.log(JSON.stringify(drupalgap.menu_links[routher_path]));
        alert('menu_execute_active_handler - no page callback (' + routher_path + ')');
      }
    }
    else {
      alert('menu_execute_active_handler - no router path (' + path + ')');
    }
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
      'user_menu_anonymous':{
        'menu_name':'user_menu_anonymous',
        'title':'User menu authenticated'
      },
      'user_menu_authenticated':{
        'menu_name':'user_menu_authenticated',
        'title':'User menu authenticated'
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
 * Collects and alters the menu definitions.
 */
function menu_router_build() {
  //  Calls all hook_menu implementations and builds a collection of menu links.
  try {
    if (drupalgap.settings.debug) {
      console.log('menu_router_build()');
      console.log(JSON.stringify(arguments));
    }
    /*var modules = module_implements('menu');
    $.each(modules, function(index, module){
    });
    console.log(JSON.stringify(modules));*/
    var menu_links = module_invoke_all('menu');
    // Now that we have the items from every hook_menu implementation, we need
    // to iterate over each implementation, then pull out each menu item and
    // add it to drupalgap.menu_links.
    if (menu_links && menu_links.length != 0) {
      $.each(menu_links, function(index, menu_link){
          $.each(menu_link, function(path, menu_item){
              drupalgap.menu_links[path] = menu_item;
          });
      });
    }
    if (drupalgap.settings.debug) {
      console.log(JSON.stringify(drupalgap.menu_links));
    }
  }
  catch (error) {
    alert('menu_router_build - ' + error);
  }
}

/**
 * Sets the active path, which determines which page is loaded.
 */
// We could not use this because the page id has already been generated
// here, and any arguments present generate a page id that won't match
// the page already generated.
/*function menu_set_active_item(path) {
  try {
    if (drupalgap.settings.debug) {
      console.log('menu_set_active_item(' + path + ')');
    }
    drupalgap.path = path;
  }
  catch (error) {
    alert('menu_set_active_item - ' + error);
  }
}*/

/**
 * Given a menu link path, this determine and returns the router path as a string.
 */
function drupalgap_get_menu_link_router_path(path) {
  try {
    if (drupalgap.settings.debug) {
      console.log('drupalgap_get_menu_link_router_path(' + path + ')');
    }
    // Let's figure out where to route this menu item, and attach the
    // router to the item.
    var router_path = null;
    var args = arg(null, path);
    if (args) {
      var args_size = args.length;
      switch (args[0]) {
        case 'user':
        case 'node':
          // If there is an integer in the path, replace it with the wildcard
          // defined via hook_menu implementation.
          if (args_size > 1 && is_int(parseInt(args[1]))) {
            // Replace the int with a wildcard for the router path.
            args[1] = '%';
            router_path = args.join('/');
          }
          break;
      }
    }
    // If there isn't a router, we'll just route to the path itself.
    if (!router_path) { router_path = path; }
    if (drupalgap.settings.debug) {
      console.log('router_path: ' + path + ' => ' + router_path);
    }
    return router_path;
  }
  catch (error) {
    alert('drupalgap_get_menu_link_router_path - ' + error);
  }
}


/**
 * Loads all of the menus specified in drupalgap.settings.menus into
 * drupalgap.menus. This is called after menu_router_build(), so any system
 * defined menus will already be present and should be overwritten with any
 * customizations present in the settings. It then iterates over the menu links
 * specified in drupalgap.menu_links and attaches any of them that have a
 * menu_name to their corresponding menu in drupalgap.menus.
 */
function drupalgap_menus_load() {
  try {
    if (drupalgap.settings.debug) {
      console.log('drupalgap_menus_load()');
    }
    if (drupalgap.settings.menus) {
      console.log(JSON.stringify(drupalgap.menus));
      console.log(JSON.stringify(drupalgap.settings.menus));
      // Process each menu defined in the settings.
      $.each(drupalgap.settings.menus, function(menu_name, menu){
          // If the menu does not already exist, it is a custom menu, so create
          // the menu and its corresponding block.
          if (!eval('drupalgap.menus.' + menu_name)) {
            // If the custom menu doesn't have its machine name set, set it.
            if (!menu.menu_name) { menu.menu_name = menu_name; }
            // Save the custom menu.
            menu_save(menu);
          }
          else {
            // The menu is a system defined menu, merge it together with any
            // custom settings.
            $.extend(true, eval('drupalgap.menus.' + menu_name), menu);
          }
      });
      // Now that we have all of the menus loaded up, and the menu router is built,
      // let's grab any links from the router that have a menu specified, and add
      // the link to the router.
      $.each(drupalgap.menu_links, function(path, menu_link){
          if (menu_link.menu_name) {
            if (eval('drupalgap.menus.' + menu_link.menu_name)) {
              // Create a links array for the menu if one doesn't exist already.
              if (!eval('drupalgap.menus.' + menu_link.menu_name + '.links')) {
                eval('drupalgap.menus.' + menu_link.menu_name + '.links = [];');
              }
              // Add the path to the menu link inside the menu.
              menu_link.path = path;
              // Now push the link onto the menu. We only care about the title,
              // path and options, as this is just a link. The rest of the
              // menu link data can be retrieved from drupalgap.menu_links.
              var link = {};
              if (menu_link.title) { link.title = menu_link.title; }
              if (menu_link.path) { link.path = menu_link.path; }
              if (menu_link.options) { link.options = menu_link.options; }
              eval('drupalgap.menus.' + menu_link.menu_name + '.links.push(link);');
            }
            else {
              alert('drupalgap_menus_load - menu does not exist (' + menu_link.menu_name + '), cannot attach link to it (' + path + ')');
            }
          }
      });
    }
  }
  catch (error) {
    alert('drupalgap_menus_load - ' + error);
  }
}

