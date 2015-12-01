Also checkout the [Select List Form Element](../Forms/Form_Elements/Select_Lists) to use this widget on a form.

![Select List](http://drupalgap.com/sites/default/files/selectmenu-widget.png)

## Render Array

```
var content = {};
content['my_select_list'] = {
  theme: 'select',
  options: {
    0: 'No',
    1: 'Yes',
    2: 'Maybe So'
  },
  value: 2
};
```

## theme('select', ...)

```
var html = theme('select', {
  options: {
    0: 'No',
    1: 'Yes'
  }
});
```

### jQuery Mobile Selectmenu Widget Option Text Align Left

Use CSS like this to align the option text for a field on the node edit form:

```
#node_edit .field-name-field-my-field .ui-select .ui-btn {
  text-align: left;
}
```