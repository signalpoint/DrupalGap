A typical mobile application for a Drupal website will want to have access to nodes, users, comments, etc. Luckily DrupalGap has some handy features to make that task easier.

## Viewing Entities

DrupalGap has a built in `_controller` for Routes that will load and deliver an entity to a `_handler`, which in turn can decide how to render the entity on the page.

As an example, here's a route (that you can attach to a custom module's `routing` function) to display Article nodes:

```
routes['article'] = {
  path: "/article/(.*)",
  defaults: {
    _title: 'Article',
    _entity_type: 'node',
    _controller: dg.entityController,
    _handler: my_module.articleController
  }
};
```

And then you can decide how to render the entity with your `_handler` function:

```
my_module.articleController = function(node, ok, error) {

  // Update the page title with the article title.
  dg.setTitle(node.getTitle() + '!');

  // Build the element to render the article.
  var element = {};

  // Stringify the node and display it as markup.
  element.foo = {
    _markup: JSON.stringify(node)
  };

  // Send the element back to be rendered.
  ok(element);

};
```
