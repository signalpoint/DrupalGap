Let's create some html tables for display...

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
    ['green', 'square', 'medium']
  ]
};
return content;
```

If you need custom attributes on a table **row**, try this:

```
//...

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
    }
  ],

//...

```

If you need custom attributes on a table **header**, try this:

```
//...

  _header: [
    {
      _attributes: {
        id: 'color-header'
      },
      _text: dg.t('Color')
    },
    {
      _attributes: {
        id: 'shape-header'
      },
      _text: dg.t('Shape')
    },
    {
      _attributes: {
        id: 'size-header'
      },
      _text: dg.t('Size')
    }
  ],

//...

```
