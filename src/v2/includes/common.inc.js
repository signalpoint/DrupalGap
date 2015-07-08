/**
 * Implementation of arg(index = null, path = null).
 * @return {*}
 */
function arg() {
  try {
    var result = null;
    // If there were zero or one arguments provided.
    if (arguments.length == 0 || arguments.length == 1) {
      // Split the path into parts.
      var drupalgap_path = dg_path_get();
      var args = drupalgap_path.split('/');
      // If no arguments were provided just return the split array, otherwise
      // return whichever argument was requested.
      if (arguments.length == 0) { result = args; }
      else if (args[arguments[0]]) { result = args[arguments[0]]; }
    }
    else {
      // A path was provided, split it into parts, then return the split array
      // if they didn't request a specific index, otherwise return the value of
      // the specific index inside the split array.
      var path = arguments[1];
      var args = path.split('/');
      if (arguments[0] && args[arguments[0]]) { result = args[arguments[0]]; }
      else { result = args; }
    }
    return result;
  }
  catch (error) { console.log('arg - ' + error); }
}

/**
 * Converts a JSON object to an XML/HTML tag attribute string and returns the
 * string.
 * @param {Object} attributes
 * @return {String{
 */
function dg_attributes(attributes) {
  try {
    //dpm('dg_attributes');
    //console.log(attributes);
    var attribute_string = '';
    if (attributes) {
      for (var name in attributes) {
          if (!attributes.hasOwnProperty(name)) { continue; }
          var value = attributes[name];
          if (value != '') {
            // @todo - if someone passes in a value with double quotes, this
            // will break. e.g.
            // 'onclick':'_drupalgap_form_submit("' + form.id + "');'
            // will break, but
            // 'onclick':'_drupalgap_form_submit(\'' + form.id + '\');'
            // will work.
            attribute_string += name + '="' + value + '" ';
          }
          else {
            // The value was empty, just place the attribute name on the
            // element, unless it was an empty class.
            if (name != 'class') { attribute_string += name + ' '; }
          }
      }
    }
    return attribute_string;
  }
  catch (error) { console.log('dg_attributes - ' + error); }
}

/**
 *
 */
function dg_check_visibility(data) {
  try {
    var visible = true;
    
    // Roles.
    if (
      typeof data.roles !== 'undefined' &&
      data.roles &&
      data.roles.value &&
      data.roles.value.length != 0
    ) {
      for (var role_index in data.roles.value) {
          if (!data.roles.value.hasOwnProperty(role_index)) { continue; }
          var role = data.roles.value[role_index];
          if (dg_user_has_role(role)) {
            // User has role, show/hide the block accordingly.
            if (data.roles.mode == 'include') { visible = true; }
            if (data.roles.mode == 'exclude') { visible = false; }
          }
          else {
            // User does not have role, show/hide the block accordingly.
            if (data.roles.mode == 'include') { visible = false; }
            if (data.roles.mode == 'exclude') { visible = true; }
          }
          // Break out of the loop if already determined to be visible.
          if (visible) { break; }
      }
    }
    
    return visible;
  }
  catch (error) { console.log('dg_check_visibility - ' + error); }
}

/**
 * Given a JS function name, this returns true if the function exists in the
 * scope, false otherwise.
 * @param {String} name
 * @return {Boolean}
 */
function dg_function_exists(name) {
  try {
    return (eval('typeof ' + name) == 'function');
  }
  catch (error) {
    alert('dg_function_exists - ' + error);
  }
}

/**
 * Given a string separated by underscores or hyphens, this will return the
 * camel case version of a string. For example, given "foo_bar" or "foo-bar",
 * this will return "fooBar".
 * @see http://stackoverflow.com/a/2970667/763010
 */
function dg_get_camel_case(str) {
  try {
    return str.replace(/[-_]([a-z])/g, function (g) { return g[1].toUpperCase(); });
  }
  catch (error) { console.log('dg_get_camel_case - ' + error); }
}

/**
 *
 */
function dg_kill_camel_case(str, separator) {
  try {
    return str.replace(/([A-Z])/g, separator + '$1');
  }
  catch (error) { console.log('dg_kill_camel_case - ' + error); }
}

/**
 *
 */
function dg_language_default() {
  try {
    dpm('dg_language_default');
    var drupalSettings = dg_ng_get('drupalSettings');
    console.log(drupalSettings);
    return typeof drupalSettings.language !== 'undefined' ?
      drupalSettings.language : 'und';
  }
  catch (error) { console.log('dg_language_default - ' + error); }
}

/**
 *
 */
function dg_ng_compile($compile, $scope, html) {
  try {
    var linkFn = $compile(html);
    return linkFn($scope);
  }
  catch (error) { console.log('dg_ng_compile - ' + error); }
}

/**
 *
 */
function dg_ng_get(key) {
  try {
    return drupalgap.ng[key];
  }
  catch (error) { console.log('dg_ng_get - ' + error); }
}

/**
 *
 */
function dg_ng_set(key, value) {
  try {
    drupalgap.ng[key] = value;
  }
  catch (error) { console.log('dg_ng_set - ' + error); }
}

/**
 * Get the current DrupalGap path.
 * @return {String}
 */
function dg_path_get() {
  try {
    var $location = dg_ng_get('location');
    return $location['$$path'].slice('1');
  }
  catch (error) { console.log('dg_path_get - ' + error); }
}

/**
 * Returns a link.
 * @return {String}
 */
function l() {
  try {
    // Grab the text and the path from the arguments and then build a simple
    // link object.
    var text = arguments[0];
    var path = arguments[1];
    var link = {'text': text, 'path': path};
    // Determine if there are any incoming link options, if there are, attach
    // them to the link object. If there are any attributes, extract them from
    // the options and attach them directly to the link object.
    var options = null;
    if (arguments[2]) {
      options = arguments[2];
      if (options.attributes) { link.attributes = options.attributes; }
      link.options = options;
    }
    return theme('link', link);
  }
  catch (error) { console.log('l - ' + error); }
}

/**
 * Returns translated text.
 * @param {String} str The string to translate
 * @return {String}
 */
function t(str) {
  return str;
}

