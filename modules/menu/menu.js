/**
 * Implements hook_block_view
 */
function menu_block_view(delta) {
  try {
    if (drupalgap.settings.debug) {
      console.log('menu_block_view()');
      console.log(JSON.stringify(arguments));
    }
    switch (delta) {
      case 'user_menu':
        var items = [];
        if (drupalgap.user.uid == 0) {
          items.push(l('Login', 'user/login'));
        }
        else {
          items.push(l('Logout', 'user/logout'));
        }
        return theme('item_list', {'items':items, 'attributes':{'data-role':'list-view'}});
        break;
      default:
        return '';
        break;
    }
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
      console.log('menu_install() - blocks');
      console.log(JSON.stringify(drupalgap.blocks));
    }
  }
  catch (error) {
    alert('menu_install - ' + error);
  }
}

/**
 * Given a menu, this adds it to drupalgap.menus, creates a block for it, and
 * adds the block to drupalgap.blocks. See menu_list_system_menus for examples
 * of a menu JSON object.
 */
function menu_save(menu) {
  try {
    if (drupalgap.settings.debug) {
      console.log('menu_save()');
      console.log(JSON.stringify(arguments));
    }
    // Add the menu to drupalgap.menus.
    eval('drupalgap.menus.push({' + menu.menu_name + ':menu});');
    // Create a block for the menu and add it to drupalgap.blocks.
    var block_delta = menu.menu_name;
    eval('var block = {' + block_delta + ':{"delta":"' + block_delta + '","module":"menu"}};');
    drupalgap.blocks.push(block);
  }
  catch (error) {
    alert('menu_save - ' + error);
  }
}

