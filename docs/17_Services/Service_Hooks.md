We can use DrupalGap Services Hooks to operate before and after calls to the Drupal website. See the [Hooks](../Hooks) page for other Services hooks.

## Do something after the user logs out

```
/**
 * Implements hook_services_postprocess().
 */
function my_module_services_postprocess(options, result) {
  try {
    if (options.service == 'user' && options.resource == 'logout') {
      // Do some stuff after the user logs out...
    }
  }
  catch (error) {
    console.log('my_module_services_postprocess - ' + error);
  }
}
```