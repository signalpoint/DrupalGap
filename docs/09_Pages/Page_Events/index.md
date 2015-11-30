## jQuery Mobile Page Events

jQuery Mobile has page events that are fired when navigating to a page in our mobile application. So it is natural to want handle these events on the pages.

[http://api.jquerymobile.com/category/events/](http://api.jquerymobile.com/category/events/)

By utilizing hook_menu() in DrupalGap, we can attach handlers to any jQM page event that happens on our app's page. For example, say we created a simple page in DrupalGap via hook_menu() and wanted to handle the jQM pageshow event with some custom code, then we could do something like this in our custom DrupalGap module:

```
/**
 * Implements hook_menu()
 */
function my_module_menu() {
  var items = {};
  items['my_page'] = {
    title:'My Custom Page',
    page_callback: 'my_custom_page',
    pageshow: 'my_custom_page_pageshow'
  };
  return items;
}

function my_custom_page() {
  var content = {};
  content['my_stuff'] = {
    markup: '<p>Nice stuff!</p>'
  };
  return content;
}

function my_custom_page_pageshow() {
  drupalgap_alert('My pageshow event has been called!');
}
```

Now when we navigate to 'my_page' in DrupalGap, the jQM pageshow event will be fired and our handler function will be called.

DrupalGap supports the following jQM page events:

- pagebeforechange
- pagebeforecreate
- pagebeforehide
- pagebeforeload
- pagebeforeshow
- pagechange
- pagechangefailed
- pagecreate
- pagehide
- pageinit
- pageload
- pageloadfailed
- pageremove
- pageshow

To use any of these page events on a page, simply add one or more of them to your hook_menu implementation and then specify a function to handle each event.