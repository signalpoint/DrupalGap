/**
 * Execute the page callback associated with the current path.
 */
function menu_execute_active_handler() {
  try {
    if (drupalgap.settings.debug) {
      console.log('menu_execute_active_handler()');
      console.log(JSON.stringify(arguments));
    }
    
    // Determine the path.
    var path = null;
    if (arguments[0]) { path = arguments[0]; }
    if (!path) { path = drupalgap.path; }
    
    // Get the router path.
    var router_path = drupalgap_get_menu_link_router_path(path);
    
    if (router_path) {
      
      // Call the page call back for this router path and send along any arguments.
      var function_name = drupalgap.menu_links[router_path].page_callback;
      if (drupalgap_function_exists(function_name)) {
        
        // Grab the page callback function.
        var fn = window[function_name];
        
        // Are there any arguments to send to the page callback?
        if (drupalgap.menu_links[router_path].page_arguments) {
          
          // For each page argument, if the argument is an integer, grab the
          // corresponding arg(#), otherwise just push the arg onto the page
          // arguments.
          var page_arguments = [];
          var args = arg(null, path);
          
          $.each(drupalgap.menu_links[router_path].page_arguments, function(index, object){
              if (is_int(object) && args[object]) {
                page_arguments.push(args[object]);
              }
              else {
                page_arguments.push(object);
              }
          });
          // Call the page callback function with the page arguments.
          return fn.apply(null, Array.prototype.slice.call(page_arguments));
          
        }
        else {
          // There are no arguments, just return the page callback result.
          return fn();
        }
      }
      else {
        // No page call back specified.
        console.log(JSON.stringify(drupalgap.menu_links[router_path]));
        alert('menu_execute_active_handler - no page callback (' + router_path + ')');
      }
    }
    else {
      // No router path.
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
    }
    var system_menus = {
      'navigation':{
        'title':'Navigation'
      },
      'management':{
        'title':'Management'
      },
      'user_menu_anonymous':{
        'title':'User menu authenticated'
      },
      'user_menu_authenticated':{
        'title':'User menu authenticated'
      },
      'main_menu':{
        'title':'Main menu'
      },
      'primary_local_tasks':{
        'title':'Primary Local Tasks'
      },
    };
    // Add the menu_name to each menu as a property.
    $.each(system_menus, function(menu_name, menu){
        menu.menu_name = menu_name;
    });
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
    // For each module that implements hook_menu, iterate over each of the
    // menu links defined by the hook, then add each menu item to
    // drupalgap.menu_links keyed by the path.
    var modules = module_implements('menu');
    var function_name;
    var fn;
    var menu_links;
    $.each(modules, function(index, module){
        // Determine the hook function name, grab the function, and call it
        // to retrieve the hook's menu links.
        function_name = module + '_menu';
        fn = window[function_name];
        menu_links = fn();
        // Iterate over each item.
        $.each(menu_links, function(path, menu_item){
            // Attach module name to item.
            menu_item.module = module;
            // Set a default type for the item if one isn't provided.
            if (typeof menu_item.type === "undefined") {
              menu_item.type = 'MENU_NORMAL_ITEM';
            }
            // Set default router path if one wasn't specified.
            if (typeof menu_item.router_path === "undefined") {
              menu_item.router_path = drupalgap_get_menu_link_router_path(path);
            }
            // Determine any parent, sibling, and child paths for the item.
            drupalgap_menu_router_build_menu_item_relationships(path, menu_item);
            // Attach item to menu links.
            drupalgap.menu_links[path] = menu_item;
        });
    });
    if (drupalgap.settings.debug) {
      console.log(JSON.stringify(drupalgap.menu_links));
    }
    //alert('menu_router_build');
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
// TODO - Since the router path is set by menu_router_build, no one other than
// menu_router_build should have to call this function. Go around and clean
// up any calls to this function because the router path will be available in
// drupalgap.menu_links[path].
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

/**
 * Given a path, and its corresponding menu item, this will determine any
 * parent, sibling, and/or child menu item paths and set the references on each
 * so they are all aware of eachother's paths.
 */
function drupalgap_menu_router_build_menu_item_relationships(path, menu_item) {
  try {
    // Split up the path arguments.
    var args = arg(null, path);
    // Any parent?
    if (args.length > 1) {
      // Set the parent path.
      var parent = args.splice(0, args.length-1).join('/');
      menu_item.parent = parent;
      // Make sure the parent exists.
      if (drupalgap.menu_links[parent]) {
        // Now tell the parent about this child. If the parent doesn't yet have
        // any children, setup the children array on the parent.
        if (typeof drupalgap.menu_links[parent].children === "undefined") {
          drupalgap.menu_links[parent].children = [];
        }
        drupalgap.menu_links[parent].children.push(path);
        // Now tell any siblings about this item, and tell this item about any
        // siblings.
        if (typeof menu_item.siblings === "undefined") {
          menu_item.siblings = [];
        }
        $.each(drupalgap.menu_links[parent].children, function(index, sibling){
            if (sibling != path && drupalgap.menu_links[sibling]) {
              if (typeof drupalgap.menu_links[sibling].siblings === "undefined") {
                drupalgap.menu_links[sibling].siblings = [];
              }
              drupalgap.menu_links[sibling].siblings.push(path);
              menu_item.siblings.push(sibling);
            }
        });
      }
    }
  }
  catch (error) {
    alert('drupalgap_menu_router_build_relationships - ' + error);
  }
}


