## Installing a Contibuted Module

 1. Visit the [Modules page](http://drupalgap.org/project/modules) to locate a contributed module
 2. Download a tag of the module from the project home page on GitHub
 3. Place the module in `www/app/modules` (*not in www/modules*)
 4. Tell DrupalGap about the module in `settings.js`:

```
/** Contributed Modules - www/app/modules **/
Drupal.modules.contrib['example'] = {};
```

## Installing a Sandbox Module

  1. Visit the [Sandbox Module page](http://drupalgap.org/project/modules/sandbox) to locate a sandbox module
  2. Follow steps 2-4 in the *Installing a Contributed Module* section above.
