With the Controlgroup Widget, we can group buttons together. Check out the [jQuery Mobile Controlgroup Widget](https://api.jquerymobile.com/controlgroup/) for more information.

![Controlgroup widget Vertical](http://drupalgap.org/sites/default/files/controlgroup-widget.png)

```
var content = {};
content['my_controlgroup'] = {
  theme: 'controlgroup',
  items: [
    bl('Hello', 'node/1'),
    bl('Goodbye', 'user/logout')
  ]
};
return content;
```

## Horizontal Grouped Buttons

![Controlgroup Widget Horizontal](http://drupalgap.org/sites/default/files/controlgroup-widget-horizontal.png)

This is accomplished with the `data-type` attribute set to horizontal:

```
var content = {};
content['my_controlgroup'] = {
  theme: 'controlgroup',
  items: [
    bl('Hello', 'node/1'),
    bl('Goodbye', 'user/logout')
  ],
  attributes: {
    'data-type': 'horizontal'
  }
};
return content;
```