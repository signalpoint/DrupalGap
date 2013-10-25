/**
 * Execute the page callback associated with the current path and return its
 * content.
 */
function menu_execute_active_handler() {
  try {
    if (drupalgap.settings.debug) {
      console.log('menu_execute_active_handler()');
      console.log(JSON.stringify(arguments));
    }
    
    // Determine the path and then grab the page id.
    var path = null;
    if (arguments[0]) { path = arguments[0]; }
    if (!path) { path = drupalgap_path_get(); }
    var page_id = drupalgap_get_page_id(path);
    
    // TODO - Check to make sure the user has access to this DrupalGap menu path!
    
    // Get the router path.
    var router_path = drupalgap_router_path_get();
    
    if (router_path) {
      /*console.log(path);
      console.log(router_path);
      console.log(JSON.stringify(drupalgap.menu_links));
      console.log(JSON.stringify(drupalgap.menu_links[router_path]));
      alert('menu_execute_active_handler');*/

      // Call the page call back for this router path and send along any arguments.
      var function_name = drupalgap.menu_links[router_path].page_callback;
      var page_arguments = [];
      if (drupalgap_function_exists(function_name)) {
        
        // Grab the page callback function and get ready to build the html.
        var fn = window[function_name];
        var content = '';
        
        // Are there any arguments to send to the page callback?
        if (drupalgap.menu_links[router_path].page_arguments) {
          // For each page argument, if the argument is an integer, grab the
          // corresponding arg(#), otherwise just push the arg onto the page
          // arguments. Then try to prepare any entity that may be present in
          // the url so the entity is sent via the page arguments to the page
          // callback, instead of just sending the integer.
          var args = arg(null, path);
          $.each(drupalgap.menu_links[router_path].page_arguments, function(index, object){
              if (is_int(object) && args[object]) { page_arguments.push(args[object]); }
              else { page_arguments.push(object); }
          });
          //drupalgap_prepare_argument_entities(page_arguments, args);
          
          // Call the page callback function with the page arguments.
          content = fn.apply(null, Array.prototype.slice.call(page_arguments));
        }
        else {
          // There are no arguments, just return the page callback result.
          content = fn();
        }
        
        // If the content came back as a string, convert it to a render object
        // so any jQM page events can be attached to the content if necessary.
        if (typeof content === 'string') {
          content = {
            content:{
              markup:content
            }
          };
        }
        
        // Clear out any previous jQM page events, then if there are any jQM
        // event callback functions attached to the menu link for this page, set
        // each event up to be fired with inline JS on the page. We pass along
        // any page arguments to the jQM event handler function.
        drupalgap.page.jqm_events = [];
        var jqm_page_events = drupalgap_jqm_page_events();
        var jqm_page_event_args = null;
        if (page_arguments.length > 0) {
          jqm_page_event_args = JSON.stringify(page_arguments); 
        }
        for (var i = 0; i < jqm_page_events.length; i++) {
          if (drupalgap.menu_links[router_path][jqm_page_events[i]]) {
            var jqm_page_event = jqm_page_events[i];
            var jqm_page_event_callback = drupalgap.menu_links[router_path][jqm_page_event];
            if (drupalgap_function_exists(jqm_page_event_callback)) {
              var options = {
                'page_id':page_id,
                'jqm_page_event':jqm_page_event,
                'jqm_page_event_callback':jqm_page_event_callback,
                'jqm_page_event_args':jqm_page_event_args
              };
              content[jqm_page_event] = {
                markup:drupalgap_jqm_page_event_script_code(options)
              };
            }
            else {
              alert('menu_execute_active_handler (' + path + ') - the jQM ' +
                jqm_page_event + ' call back function ' + jqm_page_event_callback +
                ' does not exist!'
              );
            }
          }
        }
        
        // Add a pageshow handler for the page title.
        var options = {
          'page_id':page_id,
          'jqm_page_event':'pageshow',
          'jqm_page_event_callback':'_drupalgap_page_title_pageshow',
          'jqm_page_event_args':jqm_page_event_args
        };
        content['drupalgap_page_title_pageshow'] =  {
          markup:drupalgap_jqm_page_event_script_code(options)
        };

        // And finally return the content.    
        if (drupalgap.settings.debug) { dpm(content); }
        return content;
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
    alert('menu_execute_active_handler(' + path + ') - ' + error);
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
    var system_menus = {
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
  catch (error) { drupalgap_error(error); }
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
            // Make the path available as a property in the menu link.
            menu_item.path = path;
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
    drupalgap_path_set(path);
  }
  catch (error) {
    alert('menu_set_active_item - ' + error);
  }
}*/

/**
 * Given a menu link path, this determines and returns the router path as a
 * string.
 */
function drupalgap_get_menu_link_router_path(path) {
  try {
    if (drupalgap.settings.debug) {
      console.log('drupalgap_get_menu_link_router_path(' + path + ')');
    }
    
    // TODO - Why is this function called twice sometimes? E.G. via an MVC item
    // view item/local_users/user/0, this function gets called twice in one page
    // load, that can't be good.
    
    // TODO - this function has a limitation in the types of menu paths it can
    // handle, for example a menu path of 'collection/%/%/list' with a path of
    // 'collection/local_users/user/list' can't find eachother. So we had to
    // change the mvc_menu() item path to be collection/list/%/%.
    
    // Is this path defined in drupalgap.menu_links? If it is, use it's router
    // path if it is defined, otherwise just set its router path to its own path.
    if (drupalgap.menu_links[path]) {
      if (typeof drupalgap.menu_links[path].router_path === 'undefined') {
        return path;
      }
      else {
        return drupalgap.menu_links[path].router_path;
      }
    }
    
    // Let's figure out where to route this menu item, and attach the
    // router to the item.
    var router_path = null;
    var args = arg(null, path);
    
    // If there is an integer in the path, replace it with the wildcard
    // defined via hook_menu implementation.
    if (args) {
      var args_size = args.length;
      switch (args[0]) {
        case 'user':
        case 'node':     
          if (args_size > 1 && is_int(parseInt(args[1]))) {
            args[1] = '%';
            router_path = args.join('/');
          }
          break;
        case 'taxonomy':
          if (args_size > 2 && (args[1] == 'vocabulary' || args[1] == 'term') &&
              is_int(parseInt(args[2]))
          ) {
            args[2] = '%';
            router_path = args.join('/');
          }
          break;
        default:
          if (drupalgap.settings.debug) {
            console.log('drupalgap_get_menu_link_router_path - default case, will try round two (' + path + ')');
          }
          break;
      }
    }
    
    // If we haven't found a router path yet, try some other techniques to find
    // it. If all else fails, just set the router path to the path itself.
    if (!router_path) {
      // Are there any paths in drupalgap.menu_links that would be good
      // candidates as the router for this path? Let's start at the back of the
      // argument list and start replacing each with a wildcard (%) and then
      // see if there is a path in drupalgap.menu_links that can handle it.
      if (args && args.length > 1) {
        var temp_router_path;
        for (var i = args.length-1; i != -1; i--) {
          temp_router_path = '';
          for (var j = 0; j < args.length; j++) {
            if (j < i) {
              temp_router_path += args[j];
            }
            else {
              temp_router_path += '%';
            }
            if (j != args.length-1) {
              temp_router_path += '/';
            }
          }
          // If we found a router path, let's use it.
          if (drupalgap.menu_links[temp_router_path]) {
            router_path = temp_router_path;
            break;
          }
        }
      }
    }
    
    // If the router path is a default menu local task, inherit its parent
    // router path.
    if (drupalgap.menu_links[router_path] && 
        drupalgap.menu_links[router_path].type == 'MENU_DEFAULT_LOCAL_TASK' &&
        drupalgap.menu_links[router_path].parent) {
      router_path = drupalgap.menu_links[router_path].parent;
    }
    
    // If there isn't a router and we couldn't find one, we'll just route
    // to the path itself.
    if (!router_path) { router_path = path; }
    
    // Finally, return the router path.
    if (drupalgap.settings.debug) {
      console.log(args);
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
 * menu_name to their corresponding menu in drupalgap.menus. Any menu link items
 * that have a 'region' property specified will be added to
 * drupalgap.theme.regions[region].
 */
function drupalgap_menus_load() {
  try {
    if (drupalgap.settings.debug) {
      console.log('drupalgap_menus_load()');
    }
    if (drupalgap.settings.menus) {
      // Process each menu defined in the settings.
      $.each(drupalgap.settings.menus, function(menu_name, menu){
          // If the menu does not already exist, it is a custom menu, so create
          // the menu and its corresponding block.
          if (!eval('drupalgap.menus.' + menu_name)) {
            // If the custom menu doesn't have its machine name set, set it.
            if (!menu.menu_name) { menu.menu_name = menu_name; }
            // Save the custom menu, as long is its name isn't 'regions', because
            // that is a special "system" menu that allows menu links to be
            // placed directly in regions via settings.js. Keep in mind the
            // 'regions' menu is in fact NOT a system menu.
            if (menu_name != 'regions') {
              menu_save(menu);
              // Make a block for this custom menu.
              var block_delta = menu.menu_name;
              drupalgap.blocks[0][block_delta] = {
                name:block_delta,
                delta:block_delta,
                module:'menu'
              };
            }
          }
          else {
            // The menu is a system defined menu, merge it together with any
            // custom settings.
            $.extend(true, eval('drupalgap.menus.' + menu_name), menu);
          }
      });
      // Now that we have all of the menus loaded up, and the menu router is
      // built, let's iterate over all the menu links and perform various
      // operations on them.
      $.each(drupalgap.menu_links, function(path, menu_link){
          // Let's grab any links from the router that have a menu specified,
          // and add the link to the router.
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
              var link = drupalgap_menus_load_convert_menu_link_to_link_json(menu_link);
              eval('drupalgap.menus.' + menu_link.menu_name + '.links.push(link);');
            }
            else {
              alert('drupalgap_menus_load - menu does not exist (' + menu_link.menu_name + '), cannot attach link to it (' + path + ')');
            }
          }
          // If the menu link is set to a specific region, create a links array
          // for the region if one doesn't exist already, then add the menu item
          // to the links array as a link.
          if (menu_link.region) {
            if (!drupalgap.theme.regions[menu_link.region.name].links) {
              drupalgap.theme.regions[menu_link.region.name].links = [];
            }
            drupalgap.theme.regions[menu_link.region.name].links.push(menu_link);
          }
      });
      // If there are any region menu links defined in settings.js, create a
      // links array for the region if one doesn't exist already, then add the
      // menu item to the links array as a link.
      if (typeof drupalgap.settings.menus.regions !== 'undefined') {
        $.each(drupalgap.settings.menus.regions, function(region, menu){
            if (typeof menu.links !== 'undefined' && $.isArray(menu.links) && menu.links.length > 0) {
              if (!drupalgap.theme.regions[region].links) {
                drupalgap.theme.regions[region].links = [];
              }
              $.each(menu.links, function(index, link){
                  drupalgap.theme.regions[region].links.push(link);
              });
            }
        });
      }
    }
    //console.log(JSON.stringify(drupalgap.menus));
    //alert('drupalgap_menus_load');
  }
  catch (error) {
    alert('drupalgap_menus_load - ' + error);
  }
}

/**
 * Given a menu link item from drupalgap_menus_load(), this will return a JSON
 * object representing a link object compatable with theme_link(). It contains
 * the link title, path and options.
 */
function drupalgap_menus_load_convert_menu_link_to_link_json(menu_link) {
  try {
    var link = {};
    if (menu_link.title) {
      // TODO - this is strange, we have to fill the 'text' value so theme_link
      // will play nice. These two properties, and their usage, need a thorough
      // review, only one should probably be used.
      // UPDATE - the link.text property is probably no longer used, it should
      // be safe to get rid of. In fact, this whole function is dumb and should
      // go away.
      link.title = menu_link.title;
      link.text = menu_link.title;
    }
    if (menu_link.path) { link.path = menu_link.path; }
    if (menu_link.options) { link.options = menu_link.options; }
    // If it is a menu link on a region, and it has options, set the link options
    // to the ones provided in the menu link region settings.
    if (menu_link.region && menu_link.region.options) {
      link.options = menu_link.options = menu_link.region.options;
    }
    return link;
  }
  catch (error) {
    alert('drupalgap_menus_load_convert_menu_link_to_link_json - ' + error);
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


