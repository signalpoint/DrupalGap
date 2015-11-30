

It's possible to have custom access control on a `hook_menu()` items. This means we can control who can, and cannot access, pages within the app.

It also helps determine if a menu link will be shown to, or hidden from, a user. This means users won't see a menu link, unless they have access to the link's destination page.

Please note, ***user #1 always has access***, and any customizations are ignored.

## User Roles

We can limit access to a page and menu link item using user roles. For example, if we wanted only administrators to be able to access page a page and menu link, we could do this:

```
/**
 * Implements hook_menu().
 */
function my_module_menu() {
  try {
    var items = {};
    items['welcome'] = {
      title: 'Welcome',
      page_callback: 'my_module_welcome',
      access_arguments: ['administrator']
    };
    return items;
  }
  catch (error) {
    console.log('my_module_menu - ' + error);
  }
}
```

Now if someone were to navigate to the welcome page they would only be granted access if they have the administrator user role.

## The access_callback property

By using the `access_callback` property, we can specify a custom function to determine whether or not the user has access:

```
/**
 * Implements hook_menu().
 */
function my_module_menu() {
  try {
    var items = {};
    items['welcome'] = {
      title: 'Welcome',
      page_callback: 'my_module_welcome',
      access_callback: 'my_module_welcome_access'
    };
    return items;
  }
  catch (error) {
    console.log('my_module_menu - ' + error);
  }
}

/**
 *
 */
function my_module_welcome_access() {
  try {
    if (date('l') == 'Friday') {
      return true;
    }
    drupalgap_alert('Sorry, we are closed on ' + date('l') + '.');
    return false;
  }
  catch (error) { console.log('my_module_welcome_access - ' + error); }
}
```

***Warning***, you cannot use async calls in this function. However, for local task access callbacks that fall within an entity's path (e.g. `node/%`, `user/%`), the loaded entity is automatically passed to the function. See [this page](Local_Tasks/Add_a_Custom_Local_Task) for more info and example code.

## Access Callback Arguments

We can pass one or more arguments to the access callback function by using the access_arguments array property in our hook_menu() items:

### Path Arguments

`access_arguments: [1]`

This would grab the argument in position 1 of the path, and send it along to the access callback function. In the hook_menu() example above, our path only has an argument in position zero (welcome), so this is just for demonstration. The path arguments for access callback are typically used with local tasks, [learn more about local task access callback arguments](Local_Tasks/Add_a_Custom_Local_Task).

### Static Arguments

`access_arguments: ['red', 'green', 'blue'],`

The above snippet will pass three arguments to the `access_callback` function:

```
function my_module_welcome_access(color1, color2, color3) {
  // ...
}
```