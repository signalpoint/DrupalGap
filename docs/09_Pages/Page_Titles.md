## Set page title with hook_menu()

When creating pages with `hook_menu()`, it is easy to assign a title to the page.

```
/**
 * Implements hook_menu().
 */
function my_module_menu() {
  try {
    var items = {
      custom_page: {
        title: 'Custom Page',
        page_callback: 'my_module_custom_page'
      }
    };
    return items;
  }
  catch (error) { drupalgap_error(error); }
}

/**
 * Page callback function for custom_page.
 */
function my_module_custom_page() {
  try {
    var content = {
      my_container: {
        markup: '<p>Welcome to my page.</p>'
      }
    };
    return content;
  }
  catch (error) { drupalgap_error(error); }
}
```

## Set page title with a hook_menu() title callback function

To set a page title with a title callback function, modify the `hook_menu()` implementation slightly.

```
/**
 * Implements hook_menu().
 */
function my_module_menu() {
  try {
    var items = {
      custom_page: {
        title: 'Custom Page',
        page_callback: 'my_module_custom_page',
        title_callback: 'my_module_custom_page_title_callback'
      }
    };
    return items;
  }
  catch (error) { console.log('my_module_menu - ' + error); }
}

/**
 * Page callback function for custom_page title_callback.
 */
function my_module_custom_page_title_callback(callback) {
  try {
    callback.call(null, 'My Custom Title');
  }
  catch (error) { console.log('my_module_custom_page_title_callback - ' + error); }
}
```

Now, the original title of `Custom Page` will be overwritten with `My Custom Title` when navigating to the page.

## Set page title with a hook_menu() title callback function and arguments

To set a page title with a title callback function and arguments, modify the `hook_menu()` implementation slightly.

```
/**
 * Implements hook_menu().
 */
function my_module_menu() {
  try {
    var items = {
      custom_page: {
        title: 'Custom Page',
        page_callback: 'my_module_custom_page',
        title_callback: 'my_module_custom_page_title_callback',
        title_arguments: ['My Cool Title']
      }
    };
    return items;
  }
  catch (error) { console.log(error); }
}

/**
 * Page callback function for custom_page title_callback.
 */
function my_module_custom_page_title_callback(callback, title) {
  try {
    callback.call(null, title.replace("Cool", "Awesome"));
  }
  catch (error) { console.log(error); }
}
```

Now, the original title of `My Cool Title` will be overwritten with with `My Awesome Title` when navigating to the page. Notice again how we have to pass our modified titled to the argument callback function. This sends our title back to DrupalGap, which will automatically place it on the page.

## Title Functions

Alternatively, you may use drupalgap_set_title() to programatically set a page title.

`drupalgap_set_title('Fast Food Friday');`

Use `drupalgap_get_title()` to retrieve the title of the current page.

`var current_title = drupalgap_get_title();`