With jQuery Mobile's [swipe](http://api.jquerymobile.com/swipe/), [swipeleft](http://api.jquerymobile.com/swipeleft/) and [swiperight](http://api.jquerymobile.com/swiperight/) events, we can easily detect a swipe motion from the user, and then navigate execute some custom code.

Here's a simple example that detects a swiperight event on page, and then moves the user back one page:

```
/**
 * Implements hook_menu().
 */
function my_module_menu() {
  try {
    var items = {};
    items['simple_page'] = {
      title: 'My simple page',
      page_callback: 'my_module_simple_page'
    };
    return items;
  }
  catch (error) { console.log('my_module_menu - ' + error); }
}

/**
 * The page callback for the simple page.
 */
function my_module_simple_page() {
  try {
    
    // Build the page content.
    var content = {};
    content['my_stuff'] = {
      markup: '<p>Blah blah...</p>'
    };
    
    // Set up a swipe handler to be included in the page content.
    var page_id = drupalgap_get_page_id();
    content['my_swipe_handler'] = {
      markup: drupalgap_jqm_page_event_script_code({
          page_id: page_id,
          jqm_page_event: 'pageshow',
          jqm_page_event_callback: 'my_module_page_swiperight',
          jqm_page_event_args: JSON.stringify({
              page_id: page_id
          })
      })
    };
    
    return content;
  }
  catch (error) { console.log('my_module_simple_page - ' + error); }
}

/**
 * A swiperight handler function for the simple page.
 */
function my_module_page_swiperight(options) {
  try {
    $('#' + options.page_id).on('swiperight', function(event) {
        drupalgap_back();
    });
  }
  catch (error) { console.log('my_module_page_swiperight - ' + error); }
}
```

## Add to Swiperight to Go Back to Every Page:

Add a swiperight to every page to allow you to go back one page.  

***PLEASE NOTE***: You need to reference the [jQuery Documentation](../Page_Events/jQuery_document) to see where to add the code below. If you are following the info on this link, then you would add this content to your `my_module.inline.js` file you just created in jQuery Documentation page.

```
(function ($) {

  $(document).on('pageshow',function(){

    //BACK when swiperight 
    //Bind the swiperightHandler callback function to the swipe event on
    $('div[data-role="page"]').on( "swiperight", drupalgap_swiperightHandler );

    // Callback function references the event target and adds the 'swiperight' class to it
    function drupalgap_swiperightHandler( event ){
      var current_page_id = drupalgap_get_page_id();
      $('div[data-role="page"]#' + current_page_id).on('swiperight', function(event) {
        drupalgap_back();
      });
    }
  }); //end of generic pageshow

}(jQuery));
```