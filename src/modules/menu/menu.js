/**
 * Implements hook_block_view().
 * @param {String} delta
 * @param {Object} region
 * @return {String}
 */
function menu_block_view(delta, region) {
  // NOTE: When rendering a jQM data-role="navbar" you can't place an
  // empty list (<ul></ul>) in it, this will cause an error:
  // https://github.com/jquery/jquery-mobile/issues/5141
  // So we must check to make sure we have any items before rendering the
  // menu since our theme_item_list implementation returns empty lists
  // for jQM pageshow async list item data retrieval and display.
  try {
    // Since menu link paths may have an 'access_callback' handler that needs
    // to make an async call to the server (e.g. local tasks), we'll utilize a
    // pageshow handler to render the menu, so for now just render an empty
    // placeholder and pageshow handler.
    var page_id = drupalgap_get_page_id();
    var container_id = menu_container_id(delta, page_id);
    var data_role = null;
    if (region.attributes && region.attributes['data-role']) {
      data_role = region.attributes['data-role'];
    }
    return '<div id="' + container_id + '"></div>' +
      drupalgap_jqm_page_event_script_code({
          page_id: page_id,
          jqm_page_event: 'pageshow',
          jqm_page_event_callback: 'menu_block_view_pageshow',
          jqm_page_event_args: JSON.stringify({
              menu_name: delta,
              container_id: container_id,
              'data-role': data_role
          })
      }, delta);
  }
  catch (error) { console.log('menu_block_view - ' + error); }
}

/**
 * The pageshow handler for menu blocks.
 * @param {Object} options
 */
function menu_block_view_pageshow(options) {
  try {
    var html = '';

    // Grab current path so we can watch out for any menu links that match it.
    var path = drupalgap_path_get();

    // Are we about to view a normal menu, or the local task menu?
    var delta = options.menu_name;
    if (delta == 'primary_local_tasks') {

      // LOCAL TASKS MENU LINKS

      // For the current page's router path, grab any local tasks menu links add
      // them into the menu. Note, local tasks are located in a menu link item's
      // children, if there are any. Local tasks typically have argument
      // wildcards in them, so we'll replace their wildcards with the current
      // args.
      var router_path = drupalgap_router_path_get();
      if (
        drupalgap.menu_links[router_path] &&
        drupalgap.menu_links[router_path].children
      ) {

        var args = arg();

        // Define a success callback that will be called later on...
        var _success = function(result) {
          var menu_items = [];
          var link_path = '';
          $.each(
            drupalgap.menu_links[router_path].children,
            function(index, child) {
              if (drupalgap.menu_links[child] && (
                drupalgap.menu_links[child].type == 'MENU_DEFAULT_LOCAL_TASK' ||
                drupalgap.menu_links[child].type == 'MENU_LOCAL_TASK'
              )) {
                if (drupalgap_menu_access(child, null, result)) {
                  menu_items.push(drupalgap.menu_links[child]);
                }
              }
            }
          );
          // If there was only one local task menu item, and it is the default
          // local task, don't render the menu, otherwise render the menu as an
          // item list as long as there are items to render.
          if (
            menu_items.length == 1 &&
            menu_items[0].type == 'MENU_DEFAULT_LOCAL_TASK'
          ) { html = ''; }
          else {
            var items = [];
            $.each(menu_items, function(index, item) {
                items.push(
                  l(item.title, drupalgap_place_args_in_path(item.path))
                );
            });
            if (items.length > 0) {
              html = theme('item_list', {'items': items});
            }
          }
          // Inject the html.
          $('#' + options.container_id).html(html).trigger('create');
          // If the block's region is a jQM navbar, refresh the navbar.
          if (options['data-role'] && options['data-role'] == 'navbar') {
            $('#' + options.container_id).navbar();
          }
        };

        // First, determine if any child has an entity arg in the path, and/or
        // an access_callback handler.
        var has_entity_arg = false;
        var has_access_callback = false;
        $.each(
          drupalgap.menu_links[router_path].children,
          function(index, child) {
            if (drupalgap.menu_links[child] &&
              (drupalgap.menu_links[child].type == 'MENU_DEFAULT_LOCAL_TASK' ||
               drupalgap.menu_links[child].type == 'MENU_LOCAL_TASK')
            ) {
              if (drupalgap_path_has_entity_arg(arg(null, child))) {
                has_entity_arg = true;
              }
              if (
                typeof
                  drupalgap.menu_links[child].access_callback !== 'undefined'
              ) { has_access_callback = true; }
            }
          }
        );

        // If we have an entity arg, and an access_callback, let's load up the
        // entity asynchronously.
        if (has_entity_arg && has_access_callback) {
          var found_int_arg = false;
          var int_arg_index = null;
          for (var i = 0; i < args.length; i++) {
            if (is_int(parseInt(args[i]))) {
              // Save the arg index so we can replace it later.
              int_arg_index = i;
              found_int_arg = true;
              break;
            }
          }
          if (!found_int_arg) { _success(null); return; }

          // Determine the naming convention for the entity load function.
          var load_function_prefix = args[0]; // default
          if (args[0] == 'taxonomy') {
            if (args[1] == 'vocabulary' || args[1] == 'term') {
              load_function_prefix = args[0] + '_' + args[1];
            }
          }
          var load_function = load_function_prefix + '_load';

          // If the load function exists, load the entity.
          if (drupalgap_function_exists(load_function)) {
            var entity_fn = window[load_function];
            // Load the entity. MVC items need to pass along the module name and
            // model type to its load function. All other entity load functions
            // just need the entity id.
            var entity_id = parseInt(args[int_arg_index]);
            if (args[0] == 'item') {
              entity = entity_fn(args[1], args[2], entity_id);
              _success(entity);
            }
            else {
              // Force a reset if we are editing the entity.
              var reset = false;
              if (arg(2) == 'edit') { reset = true; }
              // Load the entity asynchronously.
              entity_fn(entity_id, { reset: reset, success: _success });
            }
          }
          else {
            console.log('menu_block_view_pageshow - load function not ' +
              'implemented! ' + load_function
            );
          }
        }
        else { _success(null); }
      }
    }
    else {

      // ALL OTHER MENU LINKS

      // If the block's corresponding menu exists, and it has links, iterate
      // over each link, add it to an items array, then theme an item list.
      if (drupalgap.menus[delta] && drupalgap.menus[delta].links) {
        var items = [];
        $.each(drupalgap.menus[delta].links, function(index, menu_link) {
            // Make a deep copy of the menu link so we don't modify it.
            var link = jQuery.extend(true, {}, menu_link);
            // If there are no link options, set up defaults.
            if (!link.options) { link.options = {attributes: {}}; }
            else if (!link.options.attributes) { link.options.attributes = {}; }
            // If the link points to the current path, set it as active.
            if (link.path == path) {
              if (!link.options.attributes['class']) {
                link.options.attributes['class'] = '';
              }
              link.options.attributes['class'] +=
                ' ui-btn-active ui-state-persist ';
            }
            items.push(l(link.title, link.path, link.options));
        });
        if (items.length > 0) {
          // Pass along any menu attributes.
          var attributes = null;
          if (
            drupalgap.menus[delta].options &&
            drupalgap.menus[delta].options.attributes
          ) { attributes = drupalgap.menus[delta].options.attributes; }
          html = theme('item_list', {'items': items, 'attributes': attributes});
        }
      }
      // Add the themed item list, trigger JQM create, remove the placeholder container.
      $('#' + options.container_id).html(html).trigger('create').children().unwrap();
    }
  }
  catch (error) { console.log('menu_block_view_pageshow - ' + error); }
}

/**
 * Implements hook_install().
 */
function menu_install() {
  try {
    // Grab the list of system menus and save each.
    var system_menus = menu_list_system_menus();
    $.each(system_menus, function(menu_name, menu) {
        menu_save(menu);
    });
  }
  catch (error) { console.log('menu_install - ' + error); }
}

/**
 * Given a menu, this adds it to drupalgap.menus. See menu_list_system_menus
 * for examples of a menu JSON object.
 * @param {Object} menu
 */
function menu_save(menu) {
  try {
    drupalgap.menus[menu.menu_name] = menu;
  }
  catch (error) { console.log('menu_save - ' + error); }
}

/**
 * Given a menu name and page id, this will return its container id for that
 * page.
 * @param {String} menu_name
 * @param {String} page_id
 * @return {String}
 */
function menu_container_id(menu_name, page_id) {
  try {
    return page_id + '_menu_' + menu_name;
  }
  catch (error) { console.log('menu_container_id - ' + error); }
}

