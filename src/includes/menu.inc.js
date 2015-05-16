/**
 * Execute the page callback associated with the current path and return its
 * content.
 * @return {Object}
 */
function menu_execute_active_handler() {
  try {

    // Determine the path and then grab the page id.
    var path = null;
    if (arguments[0]) { path = arguments[0]; }
    if (!path) { path = drupalgap_path_get(); }
    var page_id = drupalgap_get_page_id(path);

    // @todo - Make sure the user has access to this DrupalGap menu path!

    // Get the router path.
    var router_path = drupalgap_router_path_get();

    if (!router_path) { return; }

    // Call the page call back for this router path and send along any
    // arguments.
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
        for (var index in drupalgap.menu_links[router_path].page_arguments) {
            if (!drupalgap.menu_links[router_path].page_arguments.hasOwnProperty(index)) { continue; }
            var object = drupalgap.menu_links[router_path].page_arguments[index];
            if (is_int(object) && args[object]) {
              page_arguments.push(args[object]);
            }
            else { page_arguments.push(object); }
        }

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
          content: {
            markup: content
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
          var jqm_page_event_callback =
            drupalgap.menu_links[router_path][jqm_page_event];
          if (drupalgap_function_exists(jqm_page_event_callback)) {
            var options = {
              'page_id': page_id,
              'jqm_page_event': jqm_page_event,
              'jqm_page_event_callback': jqm_page_event_callback,
              'jqm_page_event_args': jqm_page_event_args
            };
            content[jqm_page_event] = {
              markup: drupalgap_jqm_page_event_script_code(options)
            };
          }
          else {
            console.log(
              'menu_execute_active_handler (' + path + ') - the jQM ' +
              jqm_page_event + ' call back function ' +
              jqm_page_event_callback + ' does not exist!'
            );
          }
        }
      }

      // Add a pageshow handler for the page title.
      if (typeof content === 'object') {
        var options = {
          'page_id': page_id,
          'jqm_page_event': 'pageshow',
          'jqm_page_event_callback': '_drupalgap_page_title_pageshow',
          'jqm_page_event_args': jqm_page_event_args
        };
        content['drupalgap_page_title_pageshow'] = {
          markup: drupalgap_jqm_page_event_script_code(options)
        };
      }

      // And finally return the content.
      return content;
    }
    else {
      // No page call back specified.
      console.log(
        'menu_execute_active_handler - no page callback (' + router_path + ')'
      );
      console.log(JSON.stringify(drupalgap.menu_links[router_path]));
    }
  }
  catch (error) {
    console.log('menu_execute_active_handler(' + path + ') - ' + error);
  }
}

/**
 * Gets a router item.
 * @return {Object}
 */
function menu_get_item() {
  try {
    var path = null;
    var router_item = null;
    if (arguments[0]) { path = arguments[0]; }
    if (arguments[1]) { router_item = arguments[1]; }
    if (path && drupalgap.menu_links[path]) {
      return drupalgap.menu_links[path];
    }
    else { return null; }
  }
  catch (error) { console.log('menu_get_item - ' + error); }
}

/**
 * Returns default menu item options.
 * @return {Object}
 */
function menu_item_default_options() {
    return { attributes: menu_item_default_attributes() };
}

/**
 * Returns default menu item attributes.
 * @return {Object}
 */
function menu_item_default_attributes() {
    return { 'class': '' };
}

/**
 * Returns an array containing the names of system-defined (default) menus.
 * @return {Object}
 */
function menu_list_system_menus() {
  try {
    var system_menus = {
      'user_menu_anonymous': {
        'title': t('User menu authenticated')
      },
      'user_menu_authenticated': {
        'title': t('User menu authenticated')
      },
      'main_menu': {
        'title': t('Main menu')
      },
      'primary_local_tasks': {
        'title': t('Primary Local Tasks')
      }
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
 * Collects and alters the menu definitions.
 */
function menu_router_build() {
  //  Calls all hook_menu implementations and builds a collection of menu links.
  try {
    // For each module that implements hook_menu, iterate over each of the
    // menu links defined by the hook, then add each menu item to
    // drupalgap.menu_links keyed by the path.
    var modules = module_implements('menu');
    var function_name;
    var fn;
    var menu_links;
    for (var index in modules) {
        if (!modules.hasOwnProperty(index)) { continue; }
        var module = modules[index];
        // Determine the hook function name, grab the function, and call it
        // to retrieve the hook's menu links.
        function_name = module + '_menu';
        fn = window[function_name];
        menu_links = fn();
        // Iterate over each item.
        for (var path in menu_links) {
            if (!menu_links.hasOwnProperty(path)) { continue; }
            var menu_item = menu_links[path];
            // Attach module name to item.
            menu_item.module = module;
            // Set a default type for the item if one isn't provided.
            if (typeof menu_item.type === 'undefined') {
              menu_item.type = 'MENU_NORMAL_ITEM';
            }
            // Set default options and attributes if none have been provided.
            // @TODO - Now that we are doing this here, there may be a few
            // places throughout the code that were checking for these
            // undefined objects that will no longer need to be checked.
            if (typeof menu_item.options === 'undefined') {
              menu_item.options = menu_item_default_options();
            }
            else if (typeof menu_item.options.attributes === 'undefined') {
              menu_item.options.attributes = menu_item_default_attributes();
            }
            // Make the path available as a property in the menu link.
            menu_item.path = path;
            // Determine any parent, sibling, and child paths for the item.
            drupalgap_menu_router_build_menu_item_relationships(
              path,
              menu_item
            );
            // Attach item to menu links.
            drupalgap.menu_links[path] = menu_item;
        }
    }
  }
  catch (error) { console.log('menu_router_build - ' + error); }
}

/**
 * Given a menu link path, this determines and returns the router path as a
 * string.
 * @param {String} path
 * @return {String}
 */
function drupalgap_get_menu_link_router_path(path) {
  try {

    // @TODO - Why is this function called twice sometimes? E.G. via an MVC item
    // view item/local_users/user/0, this function gets called twice in one page
    // load, that can't be good.

    // @TODO - this function has a limitation in the types of menu paths it can
    // handle, for example a menu path of 'collection/%/%/list' with a path of
    // 'collection/local_users/user/list' can't find eachother. So we had to
    // change the mvc_menu() item path to be collection/list/%/%.

    // @TODO - each time this function is called, we should create a static
    // record of the result router path, keyed by the incoming path, that way
    // this heavy function can be called more often with less resource.

    // Is this path defined in drupalgap.menu_links? If it is, use it's router
    // path if it is defined, otherwise just set its router path to its own
    // path.
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
        case 'comment':
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
          if (args_size > 1 && is_int(parseInt(args[1]))) {
            args[1] = '%';
            router_path = args.join('/');
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
        for (var i = args.length - 1; i != -1; i--) {
          temp_router_path = '';
          for (var j = 0; j < args.length; j++) {
            if (j < i) {
              temp_router_path += args[j];
            }
            else {
              temp_router_path += '%';
            }
            if (j != args.length - 1) {
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
    return router_path;
  }
  catch (error) {
    console.log('drupalgap_get_menu_link_router_path - ' + error);
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
    if (drupalgap.settings.menus) {
      // Process each menu defined in the settings.
      for (var menu_name in drupalgap.settings.menus) {
          if (!drupalgap.settings.menus.hasOwnProperty(menu_name)) { continue; }
          var menu = drupalgap.settings.menus[menu_name];
          // If the menu does not already exist, it is a custom menu, so create
          // the menu and its corresponding block.
          if (!drupalgap.menus[menu_name]) {
            // If the custom menu doesn't have its machine name set, set it.
            if (!menu.menu_name) { menu.menu_name = menu_name; }
            // Save the custom menu, as long is its name isn't 'regions',
            // because that is a special "system" menu that allows menu links to
            // be placed directly in regions via settings.js. Keep in mind the
            // 'regions' menu is in fact NOT a system menu.
            if (menu_name != 'regions') {
              menu_save(menu);
              // Make a block for this custom menu.
              var block_delta = menu.menu_name;
              drupalgap.blocks[0][block_delta] = {
                name: block_delta,
                delta: block_delta,
                module: 'menu'
              };
            }
          }
          else {
            // The menu is a system defined menu, merge it together with any
            // custom settings.
            $.extend(true, drupalgap.menus[menu_name], menu);
          }
      }
      // Now that we have all of the menus loaded up, and the menu router is
      // built, let's iterate over all the menu links and perform various
      // operations on them.
      for (var path in drupalgap.menu_links) {
          if (!drupalgap.menu_links.hasOwnProperty(path)) { continue; }
          var menu_link = drupalgap.menu_links[path];
          // Let's grab any links from the router that have a menu specified,
          // and add the link to the router.
          if (menu_link.menu_name) {
            if (drupalgap.menus[menu_link.menu_name]) {
              // Create a links array for the menu if one doesn't exist already.
              if (!drupalgap.menus[menu_link.menu_name].links) {
                drupalgap.menus[menu_link.menu_name].links = [];
              }
              // Add the path to the menu link inside the menu.
              menu_link.path = path;
              // Now push the link onto the menu. We only care about the title,
              // path and options, as this is just a link. The rest of the
              // menu link data can be retrieved from drupalgap.menu_links.
              var link =
                drupalgap_menus_load_convert_menu_link_to_link_json(menu_link);
              drupalgap.menus[menu_link.menu_name].links.push(link);
            }
            else {
              console.log(
                'drupalgap_menus_load - menu does not exist (' +
                menu_link.menu_name + '), cannot attach link to it (' +
                path + ')'
              );
            }
          }
          // If the menu link is set to a specific region, create a links array
          // for the region if one doesn't exist already, then add the menu item
          // to the links array as a link.
          if (menu_link.region) {
            if (!drupalgap.theme.regions[menu_link.region.name].links) {
              drupalgap.theme.regions[menu_link.region.name].links = [];
            }
            drupalgap.theme.regions[menu_link.region.name].links.push(
              menu_link
            );
          }
      }
      // If there are any region menu links defined in settings.js, create a
      // links array for the region if one doesn't exist already, then add the
      // menu item to the links array as a link.
      if (typeof drupalgap.settings.menus.regions !== 'undefined') {
        for (var region in drupalgap.settings.menus.regions) {
            if (!drupalgap.settings.menus.regions.hasOwnProperty(region)) { continue; }
            var menu = drupalgap.settings.menus.regions[region];
            if (
              typeof menu.links !== 'undefined' &&
              $.isArray(menu.links) &&
              menu.links.length > 0
            ) {
              if (!drupalgap.theme.regions[region].links) {
                drupalgap.theme.regions[region].links = [];
              }
              for (var index in menu.links) {
                  if (!menu.links.hasOwnProperty(index)) { continue; }
                  var link = menu.links[index];
                  drupalgap.theme.regions[region].links.push(link);
              }
            }
        }
      }
    }
  }
  catch (error) { console.log('drupalgap_menus_load - ' + error); }
}

/**
 * Given a menu link item from drupalgap_menus_load(), this will return a JSON
 * object representing a link object compatable with theme_link(). It contains
 * the link title, path and options.
 * @param {Object} menu_link
 * @return {Object}
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
    // If it is a menu link on a region, and it has options, set the link
    // options to the ones provided in the menu link region settings.
    if (menu_link.region && menu_link.region.options) {
      link.options = menu_link.options = menu_link.region.options;
    }
    return link;
  }
  catch (error) {
    console.log(
      'drupalgap_menus_load_convert_menu_link_to_link_json - ' + error
    );
  }
}


/**
 * Given a path, and its corresponding menu item, this will determine any
 * parent, sibling, and/or child menu item paths and set the references on each
 * so they are all aware of eachother's paths.
 * @param {String} path
 * @param {Object} menu_item
 */
function drupalgap_menu_router_build_menu_item_relationships(path, menu_item) {
  try {
    // Split up the path arguments.
    var args = arg(null, path);
    // Any parent?
    if (args.length > 1) {
      // Set the parent path.
      var parent = args.splice(0, args.length - 1).join('/');
      menu_item.parent = parent;
      // Make sure the parent exists.
      if (drupalgap.menu_links[parent]) {
        // Now tell the parent about this child. If the parent doesn't yet have
        // any children, setup the children array on the parent.
        if (typeof drupalgap.menu_links[parent].children === 'undefined') {
          drupalgap.menu_links[parent].children = [];
        }
        drupalgap.menu_links[parent].children.push(path);
        // Now tell any siblings about this item, and tell this item about any
        // siblings.
        if (typeof menu_item.siblings === 'undefined') {
          menu_item.siblings = [];
        }
        for (var index in drupalgap.menu_links[parent].children) {
            if (!drupalgap.menu_links[parent].children.hasOwnProperty(index)) { continue; }
            var sibling = drupalgap.menu_links[parent].children[index];
            if (sibling != path && drupalgap.menu_links[sibling]) {
              if (
                typeof drupalgap.menu_links[sibling].siblings === 'undefined'
              ) {
                drupalgap.menu_links[sibling].siblings = [];
              }
              drupalgap.menu_links[sibling].siblings.push(path);
              menu_item.siblings.push(sibling);
            }
        }
      }
    }
  }
  catch (error) {
    console.log('drupalgap_menu_router_build_relationships - ' + error);
  }
}

