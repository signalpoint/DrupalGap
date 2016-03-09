### Change background color of flagged nodes in View

You can change the background color of a rendered views row in your app for nodes that have been flagged.

### Set up view

In your JSON View on your website, add the __Flags: Flagged__ field. Change the label to _flagged_. Change the Output Format setting to __1/0__.

### Drupalgap Code in your custom module

In your ___list_row__ function, change the following line of code 

```
var html = l(rowtext, 'node/' + row.nid);   
```

to

```
if (row.flagged == '0') {
  
  var html = l(rowtext, 'node/' + row.nid);   
  
} else {
  
  var html = l(rowtext, 'node/' + row.nid, {
    attributes: {
      'class': 'rowflag'
    }      
  });   
  
}

```

### Add the following to drupalgap.css

```
a:link.rowflag.ui-btn.ui-btn-icon-right.ui-icon-carat-r {
    background-color: #e6f2ff;
}
a:hover.rowflag.ui-btn.ui-btn-icon-right.ui-icon-carat-r {
    background-color: #cce6ff;
}
```
