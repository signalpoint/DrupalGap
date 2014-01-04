/**
 * Implements hook_block_view
 */
// NOTE: When rendering a jQM data-role="navbar" you can't place an
// empty list (<ul></ul>) in it, this will cause an error:
// https://github.com/jquery/jquery-mobile/issues/5141
// So we must check to make sure we have any items before rendering the
// menu since our theme_item_list implementation returns empty lists
// for jQM pageshow async list item data retrieval and display.
function menu_block_view(delta) {
  try {
    if (drupalgap.settings.debug) {
      console.log('menu_block_view(' + delta + ')');
    }
    var html = '';
    
    // Grab the current path so we can watch out for any menu links that match it.
    var path = drupalgap_path_get();
    
    // Are we about to view a normal menu, or the local task menu?
    if (delta == 'primary_local_tasks') {
      
      // LOCAL TASKS MENU LINKS
      
      // For the current page's router path, grab any local tasks menu links add
      // them into the menu. Note, local tasks are located in a menu link item's
      // children, if there are any. Local tasks typically have argument wildcards
      // in them, so we'll replace their wildcards with the current args.
      //var router_path = drupalgap_get_menu_link_router_path(drupalgap_get_current_path());
      var router_path = drupalgap_router_path_get();
      if (drupalgap.menu_links[router_path] && drupalgap.menu_links[router_path].children) {
        var menu_items = [];
        var link_path = '';
        $.each(drupalgap.menu_links[router_path].children, function(index, child){
            if (drupalgap.menu_links[child] &&
              (drupalgap.menu_links[child].type == 'MENU_DEFAULT_LOCAL_TASK' ||
               drupalgap.menu_links[child].type == 'MENU_LOCAL_TASK')
            ) {
              if (drupalgap_menu_access(child)) {
                menu_items.push(drupalgap.menu_links[child]);
              }
            }
        });
        // If there was only one local task menu item, and it is the default
        // local task, don't render the menu, otherwise render the menu as an
        // item list as long as there are items to render.
        if (menu_items.length == 1 && menu_items[0].type == 'MENU_DEFAULT_LOCAL_TASK') {
          html = '';          
        }
        else {
          var items = [];
          $.each(menu_items, function(index, item){
              items.push(l(item.title, drupalgap_place_args_in_path(item.path)));
          });
          if (items.length > 0) {
            html = theme('item_list', {'items':items});
          }
        }
      }
    }
    else {
      
      // ALL OTHER MENU LINKS
      
      // If the block's corresponding menu exists, and it has links, iterate over
      // each link, add it to an items array, then theme an item list.
      if (drupalgap.menus[delta] && drupalgap.menus[delta].links) {
        var items = [];
        $.each(drupalgap.menus[delta].links, function(index, menu_link){
            // Make a deep copy of the menu link so we don't modify it.
            var link = jQuery.extend(true, {}, menu_link);
            // If there are no link options, set up defaults.
            if (!link.options) { link.options = {attributes:{}}; }
            else if (!link.options.attributes) { link.options.attributes = {}; }
            // If the link points to the current path, set it as active.
            if (link.path == path) {
              if (!link.options.attributes['class']) { link.options.attributes['class'] = ''; }
              link.options.attributes['class'] += ' ui-btn-active ui-state-persist ';
            }
            items.push(l(link.title, link.path, link.options));
        });
        if (items.length > 0) {
          // Pass along any menu attributes.
          var attributes = null;
          if (drupalgap.menus[delta].options && drupalgap.menus[delta].options.attributes) {
            attributes = drupalgap.menus[delta].options.attributes;
          }
          html = theme('item_list', {'items':items, 'attributes':attributes});
        }
      }
    }
    return html;
  }
  catch (error) {
    alert('menu_block_view - ' + error);
  }
}

/**
 * Implements hook_install().
 */
function menu_install() {
  try {
    if (drupalgap.settings.debug) {
      console.log('menu_install()');
      console.log(JSON.stringify(arguments));
    }
    // Grab the list of system menus and save each.
    var system_menus = menu_list_system_menus();
    $.each(system_menus, function(menu_name, menu){
        menu_save(menu);
    });
    if (drupalgap.settings.debug) {
      console.log('menu_install() - menus');
      console.log(JSON.stringify(drupalgap.menus));
    }
  }
  catch (error) {
    alert('menu_install - ' + error);
  }
}

/**
 * Given a menu, this adds it to drupalgap.menus. See menu_list_system_menus
 * for examples of a menu JSON object.
 */
function menu_save(menu) {
  try {
    if (drupalgap.settings.debug) {
      console.log('menu_save()');
      console.log(JSON.stringify(arguments));
    }
    eval('drupalgap.menus.' + menu.menu_name + ' =  menu;');
  }
  catch (error) {
    alert('menu_save - ' + error);
  }
}

