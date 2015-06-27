/**
 * Implements hook_block_view().
 * @param {String} delta
 * @return {String}
 */
function menu_block_view(delta) {
  try {
    dpm('menu_block_view');
    console.log(delta);
    var menu = dg_menu_get(delta);
    console.log(menu);
    if (menu.links.length == 0) { return ''; }
    var items = [];
    for (var i = 0; i < menu.links.length; i++) {
      items.push(theme('link', menu.links[i]));
    }
    return {
      links: {
        markup: theme('item_list', {
          items: items,
          attributes: menu.attributes
        })
      }
    };
  }
  catch (error) { console.log('menu_block_view - ' + error); }
}

