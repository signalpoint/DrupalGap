This tutorial shows some example code for displaying some text with button links to anonymous users and an authenticated user's view of content for your home page.

```
/**
 * The page callback to display the view.
 */
function my_module_articles_page() {
  try {
    var content = {};
   
    // Logged out users.
    if (Drupal.user.uid == 0) {
      content['my_intro_text'] = {
        markup: '<p><center><strong>Welcome to my App!</strong></center></p>'
      },
      content['youtubelink'] = {
        theme: 'button_link',
        text: t('App Tutorial Video'),
        path: 'http://www.youtube.com',
        options: {InAppBrowser: true}
      },
      content['signup'] = {
        theme: 'button_link',
        text: t('Email Signup'),
        path: 'user/register',
      },
      content['login'] = {
        theme: 'button_link',
        text: t('Login'),
        path: 'user/login',
      };
    }
    
    // Logged in users.
    else {
      content['my_articles_list'] = {
        theme: 'view',
        format: 'ul',
        path: 'my-articles', /* the path to the view in Drupal */
        row_callback: 'my_module_articles_list_row',
        empty_callback: 'my_module_articles_list_empty',
        attributes: {
          id: 'my_articles_list_view'
        }
      };
    }
   
    return content;
  }
  catch (error) { console.log('my_module_articles_page - ' + error); }
}
```

Displaying of the button links comes from the [Button Widget](../../../../Widgets/Buttons) tutorial.

In the `settings.js` file, set `drupalgap.settings.front = 'articles';`, and that page is powered 

```
/**
 * Implements hook_menu().
 */
function my_module_menu() {
  var items = {};
  items['articles'] = {
    title: 'Articles',
    page_callback: 'my_module_articles_page'
  };
  return items;
}
```