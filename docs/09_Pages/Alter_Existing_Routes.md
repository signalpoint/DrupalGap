To alter an existing route, we can use `hook_init()`. In this example we'll make the built in `user.login` route a child of our app's home page. 

```
/**
 * Implements hook_init().
 */
function my_module_init() {

  // Make the user login page's base route our home page.
  dg.router.saveAsChildRoute('user.login', 'my_module.home');

}
```

This will have a link to the User Login page appear in the Primary Local Tasks when viewing our app's home page.
