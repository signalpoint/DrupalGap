Using [jQuery Mobile's Collapsibleset Widget](http://api.jquerymobile.com/collapsibleset/), we can create collapsible sets of widgets.

![Collapsibleset Widget Closed](http://drupalgap.org/sites/default/files/collapsibleset-widget-closed.png)

```
var content = {};
content['my_collapsibleset'] = {
  theme: 'collapsibleset',
  items: [
    { header: 'Hello', content: '<p>Hi!</p>' },
    { header: 'Goodbye', content: '<p>Bye!</p>' }
  ]
};
return content;
```

Notice that each item is an individual [Collapsible Widget](Collapsible_Widget).

By default, each item will be collapsed. Using the `data-collapsed` attribute and setting it to `false`, an item can be expanded by default:

![Collapsibleset Widget Open](http://drupalgap.org/sites/default/files/collapsibleset-widget-open.png)

```
var content = {};
content['my_collapsibleset'] = {
  theme: 'collapsibleset',
  items: [
    { header: 'Hello', content: '<p>Hi!</p>' },
    { header: 'Goodbye', content: '<p>Bye!</p>', attributes: { 'data-collapsed': 'false' } }
  ]
};
return content;
```