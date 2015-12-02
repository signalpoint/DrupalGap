It's possible to have a title displayed at the top of the view, simply use the optional `title` and `title_attributes` properties on the render array:

![Views Title](http://www.drupalgap.org/sites/default/files/views-ul-title.png)

```
var content = {
  theme: 'view',
  format: 'ul',
  title: 'My Articles',
  title_attributes: {
    'data-role': 'header',
    'data-theme': 'b'
  },
  /* other properties... */
};
```
