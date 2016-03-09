This page describes how to display a View in a table using a `pageshow` callback from a `hook_menu()` implementation.

```
/**
 * Implements hook_menu()
 */
function my_module_menu() {
  var items = {};
  items['articles'] = {
    title: 'My Custom Page',
    page_callback: 'my_module_articles_page',
    pageshow: 'my_module_articles_pageshow'
  };
  return items;
}

/**
 * Page callback.
 */
function my_module_articles_page() {
  var header = [];
  header.push({data: 'id'});
  header.push({data: 'Subject'});
  var rows = [];
  var content = {};
  content['my_article_table'] = {
    theme: 'table',
    header: header,
    rows: rows,
    attributes: {
      id: 'my_article_table'
    }
  };
  return content;
}
```

This will create a page with an empty table. Next we need to retrieve the results from the View and populate the table. We'll do that by utilizing the `pageshow` callback for our page:

```
/**
 * Pageshow callback.
 */
function my_module_articles_pageshow() {
  var path_to_view = 'my-articles';
  views_datasource_get_view_result(path_to_view, {
      success: function(data) {
        if (data.nodes.length == 0) { return; }
        var items = [];
        $.each(data.nodes, function(index, object){
            var node = object.node;
            items.push(node.id, l(node.title, 'node/' + node.nid));
        });
        drupalgap_table_populate("#my_article_table", items);
      }
  });
}
```

Now if we navigate to the path `articles` in DrupalGap, our page will be displayed, then the `pageshow` callback will ask Views for the results, then add them to the table.