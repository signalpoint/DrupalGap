Using `hook_page_build()`, we can alter existing pages provided by DrupalGap core, or pages provided by DrupalGap contributed modules.

```
/**
 * Implements hook_page_build().
 */
function my_module_page_build(output) {
  switch (drupalgap_router_path_get()) {
  
  // Alter the privatemsg module's user messages page.
    case 'user-messages/%':

      // Add a custom autocomplete widget.
      output.search = {
        theme: 'autocomplete',
        remote: true,
        path: 'drupalgap/search-messages',
        value: 'thread_id',
        label: 'subject',
        filter: 'name'
      };
      break;
      
    
    default:
    
      // All other pages...
    
      // Add a brand name..
      output.brand = { markup: '<p>Cool brand name!</p>' };
      
      break;
  }
  console.log('my_chat_page_build', output);
}
```

