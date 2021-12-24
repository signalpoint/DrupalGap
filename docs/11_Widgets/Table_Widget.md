We can create tables in our app.

```
var content = {};
content['my_table'] = {
  _theme: 'table',
  _header: [
    dg.t('Color'),
    dg.t('Shape'),
    dg.t('Size')
  ],
  _rows: [
    ['red', 'circle', 'small'],
    ['green', 'square', 'medium'],
    ['blue', 'triangle', 'large'],
  ]
};
return content;
```

If you need custom attributes on a row, try this:

```
var html = dg.theme('table', {
  _header: [
    dg.t('Color'),
    dg.t('Shape'),
    dg.t('Size')
  ],
  _rows: [
    {
      _attributes: {
        id: 'foo',
        class: ['bar']
      },
      _cols: ['red', 'circle', 'small']
    },
    {
      _attributes: {
        id: 'boo',
        class: ['car']
      },
      _cols: ['green', 'square', 'medium']
    },
  ]
});
```
