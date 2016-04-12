With `page_arguments`, we can create dynamic paths for [custom pages](Creating_a_Custom_Page) and [page events](Page_Events). This allows us to use one path to handle a wide variety of contexts about users, nodes, views contextual filters, etc.

Say for example we wanted to create a user dashboard that was unique to each Drupal user account. We'll make our page path handle a page like this: `user-dashboard/123`, where `123` is the id of a Drupal user account. Looking at this path, we can split it into two parts:

- `user-dashboard` (part 0)
- `123` (part 1)

Since we want to pass along `123` to our `page_callback`, we identify part `1` of the path to pass along to our custom page:

### my_module.js
```
/**
 * Implements hook_menu().
 */
function my_module_menu() {
  var items = {};
  items['user-dashboard/%'] = {
    title: 'User dashboard',
    page_callback: 'my_module_user_dashboard_page',
    page_arguments: [1],
    pageshow: 'my_module_user_dashboard_pageshow'
  };
  return items;
}

/**
 * The user dashboard page callback.
 * @param uid
 * @returns {{}}
 */
function my_module_user_dashboard_page(uid) {
  var content = {};

  // Build an empty container where the user dashboard will go.
  var attributes = {
    id: my_module_user_dashboard_container_id(uid),
    class: 'user-dashboard'
  };
  content['my_widget_container'] = {
    markup: '<div ' + drupalgap_attributes(attributes) + '>' +
      'Loading dashboard...' +
    '</div>'
  };

  return content;
}

/**
 * The user dashboard pageshow event handler.
 * @param uid
 */
function my_module_user_dashboard_pageshow(uid) {

  // Load the user account...
  user_load(uid, {
    success: function(account) {

      // Render their dashboard.
      var msg = theme('header', {
        text: account.name
      });

      // Inject it into the container.
      var container_id = my_module_user_dashboard_container_id(uid);
      $('#' + container_id).html(msg).trigger('create');

    }
  });
}

/**
 * Returns a unique html element id to use for an individual user's dashboard div container.
 * @param uid
 * @returns {string}
 */
function my_module_user_dashboard_container_id(uid) {
  return 'user-dashboard-' + uid;
}
```

## Other Techniques

Using the `pageshow` and `page_arguments` technique listed above, we can also easily load nodes or any other type of entity. Keep in mind **DrupalGap already has built in pages** for the following paths to allow for easy creation, viewing and editing of entities:

- `node/%`, `node/%/view`, `node/%/edit`
- `node/add`, `node/add/%`
- `user/%`, `user/%/view`, `user/%/edit`
- `comment/%`, `comment/%/view`, `comment/%/edit`
- `taxonomy/%`, `taxonomy/%/view`, `taxonomy/%/edit`
- `taxonomy/vocabulary/%`, `taxonomy/vocabulary/%/view`, `taxonomy/vocabulary/%/edit`

We can also [manually display a Views JSON](../Views/Displaying_a_View/Manually_Display_View) using this same technique, or for more power use a [Views Render Array](../Views/Displaying_a_View/Views_Render_Array).