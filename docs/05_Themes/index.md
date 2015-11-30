
 - [Browse Themes](http://drupalgap.org/project/project_theme)
 - [Add a Theme](http://drupalgap.org/node/add/project)

Themes control the look and feel of our mobile application. If you're familiar with how Drupal's themes are structured, the following information will be very familiar. If not, here is a brief overview of how themes work.

With our theme, we specify a page template with regions to display. For example, a typical theme has a region for a header, footer, navigation and content.

![Demonstration of regions on a page](http://drupalgap.org/sites/default/files/regions-highlighted.png)

Within a region, we then can place one or more blocks to fill in the display for that region. For example, some typical blocks in a theme would be:

 - logo
 - main_menu
 - main (*displays the current page's content*)
 - powered_by

If we were then to place these blocks in a region, the layout of our theme's page template would look something like this:

![Demonstration of blocks in regions, on a page](http://drupalgap.org/sites/default/files/regions-highlighted-with-blocks.png)

Then when it is time for DrupalGap to render a page, it renders each region, and each block within those regions. From our example regions and blocks outlined above, our mobile application's page might look something like this:

![Blocks and regions rendered as an app](http://drupalgap.org/sites/default/files/rendered-regions.png)

Here's a summary of what was rendered:

 - the logo block was rendered in the header region
 - the main menu block was rendered in the navigation region
 - the main block was rendered in the content region
 - the powered by block was rendered in the footer region

By utilizing regions and blocks within our theme, we have a flexible template system to theme our mobile application with DrupalGap.