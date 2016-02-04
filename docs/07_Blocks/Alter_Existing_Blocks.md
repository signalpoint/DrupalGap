## Alter a block's build

In this example, we add some css class names to a block's div container:

```
/**
 * Implements hook_regions_build_alter().
 */
function my_module_blocks_build_alter(blocks) {
  if (blocks.admin_menu) {
    blocks.admin_menu._attributes['class'].push('medium-6', 'columns');
  }
  if (blocks.powered_by) {
    blocks.powered_by._attributes['class'].push('medium-6', 'columns');
  }
}
```

## Alter a blocks's view

In this example, we add a link to the main menu, and style the powered by list:

```
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

    // Make the powered by block's text red and add a custom class to it.
    case 'powered_by':
      element.list._attributes.style = 'color: red;';
      element.list._attributes['class'].push('foo');
      break;

  }

}
```
