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
          // If there is an integer in the path, replace it with the wildcard
          // defined via hook_menu implementation.
          if (args_size > 1 && is_int(parseInt(args[1]))) {
            // Replace the int with a wildcard for the router path.
            args[1] = '%';
            router_path = args.join('/');
          }
          break; // user
        case 'node':
          break; // node
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


