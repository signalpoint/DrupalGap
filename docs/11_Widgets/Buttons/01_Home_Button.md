

For more information, check out [Adding Menu Links to Regions](../../Menus/Region_Menu_Links).

Before working with the links to the app's front page, it is important to note that the an empty string page path is shorthand for referring to the App's front page path. This means the following two lines of code are equivalent:

```
var html = l('Home', '');
var html = l('Home', drupalgap.settings.front);
```

Both of the lines of code above will have the same value for the `html` variable. This same concept holds true in Drupal's PHP code, an empty string path is shorthand for the site's front page path.

## Creating a Home Button

A Home Button can be placed into a region as a link. The button allows users a quick way to get back to the front page of our app. Home buttons can be added using the `app/settings.js` file, or with a custom module using `hook_menu()`. Typically we don't want the Home button to show up on the home page, so we can exclude it from the front page using visibility rules.

![Home Button](http://drupalgap.org/sites/default/files/home-button.png)

### app/settings.js

```
drupalgap.settings.menus.regions['header'] = {
  links:[
    {
      title:'Home',
      path:'',
      options:{
        attributes:{
          'data-icon':'home',
           class:'ui-btn-left'
         }
      },
      pages:{
        value:[''],
        mode:'exclude'
      }
    }
  ]
};
```

### hook_menu()

```
/**
 * Implements hook_menu().
 */
function my_module_menu() {
  var items = {

    /* ... other items ... */

    my_custom_home_page:{
      title:'Home',
      page_callback:'my_custom_home_page',
      region:{
        name:'header',
        options:{
          attributes:{
            'data-icon':'home',
            'class':'ui-btn-left'
          }
        },
        pages:{
          value:[''],
          mode:'exclude',
        }
      }
    },

    /* ... other items ... */

  };
  return items;
}
```