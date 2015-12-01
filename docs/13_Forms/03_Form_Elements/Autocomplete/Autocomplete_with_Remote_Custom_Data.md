To use a custom `hook_menu()` path on your Drupal site to provide data for an autocomplete, try something like this:

## Drupal Module

Place this code into your custom *Drupal module*:

```
/**
 * Implements hook_menu().
 */
function my_module_menu() {
 $items['example/autocomplete'] = array(
    'page callback' => '_my_module_autocomplete',
    'access arguments' => array('access content'),
    'type' => MENU_CALLBACK
  );
  return $items;
}
```

Then implement the page callback function in the module:

```
function _my_module_autocomplete() {
  $title = $_GET['title'];
  $limit = $_GET['limit'] ? $_GET['limit'] : 10;
  $results = db_select('node', 'n')
    ->fields('n', array('nid', 'title'))
    ->condition('title', db_like($title) . '%', 'LIKE')
    ->condition('type', 'article')
    ->range(0, $limit)
    ->execute()
    ->fetchAll();
  drupal_json_output($results);
  drupal_exit();
}
```

Note, your page callback must return an array of objects, similar to the output provided above, which would look something like this:

`[{"nid":"176","title":"Hello World"},{"nid":"207","title":"How to Drupal"}]`

## App

Place this code into your custom DrupalGap module to create a custom page:

```
/**
 * Implements hook_menu().
 */
function my_module_menu() {
  var items = {};
  items['my_autocomplete'] = {
    title: 'Autocomplete',
    page_callback: 'my_module_autocomplete_page'
  };
  return items;
}
```

Then implement the page callback:

```
/**
 * My autocomplete page callback.
 */
function my_module_autocomplete_page() {
  try {
    var content = {};
    content.my_autocomplete = {
      theme: 'autocomplete',
      remote: true,
      custom: true,
      path: 'example/autocomplete',
      value: 'nid',
      label: 'title',
      filter: 'title',
      params: 'limit=5'
    };
    return content;
  }
  catch (error) { console.log('my_module_autocomplete_page - ' + error); }
}
```

Notice how we set `custom` to `true`, and pass along additional parameters using `param`.

This code produces an autocomplete that functions identically to the [Autocomplete with Remote Views JSON Data](Autocomplete_with_Remote_Views_JSON_Data) example.