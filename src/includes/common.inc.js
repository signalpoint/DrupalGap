/**
 * Converts a JSON object to an XML/HTML tag attribute string and returns the
 * string.
 * @param {Object} attributes
 * @return {String{
 */
function drupalgap_attributes(attributes) {
  try {
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
            // element.
            attribute_string += name + ' ';
          }
      }
    }
    return attribute_string;
  }
  catch (error) { console.log('drupalgap_attributes - ' + error); }
}

/**
 * Used by drupalgap_render_region to check the visibility settings on region
 * links and blocks. Just like Drupal Blocks, this function checks the
 * visibility rules specified by role or pages specified in data. Returns true
 * by default, otherwise it will return true or false depending on the first
 * visibility setting present in data.
 * @param {String} type
 * @param {Object} data
 * @return {Boolean}
 */
function drupalgap_check_visibility(type, data) {
  try {
    var visible = true;
    if (typeof data === 'undefined') {
      console.log(
        'drupalgap_check_visibility - WARNING - no data provided for type (' +
        type + ')'
      );
    }
    // Roles.
    else if (typeof data.roles !== 'undefined' &&
      data.roles && data.roles.value && data.roles.value.length != 0) {
      for (var role_index in data.roles.value) {
          if (!data.roles.value.hasOwnProperty(role_index)) { continue; }
          var role = data.roles.value[role_index];
          if (drupalgap_user_has_role(role)) {
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
    // Pages.
    else if (typeof data.pages !== 'undefined' && data.pages &&
      data.pages.value && data.pages.value.length != 0) {
      var current_path = drupalgap_path_get();
      var current_path_parts = current_path.split('/');
      for (var page_index in data.pages.value) {
          if (!data.pages.value.hasOwnProperty(page_index)) { continue; }
          var path = data.pages.value[page_index];
          if (path == '') { path = drupalgap.settings.front; }
          if (path == current_path) {
            if (data.pages.mode == 'include') { visible = true; }
            else if (data.pages.mode == 'exclude') { visible = false; }
            break;
          }
          else {
            // It wasn't a direct path match, is there a wildcard that matches
            // the router path?
            if (path.indexOf('*') != -1) {
              var router_path =
                drupalgap_get_menu_link_router_path(current_path);
              if (router_path.replace(/%/g, '*') == path) {
                if (data.pages.mode == 'include') { visible = true; }
                else if (data.pages.mode == 'exclude') { visible = false; }
                break;
              }
              else {
                var path_parts = path.split('/');
                var match = true;
                if (path_parts.length == 0) { match = false; }
                else if (path_parts.length == current_path_parts.length) {
                  for (var i = 0; i < path_parts.length; i++) {
                    if (path_parts[i] != current_path_parts[i]) {
                      match = false;
                      break;
                    }
                  }
                }
                if (match) {
                  if (data.pages.mode == 'include') { visible = false; }
                  else if (data.pages.mode == 'exclude') { visible = true; }
                }
              }
            }
            else {
              // There's no wildcard in the rule, and it wasn't a direct path
              // match.
              if (data.pages.mode == 'include') { visible = false; }
              else if (data.pages.mode == 'exclude') { visible = true; }
            }
          }
      }
    }
    return visible;
  }
  catch (error) { console.log('drupalgap_check_visibility - ' + error); }
}

/**
 * @deprecated
 * @ see entity_get_bundle()
 */
function drupalgap_get_bundle(entity_type, entity) {
  try {
    var msg = 'WARNING - drupalgap_get_bundle() is deprecated, use ' +
      'entity_get_bundle() instead!';
    console.log(msg);
    return entity_get_bundle(entity_type, entity);
  }
  catch (error) { console.log('drupalgap_get_bundle - ' + error); }
}

/**
 * Returns the path to a system item (module, theme, etc.), returns false if it
 * can't find it.
 * @param {String} type
 * @param {String} name
 * @return {*}
 */
function drupalgap_get_path(type, name) {
  try {
    var path = null;
    if (type == 'module') {
      var found_module = false;
      for (var bundle in Drupal.modules) {
          if (!Drupal.modules.hasOwnProperty(bundle)) { continue; }
          var modules = Drupal.modules[bundle];
          if (found_module) { break; }
          else {
            for (var index in modules) {
                if (!modules.hasOwnProperty(index)) { continue; }
                var module = modules[index];
                if (module.name == name) {
                  found_module = true;
                  path = '';
                  if (bundle == 'core') { path += 'modules'; }
                  else if (bundle == 'contrib') { path += 'app/modules'; }
                  else if (bundle == 'custom') { path += 'app/modules/custom'; }
                  else {
                    var msg = 'drupalgap_get_path - unknown module bundle (' +
                      bundle +
                    ')';
                    drupalgap_alert(msg);
                    break;
                  }
                  path += '/' + name;
                  break;
                }
            }
          }
      }
    }
    else if (type == 'theme') {
      if (name == 'easystreet3' || name == 'ava') { path = 'themes/' + name; }
      else { path = 'app/themes/' + name; }
    }
    else {
      console.log(
        'WARNING: drupalgap_get_path - unsupported type (' + type + ')'
      );
    }
    return path;
  }
  catch (error) { console.log('drupalgap_get_path - ' + error); }
}

/**
 * Given an error message, this will log the message to the console and goto
 * the error page, if it isn't there already. If Drupal.settings.debug is set
 * to true, this function will also alert the error. You may optionally send in
 * a second message that will be displayed to the user via an alert dialog box.
 * @param {String} message
 */
function drupalgap_error(message) {
  try {
    // Generate a developer error message, log it to the console, then alert
    // the message if debugging is enabled.
    var error_message = 'drupalgap_error() - ' +
                        arguments.callee.caller.name + ' - ' +
                        message;
    dpm(error_message);
    if (Drupal.settings.debug) { drupalgap_alert(error_message); }
    // If a message for the user was passed in, display it to the user.
    if (arguments[1]) { drupalgap_alert(arguments[1]); }
    // Goto the error page if we are not already there.
    if (drupalgap_path_get() != 'error') { drupalgap_goto('error'); }
  }
  catch (error) { console.log('drupalgap_error - ' + error); }
}

/**
 * Given a link JSON object, this will return its attribute class value, or null
 * if it isn't set.
 * @param {Object} link
 * @return {String}
 */
function drupalgap_link_get_class(link) {
  try {
    var css_class = null;
    if (
      link.options && link.options.attributes &&
      link.options.attributes['class'] &&
      !empty(link.options.attributes['class'])
    ) { css_class = link.options.attributes['class']; }
    return css_class;
  }
  catch (error) { console.log('drupalgap_link_get_class - ' + error); }
}

/**
 * Get the current DrupalGap path.
 * @return {String}
 */
function drupalgap_path_get() {
  try {
    var path = drupalgap.path;
    return path;
  }
  catch (error) { console.log('drupalgap_path_get - ' + error); }
}

/**
 * Set the current DrupalGap path.
 * @param {String} path
 */
function drupalgap_path_set(path) {
  try { drupalgap.path = path; }
  catch (error) { console.log('drupalgap_path_set - ' + error); }
}

/**
 * Get the current DrupalGap router_path.
 * @return {String}
 */
function drupalgap_router_path_get() {
  try {
    var router_path = drupalgap.router_path;
    return router_path;
  }
  catch (error) { console.log('drupalgap_router_path_get - ' + error); }
}

/**
 * Set the current DrupalGap router_path.
 * @param {String} router_path
 */
function drupalgap_router_path_set(router_path) {
  try { drupalgap.router_path = router_path; }
  catch (error) { console.log('drupalgap_router_path_set - ' + error); }
}

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
      var drupalgap_path = drupalgap_path_get();
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
 * Returns a button link.
 * @return {String}
 */
function bl() {
  try {
    // Grab the text and the path.
    var text = arguments[0];
    var path = arguments[1];
    // Build the default options and attributes, if necessary.
    var options = null;
    if (arguments[2]) {
      options = arguments[2];
    }
    else { options = {}; }
    if (!options.attributes) { options.attributes = { }; }
    options.attributes['data-role'] = 'button';
    return l(text, path, options);
  }
  catch (error) { console.log('bl - ' + error); }
}

/**
 * Returns translated text.
 * @param {String} str The string to translate
 * @return {String}
 */
function t(str) {
  var lang = arguments[3] ? arguments[3] : Drupal.settings.language_default;
  if (
    lang != 'und' &&
    typeof drupalgap.locale[lang] !== 'undefined' &&
    drupalgap.locale[lang][str]
  ) { return drupalgap.locale[lang][str]; }
  return str;
}

