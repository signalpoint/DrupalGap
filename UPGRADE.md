This document describes how to update your mobile application from one minor
version of DrupalGap to another.

# settings.js

  Whenever updating DrupalGap, be sure to make a backup of your settings.js file
  then replace it with the default.settings.js file. Then you must re-add any
  modifications you made to your settings.js file (i.e. site_path, etc).

# index.html

  Whenever updating DrupalGap, be sure to make a backup of your index.html file
  then replace it with the contents of the newest default.index.html file. Then
  you must re-add any modifications you made to your index.html file.

# Clear Local Storage Cache

  It is important to clear your device (or browser) local storage cache. On a
  device, this can typically be accomplished by uninstalling the App completely,
  then re-installing it. If you're using Ripple in Chrome, then clear the
  Chrome web browser cache.

# DrupalGap Module

  Be sure you are running the latest recommended version of the DrupalGap module
  on your Drupal site. If you are using development snapshots of the DrupalGap
  mobile application development kit, you may need to use the dev version of the
  DrupalGap module alongside it.

# Version Change Notes for Developers

## 7.x-1.2 => 7.x-1.3

The following internal global string variables have been replaced:

 - `_views_embed_view_selector`
 - `_views_embed_view_results`
 - `_views_embed_view_options`
 - `_views_exposed_filter_query`
 - `_views_exposed_filter_reset`
 - `_views_exposed_filter_submit_variables`
 
If you used those values or set those values in any way (very unlikely), there
are now getter and setter functions to use instead:

**OLD WAY**
```

// Getting.
var selector = _views_embed_view_selector;
var results = _views_embed_view_results;
var options = _views_embed_view_options;
var query = _views_exposed_filter_query;
var reset = _views_exposed_filter_reset;
var submit_variables = _views_exposed_filter_submit_variables;

// Setting.
_views_embed_view_selector = selector;
_views_embed_view_results = results;
_views_embed_view_options = options;
_views_exposed_filter_query = query;
_views_exposed_filter_reset = reset;
_views_exposed_filter_submit_variables = submit_variables;

```

**NEW WAY**
```

// Getting.
var selector = views_embedded_view_get(page_id, 'selector');
var results = views_embedded_view_get(page_id, 'results');
var options = views_embedded_view_get(page_id, 'options');
var query = views_embedded_view_get(page_id, 'exposed_filter_query');
var reset = views_embedded_view_get(page_id, 'exposed_filter_reset');
var submit_variables = views_embedded_view_get(page_id, 'exposed_filter_submit_variables');

// Setting.
views_embedded_view_set(page_id, 'selector', selector);
views_embedded_view_set(page_id, 'results', results);
views_embedded_view_set(page_id, 'options', options);
views_embedded_view_set(page_id, 'exposed_filter_query', query);
views_embedded_view_set(page_id, 'exposed_filter_reset', reset);
views_embedded_view_set(page_id, 'exposed_filter_submit_variables', submit_variables);

```

## 7.x-1.0-rc4 => 7.x-1.0-rc5

### Build Web Apps by Default

The DrupalGap SDK default.settings.js file now defaults to using the `web-app`
mode. This was done to make DrupalGap 99% easier to get started with, since it
can now run in any modern browser. Simply switch the mode back to `phonegap` to
run as a mobile application instead.

## 7.x-1.0-rc3 => 7.x-1.0-rc4

### New page.tpl.html placeholder token required

All themes must update their page.tpl.html file to include a single placeholder
for the div container attributes.

**OLD WAY**
```
<div id="{:drupalgap_page_id:}" data-role="page" class="{:drupalgap_page_class:}">
  <!-- ... -->
</div>
```

**NEW WAY**
```
<div {:drupalgap_page_attributes:}>
  <!-- ... -->
</div>
```

## 7.x-1.0-rc2 => 7.x-1.0-rc3

### Views row_callback row position has moved

The `row_callback` function is now passed the row position in a different within
a different variable (@see http://www.drupalgap.org/node/219):

**OLD WAY**
```
function my_module_articles_list_row(view, row) {
  return 'The position for this row is: ' + row.count;
}
```

**NEW WAY**
```
function my_module_articles_list_row(view, row) {
  return 'The position for this row is: ' + row._position;
}
```

## 7.x-1.0-rc1 => 7.x-1.0-rc2

  Required select lists now use an empty string value instead of -1 for the
  placeholder option. Any custom form validation you may have used that
  depended on this -1 value, needs to check for an empty string now instead.

## 7.x-1.7-alpha => 7.x-1.8-alpha

  The user-profile.tpl.html file now contains a {:content:} placeholder to
  properly render a user account's content. If you have a custom theme, update
  your user-profile.tpl.html file to include this placeholder. See the
  core easystreet3 theme's user-profile.tpl.html file for example usage. 

  The page.tpl.html files for themes now should include a class name placeholder
  on their page's container div. For example, the easystreet3 theme's
  page.tpl.html file now contains this class attribute placeholder:
  
    class="{:drupalgap_page_class:}"

  jQueryMobile has been updated to 1.4.2, be sure to update any custom theme's
  index.html files to use this new version. See default.index.html file for an
  example.
  
  jDrupal has been updated to 1.0-rc3, be sure to update any custom theme's
  index.html files to use this new version. See default.index.html file for an
  example.

7.x-1.6-alpha => 7.x-1.7-alpha

  Now that we've upgraded to jQueryMobile 1.4, there are only two (instead of 5)
  data themes available. All apps will look different (but better and cleaner)
  when upgrading.
  
  ---

  One big change is that DrupalGap now utilizes jDrupal, a JavaScript Library
  for Drupal with a RESTful API for Services.

  Some drupalgap.settings variables have been moved to the Drupal.settings
  namespace because we are now using jDrupal. Update your settings from/to:
  
    drupalgap.settings.site_path => Drupal.settings.site_path
    drupalgap.settings.base_path => Drupal.settings.base_path
    drupalgap.settings.file_public_path => Drupal.settings.file_public_path;
    drupalgap.settings.cache.entity => Drupal.settings.cache.entity
    drupalgap.settings.cache.entity.enabled => Drupal.settings.cache.entity.enabled
    drupalgap.settings.cache.entity.expiration => Drupal.settings.cache.entity.expiration

  The following settings have been changed from/to:
  
    drupalgap.settings.default_services_endpoint => Drupal.settings.endpoint
    drupalgap.settings.language => Drupal.settings.language_default
  
  Any use of drupalgap.settings.language should be replaced with a call to the
  new function language_default().

  The following setting(s) have been deprecated:
  
    clean_urls

  ---

  drupalgap.views_datasource has been deprecated, instead use a call to
  views_datasource_get_view_result(). For example, before you would make a Views
  Datasource call like this:

    var options = {
      path: 'my_view_url',
      success: function(result){ /* ... */}
    };
    drupalgap.views_datasource.call(options);

  Now you make the call like this:

    views_datasource_get_view_result('my_view_url', {
        success: function(result) {
          /* ... */
        }
    });
  
  ---

  The node.tpl.html and user-profile.tpl.html files have been moved out of there
  core module folders and now live in the easystreet3 theme folder. Anyone who
  has implemented a custom theme needs to add these two .tpl.html files to their
  theme's folder.

  ---
  
  The modules system has moved out of DrupalGap and into jDrupal. So you need to
  update your settings.js file to load the modules into jDrupal. In your
  settings.js file, replace all occurrences of "drupalgap.modules" with
  "Drupal.modules". View the app/default.settings.js file to see the new syntax
  you must use in your app/settings.js file to load modules.

  ---

  The DrupalGap module now provides a "Display Mode" for your content types. For
  example, the Article content type that comes packaged with Drupal now has a
  custom display called "DrupalGap":
  
    admin/structure/types/manage/article/display/drupalgap

  By default, all DrupalGap display modes show nothing. You must specify what
  fields, labels and formats to use on your content types when they are
  displayed in your mobile app.
  
  For more information on Display Modes visit:
  
    http://drupalgap.org/node/184

  ---

  Loading entities from the server has changed from synchronous to asynchronous.
  This means that any time you load an entity, it will be loaded asynchronously
  and you must provide a success callback to use the retrieved entity. For
  example, before you could simply use:
  
    var node = node_load(123);
  
  Now that it is an asynchronous call, code like this would be used instead to
  retrieve a node:
  
    node_load(123, {
        success:function(node){
          alert('Loaded: ' + node.title);
        }
    });
  
  This change includes all core entity types. So any previous calls to
  node_load(), comment_load(), file_load(), user_load(), taxonomy_term_load(),
  etc must all be replaced with an asynchronous usage like the example code
  above.
  
  ---
  
  Now that entities are loaded asynchronously, the page title_callback system
  needed to be changed to asynchronous as well. For example, before we could
  create a title_callback for a custom page like this:
  
    function my_module_menu() {
      var items = {
        my_page:{
          title:'My Page',
          page_callback:'my_page_callback',
          title_callback:'my_page_title_callback',
          title_arguments:['Good Monkey']
        }
      };
      return items;
    }
    
    function my_page_title_callback(my_arg) {
      return my_arg.replace('Good', 'Bad');
    }
  
  Now the title_callback for the above example would be implemented like this:
    
    function my_page_title_callback(callback, my_arg) {
      callback.call(null, my_arg.replace('Good', 'Bad'));
    }
  
  As you can see, title_callback implementations now take a 'callback' argument
  that needs to be called with your custom title so the page title will be
  properly set.
  
  ---
  
  js_yyyy_mm_dd_hh_mm_ss() has been renamed to date_yyyy_mm_dd_hh_mm_ss().
  
  ---
  
  The drupalgap.settings.loading variable has been renamed to
  drupalgap.settings.loader and now contains two default modes, one for saving
  and one for loading. View the default.settings.js file for details.
  
  ---
  
  The user_login form and user_register form have had their form ids renamed to
  user_login_form and user_register_form. Any hook_form_alter() implementations
  that modified these forms, need to update the form id used to properly make
  the alterations.

7.x-1.5-alpha => 7.x-1.6-alpha

  The 'header' system block has been renamed to 'title'. In your settings.js
  file, you'll need to update your "Blocks" settings to use the 'title' block
  instead of the 'header' block. FYI, this block is used to display the page
  title.
  
  ---

  The 'navigation' and 'management' system menus have been deprecated. If you
  were using these menus at all in settings.js, the menus will still work as is,
  they will now just be considered a 'custom' menu instead. If you were using
  either of these menus programmatically, just create an empty custom menu
  in settings.js using the 'navigation' or 'management' machine name, and that
  will bring these menus back for you.

  ---

  See https://github.com/signalpoint/DrupalGap/issues/119 for information about
  adjusting any custom forms you may have previously created in a module. Now,
  the form and form_state will be passed to the form generation function. Your
  form generation functions should now MODIFY the form object and return it. No
  longer do you CREATE the form and return it. Read the Forms documentation for
  more details on creating forms. http://drupalgap.org/node/76
  
  ---
  
  The structure of the default.settings.js file has changed from being one giant
  JSON object to a much more manageable set of lines of code. It is recommended
  to immediately migrate your settings.js file to match the new struture of the
  default.settings.js file. Once that is complete, the settings.js file is much
  easier to maintain and work with now!

7.x-1.4-alpha => 7.x-1.5-alpha

  No architectural changes were made, this upgrade path should be clean.

7.x-1.3-alpha => 7.x-1.4-alpha

  Inside index.html, the use of cordova-2.x.js has been removed, as of version
  2.8 of PhoneGap, it appears they just use cordova.js for consistancy. So we
  will use that too, instead of using cordova-2.x-js

  The drupalgap.title variable has been deprecated. It has been replaced by
  drupalgap.page.title and should instead be set and retrieve by
  drupalgap_set_title() and drupalgap_get_title().
  
  The drupalgap.path variable should now be accessed and set with the following
  two functions: drupalgap_path_get() and drupalgap_path_set('foo').
  
  The drupalgap_get_current_path() has been deprecated, use drupalgap_path_get()
  instead.
  
  The drupalgap.settings.cache variable has been introduced, be sure to add it
  to your settings.js file (you'll find its default values in
  default.settings.js).
  
  The drupalgap_user_access() function has been renamed to user_access() and it
  now just takes in a string with a permission name, it no longer takes in a
  JSON object with a permission property/value.

7.x-1.2-alpha => 7.x-1.3-alpha

  Any themes created prior to 7.x-1.3-alpha need to have their template_info()
  hook updated to match the new region naming convention. The regions are now
  keyed by name and will have their 'name' property automatically set. We made
  this change so regions could easily be accessed
  (e.g. drupalgap.theme.regions.header) instead of having to iterate over all
  regions looking for a specific name. See themes/easystreet3/easystreet3.js
  for example code.
  
  hook_device_online() has been renamed to hook_deviceready()

