

By utilizing two [blocks](../Blocks) and a [region zone](../Regions/Region_Zones), we can build a slide out "menu" (aka a [jQuery Mobile Panel Widget](http://api.jquerymobile.com/panel/)).

![Panel Closed](http://drupalgap.org/sites/default/files/panel-closed_0.png)

![Panel Open](http://drupalgap.org/sites/default/files/panel-open.png)

We say *"menu"* here because this isn't a traditional [DrupalGap menu](../Menus), instead it's a [block imitating a menu](../Blocks/Imitating_Menus_with_Blocks) which allows us to more easily [build dynamic "menus"](../Menus/Menus_with_Dynamic_Links).

## 1. Build 2 Blocks

We create two custom blocks to build this slide menu. One block for the panel itself, the other to display a button to open the panel. Note, the button to open a panel doesn't necessarily have to be in a separate block, you may move it wherever you choose. We just use this example to demonstrate a common use case:

```
/**
 * Implements hook_block_info().
 */
function my_module_block_info() {
  try {
    var blocks = {};
    blocks['my_panel_block'] = {
      delta: 'my_panel_block',
      module: 'my_module'
    };
    blocks['my_panel_block_button'] = {
      delta: 'my_panel_block_button',
      module: 'my_module'
    };
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

      // The slide menu (aka panel).
      case 'my_panel_block':

        var attrs = {
          id: drupalgap_panel_id(delta),
          'data-role': 'panel',
          'data-position': 'left', // left or right
          'data-display': 'overlay' // overlay, reveal or push
        };
        var items = [
          bl('Hello', 'hello', {
              attributes: {
                'data-icon': 'home'
              }
          }),
          bl('World', 'world', {
              attributes: {
                'data-icon': 'cloud'
              }
          }),
        ];
        content += '<div ' + drupalgap_attributes(attrs) + '>' +
          '<!-- panel content goes here -->' +
          theme('jqm_item_list', { items: items }) +
        '</div><!-- /panel -->';

        break;

      // The button to open the menu.
      case 'my_panel_block_button':

        content = bl('Open panel', '#' + drupalgap_panel_id('my_panel_block'), {
            attributes: {
              'data-icon': 'bars',
              'data-iconpos': 'notext',
              'class': 'ui-btn-left'
            }
        });

        break;

    }
    return content;
  }
  catch (error) { console.log('my_module_block_view - ' + error); }
}
```

## 2. Add blocks to the settings.js file

In the `settings.js` file, add the **panel block** to the `header` region's `_prefix` zone, and then add the **panel button block** to the `header` region:

```
drupalgap.settings.blocks.my_theme = {

  header: {

    _prefix: {
      my_panel_block: { }
    },

    /* ... other blocks ... */

    my_panel_block_button: { },

    /* ... other blocks ... */

  },

  /* ... other regions ... */

};
```