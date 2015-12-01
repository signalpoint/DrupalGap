

Just like Drupal, DrupalGap uses `hook_menu()` to manage the creation and display of our mobile app's pages. This means, we can quickly and easily create pages within our mobile application.

To create a custom page in our DrupalGap mobile application, follow these steps:

## 1. Create a Custom DrupalGap Module

[Learn how to create a DrupalGap Module](../Modules/Create_a_Custom_Module)

## 2. Implement hook_menu()

```
/**
 * Implements hook_menu().
 */
function my_module_menu() {
  try {
    var items = {};
    items['hello_world'] = {
      title: 'Hello DrupalGap',
      page_callback: 'my_module_hello_world_page'
    };
    return items;
  }
  catch (error) { console.log('my_module_menu - ' + error); }
}
```

## 3. Add the Page Callback Function

```
function my_module_hello_world_page() {
  try {
    var content = {};
    content['my_intro_text'] = {
      markup: '<p>Hello App World!</p>'
    };
    return content;
  }
  catch (error) { console.log('my_module_hello_world_page - ' + error); }
}
```

The above example uses an [HTML Widget](../Widgets/HTML_Widget) to place a simple paragraph on the page.

See the Widgets page for examples of many other available widgets.

## 4. View the Custom Page (optional)

To view the newly created custom page, we could set our App's front page to the path of the custom page. For example, in the `app/settings.js` file, set the `front` variable to the `hello_world` page path:

```
// App Front Page
drupalgap.settings.front = 'hello_world';
```

Now when we load the App, we should see our custom page:

![Hello World Page](http://drupalgap.org/sites/default/files/hello-app-world.png)