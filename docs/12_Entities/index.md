A typical mobile application for a Drupal website will want to have access to nodes, users, comments, etc. Luckily DrupalGap supports the Core Entity Bundles provided by Drupal.

DrupalGap provides [built-in pages for your mobile app](Pages/Built_in_Pages) that support viewing and editing core entities. For example, here are some typical page paths within DrupalGap for viewing and editing entities:

- `#node/123`
- `#node/123/edit`
- `#user/456`
- `#user/456/edit`

If you are familiar with the paths on your Drupal site, the DrupalGap paths above will look very familiar. So familiar in fact, they are the same paths used by Drupal!

It is also easy to load entities from your Drupal site into your DrupalGap mobile application. These example functions are available within DrupalGap:

```
jDrupal.nodeLoad(123).then(function(node) {
  var msg = 'Loaded : ' + node.getTitle();
  console.log(msg);
});

$.userLoad(456).then(function(account) {
  var msg = 'Loaded : ' + account.getAccountName();
  console.log(msg);
});
```
