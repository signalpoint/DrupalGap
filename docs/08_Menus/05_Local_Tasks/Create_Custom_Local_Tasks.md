Sometimes we need to go beyond adding a custom local task to the View and Edit local tasks on Nodes and Users. Maybe we want our own completely custom set of local tasks separate from the ones built into DrupalGap core. Luckily with `hook_menu()`, we can do just that.

Let's take a look at an example of creating multiple local tasks. For this example we'll be creating a set of pages for a trip (e.g. vacation). One page to see information for before the trip, one for information during the trip, and one for after the trip:

![Local Tasks Example](http://drupalgap.org/sites/default/files/custom-local-tasks.png)

```
/**
 * Implements hook_menu().
 */
function my_module_menu() {
  try {
    var items = {};
    items['my-trip/%'] = {
      title: 'Before',
      page_callback: 'my_module_trip_before_page',
      page_arguments: [1]
    };
    items['my-trip/%/before'] = {
      type: 'MENU_DEFAULT_LOCAL_TASK',
      title: 'Before'
    };
    items['my-trip/%/during'] = {
      type: 'MENU_LOCAL_TASK',
      title: 'During',
      page_callback: 'my_module_trip_during_page',
      page_arguments: [1]
    };
    items['my-trip/%/after'] = {
      type: 'MENU_LOCAL_TASK',
      title: 'After',
      page_callback: 'my_module_trip_after_page',
      page_arguments: [1]
    };
    return items;
  }
  catch (error) {
    console.log('my_module_menu - ' + error);
  }
}
```

Now if we were to navigate to any of the following pages in the app, each page would be routed to its particular `page_callback` and passed along the argument at position 1 in the path:

- my-trip/123
- my-trip/123/during
- my-trip/123/after

In each of these cases, the `page_callback` will be passed `123` since it is in the first argument position. It's important to realize the main benefit of utilizing local tasks, and that is its ability to hold onto the context of `123` between each page. This allows us to have menu links, with dynamic path arguments, cool!

It is up to us how we utilize the integer argument. We could utilize it as a node id, a user id, any entity id for that matter. Or it could be a completely different usage of an id, no matter what though, our context is held across each menu tab.

Here are some very simple `page_callback` implementations for our local task paths:

```
/**
 *
 */
function my_module_trip_before_page(id) {
  try {
    var content = {};
    content['before_intro'] = {
      markup: '<p>Before intro...</p>'
    };
    return content;
  }
  catch (error) { console.log('my_module_trip_before_page - ' + error); }
}

/**
 *
 */
function my_module_trip_during_page(id) {
  try {
    var content = {};
    content['during_intro'] = {
      markup: '<p>During intro...</p>'
    };
    return content;
  }
  catch (error) { console.log('my_module_trip_during_page - ' + error); }
}

/**
 *
 */
function my_module_trip_after_page(id) {
  try {
    var content = {};
    content['after_intro'] = {
      markup: '<p>After intro...</p>'
    };
    return content;
  }
  catch (error) { console.log('my_module_trip_after_page - ' + error); }
}
```