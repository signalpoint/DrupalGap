## Installing a Contributed Module

 1. Visit the [Modules page](http://drupalgap.org/project/modules) to locate a contributed module
 2. Download a tag of the module from the project home page on GitHub
 3. Place the module in `www/app/modules` (*not in www/modules*)
 4. Tell DrupalGap about the module in `settings.js`:

```
/** Contributed Modules - www/app/modules **/
Drupal.modules.contrib['example'] = {};
```

DrupalGap will automatically load your module's JavaScript file into the app.

### Module options

For custom modules, use `custom` instead of `contrib` and place your modules into the `app/modules/custom` folder.

```
Drupal.modules.contrib['example'] = {

  // Set to true if the module contains a example.min.js file.
  minified: false,

  // Set to true to tell DrupalGap the module will be manually
  // included via index.html
  loaded: false
  
};
```

When using the `loaded` option as `true`, you can include your module's JavaScript file(s) manually within the `index.html` file's `<head>`:

```
<head>
   <!-- Other stuff... -->
   <script type="text/javascript" src="app/modules/contrib/example/example.js"></script>
   <!-- More stuff... -->
</head>
```

By default DrupalGap uses `false` as the value for `loaded` and will attempt to automatically load your module's JavaScript file into the DOM.
