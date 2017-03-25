After [creating a custom page](Pages/Creating_a_Custom_Page), we can add widgets to the page.

Here's an example snippet of how easy it is to place multiple widgets on a page:

```
var content = {};
content['my_button'] = { /* ... */ };
content['my_checkbox'] = { /* ... */ };
content['my_view'] = { /* ... */ };
return content;
```

If you're planning on building a form, visit the [Forms docs](Forms) to learn about the creation, validation and submission of forms using DrupalGap.
