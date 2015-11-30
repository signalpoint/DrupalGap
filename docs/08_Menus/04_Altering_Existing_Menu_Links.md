It's possible to alter existing menu links for our needs. We can do this by implementing `hook_deviceready()`:

```
/**
 * Implements hook_deviceready().
 */
function my_module_deviceready() {
  try {

    // Print menu links to console to inspect the JSON structure.
    console.log(drupalgap.menu_links);

    // Make alterations here...

    // For example, add a custom class name to the 401 page.
    drupalgap.menu_links['401'].options.attributes['class'] += ' my_custom_class ';

  }
  catch (error) { console.log('my_module_deviceready - ' + error); }
}
```

## Add Icons to an Existing Menu Link

Say for example, we wanted to place [icons](http://api.jquerymobile.com/icons/) on the node *View* and *Edit* local task menu tabs:

![Locals Tasks with Icons](http://drupalgap.org/sites/default/files/local-tasks-with-icons.png)

That can be done like so:

```
drupalgap.menu_links['node/%/view'].options.attributes['data-icon'] = 'eye';
drupalgap.menu_links['node/%/edit'].options.attributes['data-icon'] = 'edit';
```

## Change a Page Callback Function to Render an Existing Page Differently

For example, we could override the `page_callback` function that is used to render the system's dashboard page.

```
/**
 * Implements hook_deviceready().
 */
function my_module_deviceready() {
  try {
    drupalgap.menu_links['dashboard'].page_callback = 'my_module_dashboard_page';
  }
  catch (error) { console.log('my_module_deviceready - ' + error); }
}

/**
 * My dashboard page.
 */
function my_module_dashboard_page() {
  try {
    var content = {};
    content['my_paragraph'] = {
      markup: '<p>Clean your dashboard!</p>'
    };
    return content;
  }
  catch (error) { console.log('my_module_dashboard_page - ' + error); }
}
```

Now if we visit the dashboard page, our custom `page_callback` will be used when rendering the page:

![Custom Dashboard](http://drupalgap.org/sites/default/files/custom-dashboard.png)

To figure out any particular paths that need to be modified, just use the console log function:

`console.log(drupalgap.menu_links);`