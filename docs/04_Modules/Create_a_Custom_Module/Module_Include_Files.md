It is possible to separate our module's functionality into multiple JavaScript files, and have them all be loaded by utilizing module includes.

## hook_install()

For example, say we had our custom module:

`app/modules/custom/my_module/my_module.js`

We could use `hook_install()` to include other JS files:

```
/**
 * Implements hook_install().
 */
function my_module_install() {
  try {
    drupalgap_add_js('app/modules/custom/my_module/includes/foo.js');
    drupalgap_add_js('app/modules/custom/my_module/includes/bar.js');
  }
  catch (error) { console.log('my_module_install - ' + error); }
}
```

## settings.js

For example, say we had our custom module:

`app/modules/custom/my_module/my_module.js`

If we wanted code placed in another file within our module, we could create another javascript file for example:

`app/modules/custom/my_module/my_module_extra.js`

Then inside of `settings.js`, we can set this file to be included with our module:

```
/** Custom Modules - www/app/modules/custom **/
Drupal.modules.custom['my_module'] = {
  includes: [{ name: 'my_module_extra' }]
};
```

To have more than one include file, just create an extra javascript file:

`app/modules/custom/my_module/my_module_other.js`

Then add it to the includes array for the module:

`includes:[{name:'my_module_extra'},{name:'my_module_other'}]`
