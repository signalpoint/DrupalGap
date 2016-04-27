DrupalGap comes with a custom View Mode (also sometimes referred to as a Display Mode) for Nodes and Users. Use these to specify what fields and labels show up when viewing an entity inside your app.

![DrupalGap Display Mode](http://drupalgap.org/sites/default/files/Screenshot%20from%202013-10-24%2016%3A09%3A19.png)

For example, the default Article content type will now have a new Display Mode for DrupalGap:

`admin/structure/types/manage/article/display/drupalgap`

By default, there are no fields displayed using the DrupalGap Display Mode. We need to specifiy which fields, labels and formats will be used when our nodes are displayed in the mobile app. Do this for each content type.

## Custom View Modes

Normally the *DrupalGap* View Mode is sufficient for an typical application, but in case you want to support multiple View Modes that is possible as well.

Say for example you had a mobile application, and a television application, you may want to display a certain content type differently on the television than compared to the mobile application. We could use the default DrupalGap view mode to manage the display of the mobile application, then make a custom View Mode to be used by the television.

To do this, we create a custom Drupal module and implement the following hook:

```
/**
 * Implements hook_entity_info_alter().
 */
function example_entity_info_alter(&$entity_info) {

  // Add a TV view mode to nodes and users.
  $entity_info['node']['view modes']['example_tv'] = array(
    'label' => t('My TV'),
    'custom settings' => TRUE
  );

}
```

Enable our custom module in Drupal and flush all the caches, then add something like this to the television app's `settings.js` file:

```
/**
 * View Modes
 */
drupalgap.settings.view_modes = {
  node: {
    article: {
      view_mode: 'example_tv'
    }
  },
  user: {
    view_mode: 'example_tv'
  }
};
```
