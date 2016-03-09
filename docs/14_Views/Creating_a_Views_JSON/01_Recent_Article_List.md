

In this example, we'll create a View JSON Page Display to return recent article nodes:

```
{
  "nodes" : [
    {
      "node" : {
        "title" : "Hello",
        "nid" : "1"
      }
    }
  ]
}
```

In Drupal, go to `admin/structure/views/add`, then on the **Add new view** form, enter values like this:

- View name: **My Articles**
- Show **Content** of type **Article** sorted by **Unsorted**
- Check the **Create a page** checkbox
- Path: `my-articles`
- Display format: **JSON data document**
- Items to display: **2**
- Uncheck the **Use a pager** checkbox

Then click the **Continue & edit** button.

### Fields

By default, our view should come with a Node Title field. Let's also add a Node ID field to our view. To do this:

1. click the **Add** button next to **Fields**
2. type **nid** into the **Search** text box
3. select **Content: Nid** when it shows up in the search results list
4. click the **Apply (all displays)** button.
5. change the label from **Nid** to **nid**
6. click the **Apply (all displays)** button

### Preview View Results in JSON

Now when we preview the results of our view, we should see something like the JSON listed above.

### Save the View

Our view is ready to go, click the **Save** button to save the view.
