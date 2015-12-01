Sometimes the way DrupalGap renders a node's page is just not acceptable, and we may want to completely take over the rendering of a particular content type.

![Node Page View Alter](http://drupalgap.org/sites/default/files/node-page-view-alter.png)

This is possible with `hook_node_page_view_alter_TYPE()`.

Here's an example that takes over the way Article nodes are rendered, by placing an intro paragraph at the top of the page, and wrapping all the node's pre-rendered content in a collapsible widget:

```
/**
 * Implements hook_node_page_view_alter_TYPE().
 */
function my_module_node_page_view_alter_article(node, options) {
  try {
    var content = {};
    content['my_markup'] = {
      markup: '<p>Click the button to see the article!</p>'
    };
    content['my_collapsible'] = {
      theme: 'collapsible',
      header: node.title,
      content: node.content
    };
    options.success(content);
  }
  catch (error) { console.log('my_module_node_page_view_alter_article - ' + error); }
}
```

Granted this example doesn't make much sense in the real world, but it demonstrates the ability to add content to a node's page, and retain the original content. You can return a render array (recommended) or just a plain HTML string and completely take over the rendering of the page if you want. You are not required to use `node.content`, it is just there for convenience.

This hook is extremely powerful, because now we can for example add Views Render Array to our node's content, and pass along the node id as a contextual filter to the View, providing dynamic results on a per node basis!