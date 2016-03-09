By using the `format_attributes` property, we can specify attributes that will be attache to the format container. Here's an example, that makes an unordered list have its `data-inset` property set to `true`:

![Views Format Attributes](http://drupalgap.org/sites/default/files/views-ul-format-attrs.png)

```
var content = {
  theme: 'view',
  format: 'ul',
  format_attributes: {
    'data-inset': 'true'
  },
  /* other properties... */
};
```

This in turn will be rendered with HTML similar to below:

`<ul data-inset="true"><li>...</li><li>...</li></ul>`