/**
 * Implements hook_block_view_alter().
 */
function my_module_block_view_alter(element, block) {

  // Inspect the element and block to reveal who and what to alter.
  //console.log(element);
  //console.log(block);

  switch (block.get('id')) {

    // Add a link to the main menu.
    case 'main_menu':
      element.menu._items.push(
        dg.l('Map', 'map')
      );
      break;

    // Make the powered by block's text red and add a custom clas to it.
    case 'powered_by':
      element.list._attributes.style = 'color: red;';
      element.list._attributes['class'].push('foo');
      break;

  }

}
