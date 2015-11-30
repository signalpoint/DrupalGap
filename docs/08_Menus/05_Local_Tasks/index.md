Also checkout [menu links with dynamic paths](Menus_with_Dynamic_Links), for a more flexible solution than local tasks.

## Overview

With local tasks we can display menu tabs across a set of pages. A simple example of this on our Drupal website would be if we were viewing a node with a title of **Taco Tuesday**, then we would typically see the View and Edit tabs across the top of the page (when we're logged in as an admin):

![Drupal Local Tasks](http://drupalgap.org/sites/default/files/local-tasks_0.png)

The same idea applies to the View and Edit tabs we see on user profile pages on our Drupal site. These also are referred to as local tasks, and Drupal comes built in with various local tasks across all entity types (nodes, users, comments, vocabularies, terms).

DrupalGap utilizes this same concept, and allows us to place local task menu tabs across sets of pages. Similarily, DrupalGap comes pre-built with local task menu tabs across the core entity types. Here we see same View and Edit node local tasks DrupalGap:

![DrupalGap Local Tasks](http://drupalgap.org/sites/default/files/node-local-tasks.png)

Let's take a look at some example local task page paths:

```
node/%/view
node/%/edit
user/%/view
user/%/edit
```

The `%` is a placeholder for an integer argument. This allows us to easily view and edit different types of entities, by utilizing their entity id in the page path, for example:

```
node/123/view
node/123/edit
user/456/view
user/456/edit
```

The key to understanding local tasks is that when we navigate to a path like `node/123`, the View and Edit menu links (local tasks) will automatically have the entity id filled into the % placeholder. This allows us to hold onto which entity we are dealing with, as we navigate across the menu tabs.

You may have noticed that `node/%` and `node/%/view` are equivalent, this is because the first local task menu tab is always attached to a pre-existing page path. All other tabs have their own unique page path. Let's take a look at how the node local tasks are built in DrupalGap.

## An Example (from DrupalGap Core)

In DrupalGap core, there is a `node_menu()` function, which is an implementation of `hook_menu()`.

Using these menu link items, we're able to craft the pages in the app to view and edit nodes, and have the local task menu tabs show up across the top of the pages. Let's take a look at a simplified version of the actual code:

```
/**
 * Implements hook_menu().
 */
function node_menu() {
  var items = {};
  items['node/%'] = {
    page_callback: 'node_page_view',
    page_arguments: [1]
  };
  items['node/%/view'] = {
    type: 'MENU_DEFAULT_LOCAL_TASK',
    title: 'View'
  };
  items['node/%/edit'] = {
    page_callback: 'node_page_edit',
    page_arguments: [1],
    type: 'MENU_LOCAL_TASK',
    title: 'Edit'
  };
  return items;
}
```

Here's what we did...

1. Add page to view nodes with a path of `node/%`
2. Add a default local task menu tab with a path of `node/%/view`, which will auto refer to its parent path, `node/%`
3. Add another page for editing nodes with a path of `node/%/edit`, and set it as a local task menu tab

Now when we visit a page like `node/123`, this path is made up of two arguments (remember, we start counting at zero):

1. argument 0: **node**
2. argument 1: **123**

This page is then routed to `node/%` and...

1. The node/% page callback function is called to display the node on a page
2. 123 is passed to the page callback function as an argument (because we said pass the argument in position #1 by using page_arguments[1])
3. The View default local task node/%/view is automatically added to the page, and filled in with node/123/view path
4. The Edit local task node/%/edit is automatically added to the page, and filled in with node/123/edit path

This same technique is used across all core entity types, so we can View and Edit tabs when needed.

## Displaying Local Tasks

DrupalGap comes with a `primary_local_tasks` menu block. Just [add the block to a region of your theme](../Blocks/Adding_Block_Region). For example, we could add the block to the navigation region of our theme in the `settings.js` file:

```
// My Theme's Blocks
drupalgap.settings.blocks['my_theme'] = {

  /* ... other regions ... */

  navigation: {

    /* ... other blocks ... */

    primary_local_tasks: { },

    /* ... other blocks ... */

  },

  /* ... other regions ... */

};
```