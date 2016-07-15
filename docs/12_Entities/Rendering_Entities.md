Although DrupalGap can [display most entities](../Pages/Built_in_Pages) out of the box, and we can override the output of a node page using [hook_node_page_view_alter_TYPE()](http://api.drupalgap.org/7/global.html#hook_node_page_view_alter_TYPE), we can still make our own custom page(s) to both load and render an entity.

For example, say we had a content type called **Team**, we could display team nodes like this:

```
/**
 * Implements hook_menu().
 */
function example_menu() {
  try {
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
  catch (error) { console.log('example_menu - ' + error); }
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
