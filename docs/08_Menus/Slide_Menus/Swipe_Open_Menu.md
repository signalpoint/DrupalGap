Continuing from the example above, we can make this menu open when the user swipes from left to right.

Give the menu button link a unique class name attribute:

`'class': 'ui-btn-left my_panel_block_button_icon'`

Then append this content to the button link block's content:

```
// Attach a swipe listener for the menu.
var page_id = drupalgap_get_page_id();
content += drupalgap_jqm_page_event_script_code({
    page_id: page_id,
    jqm_page_event: 'pageshow',
    jqm_page_event_callback: 'fq_user_menu_swiperight',
    jqm_page_event_args: JSON.stringify({
        page_id: page_id
    })
});
```

Then you can create this function:

```
/**
*
*/
function my_panel_block_swiperight(options) {
  try {
    $('#' + options.page_id).on('swiperight', function(event) {
        $('#' + options.page_id + ' .region_header .my_panel_block_button_icon').click();
    });
  }
  catch (error) { console.log('my_panel_block_swiperight - ' + error); }
}
```

You may have to tweak your CSS selector in your `swiperight` handler.
