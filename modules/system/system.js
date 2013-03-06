/**
 * Implements hook_block_info().
 */
function system_block_info() {
  try {
    if (drupalgap.settings.debug) {
      console.log('system_block_info()');
      console.log(JSON.stringify(arguments));
    }
    // System blocks.
    var blocks = {
      'main':{
        'delta':'main',
        'module':'system',
      },
      'header':{
        'delta':'header',
        'module':'system',
      },
      'powered_by':{
        'delta':'powered_by',
        'module':'system',
      },
      'help':{
        'delta':'help',
        'module':'system',
      },
    };
    // Make a block for each system menu.
    var system_menus = menu_list_system_menus();
    $.each(system_menus, function(menu_name, menu){
        var block_delta = menu.menu_name;
        eval('blocks.' + block_delta + ' = {"delta":"' + block_delta + '","module":"menu"};');
    });
    if (drupalgap.settings.debug) {
      console.log('system_block_info() - blocks');
      console.log(JSON.stringify(blocks));
    }
    return blocks;
  }
  catch (error) {
    alert('system_block_info - ' + error);
  }
}

/**
 * Implements hook_block_view().
 */
function system_block_view(delta) {
  try {
    if (drupalgap.settings.debug) {
      console.log('system_block_view()');
      console.log(JSON.stringify(arguments));
    }
    switch (delta) {
      case 'main':
        return drupalgap_render_page({'path':drupalgap.path});
        break;
      case 'header':
        return '<h1>' + l(drupalgap_get_title(), '') + '</h1>';
        break;
      case 'powered_by':
        return '<p>Powered by: ' +  l('DrupalGap','http://www.drupalgap.org') + '</p>';
        break;
      case 'help':
        return l('Help','http://www.drupalgap.org/support');
        break;
      default:
        return '';
        break;
    }
  }
  catch (error) {
    alert('system_block_info - ' + error);
  }
}

