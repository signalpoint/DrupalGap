With `hook_add_page_to_dom_alter()`, we can change the page's attributes and/or options before it is added to the DOM.

```
/**
 * Implements hook_add_page_to_dom_alter().
 */
function my_module_add_page_to_dom_alter(attributes, options) {

  // Add a custom class to the page indicating the device size. Place
  // empty spaces around the class name so we don't collide with others.
  var size = null;
  var width = $(window).width();
  if (width <= 414) { size = 'small'; }
  else if (width < 1024) { size = 'medium'; }
  else { size = 'large'; }
  attributes.class += ' ' + size + ' ';

  // Add a custom page class name to a particular route.
  if (drupalgap_router_path_get() == 'channel/%') {
    attributes.class += ' foo-bar ';
  }

}
```

