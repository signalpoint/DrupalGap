Creates a collapsible block of content. Refer to the [jQuery Mobile Collapsible Widget docs](https://api.jquerymobile.com/collapsible/) for more information.

![Collapsible Widget Closed](http://www.drupalgap.org/sites/default/files/collapsible-widget.png)

```
var content = {};
content['my_collapsible'] = {
  theme: 'collapsible',
  header: 'Hello',
  content: '<p>Hi!</p>'
};
return content;
```

Now when we click on **Hello**, the widget will open up:

![Collapsible Widget Open](http://www.drupalgap.org/sites/default/files/collapsible-widget-open.png)

We can set the `data-collapsed` attribute to `false` to have the widget be open by default:

```
var content = {};
content['my_collapsible'] = {
  theme: 'collapsible',
  header: 'Hello',
  content: '<p>Hi!</p>',
  attributes: {
    'data-collapsed': 'false'
  }
};
return content;
```

## Custom Icons

Try placing these attributes onto your collapsible to change the icons for the expanded and collapsed positions:

```
'data-collapsed-icon': 'arrow-r',
'data-expanded-icon': 'arrow-d'
```