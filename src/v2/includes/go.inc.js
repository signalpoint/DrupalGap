/**
 * Given a path, this will change the current page in the app.
 * @param {String} path
 * @return {*}
 */
function drupalgap_goto(path) {
  try {
    $location = drupalgap_ng_get('location');
    $location.path('/' + path);
  }
  catch (error) { console.log('drupalgap_goto - ' + error); }
}

