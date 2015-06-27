/**
 * Execute the page callback associated with the current path and return its
 * content.
 * @param {Object} $compile
 * @param {Object} $injector
 * @return {Object}
 */
function menu_execute_active_handler($compile, $injector) {
  try {
    //dpm('menu_execute_active_handler');
    
    var path = dg_path_get();
    //dpm('path: ' + path);
    
    var route = dg_route_get();
    //dpm('route');
    //console.log(route);
    
    // Determine the page_callback function.
    var page_callback = typeof route['$$route'].page_callback !== 'undefined' ?
      route['$$route'].page_callback : null;
    if (!page_callback || !dg_function_exists(page_callback)) { return '<p>404</p>'; }
    
    // Determine the page_arguments, if any.
    var page_arguments = typeof route['$$route'].page_arguments !== 'undefined' ?
      route['$$route'].page_arguments : null;
    
    // Call the page_callback, with or without arguments. For each page
    // argument, if the argument is an integer, grab the corresponding arg(#),
    // otherwise just push the arg onto the page arguments. Then try to prepare
    // any entity that may be present in the url so the entity is sent via the
    // page arguments to the page callback, instead of just sending the integer.
    if (!page_arguments) { return window[page_callback](); }
    var _page_args = [];
    var args = arg(null, path);
    for (var index in page_arguments) {
      if (!page_arguments.hasOwnProperty(index)) { continue; }
      var object = page_arguments[index];
      if (dg_is_int(object) && args[object]) { _page_args.push(args[object]); }
      else { _page_args.push(object); }
    }
    return window[page_callback].apply(null, Array.prototype.slice.call(_page_args));
  }
  catch (error) {
    console.log('menu_execute_active_handler - ' + error);
  }
}
