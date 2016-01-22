Creating custom menus in DrupalGap is done with custom blocks. Here's an example menu with a link to a Food page, and a link to a Beverage page:

![Food Page](http://drupalgap.org/sites/default/files/food-page.png)

![Beverage](http://drupalgap.org/sites/default/files/beverage-page.png)

## Creating the Menu

To create a custom menu like this, first [create a custom block](../Blocks/Create_a_Custom_Block). Then implement its `build` function with something like this:

```
return new Promise(function(ok, err) {
  var content = {};
  content['my_markup'] = {
    _theme: 'item_list',
    _items: [
      dg.l('Food', 'food'),
      dg.l('Beverage', 'beverage')
    ]
  };
  ok(content);
});
```

## Displaying the Menu's Block

For example, if we wanted to put the `my_module_custom_block` block in the `header` region of `my_theme`, we would do this in the `settings.js` file:

```
drupalgap.settings.blocks.my_theme = {

  /* ... */

  header: {

    /* ... other blocks ... */

    my_module_custom_block:{},

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
 * Defines custom routes for my module.
 */
my_module.routing = function() {
  var routes = {};

  // My example food page route.
  routes["my_module.food"] = {
    "path": "/food",
    "defaults": {
      "_controller": function() {
        return new Promise(function(ok, err) {
          ok('What would you like to eat?');
        });
      },
      "_title": "Food"
    }
  };
  
  // My example beverage page route.
    routes["my_module.beverage"] = {
      "path": "/beverage",
      "defaults": {
        "_controller": function() {
          return new Promise(function(ok, err) {
            ok('What would you like to drink?');
          });
        },
        "_title": "Beverage"
      }
    };

  // Returns the routes.
  return routes;
};
```

[Learn More About Pages](../Pages)
