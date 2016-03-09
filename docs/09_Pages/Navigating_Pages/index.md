For other techniques on navigating between pages, review the [Links](../Links) page.

Once we have created some pages in our mobile application, we'll want to be able to navigate between them. To see how to navigate between two pages, let's create two pages. Each page will have a button link that sends our user to the other page.

![Page One](http://drupalgap.org/sites/default/files/page-one.png)

![page Two](http://drupalgap.org/sites/default/files/page-two.png)

```
/**
 * Implements hook_menu().
 */
function my_module_menu() {
  var items = {};
  items['page_one'] = {
    title: 'Page One',
    page_callback: 'my_module_page_one'
  };
  items['page_two'] = {
    title: 'Page Two',
    page_callback: 'my_module_page_two'
  };
  return items;
}

/**
 * Callback function for page one.
 */
function my_module_page_one() {
  var content = {};
  content['page_two_button'] = {
    path: 'page_two',
    text: 'Go to Page Two',
    theme: 'button_link'
  };
  return content;
}

/**
 * Callback function for page two.
 */
function my_module_page_two() {
  var content = {};
  content['page_one_button'] = {
    path: 'page_one',
    text: 'Go to Page One',
    theme: 'button_link'
  };
  return content;
}
```

Next, we'll set the front page of our app to the first page so we can navigate between the two pages.

Now, when we load our app we'll be able to navigate between the two pages.
