# Set the page title

To utilize the page title feature, place the `title` Block within a Region of your Theme in the `settings.js` file.

## With text
```
dg.setPageTitle(dg.t('Edit'));
```

## With a widget
```
dg.setPageTitle({
  _theme: 'title',
  _title: dg.t('Edit'),
  _attributes: { class: ['clearfix'] },
  _prefix: dg.bl('<i class="fa fa-arrow-left"></i>', 'group/' + node.nid, {
    _attributes: {
      title: dg.t('Cancel'),
      class: ['pull-left']
    }
  })
});
```
You can use any widget, not just the `title` widget.
