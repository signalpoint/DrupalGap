> There is currently [a bug in the Views datasource module](https://www.drupal.org/node/2396813) which prevents the picture's JSON data from being output properly! See [this comment](https://www.drupal.org/node/2396813#comment-10461959) for a workaround.

[Click here](../Displaying_a_View/Views_Render_Array/Image_Lists) to see the corresponding Views Render Array example to render a list of users and their profile pictures.

In this example, we'll create a Views JSON Page Display that returns to us a list of user names and profile pictures:

```
{
  "users" : [
    {
      "user" : {
        "name" : "tyler",
        "picture" : {
          "src": "http://www.example.com/sites/default/files/styles/thumbnail/public/pictures/picture-1-1388127317.png?itok=iZ5Pl9kE"
        },
        "uid" : "1"
      }
    },
    {
      "user" : {
        "name" : "joe",
        "picture" : {
          "src": "http://www.example.com/sites/default/files/styles/thumbnail/public/pictures/picture-2-1388127360.png?itok=QYfWNYKj"
        },
        "uid" : "2"
      }
    }
  ]
}
```

Create a view in Drupal at `admin/structure/views/add` using these settings:

- View name: **User Profiles JSON**
- Show **Users** sorted by **Oldest first**
- Check the box for **Create a page**
- Page title: **User Profiles**
- Path: `drupalgap/user-profiles`
- Display format: **JSON data document**
- Items to display: **10**
- Uncheck **Use a pager**

Click the **Continue & Edit** button. Then **add two fields** to the View:

- User: Picture
- User: Uid

Click the **Add and configure fields** button. For the **User: Picture** field, use these settings:

- Label: **picture**
- Uncheck **Link to user's profile**
- Image style: **thumbnail**

Click the **Apply and continue** button. For the **User: Uid** field, use these settings:

- Label: **uid**
- Uncheck **Link this field to its user**

Click the **Apply** button. Then click the **Settings** link next to **JSON data document** in the **FORMAT** section, and use these settings:

- Root object name: **users**
- Top-level child object: **user**

Click the **Apply** button. Next, observe the View's preview results of the JSON, it should look something like the JSON output listed above.

Finally click the **Save** button to save the **View**.