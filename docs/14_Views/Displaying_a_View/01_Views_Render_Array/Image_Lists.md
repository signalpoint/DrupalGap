> There is currently a [bug in the Views datasource module](https://www.drupal.org/node/2396813) which prevents the picture's JSON data from being output properly! See [this comment](https://www.drupal.org/node/2396813#comment-10461959) for a workaround.

It's easy to create dynamic lists with images. Here are two typical scenario examples:

- List of User Profile Pictures and Links
- List of Article Images and Titles as Links

## List of User Profile Pictures and Links

With this example, we'll create a page in our mobile application that displays a list of users with their profile picture and user name. Clicking on the user will navigate the app to the corresponding user profile page.

For this example to work, we'll need to check the "Enable user pictures" checkbox under `admin/config/people/accounts` on our Drupal site. Also, the **View user profiles** permission needs to be given to both the Anonymous and Authenticated user roles under `admin/people/permissions`.

This example is powered by the [Views JSON User List Example](../../Creating_a_Views_JSON/User_List_with_Photos). Be sure to have it set up before continuing.

Now we're ready to display a list of users, along with their profile pictures and a link to view their profile in the DrupalGap mobile app. Let's create a custom page with our custom module in DrupalGap:

![User Profile Pictures List](http://www.drupalgap.org/sites/default/files/user-profiles.png)

```
/**
 * Implements hook_menu().
 */
function my_module_menu() {
    try {
      var items = {};
            items['user_profiles'] = {
              title: 'User Profiles',
              page_callback: 'my_module_user_profiles'
            };
     };
      return items;
    }
    catch (error) { console.log('hook_menu failed - ' + error); }
}
 
/**
 * The page callback to display the view my_module_user_profiles.
 */
function my_module_user_profiles() {
  try {
    var content = {};
       
    content['user_listing'] = {
      theme: 'view',
      format: 'ul',
      path: 'user-profiles', /* the path to the view in Drupal */
      row_callback: 'my_module_user_profiles_list_row',
      empty_callback: 'my_module_user_profiles_list_empty',
      attributes: {
        id: 'user_listing_items'
      }
    };
       
        return content;
  }
  catch (error) { console.log('my_module_user_profiles - ' + error); }
}
 
 /**
 * The row callback to render a single row.
 */
function my_module_user_profiles_list_row(view, row) {
  try {
      var image_html = theme('image', { path: row.picture.src });
      var name_html = '<h2>' + row.name + '</h2>';
      return l(image_html + name_html, 'user/' + row.uid);
  }
  catch (error) { console.log('my_module_user_profiles_list_row - ' + error); }
}
 
 
/**
 * Callback function for no results.
 */
function my_module_user_profiles_list_empty(view) {
  try {
    return '<p>Sorry, no users were found.</p>';
  }
  catch (error) { console.log('my_module_user_profiles_list_empty - ' + error); }
}
```

Now if we view our newly created page in the App, we'll see a list of users along with their names, profile pictures and be able to click on them to see their user profile.

## List of Article Nodes with an Image Field and a Link

With this example, we'll create a page in our mobile application that displays a list of articles with their image field and node title. Clicking on the article will navigate the app to the corresponding article node page. For this example to work, we'll need a few Article nodes created with images under node/add/article on our Drupal site.  Also, the "View published content" permission needs to be given to both the Anonymous and Authenticated user roles under admin/people/permissions.

Now we're ready to display a list of articles, along with their image field, and a link to view the article node in the DrupalGap mobile app. Let's create a custom page with our custom module in DrupalGap:

![Article Images List](http://www.drupalgap.org/sites/default/files/article-images.png)

```
/**
 * Implements hook_menu().
 */
function my_module_menu() {
    try {
      var items = {};
            items['article_images'] = {
              title: 'Article Images',
              page_callback: 'my_module_article_images'
            };
     };
      return items;
    }
    catch (error) { console.log('hook_menu failed - ' + error); }
}
 
/**
 * The page callback to display the view my_module_article_images.
 */
function my_module_article_images() {
  try {
    var content = {};
       
    content['my_articles_list'] = {
      theme: 'view',
      format: 'ul',
      path: 'article-images', /* the path to the view in Drupal */
      row_callback: 'my_module_article_images_list_row',
      empty_callback: 'my_module_article_images_list_empty',
      attributes: {
        id: 'article_listing_items'
      }
    };
       
        return content;
  }
  catch (error) { console.log('my_module_article_images - ' + error); }
}
 
/**
 * The row callback to render a single row.
 */
function my_module_article_images_list_row(view, row) {
  try {
        
      var image_html = theme('image', { path: row.field_image.src });
      var title_html = '<h2>' + row.title + '</h2>';
      var link = l(image_html + title_html, 'node/' + row.nid);
    
      return link;
            
  }
  catch (error) { console.log('my_module_article_images_list_row - ' + error); }
}
 
/**
 * Callback function for no results.
 */
function my_module_article_images_list_empty(view) {
  try {
    return '<p>Sorry, no articles were found.</p>';
  }
  catch (error) { console.log('my_module_article_images_list_empty - ' + error); }
}
```

Now if we view our newly created page in the App, we'll see a list of articles along with their titles, image, and be able to click on them to see the full article node page.