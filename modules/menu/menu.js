/**
 * Implements hook_block_view
 */
function menu_block_view(delta) {
  try {
    if (drupalgap.settings.debug) {
      console.log('menu_block_view(' + delta + ')');
    }
    var html = '';
    switch (delta) {
      case 'user_menu':
        var items = [];
        if (drupalgap.user.uid == 0) {
          items.push(l('Login', 'user/login'), l('Register', 'user/register'));
        }
        else {
          items.push(l('My Account', 'user'), l('Logout', 'user/logout'));
        }
        html = theme('item_list', {'items':items, 'attributes':{'data-role':'list-view'}});
        break;
      case 'main_menu':
        var items = [];
        items.push(l('Content', 'node', {'attributes':{'data-icon':'star'}}));
        html = theme('item_list', {'items':items, 'attributes':{'data-role':'list-view'}});
        break;
      case 'navigation':
        html = 'Navigate this!';
        break;
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
    eval('drupalgap.menus.push({' + menu.menu_name + ':menu});');
  }
  catch (error) {
    alert('menu_save - ' + error);
  }
}

