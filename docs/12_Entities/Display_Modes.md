DrupalGap comes with custom Display Modes for your entities. Use these to specify what fields and labels show up when viewing an entity inside your app.

![DrupalGap Display Mode](http://drupalgap.org/sites/default/files/Screenshot%20from%202013-10-24%2016%3A09%3A19.png)

For example, the default Article content type will now have a new Display Mode for DrupalGap:

`admin/structure/types/manage/article/display/drupalgap`

By default, there are no fields displayed using the DrupalGap Display Mode. We need to specifiy which fields, labels and formats will be used when our nodes are displayed in the mobile app. Do this for each content type.