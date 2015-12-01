A typical mobile application for a Drupal website will want to have access to nodes, users, comments. Luckily DrupalGap supports the Core Entity Bundles provided by Drupal.

DrupalGap provides [built-in pages for your mobile app](Pages/Built_in_Pages) that support viewing and editing core entities. For example, here are some typical page paths within DrupalGap for viewing and editing entities:

- `node/123`
- `node/123/edit`
- `user/456`
- `user/456/edit`

If you are familiar with the paths on your Drupal site, the DrupalGap paths above will look very familiar. So familiar in fact, they are the same paths used by Drupal!

It is also easy to load entities from your Drupal site into your DrupalGap mobile application. These example functions are available within DrupalGap:

```
node_load(123, {
    success: function(node) {
      alert('Loaded ' + node.title);
    }
});

user_load(456, {
    success: function(user) {
      alert('Loaded ' + user.name);
    }
});
```

If entity caching is enabled in the `settings.js` file, anytime DrupalGap fetches an entity from the server, it will save it to the local storage on the mobile device. This allows developers to call e.g. `node_load(123, {...});` multiple times without worrying about the mobile application calling the Drupal server over and over for the same data.

[Learn More About Entity Caching](Developer_Guide/Caching_and_Performance)