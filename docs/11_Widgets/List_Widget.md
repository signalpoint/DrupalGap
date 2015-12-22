We can create lists within our app. These examples show how to display a static list of items in your app.

Refer to the [Image Lists](../Views/Displaying_a_View/Views_Render_Array/Image_Lists) page for an example of a dynamic list that use remote data set.

## Unordered Lists

![Unordered List](http://drupalgap.org/sites/default/files/unordered-list.png)

```
var content = {};
content['my_item_list'] = {
  _theme: 'item_list',
  _title: 'Colors',
  _items: ['Red', 'Green', 'Blue']
};
return content;
```

## Ordered Lists

Creating an ordered list is very similar to the unordered list example above, except we specify the `type` of list as `ol`, for example:

![Ordered List](http://drupalgap.org/sites/default/files/ordered-list.png)

```
var content = {};
content['my_item_list'] = {
  _theme: 'item_list',
  _type: 'ol',
  _title: 'Instructions',
  _items: ['Stop', 'Drop', 'Roll']
};
return content;
```