DrupalGap utilizes [jQuery Mobile Page Transitions](http://www.w3schools.com/jquerymobile/jquerymobile_transitions.asp) when navigating between pages. Here are some example techniques for using page transitions when navigating our mobile apps:

## Using drupalgap_goto()

`drupalgap_goto('my_custom_page', {transition:'flip'});`

## Using l()

`var my_link = l('Users', 'user-listing', {transition:'flip'});`

## Using hook_menu()

```
/**
 * Implements hook_menu().
 */
function my_module_menu() {
  var items = {
    my_custom_page:{
      title:"My Custom Page",
      page_callback:"my_module_custom_page",
      options:{
        transition:'pop'
      }
    }
  };
  return items;
}
```

## Using a page_callback function from a hook_menu() item

```
function my_module_custom_page() {
  var content = {
    my_link:{
      text:"My Link",
      path:"my_other_custom_page,
      theme:"link",
      options:{
        transition:'flip'
      }
    }
  };
  return content;
}
```

## Using a menu link in the settings.js file

```
drupalgap.settings.menus['my_menu'] = {
  links:[
    {
      title:"My Link",
      path:"my_custom_page",
      options:{
        transition:'flip',
        attributes:{"data-icon":"star"}
      }
    }
  ]
};
```