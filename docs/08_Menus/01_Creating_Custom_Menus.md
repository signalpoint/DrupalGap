Creating custom menus in DrupalGap is done with the `app/settings.js` file. Here's an example menu with a link to a Food page, and a link to a Beverage page:

![Food Page](http://drupalgap.org/sites/default/files/food-page.png)

![Beverage](http://drupalgap.org/sites/default/files/beverage-page.png)

## Creating the Menu

To create a custom menu like this, just add an entry to the menu settings in the `app/settings.js` file:

```
drupalgap.settings.menus['my_menu'] = {
  links:[
    {
      title: 'Food',
      path: 'food'
    },
    {
      title: 'Beverage',
      path: 'beverage'
    }
  ]
};
```

## Displaying the Menu's Block

Now when DrupalGap runs, it will automatically create a `my_menu` block for the custom menu. The block can then be added to a region for display. For example, if we wanted to put the `my_menu` block in the `navigation` region of `my_theme`, we would do this in the `app/settings.js` file:

```
drupalgap.settings.blocks.my_theme = {

  /* ... */

  navigation:{

    /* ... other blocks ... */

    my_menu:{},

    /* ... other blocks ... */

  },

  /* ... */

};
```

[More information on adding blocks to regions](../Blocks/Adding_Block_Region)

## Creating Pages for the Menu Links

When creating custom menus, we'll typically need some pages to go along with the menu links. Let's create two simple pages, one for food, and one for beverage in our custom module:

```
/**
 * Implements hook_menu().
 */
function my_module_menu() {
  var items = { };
  items['food'] = {
    title: 'Food',
    page_callback: 'my_module_food_page'
  };
  items['beverage'] = {
    title: 'Beverage',
    page_callback: 'my_module_beverage_page'
  };
  return items;
}

/**
 * The food page callback function.
 */
function my_module_food_page() {
  return 'What would you like to eat?';
}

/**
 * The beverage page callback function.
 */
function my_module_beverage_page() {
  return 'What would you like to drink?';
}
```

[Learn More About Pages](../Pages)
