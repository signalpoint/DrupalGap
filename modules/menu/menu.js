/**
 * Implements hook_block_view
 */
function menu_block_view(delta) {
  try {
    if (drupalgap.settings.debug) {
      console.log('menu_block_view(' + delta + ')');
    }
    // If the block's corresponding menu exists, and it has links, iterate over
    // each link, add it to an items array, then them an item list.
    var html = '';
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

