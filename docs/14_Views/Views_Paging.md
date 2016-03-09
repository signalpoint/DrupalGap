When using a Render Array to Display a View, if we have paging enabled on a View in Drupal, paging will be displayed for that View in our mobile app.

For example, in the Drupal Views' UI, we could have **PAGER** settings like this on our Views JSON page:

![Drupal Views Pager UI](http://drupalgap.org/sites/default/files/drupal-views-pager-ui.png)

DrupalGap will then automatically respond and provide paging for the View inside the app:

![Views Pager Top](http://drupalgap.org/sites/default/files/views-pager-top.png)

## Pager Position

By default the pager will be rendered on `top` of the Views' results (if paging is enabled on your View):

You may optionally set it to `bottom` to render the pager below the Views' results.

```
var content = {
  theme: 'view',
  pager_pos: 'bottom',
  /* ... other settings here ... */
}
```
