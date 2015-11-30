With the DrupalGap menu system, and our `settings.js` file, we can create popup menus. Before getting started with popup menus, it is a good idea to be familiar with [Menus](../Menus), [Blocks](../Blocks), [Regions](../Regions) and [Region Links](Region_Menu_Links) in DrupalGap.

![Popup Menu Example](http://drupalgap.org/sites/default/files/popup-menu.png)

## How it Works

1. Create some Pages to Visit (optional)
2. Create a Custom Popup Menu
3. Place the Popup Menu's Block in a Region (e.g. header)
4. Make a Button in the Region to Display the Popup Menu

## An Example

### Create Destination Pages (optional)

If the pages we want our menu links to visit haven't been created yet, then we can create some pages that can be navigated to when a particular popup menu link is clicked:

```
/**
 * Implements hook_menu().
 */
function my_module_menu() {
  try {
    items['foo'] = {
      title: 'Foo',
      page_callback: 'my_module_foo'
    };
    items['bar'] = {
      title: 'Bar',
      page_callback: 'my_module_bar'
    };
    return items;
  }
  catch (error) {
    console.log('my_module_menu - ' + error);
  }
}

function my_module_foo() {
  return 'Hi foo!';
}

function my_module_bar() {
  return 'Howdy bar!';
}
```

### Create the Menu

Now that we have some pages that can be navigated to, let's create a menu in the `settings.js` file:

```
drupalgap.settings.menus['my_popup_menu'] = {
  options: menu_popup_get_default_options(),
  links:[
    { title: 'Foo', path: 'foo' },
    { title: 'Bar', path: 'bar' }
  ]
};
```

### Place the Menu's Block in a Region

Whenever a menu is created, DrupalGap automatically creates a block for that menu. The block is in charge of displaying the menu, so we place the block in a region to specify where the menu should be displayed. This is done in the `settings.js` file. Let's place the menu's block in the `header` region of our theme:

```
drupalgap.settings.blocks.my_theme = {
  header: {
    /* ... other blocks ... */
    my_popup_menu: { }
  },
  /* ... other regions ... */
};
```

### Make a Button to Popup the Menu in the Region

Now that we've created the menu, and placed its block in a region, we need to make a button to actually popup the menu.

![Popup Button](http://drupalgap.org/sites/default/files/popup-button.png)

This is done using a region menu link in the `settings.js` file:

```
drupalgap.settings.menus.regions['header'] = {
  links:[

    /* ... other links ... */

    /* My Popup Menu Button */
    {
      options: {
        popup: true,
        popup_delta: 'my_popup_menu',
        attributes: {
          'class': 'ui-btn-right'
        }
      }
    }

  ]
};
```

Now when we click on the region link, it knows to popup the `my_popup_menu`, cool!

![Popup Menu](http://drupalgap.org/sites/default/files/popup-menu.png)

We could then navigate to the **Foo** or **Bar** page:

![Foo Page](http://drupalgap.org/sites/default/files/popup-foo-page.png)
