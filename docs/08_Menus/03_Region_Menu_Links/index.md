

See also [menus with dynamic links](../Menus_with_Dynamic_Links).

We can add menu links directly to regions using `hook_menu()` or with the `app/settings.js` file. For example, say we wanted to place an Order button on the top right of our Food page (from the [Food & Beverage example](../Creating_Custom_Menus)):

![Food and Beverage Example](http://drupalgap.org/sites/default/files/order-food.png)

## How it works

jQuery Mobile allows placement of links like this directly inside of header and footer containers, so we want to be able to easily add menu links directly to these regions. DrupalGap requires themes to have a header and footer region (which corresponds to the jQM `data-role` attribute), so it is easy to place a menu link in one of these regions.

We can add menu links to regions in using our `settings.js` file or by using `hook_menu()`. Here are some examples which place the **+ Order** button shown above:

### Using settings.js

For example, we could place a menu link in the header region using the settings.js file:

```
drupalgap.settings.menus.regions['header'] = {  
  links:[
    /* ... other region links ... */
    {
      title: 'Order',
      path: 'food_order',
      options: {
        attributes: {
          'data-icon': 'plus',
          'class': 'ui-btn-right'
        }
      },
      pages: {
        value: ['food'],
        mode: 'include'
      }
    }
  ]
};
```

### Using hook_menu()

Alternatively, we can declare region menu links inside a module using `hook_menu()`:

```
/**
 * Implements hook_menu().
 */
function my_module_menu() {

  var items = {};

  /* ... other menu link items... */

  items['food_order'] = {
    title: 'Order',
    page_callback: 'my_module_order_food_page',
    region: {
      name: 'header',
      options: {
        attributes: {
          'data-icon': 'plus',
          'class': 'ui-btn-right'
        }
      },
      pages: {
        value: ['food'],
        mode: 'include'
      }
    }
  };

  return items;

}
```

Check out the [Home Button](../Widgets/Buttons/Home_Button) and [Back Button](../Widgets/Buttons/Back_Button) examples, and [Popup Menus](Popup_Menus_Drop_Down_Menus) for typical uses of region menu links.
