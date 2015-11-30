To create custom modules in DrupalGap, follow these steps:

**1.** Create a directory for the custom module in app/modules/custom (not in app/modules), for example:

`app/modules/custom/my_module`

**2.** Create a javascript file for the module, the javascript file name must match the name of the module directory:

`app/modules/custom/my_module/my_module.js`

**3.** Tell DrupalGap about the custom module by adding it to the www/app/settings.js file:

```
/** Custom Modules - www/app/modules/custom **/
Drupal.modules.custom['my_module'] = {};
```

Adding more than one custom module just repeat the above line and change the `my_module` to `my_additional_module`.

**4.** Add custom code to the module's javascript file.

For example, try [creating a custom page]() in the App using `hook_menu()`.
