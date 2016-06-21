By using a render array, we can take advantage of DrupalGap's built in features for Views.

## Formats

We can easily render our view using a few different formats:

- **ul**
- **ol**
- **table**
- **unformatted_list** (*default*)

### Unordered List

Here's an example rendering a view as an unordered list (ul):

![Views Unordered List](http://www.drupalgap.org/sites/default/files/views-ul.png)

```
/**
 * Implements hook_menu().
 */
function my_module_menu() {
  var items = {};
  items['articles'] = {
    title: 'Articles',
    page_callback: 'my_module_articles_page'
  };
  return items;
}

/**
 * The page callback to display the view.
 */
function my_module_articles_page() {
  try {
    var content = {};
    content['my_articles_list'] = {
      theme: 'view',
      format: 'ul',
      path: 'my-articles', /* the path to the view in Drupal */
      row_callback: 'my_module_articles_list_row',
      empty_callback: 'my_module_articles_list_empty',
      attributes: {
        id: 'my_articles_list_view'
      }
    };
    return content;
  }
  catch (error) { console.log('my_module_articles_page - ' + error); }
}

/**
 * The row callback to render a single row.
 */
function my_module_articles_list_row(view, row) {
  try {
    return l(t(row.title), 'node/' + row.nid);
  }
  catch (error) { console.log('my_module_articles_list_row - ' + error); }
}

/**
 *
 */
function my_module_articles_list_empty(view) {

  // This...

  return t('Sorry, no articles were found.');

  // Or...

  var content = {};
  content['msg'] = { markup: t('Sorry, no articles were found.') }
  // content['some-other-widget'] = { /* ... */ }
  return content;

}
```

Now if we were to navigate to the **articles** page in our app, we would see our view rendered as an unordered list, with a pager (if there are enough articles for multiple pages).

### Ordered List

To render an ordered list, change the format to ol, for example:

`format: 'ol',`

![Views Ordered List](http://www.drupalgap.org/sites/default/files/views-ol.png)

### Table

To render a table, change the format to table, and add some `format_attributes` (optional), for example:

```
format: 'table',
format_attributes: {
  border: 1,
  'cellpadding': 10,
  'cellspacing': 10,
},
```

![Views Table](http://www.drupalgap.org/sites/default/files/views-table.png)

Note, when using the table format, in your `row_callback` function, be sure to wrap each column of your row in table data elements, for example:

```
var html =
  '<td>' + row.nid + '</td>' +
  '<td>' + l(row.title, 'node/' + row.nid) + '</td>';
return html;
```

## No Results

If there were no results available, then the `my_module_articles_page_empty` function would be called to render the empty text. You can return a plain html string here, or build a Widget(s) and return it as `content`. 

## Row Position

When using a `row_callback` function, the position of the row is located within the row object. For example, we could do extra stuff for the first and last row if we wanted to:

```
/**
 * The row callback to render a single row.
 */
function my_module_articles_list_row(view, row) {
  try {
    var html = l(row.title, 'node/' + row.nid);
    // Use plain text for the first and last rows.
    if (row._position == 0 || row._position == view.count - 1) {
      html = row.title;
    }
    return html;
  }
  catch (error) { console.log('my_module_articles_list_row - ' + error); }
}
```

Please note, prior to *DrupalGap 7.x-1.0-rc3* the position was available here:

`row.count`
