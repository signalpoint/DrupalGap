Menus are used to provide the user with links to interact with our mobile app. Each menu in DrupalGap, automatically has a block created for it. The block can then be placed into a theme's region to determine where the menu will be displayed.

For example, DrupalGap comes packaged with a menu called `user_menu_anonymous`, and it contains a Login link, and a Register link. Since a matching block is automatically created for the menu, the `user_menu_anonymous` block can be placed into a region within our app's theme.

![DrupalGap Sample Page](http://drupalgap.org/sites/default/files/hello-app-world.png)

The `user_menu_anonymous` block would of course want to be seen only by anonymous users. We can control when to show or hide the menu's block using [visibility rules](../Blocks/Block_Visibility_Rules). 

DrupalGap comes packaged with a few system menus:

- user_menu_anonymous
- user_menu_authenticated
- main_menu
- navigation

Similar to the example above, each of these menus also has a matching block that can be placed into a region wihtin our app's theme.
