In the Views JSON you created, add the field for **Has New Content**. Change the label to new_content. Then expand the **Rewrite Results** section and check the **Rewrite the output of this field** box. Enter the integer **1** in the box. Then save the field.

Then you could use something like this in your `row_callback`:

```
/**
 * The row callback to render a single row.
 */
function my_module_articles_list_row(view, row) {
  try {
    if (row.new_content == 1) {
      var html = l('<font color="#0404B4">' + row.title + '</font>', 'node/' + row.nid);
    } else {
      var html = l('<font color="#2E2E2E">' + row.title + '</font>', 'node/' + row.nid);
    }
    return html;
  }
  catch (error) { console.log('my_module_articles_list_row - ' + error); }
}
```

Now, the node title will be in a different color when there is new content on that node.
