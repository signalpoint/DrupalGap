We can alter the title of an existing page by utilizing `hook_deviceready()`. For example, if we wanted to change the title of the User Login page, we could do that with the following code:

```
/**
 * Implements hook_deviceready().
 */
function my_module_deviceready() {
  try {
    drupalgap.menu_links['user/login'].title = 'Welcome';
  }
  catch (error) { console.log('my_module_deviceready - ' + error); }
}
```