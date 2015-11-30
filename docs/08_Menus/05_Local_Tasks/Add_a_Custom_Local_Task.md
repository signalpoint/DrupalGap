

This section contains examples on how to place a custom local task (menu tab) link within your app. Alternatively, you can [create your own custom local task set](Create_Custom_Local_Tasks).

## Node Local Tasks

In this example, we want to place a custom local task called **Salsa** in certain spots:

![Node Local Task](http://drupalgap.org/sites/default/files/node-local-task.png)

Remember, that the **View** local task is provided by DrupalGap core, so we're going to group our local task with it. Did you notice the **Edit** button is not there? That's because in this particular screen shot the user does not have permission to edit the node, so the **Edit** local task is automatically hidden.

Let's build the Salsa page and its local task:

```
/**
 * Implements hook_menu().
 */
function my_module_menu() {
  try {
    var items = {};
    items['node/%/salsa'] = {
      title: 'Salsa',
      type: 'MENU_LOCAL_TASK',
      page_callback: 'my_module_salsa_page',
      page_arguments: [1],
      title_callback: 'my_module_salsa_page_title',
      title_arguments: [1],
      access_callback: 'my_module_salsa_page_access',
      access_arguments: [1],
    };
    return items;
  }
  catch (error) {
    console.log('my_module_menu - ' + error);
  }
}

/**
 *
 */
function my_module_salsa_page(nid) {
  try {
    var content = {};
    // Build the widgets for your page...
    content['my_salsa'] = {
      theme: 'button',
      text: 'More info',
      attributes: {
        onclick: "drupalgap_alert('It is delicious!');"
      }
    };
    return content;
  }
  catch (error) { console.log('my_module_salsa_page - ' + error); }
}

/**
 *
 */
function my_module_salsa_page_access(node) {
  try {
    // Only show the local task on article nodes, that have the word "taco" in
    // the title.
    if (
      node.type == 'article' &&
      node.title.toLowerCase().indexOf('taco') != -1
    ) { return true; }
    return false;
  }
  catch (error) { console.log('my_module_salsa_page_access - ' + error); }
}
```

Now if someone were to visit any article that has the word "Taco" or "taco" in it, there would be a local task placed on the page called Salsa. When it is clicked, the node id will be fed into our `page_callback` function. We could then use that node id as a contextual filter with a View to retrieve whatever data we need.

## User Local Tasks

Say for example we wanted to place an Articles local task (menu tab link) across the tops of the user account pages. When the tab is clicked, we want it to a show a page with a list of the user's articles.

![User Local Tasks](http://drupalgap.org/sites/default/files/user-local-tasks-articles_0.png)

We also want the title of the page (e.g. "tyler's articles") to be dynamic, in that it responds to the context of the user account. Additionally, for this example we'd like the local task only to show up when viewing administrator accounts.

DrupalGap comes with the View and Edit local tasks, so we can add our tab alongside them. We would do this via `hook_menu()` in our custom module:

```
/**
 * Implements hook_menu().
 */
function my_module_menu() {
  try {
    var items = {};
    items['user/%/articles'] = {
      title: 'Articles',
      type: 'MENU_LOCAL_TASK',
      page_callback: 'my_module_user_articles_page',
      page_arguments: [1],
      title_callback: 'my_module_user_articles_title',
      title_arguments: [1],
      access_callback: 'my_module_user_articles_access',
      access_arguments: [1]
    };
    return items;
  }
  catch (error) {
    console.log('my_module_menu - ' + error);
  }
}
```

Notice we used `MENU_LOCAL_TASK` for the type, this is because the `MENU_DEFAULT_LOCAL_TASK` is already specified by DrupalGap core, so we're just adding to this set of local task menu tabs.

Now we could implement the page to load and display a list of articles published by the user. This page would be powered by a View JSON page display in Drupal that:

- shows published content of type Article
- has a page path of: user-articles
- shows the following fields: nid, title
- sorts by content post date, descending
- has a content author id contextual filter

Here's the code that would display the *Articles* page:

```
/**
 *
 */
function my_module_user_articles_page(uid) {
  try {
    var content = {};
    content['user_articles'] = {
      theme: 'view',
      format: 'ul',
      path: 'user-articles/' + uid, /* the path to the View in Drupal */
      row_callback: 'my_module_user_articles_row',
      empty_callback: 'my_module_user_articles_empty',
      attributes: {
        id: 'user_articles_view_' + uid
      }
    };
    return content;
  }
  catch (error) { console.log('my_module_user_articles_page - ' + error); }
}

/**
 *
 */
function my_module_user_articles_row(view, row) {
  try {
    return l(row.title, 'node/' + row.nid);
  }
  catch (error) { console.log('my_module_user_articles_row - ' + error); }
}

/**
 *
 */
function my_module_user_articles_empty(view) {
  try {
    return 'Sorry, no articles were found.';
  }
  catch (error) { console.log('my_module_user_articles_empty - ' + error); }
}

/**
 *
 */
function my_module_user_articles_title(callback, uid) {
  try {
    user_load(uid, {
        success: function(account) {
          callback.call(null, account.name + "'s articles");
        }
    });
  }
  catch (error) { console.log('my_module_user_articles_title - ' + error); }
}

/**
 *
 */
function my_module_user_articles_access(account) {
  try {
    if (drupalgap_user_has_role('administrator', account)) {
      return true;
    }
    return false;
  }
  catch (error) { console.log('my_module_user_articles_access - ' + error); }
}
```

Notice how we appended an underscore and the uid to the Views Render Array id? This is because as we navigate through the app and view different user profiles, we need a unique id for each widget.

Feel free to adjust your titles and access controls as needed.

- Visit [Page Titles](../../Pages/Page_Titles) for more information about setting the title of a page
- Check out [Menu Link Access Callback]() for more info on controlling access to a local task page and menu link
