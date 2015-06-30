/**
 *
 * @returns {Object}
 */

function dg_route_access() {
  try {
    dpm('dg_route_access');
    console.log(arguments);
    var access = false;
    var route = typeof arguments[0] !== 'undefined' ?
      arguments[0] : dg_route_get();
    var account = typeof arguments[1] !== 'undefined' ?
      arguments[1] : dg_user_get();
    console.log(route);
    console.log(account);
    if (account.uid == 1) { return true; }
    if (route['$$route'].access_callback) {
      if (route['$$route'].access_arguments) {
        // @TODO this isn't converting the page arguments to their potential
        // path values (i.e. integers are converted to arg()), check out the
        // route object, it may have parsed the args for us already.
        access = window[route['$$route'].access_callback].apply(
          null,
          route['$$route'].access_arguments
        );
      }
      else {
        access = window[route['$$route'].access_callback]();
      }
    }
    else if (route['$$route'].access_arguments) {
      for (var i = 0; i < route['$$route'].access_arguments.length; i++) {
        var access_argument = route['$$route'].access_arguments[i];
        access = dg_user_access.apply(null, [access_argument, account]);
        if (access) { break; }
      }
    }
    return access;
  }
  catch (error) {
    console.log('dg_route_access - ' + error);
  }
}
/**
 * Get the current Angular "route" object.
 * @see https://docs.angularjs.org/api/ngRoute/provider/$routeProvider
 * @return {Object}
 */
function dg_route_get() {
  try {
    dpm('dg_route_get');
    var $route = dg_ng_get('route');
    console.log($route);
    return $route.current;
  }
  catch (error) { console.log('dg_route_get - ' + error); }
}

