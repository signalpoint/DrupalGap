There are a few different ways to create tables in DrupalGap.

![Table Widget](http://drupalgap.org/sites/default/files/table.png)

## Render Array

```
var header = [];
header.push({ data: 'Column 1' });
header.push({ data: 'Column 2' });
var rows = [];
rows.push(["Row 1 Column 1", "Row 1 Column 2"]);
rows.push(["Row 2 Column 1", "Row 2 Column 2"]);
var content = {
  my_table:{
    theme: 'table',
    header: header,
    rows: rows,
    attributes: {
      'border': 1
    }
  }
};
return content;
```

## theme('table', ...)

```
var header = [];
header.push({ data: 'Column 1' });
header.push({ data: 'Column 2' });
var rows = [];
rows.push(['Row 1 Column 1', 'Row 1 Column 2']);
rows.push(['Row 2 Column 1', 'Row 2 Column 2']);
var table_data = {
  header: header,
  rows: rows,
  attributes: {
    border: 1
  }
};
var table = theme('table', table_data);
$('div#my_container').html(table).trigger('create');
```
