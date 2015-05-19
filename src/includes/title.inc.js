/**
 * An interal callback used to handle the setting of the page title during the
 * pageshow event.
 * @param {*} page_arguments
 */
function _drupalgap_page_title_pageshow(page_arguments) {
  try {
    var router_path = drupalgap_router_path_get();
    // Set the page title. First we'll see if the hook_menu() item has a
    // title variable set, then check for a title_callback function.
    var title_arguments = [];
    if (typeof drupalgap.menu_links[router_path].title !== 'undefined') {
      drupalgap_set_title(drupalgap.menu_links[router_path].title);
    }
    if (
      typeof drupalgap.menu_links[router_path].title_callback !== 'undefined'
    ) {
      var function_name = drupalgap.menu_links[router_path].title_callback;
      if (drupalgap_function_exists(function_name)) {
        // Grab the title callback function.
        var fn = window[function_name];
        // Place the internal success callback handler on the front of the
        // title arguments.
        title_arguments.unshift(_drupalgap_page_title_pageshow_success);
        // Are there any additional arguments to send to the title callback?
        if (drupalgap.menu_links[router_path].title_arguments) {
          // For each title argument, if the argument is an integer, grab the
          // corresponding arg(#), otherwise just push the arg onto the title
          // arguments.
          var args = arg(null, drupalgap_path_get());
          var _title_arguments = drupalgap.menu_links[router_path].title_arguments;
          for (var index in _title_arguments) {
              if (!_title_arguments.hasOwnProperty(index)) { continue; }
              var object = _title_arguments[index];
              if (is_int(object) && args[object]) {
                title_arguments.push(args[object]);
              }
              else { title_arguments.push(object); }
          }
        }
        // Call the title callback function with the title arguments.
        drupalgap_set_title(
          fn.apply(
            null,
            Array.prototype.slice.call(title_arguments)
          )
        );
      }
    }
    else {
      _drupalgap_page_title_pageshow_success(drupalgap_get_title());
    }
  }
  catch (error) { console.log('_drupalgap_page_title_pageshow - ' + error); }
}

/**
 * An internal function used to set the page title when the page title callback
 * function is successful.
 * @param {String} title
 */
function _drupalgap_page_title_pageshow_success(title) {
  try {
    var id = system_title_block_id(drupalgap_path_get());
    $('h1#' + id).html(title);
  }
  catch (error) {
    console.log('_drupalgap_page_title_pageshow_success - ' + error);
  }
}

