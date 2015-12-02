## Add Custom CSS File with Module

With a custom module, we can easily add CSS to our mobile app. Say for example we had a module css file we wanted to include:

`app/modules/custom/my_module/my_module.css`

Then we could implement `hook_install()` in our module and a make a call to `drupalgap_add_css()`, for example:

```
/**
 * Implements hook_install().
 */
function my_module_install() {
  try {
    var css = drupalgap_get_path('module', 'my_module') + '/my_module.css';
    drupalgap_add_css(css);
  }
  catch (error) { console.log('my_module_install - ' + error); }
}
```