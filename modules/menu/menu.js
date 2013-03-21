/**
 * Implements hook_block_view
 */
function menu_block_view(delta) {
  try {
    if (drupalgap.settings.debug) {
      console.log('menu_block_view(' + delta + ')');
    }
    var html = '';
    // Are we about to view a normal menu, or the local task menu?
    if (delta == 'primary_local_tasks') {
      // For the current page's router path, grab any local tasks and theme them
      // into the menu. Note, local tasks are located in a menu link item's
      // children, if there are any.
      var router_path = drupalgap_get_menu_link_router_path(drupalgap_get_current_path());
      if (drupalgap.menu_links[router_path] && drupalgap.menu_links[router_path].children) {
        var items = [];
        $.each(drupalgap.menu_links[router_path].children, function(index, child){
            if (drupalgap.menu_links[child] &&
              (drupalgap.menu_links[child].type == 'MENU_DEFAULT_LOCAL_TASK' ||
               drupalgap.menu_links[child].type == 'MENU_LOCAL_TASK')
            ) {
              items.push(l(drupalgap.menu_links[child].title, child));
            }
        });
        html = theme('item_list', {'items':items});
      }
    }
    else {
      // If the block's corresponding menu exists, and it has links, iterate over
      // each link, add it to an items array, then theme an item list.
      if (eval('drupalgap.menus.' + delta) && eval('drupalgap.menus.' + delta + '.links')) {
        var items = [];
        var links = eval('drupalgap.menus.' + delta + '.links');
        $.each(links, function(index, link){
            if (!link.options) { link.options = null; }
            items.push(l(link.title, link.path, link.options));
        });
        if (items.length != 0) {
          html = theme('item_list', {'items':items});
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

