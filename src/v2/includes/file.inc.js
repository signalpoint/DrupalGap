/**
 * Reads entire file into a string and returns the string. Returns false if
 * it fails.
 * @param {String} path
 * @param {Object} options
 * @return {String}
 */
function dg_file_get_contents(path, options) {
  try {
    var file = false;
    var default_options = {
      type: 'GET',
      url: path,
      dataType: 'html',
      data: null,
      async: false,
      success: function(data) { file = data; },
      error: function(xhr, textStatus, errorThrown) {
        console.log(
          'dg_file_get_contents - failed to load file (' + path + ')'
        );
      }
    };
    $.extend(default_options, options);
    jQuery.ajax(default_options);
    return file;
  }
  catch (error) { console.log('dg_file_get_contents - ' + error); }
}

/**
 * Checks if a given file exists, returns true or false.
 * @param  {string} path
 *   A path to a file
 * @return {bool}
 *   True if file exists, else false.
 */
function dg_file_exists(path) {
  try {
    var http = new XMLHttpRequest();
    http.open('HEAD', path, false);
    http.send();
    return http.status!=404;
  }
  catch (error) { console.log('dg_file_exists - ' + error); }
}

/**
 * Given a variable name and value, this will save the value to local storage,
 * keyed by its name.
 * @param {String} name
 * @param {*} value
 * @return {*}
 */
function dg_save(name, value) {
  try {
    if (!value) { value = ' '; } // store null values as a single space*
    else if (dg_is_int(value)) { value = value.toString(); }
    else if (typeof value === 'object') { value = JSON.stringify(value); }
    return window.localStorage.setItem(name, value);
    // * phonegap won't store an empty string in local storage
  }
  catch (error) {
    console.log('dg_save - ' + error);
  }
}

/**
 * Given a variable name and a default value, this will first attempt to load
 * the variable from local storage, if it can't then the default value will be
 * returned.
 * @param {String} name
 * @param {*} default_value
 * @return {*}
 */
function dg_load(name, default_value) {
  try {
    var value = window.localStorage.getItem(name);
    if (!value) { value = default_value; }
    if (value == ' ') { value = ''; } // Convert single spaces to empty strings.
    if ( // auto parse json objects
      value.length &&
      value.charAt(0) == '{' &&
      value.charAt(value.length - 1) == '}'
    ) { value = JSON.parse(value); }
    return value;
  }
  catch (error) {
    console.log('dg_load - ' + error);
  }
}

/**
 * Given a variable name, this will remove the value from local storage.
 * @param {String} name
 * @return {*}
 */
function dg_delete(name) {
  try {
    return window.localStorage.removeItem(name);
  }
  catch (error) {
    console.log('dg_delete - ' + error);
  }
}

