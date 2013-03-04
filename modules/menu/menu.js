/**
 * Implements hook_install().
 */
function menu_install() {
  try {
    if (drupalgap.settings.debug) {
      console.log('menu_install()');
      console.log(JSON.stringify(arguments));
    }
    var system_menus = menu_list_system_menus();
    $.each(system_menus, function(index, object){
        console.log(index);
        console.log(JSON.stringify(object));
    });
  }
  catch (error) {
    alert('menu_install - ' + error);
  }
}

