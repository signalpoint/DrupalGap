Visit the [Select List Widget](../../Widgets/Select_List_Widget) for other techniques on how to display a select list.

## Select List with Single Selectable Option

![Select List Widget](http://www.drupalgap.org/sites/default/files/selectmenu-widget.png)

```
form.elements['my_select_list'] = {
  title: 'My Vote',
  type: 'select',
  options: {
    0: 'No',
    1: 'Yes',
    2: 'Maybe So'
  },
  default_value: 1
};
```

## Select List with Multiple Selectable Options

![Select List Multiple Widget](http://www.drupalgap.org/sites/default/files/select-list-multiple.png)

To get a select list with multiple selectable options, use the `multiple` attribute from within the options, for example:

```
options: {
  0: 'No',
  1: 'Yes',
  2: 'Maybe So',
  attributes: {
    'data-native-menu': 'false',
    'multiple': 'multiple'
  }
}
```