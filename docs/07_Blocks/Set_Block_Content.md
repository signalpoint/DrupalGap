It's very easy to dynamically change a block's content without reloading the page:

```
var element = {
  foo: {
    _markup: '<p>' + dg.t('Bar') + '</p>'
  }
};
dg.setBlockContent('my_module_custom_block', element);
```

This allows you to set the html within a block, without having to reload the current page.
