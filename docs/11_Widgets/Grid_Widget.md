We can easily render [jQuery Mobile Grids](http://demos.jquerymobile.com/1.4.5/grids/) with DrupalGap.

![Grid Widget](http://drupalgap.org/sites/default/files/jqm-grid.png)

## Render Array

```
var content = {};
content['my_grid'] = {
  theme: 'jqm_grid',
  columns: 2,
  items: [
    bl('Foo', 'foo'),
    bl('Bar', 'bar'),
    bl('Baz', 'baz'),
    bl('Chop', 'chop')
  ]
};
return content;
```

## theme('jqm_grid', ...)

```
var html = theme('jqm_grid', {
  columns: 2,
  items: [
    bl('Foo', 'foo'),
    bl('Bar', 'bar'),
    bl('Baz', 'baz'),
    bl('Chop', 'chop')
  ]
});
return html;
```

