Although DrupalGap can [display most entities](../Pages/Built_in_Pages) out of the box, and we can override the output of a node page using [hook_node_page_view_alter_TYPE()](http://api.drupalgap.org/7/global.html#hook_node_page_view_alter_TYPE), we can still make our own custom page(s) to both load and render an entity.

For example, say we had a content type called **Team**, we could display team nodes like this:

```
/**
 * Implements hook_menu().
 */
function example_menu() {
  var items = {};
  items['team/%'] = {
    page_callback: 'drupalgap_get_entity',
    page_arguments: ['my_module_team_page', 'node', 1]
  };
  return items;
}

function my_module_team_page(node) {
  var content = {};
  content['title'] = { markup: node.title };
  return content;
}
```

You may optionally pass a *unique* 4th `page_argument` as a string, should you need to use this same technique on a different `hook_menu()` item. For example:
 
```
function example_menu() {
  var items = {};
  items['team/%'] = {
    page_callback: 'drupalgap_get_entity',
    page_arguments: ['my_module_team_page', 'node', 1, 'team']
  };
  items['manage-team/%'] = {
    page_callback: 'drupalgap_get_entity',
    page_arguments: ['my_module_manage_team_page', 'node', 1, 'manage']
  };
  return items;
}
```

For a similar example with user accounts, [see this comment](https://github.com/signalpoint/DrupalGap/issues/845#issue-173522542).

The example above is actually a new feature that was built after doing the same thing over and over again, which is the example listed below.

The example below provides complete control over the process, whereas the above example is essentially short hand for this: 

```
/**
 * Implements hook_menu().
 */
function example_menu() {
  var items = {};
  items['team/%'] = {
    title: 'Team',
    title_callback: 'example_team_title_callback',
    title_arguments: [1],
    page_callback: 'example_team_page',
    pageshow: 'example_team_pageshow',
    page_arguments: [1]
  };
  return items;
}


function example_team_title_callback(callback, nid) {
  node_load(nid, {
    success: function(node) {
      callback.call(null, node.title);
    }
  });
}

function example_team_container_id(nid) {
  return 'example-team-' + nid;
}

function example_team_page(nid) {
  return '<div id="' + example_team_container_id(nid) + '"></div>';
}

function example_team_pageshow(nid) {
  node_load(nid, {
    success: function(node) {
      var content = node.title; // Add other content here...
      $('#' + example_team_container_id(nid)).html(content).trigger('create');
    }
  });
}
```
