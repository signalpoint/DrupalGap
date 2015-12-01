Here's an example Views JSON Page Display that will return some articles with their image, title and node id:

```
{
  "nodes" : [
    {
      "node" : {
        "title" : "French Fries",
        "picture" : {
          "src": "http://localhost/drupal-7/sites/default/files/styles/thumbnail/public/field/image/french-fries.jpg?itok=63rHWK7F"
        },
        "nid" : "25"
      }
    },
    {
      "node" : {
        "title" : "Pizza",
        "picture" : {
          "src": "http://localhost/drupal-7/sites/default/files/styles/thumbnail/public/field/image/pizza.jpg?itok=M3Y-22-E"
        },
        "nid" : "24"
      }
    }
  ]
}
```

To do this, create a view in Drupal at `admin/structure/views/add` using these settings:

- View name: **Article Images**
- Show **Content** of type **Article** sorted by **Oldest first**
- Check the box for **Create a page**
- Page title: **Article Image**
- Path: `drupalgap/article-images`
- Display format: **JSON data document**
- Items to display: **10**
- Uncheck **Use a pager**

Click the **Continue & Edit** button. Then **add two fields** to the View:

- Content: Image
- Content: Nid

Click the **Add and configure** fields button. For the **Content: Image** field, use these settings:

- Label: **picture**
- Image style: **thumbnail**

Click the **Apply and continue** button. For the **Content: Nid** field, use these settings:

- Label: **nid**

Click the **Apply** button. Next, observe the View's preview results of the JSON, it should look something like the JSON output listed above.

Finally click the **Save** button to save the View.