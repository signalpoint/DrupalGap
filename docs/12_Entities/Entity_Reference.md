We can either use the `Simple` selection mode on our Entity reference field's widget to have DrupalGap automatically handle the field, otherwise we can use a View to power the results for the field (described below).

When using a View to power an [Entity Reference](http://drupalgap.org/project/entityreference) field, we need  a Views JSON page display so the app can retrieve the data to power the field.

**1**. First, create a new View (or edit an existing one), [using these instructions](../Forms/Form_Elements/Autocomplete/Autocomplete_with_Remote_Views_JSON_Data). When following the instructions, be sure to create the "Entity reference" display mentioned in step #2 below, before creating the Page display on your View. When creating the Page display in your View, you'll need the path mentioned in step #3 below.

This Views JSON display only needs two fields, the node title and node id. So verify your JSON display preview shows something like this:

```
{
  "nodes": [
    {
      "node": {
        "title": "Apples",
        "nid": "123"
      }
    }, /* ... other nodes ... */
  ]
}
```

**2**. Next, add an "Entity reference" display to your View, and configure the display settings to use the "Title" as the search field.

**3**. Take note of the machine name of your View, and the machine name of the Entity Reference display. To locate the two machine names, navigate to the settings for your particular View, and click on the entity reference display:

![Entity Reference display in Views](http://drupalgap.org/sites/default/files/Screenshot%20from%202014-04-15%2013%3A58%3A37.png)

Now, the URL in the address bar you should have something like this as the path:

`admin/structure/views/view/page_references/edit/entityreference_1`

In this example, the machine name of the view is page_references, and the machine name of the entity reference display is entityreference_1. At this time, take note of your two machine names. These machines names will be used to construct the path for the Page display on your view mentioned in step #2 above. Here a path, for example:

`drupalgap/page_references/entityreference_1`

This path is very specific, so be sure to set the Views' Page display path correctly with your machine names, or else the field will not work properly in the app.

**4**. Finally configure the "Field settings" for the entity reference field on your content type, so that the "mode" value in the "Entity selection" section is set to your View's Entity Reference display.

Now when you add/edit a node with that has this entity reference field, this widget will work properly on the form.
