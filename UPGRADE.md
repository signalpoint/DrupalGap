# 7.x-1.x => 7.x-2.x

This document describes the code changes between DrupalGap 7.x-1.x (powered by
jQuery Mobile) and 7.x-2.x (powered by Angulas JS).

## Drupal.settings
The Drupal.settings JSON object no longer exists, it has been replaced by an
Angular module config value.
```
// old way
alert(Drupal.settings.site_path);
// new way
var drupalSettings = dg_ng_get('drupalSettings');
alert(drupalSettings.site_path);
```

## Drupal.user
```
// old way
alert('Hi user # ' + Drupal.user.uid);
// new way
var user = dg_user_get();
alert('Hi user # ' + user.uid);
```

## hook_field_formatter_view()
// @TODO is this still happening?
Uses element objects in 1.x, uses element arrays in 2.x:
```
var element = { 0: { theme: 'foo', ... } }; // old way
var element = [ { theme: 'foo', ... }]; // new way
```
## Custom Modules
```

```

### hook_menu()
```
// old way
function my_module_menu() {
  var items = {};
  items['foo'] = {
    title: 'Foo',
    page_callback: 'foo_page'
  };
  return items;
}
// new way
angular.module('my_module', ['drupalgap'])
.config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/foo', {
          templateUrl: 'themes/spi/page.tpl.html',
          controller: 'dg_page_controller',
          page_callback: 'foo_page'
      });
}]);
```
