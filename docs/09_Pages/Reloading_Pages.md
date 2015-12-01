By default, when you visit a page in DrupalGap, the page is assembled and then placed into the DOM. This allows the page to be quickly accessed on subsequent visits with no need to re-assemble it. However, sometimes we want to force a page to be reloaded. To do this, we'll use the reloadPage property. Here are a few examples of ways to force a reload on a page.

## Using drupalgap_goto()

`drupalgap_goto('my_custom_page', {reloadPage:true});`

## Using l()

`var my_link = l('Users', 'user-listing', {reloadPage:true});`

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
        reloadPage:true
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
      path:"my_other_custom_page",
      theme:"link",
      options:{
        reloadPage:true
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
        reloadPage:true,
        attributes:{"data-icon":"star"}
      }
    }
  ]
};
```