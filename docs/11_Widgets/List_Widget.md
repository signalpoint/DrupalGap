Using the [jQuery Mobile Listview widget] (https://api.jquerymobile.com/listview/), we can create lists within our app. These examples show how to display a static list of items in your app.

Refer to the [Image Lists](../Views/Displaying_a_View/Views_Render_Array/Image_Lists) page for an example of a dynamic list that use remote data set.

## Unordered Lists

![Unordered List](http://drupalgap.org/sites/default/files/unordered-list.png)

```
var content = {};
content['my_item_list'] = {
  theme: 'item_list',
  title: 'Colors',
  items: ['Red', 'Green', 'Blue']
};
return content;
```

### jQuery Mobile Unordered Lists

Using jQuery Mobile, we can easily make our list look much better:

![jQuery Mobile Unordered List](http://drupalgap.org/sites/default/files/jquerymobile-unordered-list.png)

```
var content = {};
content['my_item_list'] = {
  theme: 'jqm_item_list',
  title: 'Colors',
  items: ['Red', 'Green', 'Blue'],
  attributes: {
    'data-inset': true
  }
};
return content;
```

## Ordered Lists

Creating an ordered list is very similar to the unordered list example above, except we specify the `type` of list as `ol`, for example:

![Ordered List](http://drupalgap.org/sites/default/files/ordered-list.png)

```
var content = {};
content['my_item_list'] = {
  theme: 'item_list',
  type: 'ol',
  title: 'Instructions',
  items: ['Stop', 'Drop', 'Roll']
};
return content;
```

### jQuery Mobile Ordered Lists

![jQuery Mobile Ordered List](http://drupalgap.org/sites/default/files/jquerymobile-ordered-list.png)

```
var content = {};
content['my_item_list'] = {
  theme: 'jqm_item_list',
  type: 'ol',
  title: 'Instructions',
  items: ['Stop', 'Drop', 'Roll'],
  attributes: {
    'data-inset': true
  }
};
return content;
```

## List item attributes

Sometimes we need to place custom attributes on a particular list item. This is possible like so:

```
items: [
  'Stop',
  {
    attributes: { class: 'foo' },
    content: 'Drop'
  },
  {
    attributes: { class: 'bar' },
    content: {
      markup: 'Roll'
    }
  }
]
```
Notice how we can use a *string* or a *widget* for the `content` property, this gives us great flexibility on what goes inside a list item.

