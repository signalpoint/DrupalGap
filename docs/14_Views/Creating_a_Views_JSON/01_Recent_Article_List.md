

In this example, we'll create a **REST export** to return recent article node JSON data:

```
[
 {
  "nid":[{"value":"1"}],
  "type":[{"target_id":"article"}],
  "title":[{"value":"Hello World"}]
 },
 {
   "nid":[{"value":"2"}],
   "type":[{"target_id":"article"}],
   "title":[{"value":"Goodbye World"}]
  }
]
```

## Build the REST export View

In Drupal, go to `admin/structure/views/add`, then on the **Add new view** form, enter values like this:

- View name: **My Articles**
- Show **Content** of type **Article** sorted by **Newest first**
- Check the **Provide a REST export** checkbox
- REST export path: `my-articles`

Then click the **Save & edit** button.

### Preview View Results as JSON

Now when we preview the results of our view, we should see something like the JSON listed above.

### Save the View

Our view is ready to go!
