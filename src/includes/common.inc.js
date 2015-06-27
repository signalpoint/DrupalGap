/**
 * Given an Angular route, this will return the corresponding DrupalGap path.
 * @param {String} route Then angular route as a full URL path.
 * @return {String}  The DrupalGap path.
 */
function drupalgap_angular_get_route_path(route) {
  try {
    var find = '#/';
    var pos = route.indexOf(find);
    if (pos == -1) { return false; }
    return route.substr(pos + find.length, route.length - (pos + find.length));
  }
  catch (error) { console.log('drupalgap_angular_get_route_path - ' + error); }
}

/**
 * Returns true if the directive exists, false otherwise.
 * @param {Object} $injector
 * @param {String} directive The directive name.
 */
function dg_directive_exists($injector, directive) {
  try {
    return $injector.has(directive + 'Directive');
  }
  catch (error) { console.log('dg_directive_exists - ' + error); }
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
                if (data.pages.mode == 'include') { visible = false; }
                else if (data.pages.mode == 'exclude') { visible = true; }
                if (!match) { visible = !visible; }
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
 * Given an entity type and entity, this will return the bundle name as a
 * string for the given entity, or null if the bundle is N/A.
 * @param {String} entity_type The entity type.
 * @param {Object} entity The entity JSON object.
 * @return {*}
 */
function drupalgap_get_bundle(entity_type, entity) {
  try {
    var bundle = null;
    switch (entity_type) {
      case 'node': bundle = entity.type; break;
      case 'user': bundle = 'user'; break;
      case 'comment':
      case 'file':
      case 'taxonomy_vocabulary':
      case 'taxonomy_term':
        // These entity types don't have a bundle.
        break;
      default:
        console.log(
          'WARNING: drupalgap_get_bundle - unsupported entity type (' +
            entity_type +
          ')'
        );
        break;
    }
    return bundle;
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
 * Get the current DrupalGap router_path.
 * @return {String}
 */
function drupalgap_router_path_get() {
  try {
    var $route = drupalgap_ng_get('route');
    return $route.current['$$route'].path;
  }
  catch (error) { console.log('drupalgap_router_path_get - ' + error); }
}

/**
 * Set the current DrupalGap router_path.
 * @param {String} router_path
 * @deprecated
 */
function drupalgap_router_path_set(router_path) {
  console.log('DEPRECATED - drupalgap_path_set() is handled by Angular!');
  return;
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

