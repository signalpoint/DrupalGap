This page describes how to display a View using a `pageshow` callback from a `hook_menu()` implementation.

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
  var content = {};
  content['my_article_list'] = {
    theme: 'jqm_item_list',
    title: 'My Article List',
    items: [],
    attributes: { id: 'my_article_list' }
  };
  return content;
}
```

This will create a page with an empty list. Next we need to retrieve the results from the View and populate the list. We'll do that by utilizing the `pageshow` callback for our page:

```
/**
 * Pageshow callback.
 */
function my_module_articles_pageshow() {
  var path_to_view = 'my-articles';
  views_datasource_get_view_result(path_to_view, {
      success: function (data) {
        if (data.nodes.length > 0) {
          var items = [];
          $.each(data.nodes, function(index, object){
              var node = object.node;
              items.push(
                l(node.title, 'node/' + node.nid)
              );
          });
          drupalgap_item_list_populate('#my_article_list', items);
        }
      }
  });
}
```

Now if we navigate to the path `articles` in DrupalGap, our page will be displayed, then the `pageshow` callback will ask Views for the results, then add them to the list.
