See also [imitating menus with blocks](../Blocks/Imitating_Menus_with_Blocks).

![Dynamic Menu Links](http://drupalgap.org/sites/default/files/dynamic-menu-links.png)

Since the `settings.js` file is loaded before the DrupalGap bootstrap, we can't place dynamic argument values in our menu links.

Here's an example block that lives in a `header` region and it simulates a popup menu, and has a dynamic link path that contains the current user's id:

```
/**
 * Implements hook_block_info().
 */
function my_module_block_info() {
  try {
    var blocks = {};
    blocks['my_module_user_menu'] = {
      delta: 'my_module_user_menu',
      module: 'my_module'
    }
    return blocks;
  }
  catch (error) { console.log('my_module_block_info - ' + error); }
}

/**
 * Implements hook_block_view().
 */
function my_module_block_view(delta, region) {
  try {
    var content = '';
    switch (delta) {
      case 'my_module_user_menu':
        var uid = Drupal.user.uid;
        var html = theme('popup', {
            content: theme('jqm_item_list', {
                items: [
                  l('View profile', 'user'),
                  l('Edit account', 'user/' + uid + '/edit'),
                  l('Logout', 'user/logout')
                ]
            }),
            attributes: {
              id: drupalgap_get_page_id() + '_my_module_user_menu'
            },
            button_attributes: {
              'data-icon': 'bars',
              'data-iconpos': 'notext',
              'class': 'ui-btn-left'
            }
        });
        return html;
        break;
    }
    return content;
  }
  catch (error) { console.log('my_module_block_view - ' + error); }
}
```

A common mistake is to place the `Drupal.user.uid` in a menu created via the `settings.js` file. This unfortunately won't work (for now). But we can easily get around this problem by [creating a custom block](../Blocks/Create_a_Custom_Block) like we did above.

Remember, we're not actually creating what DrupalGap considers a menu here, we are simulating a jQuery Mobile menu, inside a DrupalGap block. In the future DrupalGap, will have a more flexible menu system, but for now this approach works great.

***Be careful*** when working with *headers* and *footers* with jQuery Mobile, there must be some type of html header element inside of it, or the region may appear collapsed. If you don't already have some header text in that region provided by another block, just append an empty one to your block's content at the end:

`return html + '<h2>&nbsp;</h2>';`
