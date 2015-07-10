/*! drupalgap 2015-07-10 */
// Create the drupalgap object.
var drupalgap = {
  blocks: [],
  content_types_list: {}, /* holds info about each content type */
  date_formats: {}, /* @see system_get_date_formats() in Drupal core */
  date_types: {}, /* @see system_get_date_types() in Drupal core */
  entity_info: {},
  field_info_fields: {},
  field_info_instances: {},
  field_info_extra_fields: {},
  menus: {},
  modules: {},
  ng: {}, /* holds onto angular stuff */
  remote_addr: null, /* php's $_SERVER['REMOTE_ADDR'] via system connect */
  sessid: null,
  session_name: null,
  site_settings: {}, /* holds variable settings from the Drupal site */
  user: {} /* holds onto the current user's account object */
};

// Create the drupalgap module for Angular.
angular.module('drupalgap', [])
  .value('drupalgapSettings', null)
  .service('dgConnect', ['$q', '$http', 'drupalSettings', dgConnect])
  .service('dgOffline', ['$q', dgOffline])
  .config(function() {
     // @WARNING Synchronous XMLHttpRequest on the main thread is deprecated.
     // @TODO allow a developer mode to live sync the drupalgap.json content using an api key
     var json = JSON.parse(dg_file_get_contents('app/js/drupalgap.json'));
     for (var name in json) {
       if (!json.hasOwnProperty(name)) { continue; }
       drupalgap[name] = json[name];
     }
  });

// Grab the app's dependencies from the index.html file.
var dg_dependencies = [];
var _dg_dependencies = dg_ng_dependencies();
for (var parent in _dg_dependencies) {
  if (!_dg_dependencies.hasOwnProperty(parent)) { continue; }
  var dg_parent = _dg_dependencies[parent];
  for (var module_name in dg_parent) {
    if (!dg_parent.hasOwnProperty(module_name)) { continue; }
    var module = dg_parent[module_name];
    if (!module.name) { module.name = module_name; }
    dg_dependencies.push(module_name);
    if (parent == 'drupalgap') {
      drupalgap.modules[module_name] = module;
    }

  }
}
dpm(drupalgap.modules);

// Create the app with its dependencies.
var dgApp = angular.module('dgApp', dg_dependencies);

// Run the app.
dgApp.run([
    '$rootScope', '$routeParams', '$location', '$http', 'drupal', 'drupalSettings', 'drupalgapSettings',
    function($rootScope, $routeParams, $location, $http, drupal, drupalSettings, drupalgapSettings) {

      //dpm('dgApp.run()');
      //console.log(arguments);

      dg_ng_set('routeParams', $routeParams);
      dg_ng_set('location', $location);
      dg_ng_set('http', $http);
      dg_ng_set('drupal', drupal);
      dg_ng_set('drupalSettings', drupalSettings);
      dg_ng_set('drupalgapSettings', drupalgapSettings);

      // Watch for changes in the Angular route (this is fired twice per route change)...
      /*$rootScope.$on("$locationChangeStart", function(event, next, current) {

          // Extract the current menu path from the Angular route, and warn
          // about any uncrecognized routes.
          // @TODO this doesn't do anything, but it's a good placeholder for
          // future needs/hooks while pages are changing. Revisit these two
          // function's implementations now that we have a better understanding
          // of Angular's routing.
          var path_current = drupalgap_angular_get_route_path(current);
          var path_next = drupalgap_angular_get_route_path(next);
          if (!path_next) {
            if (!drupalgap_path_get()) { return; } // Don't warn about the first page load.
            console.log('locationChangeStart - unsupported path: ' + path_next);
          }

      });*/
  }
]);

/**
 *
 */
function dgConnect($q, $http, drupalSettings) {
  try {
    this.json_load = function() {
      // First, try to load the json from local storage.
      var json = dg_load('drupalgap.json', null);
      if (json) { dpm('loaded json from local storage'); }
      // The json wasn't in local storage, if we don't have a connection load the
      // drupalgap.json file from the app directory, if it exists.
      else if (!dg_check_connection()) {
        var path = 'app/js/drupalgap.json';
        if (dg_file_exists(path)) {
          dpm('loaded json from file system, saving it to local storage');
          json = JSON.parse(dg_file_get_contents(path));
          dg_save('drupalgap.json', json);
        }
        else {
          dpm('file does not exist');
        }
      }
      if (json) {
        return $q(function(resolve, reject) {
          setTimeout(function() {
              resolve(json);
          }, 100);
        });
      }
      return null;
    };
  }
  catch (error) { console.log('dgConnect - ' + error); }
}

/**
 *
 */
function dgOffline($q) {
  try {
    this.connect = function() {
      var anonymous_user = {
        "sessid": null,
        "session_name": null,
        "user": dg_user_defaults()
      };
      return $q(function(resolve, reject) {
        setTimeout(function() {
            resolve(anonymous_user);
        }, 100);
      });
    }
  }
  catch (error) { console.log('dgOffline - ' + error); }
}


/**
 *
 */
function drupalgap_block_load(delta) {
  try {
    for (var index in drupalgap.blocks) {
      if (!drupalgap.blocks.hasOwnProperty(index)) { continue; }
      var block = drupalgap.blocks[index];
      if (block.delta == delta) { return block; }
    }
    return null;
  }
  catch (error) { console.log('drupalgap_block_load - ' + error); }
}

/**
 *
 */
function drupalgap_render_block(delta, block) {
  try {
    angular.merge(block, drupalgap_block_load(delta));
    //console.log('loaded block');
    //console.log(block);
    var function_name = block.module + '_block_view';
    if (!dg_function_exists(function_name)) {
      console.log('WARNING: ' + function_name + '() does not exist, so we are skipping this block: ' + delta);
      return '';
    }
    return dg_render(window[function_name](block.delta));
  }
  catch (error) { console.log('drupalgap_render_block - ' + error); }
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
    var drupalSettings = dg_ng_get('drupalSettings');
    return typeof drupalSettings.language !== 'undefined' ?
      drupalSettings.language : 'und';
  }
  catch (error) { console.log('dg_language_default - ' + error); }
}

function dg_is_array(obj) {
  return Array.isArray(obj);
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


/**
 *
 */
function drupalgap_json_load() {
  try {
    
  }
  catch (error) { console.log('drupalgap_json_load - ' + error); }
}


/**
 * Checks the devices connection and sets drupalgap.online to true if the
 * device has a connection, false otherwise.
 * @return {String}
 *   A string indicating the type of connection according to PhoneGap.
 */
function dg_check_connection() {
  try {
    
    return true;

    // If we're not in PhoneGap (i.e. a web app environment, or Ripple), we'll
    // assume we have a connection. Is this a terrible assumption? Anybody out
    // there know?
    // http://stackoverflow.com/q/15950382/763010
    if (
      drupalgap.settings.mode != 'phonegap' ||
      typeof parent.window.ripple === 'function'
    ) {
      drupalgap.online = true;
      return 'Ethernet connection';
    }

    var networkState = navigator.connection.type;
    var states = {};
    states[Connection.UNKNOWN] = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI] = 'WiFi connection';
    states[Connection.CELL_2G] = 'Cell 2G connection';
    states[Connection.CELL_3G] = 'Cell 3G connection';
    states[Connection.CELL_4G] = 'Cell 4G connection';
    states[Connection.NONE] = 'No network connection';
    if (states[networkState] == 'No network connection') {
      drupalgap.online = false;
    }
    else {
      drupalgap.online = true;
    }
    return states[networkState];
  }
  catch (error) { console.log('drupalgap_check_connection - ' + error); }
}

/**
 *
 */
function dg_session_get() {
  try {
    return {
      sessid: drupalgap.sessid,
      session_name: drupalgap.session_name,
      user: dg_user_get()
    };
  }
  catch (error) { console.log('dg_session_get - ' + error); }
}


/**
 *
 */
function dg_session_set(data) {
  try {
    drupalgap.sessid = data.sessid;
    drupalgap.session_name = data.session_name;
    dg_user_set(data.user);
  }
  catch (error) { console.log('dg_session_set - ' + error); }
}


/**
 * @deprecated
 */
function drupalgap_attributes(attributes) {
  try {
    console.log(
      'DEPRECATED - drupalgap_attributes(): use dg_attributes() instead in ' +
      arguments.callee.caller.name + '()'
    );
    return dg_attributes(attributes);
  }
  catch (error) { console.log('drupalgap_attributes - ' + error); }
}

/**
 * @deprecated
 * @see dg_check_connection()
 */
function drupalgap_check_connection() {
  console.log(
    'DEPRECATED - drupalgap_check_connection(): use dg_check_connection() instead in ' +
    arguments.callee.caller.name + '()'
  );
  return dg_check_connection();
}

/**
 * @deprecated
 * @see dg_check_visibility().
 */
function drupalgap_check_visibility(type, data) {
  console.log(
    'DEPRECATED - drupalgap_check_visibility(): use dg_check_visibility() instead in ' +
    arguments.callee.caller.name + '()'
  );
  return dg_check_visibility(data);
}

/**
 * @deprecated
 */
function drupalgap_field_info_field(field_name) {
  try {
    console.log(
      'DEPRECATED - drupalgap_field_info_field(): use dg_field_info_field() instead in ' +
      arguments.callee.caller.name + '()'
    );
    return dg_field_info_field(field_name);
  }
  catch (error) { console.log('drupalgap_field_info_field - ' + error); }
}

/**
 * @deprecated
 */
function drupalgap_field_info_instance(entity_type, field_name, bundle_name) {
  console.log(
    'DEPRECATED - drupalgap_field_info_instance(): use dg_field_info_instance() instead in ' +
    arguments.callee.caller.name + '()'
  );
  return dg_field_info_instance(entity_type, field_name, bundle_name)
}

/**
 * @deprecated
 */
function drupalgap_field_info_instances(entity_type, bundle_name) {
  console.log(
    'DEPRECATED - drupalgap_field_info_instances(): use dg_field_info_instances() instead in ' +
    arguments.callee.caller.name + '()'
  );
  return dg_field_info_instances(entity_type, bundle_name);
}

/**
 * @deprecated
 * @see dg_file_exists()
 */
function drupalgap_file_exists(path) {
  console.log(
    'DEPRECATED - drupalgap_file_exists(): use dg_file_exists() instead in ' +
    arguments.callee.caller.name + '()'
  );
  return dg_file_exists(path);
}

/**
 * @deprecated
 */
function drupalgap_function_exists(name) {
  try {
    console.log(
      'DEPRECATED - drupalgap_function_exists(): use dg_function_exists() instead in ' +
      arguments.callee.caller.name + '()'
    );
    return dg_function_exists(name);
  }
  catch (error) { console.log('drupalgap_function_exists - ' + error); }
}

/**
 * Given a form_id, this will return a form with a directive attribute for it.
 * @param {String} form_id
 * @return {String}
 * @deprecated
 */
/*function drupalgap_get_form(form_id) {
  try {
    console.log(
      'DEPRECATED - drupalgap_get_form() - instead, use a directive with this name: ' +
      dg_get_camel_case(form_id)
    );
    return;
  }
  catch (error) { console.log('drupalgap_get_form - ' + error); }
}*/

/**
 * @deprecated
 */
function drupalgap_form_defaults(form_id) {
  try {
    console.log(
      'DEPRECATED - drupalgap_form_defaults(): use dg_form_defaults() instead in ' +
      arguments.callee.caller.name + '(), and pass $scope to it'
    );
    return dg_form_defaults(form_id);
  }
  catch (error) { console.log('drupalgap_form_defaults - ' + error); }
}

/**
 * @deprecated
 */
function drupalgap_file_get_contents(path, options) {
  try {
    console.log(
      'DEPRECATED - drupalgap_file_get_contents(): use dg_file_get_contents() instead in ' +
      arguments.callee.caller.name + '()'
    );
    return dg_file_get_contents(path, options);
  }
  catch (error) { console.log('drupalgap_file_get_contents - ' + error); }
}

/**
 * @deprecated
 */
function drupalgap_form_get_element_id(name, form_id) {
  console.log(
    'DEPRECATED - drupalgap_form_get_element_id(): use dg_form_get_element_id() instead in ' +
    arguments.callee.caller.name + '()'
  );
  return dg_form_get_element_id(name, form_id);
}

/**
 * @deprecated
 */
function drupalgap_form_render(form) {
  console.log(
    'DEPRECATED - drupalgap_form_render(): use dg_form_render() instead in ' +
    arguments.callee.caller.name + '()'
  );
  return dg_form_render(form);
}

/**
 * @deprecated
 */
function drupalgap_get_camel_case(str) {
  try {
    console.log('DEPRECATED - drupalgap_get_camel_case(), use dg_get_camel_case() instead');
    return dg_get_camel_case(str);
  }
  catch (error) { console.log('drupalgap_get_camel_case - ' + error); }
}

/**
 * @deprecated
 */
function drupalgap_kill_camel_case(str, separator) {
  try {
    console.log('DEPRECATED - drupalgap_kill_camel_case(), use dg_kill_camel_case() instead');
    return dg_kill_camel_case(str, separator);
  }
  catch (error) { console.log('drupalgap_kill_camel_case - ' + error); }
}

/**
 *
 */
function drupalgap_ng_get(key) {
  try {
    console.log(
      'DEPRECATED - drupalgap_ng_get(): use dg_ng_get() instead in ' +
      arguments.callee.caller.name + '()'
    );
    return dg_ng_get(key);
  }
  catch (error) { console.log('drupalgap_ng_get - ' + error); }
}

/**
 *
 */
function drupalgap_ng_set(key, value) {
  try {
    console.log(
      'DEPRECATED - drupalgap_ng_set(): use dg_ng_set() instead in ' +
      arguments.callee.caller.name + '()'
    );
    dg_ng_set(key, value);
  }
  catch (error) { console.log('drupalgap_ng_set - ' + error); }
}

/**
 * Get the current DrupalGap path.
 * @return {String}
 */
function drupalgap_path_get() {
  try {
    console.log(
      'DEPRECATED - drupalgap_path_get(): use dg_path_get() instead in ' +
      arguments.callee.caller.name + '()'
    );
    return dg_path_get();
  }
  catch (error) { console.log('drupalgap_path_get - ' + error); }
}

/**
 * Set the current DrupalGap path.
 * @param {String} path
 * @deprecated
 */
function drupalgap_path_set(path) {
  console.log(
    'DEPRECATED - drupalgap_path_set(): is now handled by Angular, the caller is being ignored:' +
    arguments.callee.caller.name + '()'
  );
  return;
}

/**
 * @see dg_render()
 * @deprecated
 * @param content
 * @returns {String}
 */
function drupalgap_render(content) {
  console.log(
    'DEPRECATED - drupalgap_render(): use dg_render() instead in ' +
    arguments.callee.caller.name + '()'
  );
  return dg_render(content);
}

/**
 * @deprecated
 * @see dg_user_has_role()
 */
function drupalgap_user_has_role() {
  console.log(
    'DEPRECATED - drupalgap_user_has_role(): use dg_user_has_role() instead in ' +
    arguments.callee.caller.name + '()'
  );
  if (arguments.length == 1) { return dg_user_has_role(arguments[0]); }
  else if (arguments.length == 2) {
    return dg_user_has_role(arguments[0], arguments[0]);
  }
}

/**
 * @deprecated
 * @see drupal_entity_primary_key_title()
 */
function entity_primary_key(entity_type) {
  console.log(
    'DEPRECATED - entity_primary_key(): use drupal_entity_primary_key() instead in ' +
    arguments.callee.caller.name + '()'
  );
  return drupal_entity_primary_key(entity_type);
}

/**
 * @deprecated
 * @see drupal_entity_primary_key_title()
 */
function entity_primary_key_title(entity_type) {
  console.log(
    'DEPRECATED - entity_primary_key_title(): use drupal_entity_primary_key_title() instead in ' +
    arguments.callee.caller.name + '()'
  );
  return drupal_entity_primary_key_title(entity_type);
}

/**
 * @deprecated
 */
function empty(value) {
  console.log(
    'DEPRECATED - empty(): use dg_empty() instead in ' +
    arguments.callee.caller.name + '()'
  );
  return dg_empty(value);
}

/**
 * Set the current DrupalGap path.
 * @param {String} path
 * @deprecated
 */
function is_int(n) {
  console.log(
    'DEPRECATED - is_int(): use dg_is_int() instead in ' +
    arguments.callee.caller.name + '()'
  );
  return dg_is_int(n);
}

/**
 *
 */
function language_default() {
  try {
    console.log(
      'DEPRECATED - language_default(): use dg_language_default() instead in ' +
      arguments.callee.caller.name + '()'
    );
    return dg_language_default();
  }
  catch (error) { console.log('language_default - ' + error); }
}

/**
 * @deprecated
 * @see dg_module_implements()
 */
function module_implements(hook) {
  console.log(
    'DEPRECATED - module_implements(): use dg_module_implements() instead in ' +
    arguments.callee.caller.name + '()'
  );
  return dg_module_implements(hook);
}

/**
 * @see https://api.drupal.org/api/drupal/includes!module.inc/function/module_invoke/7
 */
function module_invoke(module, hook) {
  console.log(
    'DEPRECATED - module_invoke(): use dg_module_invoke() instead in ' +
    arguments.callee.caller.name + '()'
  );
  return dg_module_invoke.apply(null, Array.prototype.slice.call(arguments));
}

/**
 * @deprecated
 * @see module_invoke_all()
 */
function module_invoke_all(hook) {
  console.log(
    'DEPRECATED - module_invoke_all(): use dg_module_invoke_all() instead in ' +
    arguments.callee.caller.name + '()'
  );
  if (arguments.length == 1) { return dg_module_invoke_all(hook); }
  return dg_module_invoke_all.apply(null, Array.prototype.slice.call(arguments));
}

/**
 * Given a JSON object or string, this will print it to the console. It accepts
 * an optional boolean as second argument, if it is false the output sent to the
 * console will not use pretty printing in a Chrome/Ripple environment.
 * @param {Object} data
 */
function dpm(data) {
  try {

    if (typeof data !== 'undefined') {
      if (typeof parent.window !== 'undefined' && typeof parent.window.ripple === 'function') {
        if (typeof arguments[1] !== 'undefined' && arguments[1] == false) {
          console.log(JSON.stringify(data));
        }
        else {
          console.log(data);
        }
      }
      else if (typeof data === 'object') { console.log(data); }
      else if (data == '') { console.log('<empty-string>'); }
      else { console.log(data); }
    }
    else { console.log('<undefined>'); }

    // Show the caller name.
    //var caller = arguments.callee.caller.name + '()';
    //console.log(caller);

  }
  catch (error) { console.log('dpm - ' + error); }
}


/**
 * Returns an array of entity type names.
 * @return {Array}
 */
function dg_entity_types() {
  try {
    var entity_types = [];
    var entity_info = dg_entity_get_info();
    for (var entity_type in entity_info) {
      if (!entity_info.hasOwnProperty(entity_type)) { continue; }
      entity_types.push(entity_type);
    }
    return entity_types;
  }
  catch (error) { console.log('dg_entity_types - ' + error); }
}

/**
 * @see https://api.drupal.org/api/drupal/includes!common.inc/function/entity_get_info/7
 * @param {String|null} entity_type
 */
function dg_entity_get_info() {
  try {
    var entity_type = typeof arguments[0] !== 'undefined' ? arguments[0] : null;
    if (entity_type) { return drupalgap.entity_info[entity_type]; }
    return drupalgap.entity_info;
  }
  catch (error) { console.log('dg_entity_get_info - ' + error); }
}
/**
 * @see https://api.drupal.org/api/drupal/modules!field!field.info.inc/function/field_info_extra_fields/7
 */
function dg_field_info_extra_fields(entity_type, bundle, context) {
  try {
    return drupalgap.field_info_extra_fields[entity_type][bundle][context];
  }
  catch (error) {
    console.log('dg_field_info_extra_fields - ' + error);
  }
}

/**
 * Given a field name, this will return its field info.
 * @param {String} field_name
 * @return {Object}
 */
function dg_field_info_field(field_name) {
  try {
    return drupalgap.field_info_fields[field_name];
  }
  catch (error) { console.log('dg_field_info_field - ' + error); }
}

/**
 * Given an entity type and/or a bundle name, this returns the field info
 * instances for the entity or the bundle.
 * @param {String} entity_type
 * @param {String} bundle_name
 * @return {Object}
 */
function dg_field_info_instances(entity_type, bundle_name) {
  try {
    var field_info_instances = null;
    // If there is no bundle, pull the fields out of the wrapper.
    // @TODO there appears to be a special case with commerce_products, in that
    // they aren't wrapped like normal entities (see the else statement when a
    // bundle name isn't present). Or do we have a bug here, and we shouldn't
    // be expecting the wrapper in the first place?
    if (!bundle_name) {
      if (entity_type == 'commerce_product') {
        field_info_instances =
          drupalgap.field_info_instances[entity_type];
      }
      else if (
        typeof drupalgap.field_info_instances[entity_type] !== 'undefined' &&
        typeof drupalgap.field_info_instances[entity_type][entity_type] !== 'undefined'
      ) {
        field_info_instances =
          drupalgap.field_info_instances[entity_type][entity_type];
      }
    }
    else {
      if (typeof drupalgap.field_info_instances[entity_type] !== 'undefined') {
        field_info_instances =
          drupalgap.field_info_instances[entity_type][bundle_name];
      }
    }
    return field_info_instances;
  }
  catch (error) { console.log('dg_field_info_instances - ' + error); }
}

/**
 * Given an entity type, field name, and bundle name this will return a JSON
 * object with data for the specified field name.
 * @param {String} entity_type
 * @param {String} field_name
 * @param {String} bundle_name
 * @return {Object}
 */
function dg_field_info_instance(entity_type, field_name, bundle_name) {
  try {
    var instances = dg_field_info_instances(entity_type, bundle_name);
    if (!instances) {
      var msg = 'WARNING: dg_field_info_instance - instance was null ' +
        'for entity (' + entity_type + ') bundle (' + bundle_name + ') using ' +
        'field (' + field_name + ')';
      console.log(msg);
      return null;
    }
    if (!instances[field_name]) {
      var msg = 'WARNING: dg_field_info_instance - ' +
        '"' + field_name + '" does not exist for entity (' + entity_type + ')' +
        ' bundle (' + bundle_name + ')';
      console.log(msg);
      return null;
    }
    return instances[field_name];
  }
  catch (error) { console.log('dg_field_info_instance - ' + error); }
}
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


/**
 *
 */
function drupalgap_form_render_elements(form) {
  try {
    //dpm('drupalgap_form_render_elements');
    //console.log(form);
    var html = '';
    if (!form.elements) { return html; }
    for (var name in form.elements) {
      if (!form.elements.hasOwnProperty(name)) { continue; }
      html += drupalgap_form_render_element(form, form.elements[name]);
    }
    return html;
  }
  catch (error) { console.log('drupalgap_form_render - ' + error); }
}

/**
 *
 */
function drupalgap_form_render_element(form, element) {
  try {
    //dpm('drupalgap_form_render_element');
    //console.log(form);
    //console.log(element.name);
    //console.log(element);

    // Preprocess element if necessary...

    // @TODO great spot for a hook.


    // There are two main "types" of form elements, "flat" elements like node title
    // and node id, and many typical elements created on custom forms. Then there
    // are "field" elements like a node body provided by Drupal's entity system.
    // Flat elements will be rendered as is through the dg theme layer, field elements
    // will be passed along to their hook_field_widget_form() implementer.

    // FLAT ELEMENTS
    if (typeof element.field_name === 'undefined') {

      // Submit button.
      if (element.type == 'submit') {
        element.attributes['class'] += ' dg_form_submit_button ';
        if (typeof element.attributes['data-ng-click'] === 'undefined') {
          element.attributes['data-ng-click'] = 'drupalgap_form_submit(\'' + form.id + '\', form_state);';
        }
        if (typeof element.attributes['value'] === 'undefined' && element.value) {
          element.attributes['value'] = element.value;
        }
      }
      else {
        // All other elements should have an ng-model attached, which allows the
        // form state values to be properly assembled and ready for validation and
        // submission handlers.
        if (typeof element.attributes['ng-model'] === 'undefined') {
          element.attributes['ng-model'] = "form_state['values']['" + element.name + "']";
        }
      }

      return theme('form_element', { element: element });

    }

    // FIELD ELEMENTS
    else {

      var language = form.entity ? form.entity.language : dg_language_default();

      // Determine the hook_field_widget_form().
      var hook = element.field_info_instance.widget.module + '_field_widget_form';
      if (!dg_function_exists(hook)) {
        console.log(hook + '() is missing!');
        return '';
      }

      // Prepare the container children and element items, if any.
      var children = '';
      var items = null;
      if (form.entity) { items = form.entity[element.name][language]; }

      // Field label.
      children += theme('form_element_label', { element: element });

      // New entity.
      if (!items) {
        var delta = 0;
        element = window[hook](
          form,
          null, // form_state
          element.field_info_field, // field
          element.field_info_instance, // instance
          language,
          null, // items
          delta, // delta
          dg_form_element_field_item_element_create(
            form.elements[element.name].attributes.id,
            element.name,
            language,
            delta
          ) // element
        );
        children += theme(element.type, element);
      }

      // Existing entity.
      else {

        for (var delta in items) {
          if (!items.hasOwnProperty(delta)) { continue; }
          var item = items[delta];
          element = window[hook](
            form,
            null, // form_state
            element.field_info_field, // field
            element.field_info_instance, // instance
            language,
            items, // items
            delta, // delta
            dg_form_element_field_item_element_create(
              form.elements[element.name].attributes.id,
              element.name,
              language,
              delta
            ) // element
          );
          children += theme(element.type, element);
        }
      }

      /*if (element.field_info_field.cardinality == '-1') {
        children += '';
      }*/

      return theme('container', {
        element: {
          children: children
        }
      });

    }
    


  }
  catch (error) { console.log('drupalgap_form_render_element - ' + error); }
}

/**
  * @param {Object} element
  */
function dg_form_element_ng_model_attribute(element) {
  try {
    return "form_state.values['" + element.name + "']";
  }
  catch (error) {
    console.log('dg_form_element_ng_model_attribute - ' + error);
  }
}

/**
 *
 */
function dg_form_element_field_id_attribute(id, language, delta) {
  try {
    return id + '-' + language + '-' + delta + '-value';
  }
  catch (error) {
    console.log('dg_form_element_field_id_attribute - ' + error);
  }
}

/**
 *
 */
function dg_form_element_field_name_attribute(name, language, delta) {
  try {
    return name + '[' + language + '][' + delta + '][value]';
  }
  catch (error) {
    console.log('dg_form_element_field_name_attribute - ' + error);
  }
}

/**
 *
 */
function dg_form_element_field_ng_model_attribute(name, language, delta) {
  try {
    // The ng-model needs the language code and value wrapped in single quotes.
    return 'form_state.values.' + name + "['" + language + "'][" + delta + "]['value']";
  }
  catch (error) {
    console.log('dg_form_element_field_ng_model_attribute - ' + error);
  }
}

/**
 *
 * @param variables
 * @returns {string}
 */
function dg_form_element_field_item_element_create(id, name, language, delta) {
  try {
    return {
      attributes: {
        id: dg_form_element_field_id_attribute(id, language, delta),
        name: dg_form_element_field_name_attribute(name, language, delta),
        'ng-model': dg_form_element_field_ng_model_attribute(name, language, delta)
      }
    }
  }
  catch (error) {
    console.log('dg_form_element_field_item_element_create - ' + error);
  }
}

/**
 *
 */
function theme_form_element(variables) {
  try {
    return '<div>' +
      theme('form_element_label', { element: variables.element } ) +
      theme(variables.element.type, {
          attributes: variables.element.attributes,
          element: variables.element
      }) +
    '</div>';
  }
  catch (error) { console.log('theme_form_element - ' + error); }
}

/**
 *
 */
function theme_form_element_label(variables) {
  try {
    return typeof variables.element.title !== 'undefined' ?
      variables.element.title : '';
  }
  catch (error) { console.log('theme_form_element_label - ' + error); }
}

/**
 *
 */
function dg_form_element_set_empty_options_and_attributes(form, language) {
  try {
    // Set empty options and attributes properties on each form element if the
    // element does not yet have any. This allows others to more easily modify
    // options and attributes on an element without having to worry about
    // testing for nulls and creating empty properties first.
    for (var name in form.elements) {
      if (!form.elements.hasOwnProperty(name)) { continue; }
      var element = form.elements[name];
      var element_is_field = typeof element.field_name !== 'undefined' ? true : false;

      if (!element.attributes) {
        form.elements[name].attributes = { };
      }
      id = dg_form_get_element_id(name, form.id);
      form.elements[name].id = id;
      form.elements[name].name = name;
      form.elements[name].attributes.id = id;

      // Flat elements.
      if (!element_is_field) {

      }

      // Field elements.
      else {

        // Load its field_info_field and field_info_instance onto the element.
        form.elements[name].field_info_field = dg_field_info_field(name);
        form.elements[name].field_info_instance = dg_field_info_instance(
          form.entity_type,
          name,
          form.bundle
        );

        // Set the title property on the element if it isn't already set.
        if (!form.elements[name].title) {
          form.elements[name].title = t(form.elements[name].field_info_instance.label);
        }

      }

      continue;







      //form.elements[name].is_field = element_is_field; // @TODO Drupal does not use this boolean flag at all.



      // If the element is a field, we'll append a language code and delta
      // value to the element id, along with the field items appended
      // onto the element using the language code and delta values.
      var id = null;
      if (element_is_field) {
        // What's the number of allowed values (cardinality) on this field?
        // A cardinality of -1 means the field has unlimited values.
        var cardinality = parseInt(element.field_info_field.cardinality);
        if (cardinality == -1) {
          cardinality = 1; // we'll just add one element for now, until we
                           // figure out how to handle the 'add another
                           // item' feature.
        }
        // Initialize the item collections language code if it hasn't been.
        if (!form.elements[name][language]) {
          form.elements[name][language] = {};
        }
        // Prepare the item(s) for this element.
        for (var delta = 0; delta < cardinality; delta++) {
          // Prepare some item defaults.
          var item = drupalgap_form_element_item_create(
            name,
            form,
            language,
            delta
          );
          // If the delta for this item hasn't been created on the element,
          // create it using the default item values. Otherwise, merge the
          // default values into the pre existing item on the element.
          if (!form.elements[name][language][delta]) {
            form.elements[name][language][delta] = item;
          }
          else {
            $.extend(true, form.elements[name][language][delta], item);
          }
        }
      }
    }
  }
  catch (error) { console.log('dg_form_element_set_empty_options_and_attributes - ' + error); }
}

/**
 * Given a form element name and the form_id, this generates an html id
 * attribute value to be used in the DOM. An optional third argument is a
 * string language code to use. An optional fourth argument is an integer delta
 * value to use on field elements.
 * @param {String} name
 * @param {String} form_id
 * @return {String}
 */
function dg_form_get_element_id(name, form_id) {
  try {
    if (name == null || name == '') { return ''; }
    var id =
      'edit-' +
      //form_id.toLowerCase().replace(/_/g, '-') + '-' +
      name.toLowerCase().replace(/_/g, '-');
    // Any language code to append to the id?
    if (arguments[2]) { id += '-' + arguments[2]; }
    // Any delta value to append to the id?
    if (typeof arguments[3] !== 'undefined') {
      id += '-' + arguments[3] + '-value';
    }
    return id;
  }
  catch (error) { console.log('dg_form_get_element_id - ' + error); }
}


/**
 *
 */
function drupalgap_get_form(form_id) {
  try {
    dpm('drupalgap_get_form');
    console.log(form_id);
    return theme('form', { form_id: form_id });
    // Set up form defaults.
    /*var form = {
      attributes: {
        id: form_id,
        'class': []
      }
    };*/
    // Set up a directive attribute to handle this form, then theme and return.
    //form.attributes[] = '';
  }
  catch (error) { console.log('drupalgap_get_form - ' + error); }
}

/**
 *
 */
function theme_form(variables) {
  try {
    // Theme the form as an Angular directive based on the form's id.
    var directive = variables.form_id.replace(/_/g, '-')
    return '<' + directive + '></' + directive + '>';
    //return '<form ' + dg_attributes(variables.form.attributes) + '></form>';
  }
  catch (error) { console.log('theme_form - ' + error); }
}

/**
 *
 */
function dg_form_render(form) {
  try {
    // Render the prefix and suffix and wrap them in their own div.
    var prefix = form.prefix;
    if (!dg_empty(prefix)) {
      prefix = '<div class="form_prefix">' + prefix + '</div>';
    }
    var suffix = form.suffix;
    if (!dg_empty(suffix)) {
      suffix = '<div class="form_suffix">' + suffix + '</div>';
    }
    return '<form ' + dg_attributes(form.attributes) + '>' +
      prefix +
      drupalgap_form_render_elements(form) +
      suffix +
    '</form>';
  }
  catch (error) { console.log('drupalgap_form_render - ' + error); }
}

/**
 * Given a form id, this will assemble and return the default form JSON object.
 * @param {String} form_id
 * @return {Object}
 */
function dg_form_defaults(form_id, $scope) {
  try {
    var form = {};
    
    // Set the form id, elements, buttons, options and attributes.
    form.id = form_id;
    form.elements = {};
    form.buttons = {};
    form.attributes = {
      id: form_id,
      'class': ''
    };
    
    // Create a prefix and suffix.
    form.prefix = '';
    form.suffix = '';
    
    // Create empty arrays for the form's validation and submission handlers.
    form.validate = [];
    form.submit = [];
    
    if (!$scope.form_state) { $scope.form_state = { values: { } } };
    
    // FORM SUBMIT HANDLER
    // @TODO - who is passing the form_id and form_state to this function? we
    // probably don't need to do that anymore, because that data should already
    // be available in the scope... I think.
    $scope.drupalgap_form_submit = function() {
      
      dpm('drupalgap_form_submit');
      console.log(arguments);
      
      // Extract the form and its id along with the form state, from the scope.
      // Remember the form state values are automatically assembled by Angular,
      // unlike DrupalGap 1.x where we assembled them manually.
      var form = $scope.form;
      var form_state = $scope.form_state;
      var form_id = form.id;
      //console.log(form);
      //console.log(form_state);
      //console.log(form_id);
  
      // Clear out previous form errors.
      drupalgap.form_errors = {};
  
      // Build the form validation wrapper function.
      var form_validation = function() {
        try {
  
          // Call the form's validate function(s), if any.
          /*for (var index in form.validate) {
              if (!form.validate.hasOwnProperty(index)) { continue; }
              var fn = form.validate[index];
              fn.apply(null, Array.prototype.slice.call([form, form_state]));
          }*/
  
          // Call drupalgap form's api validate.
          // @TODO this should be replaced with Angular's way of doing things.
          //_drupalgap_form_validate(form, form_state);
  
          // If there were validation errors, show the form errors and stop the
          // form submission. Otherwise submit the form.
          /*if (!jQuery.isEmptyObject(drupalgap.form_errors)) {
            var html = '';
            for (var name in drupalgap.form_errors) {
                if (!drupalgap.form_errors.hasOwnProperty(name)) { continue; }
                var message = drupalgap.form_errors[name];
                html += message + '\n\n';
            }
            drupalgap_alert(html);
          }*/
          //else {
            form_submission();
          //}

        }
        catch (error) {
          console.log('drupalgap_form_submit - form_validation - ' + error);
        }
      };
  
      // Build the form submission wrapper function.
      var form_submission = function() {
        try {
          // Call the form's submit function(s), if any.
          for (var index in form.submit) {
            if (!form.submit.hasOwnProperty(index)) { continue; }
            var fn = form.submit[index];
            // @TODO we probably don't need to use an apply here, just call it directly since there are 2 args
            fn.apply(null, Array.prototype.slice.call([form, form_state]));
          }
        }
        catch (error) {
          console.log('drupalgap_form_submit - form_submission - ' + error);
        }
      };
  
      // Get ready to validate and submit the form, but first...
  
      // If this is an entity form, and there is an image field on the form, we
      // need to asynchronously process the image field, then continue onward
      // with normal form validation and submission.
      /*if (form.entity_type &&
        image_fields_present_on_entity_type(form.entity_type, form.bundle)
      ) {
        _image_field_form_process(form, form_state, {
            success: form_validation
        });
      }
      else {*/
        // There were no image fields on the form, proceed normally with form
        // validation, which will in turn process the submission if there are no
        // validation errors.
        form_validation();
      /*}*/
      
      
      
    }

    // Finally, return the form.
    return form;
  }
  catch (error) { console.log('dg_form_defaults - ' + error); }
}

/**
 * @param {Object} $compile
 * @param {Object} $scope
 * @param {Object|Null} hookFieldWidgetForm
 */
function dg_ng_compile_form($compile, $scope) {
  try {
    dpm('dg_ng_compile_form');
    console.log(arguments);
    
    var drupalSettings = dg_ng_get('drupalSettings');
    
    // @TODO sometime between dg_ng_compile_form() and dgFormElement.link, we
    // are losing the form state.

    dg_form_element_set_empty_options_and_attributes($scope.form, drupalSettings.language);

    // Give modules an opportunity to alter the form.
    //module_invoke_all('form_alter', $scope.form, null, $scope.form.id);

    // Place the assembled form into local storage so _drupalgap_form_submit
    // will have access to the assembled form.
    //drupalgap_form_local_storage_save($scope.form);

    // For each form element...
    for (var name in $scope.form.elements) {
      if (!$scope.form.elements.hasOwnProperty(name)) { continue; }
      var element = $scope.form.elements[name];
      //dpm(name);
      //console.log(element);
      
      if (!element.field_name) {
        if (typeof element.attributes.name === 'undefined') {
          $scope.form.elements[name].attributes.name = element.name;
        }
        if (typeof element.default_value !== 'undefined') {
          // @TODO we shouldn't be dropping all these directly in scope, let's
          // put them in their own object instead. Although this may be possible
          // to deprecate now because of our ng-model and scope.form_state usage,
          // needs testing...
          $scope[element.name] = element.default_value;
        }
      }

      // Place any hidden input's value (if any) into the scope so it can be
      // properly bound to the form state values.
      if (element.type == 'hidden') {
        if (typeof element.default_value !== 'undefined') {
          // @TODO we should probably stick these values in their own object, so
          // they aren't polluting the scope with nonsense.
          $scope[element.name] = element.default_value;
        }
        var ng_model = typeof element.attributes['ng-model'] !== 'undefined' ?
          element.attributes['ng-model'] : dg_form_element_ng_model_attribute(element);
        $scope.form.elements[name].attributes['ng-init'] = ng_model + " = " + element.attributes.name;
      }

    }

    // Finally compile the rendered form.
    return dg_ng_compile($compile, $scope, dg_form_render($scope.form));
  }
  catch (error) { console.log('dg_ng_compile_form - ' + error); }
}




/**
 * Themes a container.
 * @param {Object} variables
 * @return {String}
 */
function theme_container(variables) {
  try {
    var element = variables.element;
    var output = '<div ' + dg_attributes(variables.attributes) + '>' + element.children + '</div>';
    return output;
  }
  catch (error) { console.log('theme_container - ' + error); }
}

/**
 * Themes a form element label.
 * @param {Object} variables
 * @return {String}
 */
function theme_form_element_label(variables) {
  try {
    //dpm('theme_form_element_label');
    //console.log(element.title);
    //console.log(variables);
    var element = variables.element;
    if (dg_empty(element.title)) { return ''; }
    // Any elements with a title_placeholder set to true
    // By default, use the element id as the label for, unless the element is
    // a radio, then use the name.
    var label_for = '';
    if (element.id) { label_for = element.id; }
    else if (element.attributes && element.attributes['for']) {
      label_for = element.attributes['for'];
    }
    if (element.type == 'radios') { label_for = element.name; }
    // Render the label.
    var html =
      '<label for="' + label_for + '"><strong>' + element.title + '</strong>';
    if (element.required) { html += theme('form_required_marker', { }); }
    html += '</label>';
    return html;
  }
  catch (error) { console.log('theme_form_element_label - ' + error); }
}

/**
 * Themes a marker for a required form element label.
 * @param {Object} variables
 * @return {String}
 */
function theme_form_required_marker(variables) {
  return '*';
}

/**
 * Themes a hidden input.
 * @param {Object} variables
 * @return {String}
 */
function theme_hidden(variables) {
  try {
    variables.attributes.type = 'hidden';
    if (!variables.attributes.value && variables.value != null) {
      variables.attributes.value = variables.value;
    }
    var output = '<input ' + dg_attributes(variables.attributes) + ' />';
    return output;
  }
  catch (error) { console.log('theme_hidden - ' + error); }
}

/**
 * Themes a password input.
 * @param {Object} variables
 * @return {String}
 */
function theme_password(variables) {
  try {
    variables.attributes.type = 'password';
    var output = '<input ' + dg_attributes(variables.attributes) + ' />';
    return output;
  }
  catch (error) { console.log('theme_password - ' + error); }
}

/**
 * Themes a password input.
 * @param {Object} variables
 * @return {String}
 */
function theme_submit(variables) {
  try {
    //dpm('theme_submit');
    //console.log(variables);
    variables.attributes.type = 'submit';
    var output = '<input ' + dg_attributes(variables.attributes) + ' />';
    return output;
  }
  catch (error) { console.log('theme_submit - ' + error); }
}

/**
 * Themes a textarea input.
 * @param {Object} variables
 * @return {String}
 */
function theme_textarea(variables) {
  try {
    var value = typeof variables.value !== 'undefined' ?
      variables.value : '';
    return '<textarea ' + dg_attributes(variables.attributes) + '>' +
      value +
    '</textarea>';
  }
  catch (error) { console.log('theme_textarea - ' + error); }
}

/**
 * Themes a text input.
 * @param {Object} variables
 * @return {String}
 */
function theme_textfield(variables) {
  try {
    variables.attributes.type = 'text';
    var output = '<input ' + dg_attributes(variables.attributes) + ' />';
    return output;
  }
  catch (error) { console.log('theme_textfield - ' + error); }
}

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


/**
 * Given an argument, this will return true if it is an int, false otherwise.
 * @param {Number} n
 * @return {Boolean}
 */
function dg_is_int(n) {
  // Credit: http://stackoverflow.com/a/3886106/763010
  if (typeof n === 'string') { n = parseInt(n); }
  return typeof n === 'number' && n % 1 == 0;
}

/**
 * Returns true if given value is empty. A generic way to test for emptiness.
 * @param {*} value
 * @return {Boolean}
 */
function dg_empty(value) {
  try {
    if (value === null) { return true; }
    if (typeof value === 'object') { return Object.keys(value).length === 0; }
    return (typeof value === 'undefined' || value == '');
  }
  catch (error) { console.log('dg_empty - ' + error); }
}


dgApp.config(function(drupalgapSettings) {

  //dpm('config() - initializing...');
  //console.log(arguments);

  // @WARNING only certain providers like constants are available here, no scope
  // or values available here...
  
  drupalgap_onload(drupalgapSettings);

});

/**
 *
 */
function drupalgap_onload(drupalgapSettings) {
  try {
    dg_module_invoke_all('install');
    drupalgap_load_blocks(drupalgapSettings);
    drupalgap_load_menus(drupalgapSettings);
  }
  catch (error) { console.log('drupalgap_onload - ' + error); }
}

/**
 *
 */
function drupalgap_load_blocks(drupalgapSettings) {
  try {
    //dpm('drupalgap_load_blocks');
    //console.log(drupalgapSettings);

    // For each module type specified in drupalgapSettings (core, contrib,
    // custom)...
    var modules = drupalgapSettings.modules;
    for (var type in modules) {
      if (!modules.hasOwnProperty(type)) { continue; }

      // For each module within the type...
      var _modules = modules[type];
      for (var name in _modules) {
        if (!_modules.hasOwnProperty(name)) { continue; }

        var function_name = name + '_block_info';

        // Skip any modules that don't implement hook_block_info().
        if (!dg_function_exists(function_name)) { continue; }

        // Call the implementation of hook_block_info() for the current module,
        // then iterate over each of its blocks, placing them onto
        // drupalgap.blocks one by one.
        var module = _modules[name];
        var blocks = window[function_name]();
        //console.log(name);
        //console.log(blocks);
        for (var delta in blocks) {
          if (!blocks.hasOwnProperty(delta)) { continue; }
          var block = blocks[delta];
          if (!block.delta) { block.delta = delta; }
          if (!block.module) { block.module = name; }

          // Merge in any block settings.
          //angular.merge(block);

          // Add the block to drupalgap.blocks.
          drupalgap.blocks.push(block);
        }

      }

    }
    //dpm('BLOCKS!');
    //console.log(drupalgap.blocks);
  }
  catch (error) { console.log('drupalgap_load_blocks - ' + error); }
}

/**
 *
 */
function drupalgap_load_menus(drupalgapSettings) {
  try {
    if (!drupalgapSettings.menus) { return; }
    var menus = drupalgapSettings.menus;
    for (var name in menus) {
      if (!menus.hasOwnProperty(name)) { continue; }
      var menu = menus[name];
      if (!menu.links) { menu.links = []; }
      if (!menu.attributes) { menu.attributes = {}; }
      dg_menu_set(name, menu);
    }
  }
  catch (error) { console.log('drupalgap_load_menus - ' + error); }
}

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
    
    var route = dg_route_get();
    
    // Determine the page_callback function.
    var page_callback = typeof route['$$route'].page_callback !== 'undefined' ?
      route['$$route'].page_callback : null;
    if (!page_callback || !dg_function_exists(page_callback)) {
      console.log('The ' + page_callback + '() page_callback does not exist!');
      return '<p>404 - ' + t('Not Found') + '</p>';
    }
    
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

/**
 * Returns an array containing the names of system-defined (default) menus.
 * @return {Object}
 */
function menu_list_system_menus() {
  try {
    var system_menus = {
      admin_menu: {
        title: t('Admin')
      },
      user_menu_anonymous: {
        title: t('User menu authenticated')
      },
      user_menu_authenticated: {
        title: t('User menu authenticated')
      },
      main_menu: {
        title: t('Main menu')
      },
      /*primary_local_tasks: {
        title: t('Primary Local Tasks')
      }*/
    };
    // Add the menu_name to each menu as a property.
    for (var menu_name in system_menus) {
        if (!system_menus.hasOwnProperty(menu_name)) { continue; }
        var menu = system_menus[menu_name];
        menu.menu_name = menu_name;
    }
    return system_menus;
  }
  catch (error) { console.log('menu_list_system_menus - ' + error); }
}

/**
 *
 */
function dg_menu_get(name) {
  try {
    return drupalgap.menus[name];
  }
  catch (error) { console.log('dg_menu_get - ' + error); }
}

/**
 *
 */
function dg_menu_set(name, menu) {
  try {
    drupalgap.menus[name] = menu;
  }
  catch (error) { console.log('dg_menu_set - ' + error); }
}

/**
 * @see https://api.drupal.org/api/drupal/includes!module.inc/function/module_implements/7
 */
function dg_module_implements(hook) {
  var modules = [];
  for (var module_name in drupalgap.modules) {
    if (!drupalgap.modules.hasOwnProperty(module_name)) { continue; }
    var module = drupalgap.modules[module_name];
    if (dg_function_exists(module_name + '_' + hook)) { modules.push(module_name); }
  }
  return modules;
}

/**
 * @see https://api.drupal.org/api/drupal/includes!module.inc/function/module_invoke/7
 */
function dg_module_invoke(module, hook) {
  try {
    //dpm('dg_module_invoke');
    //dpm(arguments);
    var module_invocation_results = null;
    var module_arguments = Array.prototype.slice.call(arguments);
    var function_name = module + '_' + hook;
    if (dg_function_exists(function_name)) {
      var fn = window[function_name];
      module_arguments.splice(0, 2);
      if (module_arguments.length == 0) { module_invocation_results = fn(); }
      else { module_invocation_results = fn.apply(null, module_arguments); }
    }
    return module_invocation_results;
  }
  catch (error) { console.log('dg_module_invoke - ' + error); }
}

/**
 * @see https://api.drupal.org/api/drupal/includes!module.inc/function/module_invoke_all/7
 */
function dg_module_invoke_all(hook) {
  try {
    //dpm('dg_module_invoke_all');
    //dpm(arguments);
    var hook_args = Array.prototype.slice.call(arguments);
    hook_args.splice(0, 1);
    var results = [];
    for (var module_name in drupalgap.modules) {
      if (!drupalgap.modules.hasOwnProperty(module_name)) { continue; }
      var module = drupalgap.modules[module_name];
      var function_name = module_name + '_' + hook;
      if (dg_function_exists(function_name)) {
        var fn = window[function_name];
        var invocation_results = null;
        if (hook_args.length) { invocation_results = fn.apply(null, hook_args); }
        else { invocation_results = fn(); }
        if (dg_is_array(invocation_results)) {
          for (var i = 0; i < invocation_results.length; i++) {
            results.push(invocation_results[i]);
          }
        }
        else { results.push(invocation_results); }
      }
    }
    return results;
  }
  catch (error) {
    console.log('dg_module_invoke_all - ' + error);
  }
}

// Used to render the "dg-page" directive attribute from the theme's
// page.tpl.html file.
dgApp.directive("dgPage", function($compile, drupalgapSettings) {
    return {
      controller: function($scope, drupal, dgConnect, dgOffline) {
        
        //dpm('dgPage controller');

        dg_ng_set('scope', $scope);

        $scope.loading = 0;
        
        /*dgConnect.json_load().then(function(json) {
            dpm('made it back!');
            console.log(json);
        });*/

        if (!dg_check_connection()) {
          
          // We don't have a connection...
          
          //dpm('making an offline promise...');
          
          // Make a promise to the offline link.
          $scope.loading++;
          $scope.offline = {
            data: dgOffline.connect()
          };
          
        }
        else {

          // We have a connection...
          
          //dpm('making an online promise...');
          
          // Make a promise to the connect link.
          $scope.loading++;
          $scope.connect = {
            data: drupal.connect()
          };

        }
      },
      link: function(scope, element, attrs) {
        
        //dpm('dgPage link');
        
        if (scope.offline) {
          scope.offline.data.then(function(data) {
              
            //dpm('dgPage link offline');
              
            // Offline...

            scope.loading--;

            //dpm('fullfilled the offline promise!');
            //console.log(data);
              
            // Set the drupalgap user and session info.
            dg_session_set(data);

            dg_page_compile($compile, drupalgapSettings, scope, element, attrs);
              
          });  
        }
        else if (scope.connect) {
          
          scope.connect.data.then(function (data) {
              
            //dpm('dgPage link online');
              
            // Online...

            scope.loading--;
            
            //dpm('fullfilled the connection promise!');
            //console.log(data);
              
            dg_session_set(data);

            // Does the user have access to this route?
            if (!dg_route_access()) {
            }
            else {
            }

            dg_page_compile($compile, drupalgapSettings, scope, element, attrs);

          });

        }

      }
    };
});

function dg_page_access() {
  try {

  }
  catch (error) {
    console.log('dg_page_access - ' + error);
  }
}

dgApp.controller('dg_page_controller', [
    '$scope', '$sce', '$route', '$location', '$routeParams',
    function($scope, $sce, $route, $location, $routeParams) {
      try {

        //dpm('dg_page_controller');
        //console.log(arguments);
  
        // Place the route into the global dg ng, we don't do this in run()
        // because the route isn't fully initialized until this controller is
        // invoked.
        dg_ng_set('route', $route);
  
      }
      catch (error) { console.log('dg_page_controller - ' + error); }
  }
]);

/**
 *
 */
function dg_page_compile($compile, drupalgapSettings, scope, element, attrs) {
  try {
    var theme = drupalgapSettings.theme;
    var template = '';
    for (var name in theme.regions) {
      if (!theme.regions.hasOwnProperty(name)) { continue; }
      var region = theme.regions[name];
      template += drupalgap_render_region(angular.merge({}, region));
    }
    var linkFn = $compile(template);
    var content = linkFn(scope);
    element.append(content);
  }
  catch (error) { console.log('dg_page_compile - ' + error); }
}

/**
 *
 */
function drupalgap_render_region(region) {
  try {
    return theme('region', {
        region: region,
        blocks: drupalgap_render_region_blocks(region)
    });
  }
  catch (error) { console.log('drupalgap_render_region - ' + error); }
}

/**
 *
 */
function drupalgap_render_region_blocks(region) {
  try {
    //dpm('drupalgap_render_region_blocks');
    //console.log(region);
    if (!region.blocks) { return ''; }
    var html = '';
    for (var delta in region.blocks) {
      if (!region.blocks.hasOwnProperty(delta)) { continue; }
      var block = region.blocks[delta];
      if (dg_check_visibility(block)) {
        html += drupalgap_render_block(delta, block);
      }
    }
    return html;
  }
  catch (error) { console.log('drupalgap_render_region_blocks - ' + error); }
}

/**
 *
 */
function theme_region(variables) {
  try {
    //dpm('theme_region');
    //console.log(variables);
    var region = variables.region;
    var format = typeof region.format === 'undefined' ?
      'div' : region.format;
    return '<' + format + ' ' + dg_attributes(region.attributes) + '>' +
      variables.blocks +
    '</' + format + '>';
  }
  catch (error) { console.log('theme_region - ' + error); }
}


/**
 * Given a html string, a render object or render array, this return the html
 * representing the content's output.
 * @param {String|Object|Array} output The html string or render array to render.
 * @return {String}
 */
function dg_render(content) {
  try {
    //dpm('dg_render');
    //console.log(content);

    var type = $.type(content); // @TODO jQuery dependency here.
    if (type === 'string') { return content; }
    var html = '';
    if (type === 'object') {
      if (content.markup) { return content.markup; }
      if (content.theme) { return theme(content.theme, content); }
      for (var index in content) {
        if (!content.hasOwnProperty(index)) { continue; }
        var piece = content[index];
        var _type = $.type(piece);
        if (_type === 'object') { html += dg_render(piece); }
        else if (_type === 'array') {
          for (var i = 0; i < piece.length; i++) {
            html += dg_render(piece[i]);
          }
        }
      }
    }
    else if (type === 'array') {
      for (var i = 0; i < content.length; i++) {
        html += dg_render(content[i]);
      }
    }
    return html;
    
    
    
    
    
    // Since the output has already been assembled, render the content
    // based on the output type. The output type will either be an html string
    // or a drupalgap render object.
    var output_type = $.type(output);
    var content = '';

    // If the output came back as a string, we can render it as is. If the
    // output came back as on object, render each element in it through the
    // theme system.
    if (output_type === 'string') {
      // The page came back as an html string.
      content = output;
    }
    else if (output_type === 'object') {
      // The page came back as a render object. Let's define the names of
      // variables that are reserved for theme processing.
      var render_variables = ['theme', 'view_mode', 'language'];

      // Is there a theme value specified in the output and the registry?
      if (output.theme && drupalgap.theme_registry[output.theme]) {

        // Extract the theme object template and determine the template file
        // name and path.
        var template = drupalgap.theme_registry[output.theme];
        var template_file_name = output.theme.replace(/_/g, '-') + '.tpl.html';
        var template_file_path = template.path + '/' + template_file_name;

        // Make sure the template file exists.
        if (drupalgap_file_exists(template_file_path)) {

          // Loads the template file's content into a string.
          var template_file_html = drupalgap_file_get_contents(
            template_file_path
          );
          if (template_file_html) {

            // What variable placeholders are present in the template file?
            var placeholders = drupalgap_get_placeholders_from_html(
              template_file_html
            );
            if (placeholders) {

              // Replace each placeholder with html.
              // @todo - each placeholder should have its own container div and
              // unique id.
              for (var index in placeholders) {
                  if (!placeholders.hasOwnProperty(index)) { continue; }
                  var placeholder = placeholders[index];
                  var html = '';
                  if (output[placeholder]) {
                    // Grab the element variable from the output.
                    var element = output[placeholder];
                    // If it is markup, render it as is, if it is themeable,
                    // then theme it.
                    if (output[placeholder].markup) {
                      html = output[placeholder].markup;
                    }
                    else if (output[placeholder].theme) {
                      html = theme(output[placeholder].theme, element);
                    }
                    // Now remove the variable from the output.
                    delete output[placeholder];
                  }
                  // Now replace the placeholder with the html, even if it was
                  // empty.
                  template_file_html = template_file_html.replace(
                    '{:' + placeholder + ':}',
                    html
                  );
              }
            }
            else {
              // There were no place holders found, do nothing, ok.
            }

            // Finally add the rendered template file to the content.
            content += template_file_html;
          }
          else {
            console.log(
              'drupalgap_render - failed to get file contents (' +
                template_file_path +
              ')'
            );
          }
        }
        else {
          console.log(
            'drupalgap_render - template file does not exist (' +
              template_file_path +
              ')'
            );
        }
      }

      // Iterate over any remaining variables and theme them.
      // @todo - each remaining variables should have its own container div and
      // unique id, similar to the placeholder div containers mentioned above.
      for (var element in output) {
          if (!output.hasOwnProperty(element)) { continue; }
          var variables = output[element];
          if ($.inArray(element, render_variables) == -1) {
            content += theme(variables.theme, variables);
          }
      }
    }

    // Now that we are done assembling the content into an html string, we can
    // return it.
    return content;
  }
  catch (error) { console.log('dg_render - ' + error); }
}


/**
 *
 * @returns {Object}
 */

function dg_route_access() {
  try {
    //dpm('dg_route_access');
    //console.log(arguments);
    var access = false;
    var route = typeof arguments[0] !== 'undefined' ?
      arguments[0] : dg_route_get();
    var account = typeof arguments[1] !== 'undefined' ?
      arguments[1] : dg_user_get();
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
    var $route = dg_ng_get('route');
    return $route.current;
  }
  catch (error) { console.log('dg_route_get - ' + error); }
}


/**
 * Implementation of theme().
 * @param {String} hook
 * @param {Object} variables
 * @return {String}
 */
function theme(hook, variables) {
  try {
    
    //dpm('theme(' + hook + ')');
    //console.log(variables);
    
    // If there is HTML markup present, just return it as is. Otherwise, run
    // the theme hook and send along the variables.
    if (!variables) { variables = {}; }
    if (variables.markup) { return variables.markup; }
    var content = '';
    
    // Determine the theme function and verify its existence.
    var theme_function = 'theme_' + hook;
    if (!dg_function_exists(theme_function)) {
      console.log(theme_function + '() is missing!');
      return '';
    }
    
    // @TODO check for modules implementing the theme hook.
    
    // @TODO check for the current theme implementing the theme hook.
    
    if (typeof variables.attributes === 'undefined') {
      variables.attributes = {};
    }
    // If there is no class name, set an empty one.
    if (!variables.attributes['class']) { variables.attributes['class'] = ''; }
    
    if (!window[theme_function]) { return ''; }
    var fn = window[theme_function];
    content = fn.call(null, variables);
    return content;
    
  }
  catch (error) { console.log('theme - ' + error); }
}

/**
 * Themes a fieldset widget.
 * @param {Object} variables
 * @return {String}
 */
function theme_fieldset(variables) {
  try {
    var title = typeof variables.title !== 'undefined' ?
      variables.title : null;
    var description = typeof variables.description !== 'undefined' ?
      variables.description : null;
    var children = typeof variables.children !== 'undefined' ?
      variables.children : null;
    var html = '<fieldset ' + dg_attributes(variables.attributes) + '>';
    if (title) { html += '<legend><span class="fieldset-legend">' + title + '</span></legend>'; }
    html += '<div class="fieldset-wrapper">';
    if (description) { html += '<div class="fieldset-description">' + description + '</div>'; }
    if (children) { html += dg_render(children); }
    return html + '</div></fieldset>';
  }
  catch (error) { console.log('theme_fieldset - ' + error); }
}

/**
 * Themes a header widget.
 * @param {Object} variables
 * @return {String}
 */
function theme_header(variables) {
  try {
    var type = typeof variables.type !== 'undefined' ?
      variables.type : 'h1';
    var text = typeof variables.text !== 'undefined' ?
      variables.text : '';
    var html = '<' + type + ' ' + dg_attributes(variables.attributes) + '>' +
      text +
    '</' + type + '>';
    return html;
  }
  catch (error) { console.log('theme_header - ' + error); }
}

/**
 * Implementation of theme_item_list().
 * @param {Object} variables
 * @return {String}
 */
function theme_item_list(variables) {
  try {
    //dpm('theme_item_list');
    //console.log(variables);


    var items = variables['items'];
    var title = variables['title'];
    var type = typeof variables['type'] !== 'undefined' ?
      variables['type'] : 'ul';
    var attributes = variables['attributes'];

    // Only output the list container and title, if there are any list items.
    // Check to see whether the block title exists before adding a header.
    // Empty headers are not semantic and present accessibility challenges.
    var output = '<div class="item-list">';
    if (title && title != '') {
      output += '<h3>' + title + '</h3>';
    }

    if (!dg_empty(items)) {
      output += '<' + type + ' ' + dg_attributes(attributes) + '>';
      var num_items = items.length;
      var i = 0;
      for (var delta in items) {
        if (!items.hasOwnProperty(delta)) { continue; }
        var item = items[delta];
        attributes = {
          'class': '' // @TODO need to support arrays!
        };
        var children = [];
        var data = '';
        i++;
        if ($.type(item) !== 'string') { // @TODO jQuery dependency here!
          for (var key in item) {
            if (!item.hasOwnProperty(key)) { continue; }
            var value = item[key];
            if (key == 'data') {
              data = value;
            }
            else if (key == 'children') {
              children = value;
            }
            else {
              attributes[key] = value;
            }
          }
        }
        else {
          data = item;
        }
        if (children.length > 0) {
          // Render nested list.
          data += theme_item_list({
            items: children,
            title: null,
            type: type,
            attributes: attributes
          });
        }
        if (i == 1) {
          //attributes ['class'][] = 'first';
          attributes['class'] += ' first ';
        }
        if (i == num_items) {
          //attributes ['class'][] = 'last';
          attributes ['class'] += ' last ';
        }
        output += '<li ' + dg_attributes(attributes) + '>' + data + "</li>\n";
      }
      output += '</' + type + '>';
    }
    output += '</div>';
    return output;
  }
  catch (error) { console.log('theme_item_list - ' + error); }
}

/**
 * Implementation of theme_link().
 * @param {Object} variables
 * @return {String}
 */
function theme_link(variables) {
  try {
    //dpm('theme_link');
    //console.log(variables);
    var text = '';
    if (variables.text) { text = variables.text; }
    else if (variables.title) { text = variables.title; }
    if (typeof variables.path !== 'undefined' && variables.path != null) {

      // If the path begins with a hashtag, just render the link as is with the
      // hashtag for the href.
      /*if (variables.path.indexOf('#') == 0) {
        variables.attributes['href'] = variables.path;
        return '<a ' + dg_attributes(variables.attributes) + '>' +
          text +
        '</a>';
      }*/

      // By default our onclick will use a drupalgap_goto(). If we have any
      // incoming link options, then modify the link accordingly.
      if (variables.options) {

        // Use an InAppBrowser?
        if (variables.options.InAppBrowser) {
          variables.attributes['onclick'] =
            "javascript:window.open('" + variables.path + "', '_blank', 'location=yes');";
        }

        else {

          // Prepare the path.
          /*variables.path = _drupalgap_goto_prepare_path(variables.path);

          if (typeof variables.attributes['href'] === 'undefined') {
            variables.attributes['href'] = '#/' + variables.path;
          }*/

          // All other options need to be extracted into a JSON string for the
          // onclick handler.

          /*var goto_options = '';
          for (var option in variables.options) {
              if (!variables.options.hasOwnProperty(option)) { continue; }
              var value = variables.options[option];
              if (option == 'attributes') { continue; }
              if (typeof value === 'string') { value = "'" + value + "'"; }
              goto_options += option + ':' + value + ',';
          }
          onclick =
            'drupalgap_goto(\'' +
              variables.path + '\', ' +
              '{' + goto_options + '});';*/

        }
      }
      else {
        
        // No link options are coming in...
        
        
        
      }
      
      if (typeof variables.attributes['href'] === 'undefined') {
        variables.attributes['href'] = '#/' + variables.path;
      }

      // Is this link active?
      if (variables.path == dg_path_get()) {
        if (variables.attributes['class'].indexOf('active') == -1) {
          variables.attributes['class'] += ' active ';
        }
      }

      // Finally, return the link.
      return '<a ' + dg_attributes(variables.attributes) + '>' + text + '</a>';

    }
    else {

      // The link has no path, so just render the text and attributes.
      if (typeof variables.attributes.href === 'undefined') {
        variables.attributes.href = '#';
      }
      return '<a ' + dg_attributes(variables.attributes) + '>' +
        text +
      '</a>';

    }
  }
  catch (error) { console.log('theme_link - ' + error); }
}

/**
 * Implementation of theme_table().
 * @param {Object} variables
 * @return {String}
 */
function theme_table(variables) {
  try {
    var html = '<table ' + dg_attributes(variables.attributes) + '>';
    if (variables.header) {
      html += '<thead><tr>';
      for (var index in variables.header) {
        if (!variables.header.hasOwnProperty(index)) { continue; }
        var column = variables.header[index];
        if (column.data) {
          html += '<td>' + column.data + '</td>';
        }
      }
      html += '</tr></thead>';
    }
    html += '<tbody>';
    if (variables.rows) {
      for (var row_index in variables.rows) {
        if (!variables.rows.hasOwnProperty(row_index)) { continue; }
        var row = variables.rows[row_index];
        html += '<tr>';
        if (row) {
          for (var column_index in row) {
            if (!row.hasOwnProperty(column_index)) { continue; }
            var column = row[column_index];
            html += '<td>' + column + '</td>';
          }
        }
        html += '</tr>';
      }
    }
    return html + '</tbody></table>';
  }
  catch (error) { console.log('theme_table - ' + error); }
}

angular.module('dg_admin', ['drupalgap'])
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/admin', {
      templateUrl: 'themes/spi/page.tpl.html',
      controller: 'dg_page_controller',
      page_callback: 'dg_admin_page',
      access_arguments: ['administer drupalgap']
    });
    $routeProvider.when('/admin/connect', {
      templateUrl: 'themes/spi/page.tpl.html',
      controller: 'dg_page_controller',
      page_callback: 'dg_admin_connect_page'

    });
}]);

function dg_admin_page() {
  var content = {};
  content['links'] = {
    title: t('DrupalGap'),
    theme: 'item_list',
    items: [ // @TODO these links should be render arrays and theme_item_list should allow for render array items!
      l(t('Connect'), 'admin/connect')
    ]
  };
  var entity_info = dg_entity_get_info();
  for (var entity_type in entity_info) {
    if (!entity_info.hasOwnProperty(entity_type)) { continue; }
    var entity = entity_info[entity_type];
    content[entity_type] = {
      theme: 'fieldset',
      title: entity.plural_label,
      children: [
        {
          theme: 'item_list',
          items: [
            l(t('List'), 'admin/' + entity_type), // @TODO should be a render array
            l(t('Add'), entity_type + '/add'), // @TODO should be a render array
          ]
        }

      ]
    }
  }
  return content;
}

function dg_admin_connect_page() {
  var content = {};
  content['connect'] = {
    theme: 'textarea',
    attributes: {
      'ng-model': 'dg_connect'
    }
  };
  $http = dg_ng_get('http');
  drupalSettings = dg_ng_get('drupalSettings');
  var path = drupalSettings.site_path + drupalSettings.base_path + '?q=drupalgap/connect';
  $http.get(path).then(function(result) {
    if (result.status != 200) { return; }
    console.log(result.data);
    dg_ng_get('scope').dg_connect = JSON.stringify(result.data);
  });
  return content;
}

/**
 * Implements hook_form_alter().
 */
function dg_bootstrap_form_alter(form, form_state, form_id) {
  dpm('dg_bootstrap_form_alter');
  dpm(arguments);
}

angular.module('dg_entity', ['drupalgap'])

// ~ hook_menu()
.config(['$routeProvider', function($routeProvider) {

    var entity_types = dg_entity_types();
    console.log(entity_types);
      
      // Add routes to view and edit entities.
      for (var i = 0; i < entity_types.length; i++) {

        var entity_type = entity_types[i];
        var entity = dg_entity_get_info(entity_type);
        var route = '/' + entity_type + '/:' + entity.entity_keys.id;

        // Add.
        $routeProvider.when('/' + entity_type + '/add', {
          templateUrl: 'themes/spi/page.tpl.html',
          controller: 'dg_page_controller',
          page_callback: 'dg_entity_page_add',
          page_arguments: [0]
        });
        $routeProvider.when('/' + entity_type + '/add/:bundle', {
          templateUrl: 'themes/spi/page.tpl.html',
          controller: 'dg_page_controller',
          page_callback: 'dg_entity_page_edit',
          page_arguments: [0, 2]
        });

        // View.
        $routeProvider.when(route, {
            templateUrl: 'themes/spi/page.tpl.html',
            controller: 'dg_page_controller',
            page_callback: 'dg_entity_page_view',
            page_arguments: [0, 1]
        });

        // Edit.
        $routeProvider.when(route + '/edit', {
          templateUrl: 'themes/spi/page.tpl.html',
          controller: 'dg_page_controller',
          page_callback: 'dg_entity_page_edit',
          page_arguments: [0, 1]
        });

        // Admin list.
        $routeProvider.when('/admin/' + entity_type, {
          templateUrl: 'themes/spi/page.tpl.html',
          controller: 'dg_page_controller',
          page_callback: 'dg_entity_page_list',
          page_arguments: [1]
        });

      }
      
}])

.directive("entityView", function($compile, drupal) {
    return {
      controller: function($scope) {
        var entity_type = arg(0);
        var entity_id = arg(1);
        $scope.entity_type = entity_type;
        $scope.entity_id = entity_id;
        $scope.loading++;
        $scope.entity_load = {
          entity: drupal[entity_type + '_load'](entity_id)
        };
      },
      //replace: true,
      link: function(scope, element, attrs) {
        scope.entity_load.entity.then(function (entity) {
            //console.log(scope);
            //console.log(entity);

          scope.loading--;

          var entity_type = scope.entity_type;
            
          var content = { };

          // Add the "title" of this entity to the content.
          content[drupal_entity_primary_key(entity_type)] = {
            theme: 'header',
            text: entity[drupal_entity_primary_key_title(entity_type)]
          };
            
          // Grab this entity's field info instances.
          var instances = drupalgap_field_info_instances(
            entity_type,
            entity.type // @TODO support all entity type bundles, not just node content types
          );
          //console.log(drupalgap.field_info_instances);
          //console.log(instances);
            
            // Render each field instance...
            for (var field_name in instances) {
              if (!instances.hasOwnProperty(field_name)) { continue; }
              var instance = instances[field_name];
              
              // Extract the drupalgap display mode and the module name in
              // charge of the field's formatter view hook.
              var display = instance.display.drupalgap;
              var module = display.module;
              var hook = module + '_field_formatter_view';

              dpm(hook);
              
              // Invoke the hook_field_formmater_view(), if it exists.
              if (!dg_function_exists(hook)) { console.log(hook + '() missing!'); continue; }
              content[field_name] = window[hook](
                entity_type,
                entity,
                dg_field_info_field(field_name),
                instance,
                entity.language,
                entity[field_name][entity.language],
                display
              );
              
            }

          // @TODO great place for a hook
            
            element.replaceWith($compile(dg_render(content))(scope));
        });
      }
    };
})

  .directive("entityEdit", function($compile, drupal) {
    return {
      controller: function($scope) {
        var entity_type = arg(0);
        var entity_id = arg(1);
        var is_new = entity_id == 'add' ? true : false;
        $scope.entity_type = entity_type;
        $scope.bundle = is_new ? arg(2) : null;

        // Existing entity.
        if (!is_new) {
          $scope.entity_id = entity_id;
          $scope.loading++;
          $scope.entity_load = {
            entity: drupal[entity_type + '_load'](entity_id)
          };
          return;
        }

      },
      //replace: true,
      link: function(scope, element, attrs) {

        // New entity.
        if (!scope.entity_load) {
          dg_entity_form_builder($compile, scope, element, null);
          return;
        }

        // Existing entity.
        scope.entity_load.entity.then(function (entity) {
          //console.log(scope);
          //console.log(entity);
          scope.loading--;
          var entity_info = dg_entity_get_info(scope.entity_type);
          scope.bundle = entity[entity_info.entity_keys.bundle];
          dg_entity_form_builder($compile, scope, element, entity);
        });

      }
    };
  })
  .directive('entityList', function($compile, drupal) {
    return {
      controller: function($scope) {
        var entity_type = arg(1);
        $scope.entity_type = entity_type;
        $scope.loading++;
        $scope.entity_index = {
          entities: drupal[entity_type + '_index']()
        };
      },
      link: function(scope, element, attrs) {
        scope.entity_index.entities.then(function (entities) {
          scope.loading--;

          var entity_type = attrs['entityType'];

          // If someone is providing an index page for this entity type use it.
          var fn = window[entity_type + '_index_page'];
          if (dg_function_exists(fn)) {
            var linkFn = $compile(dg_render(fn(entities)));
            var content = linkFn(scope);
            element.append(content);
            return;
          }

          // Nobody is providing a listing page for this entity type, let's
          // spit out a generic table listing for the entity type's index....

          var entity_info = dg_entity_get_info(entity_type);

          var rows = [];
          for (var index in entities) {
            if (!entities.hasOwnProperty(index)) { continue; }
            var entity = entities[index];

            rows.push([
              l(t(entity[entity_info.entity_keys.label]), entity_type + '/' + entity[entity_info.entity_keys.id]),
              theme('item_list', {
                items: [
                  l(t('edit'), entity_type + '/' + entity[entity_info.entity_keys.id] + '/edit'),
                  l(t('delete'), null)
                ]
              })
            ]);

          }

          var content = {};
          content['label'] = {
            markup: '<h2>' + t(entity_info.plural_label) + '</h2>'
          };
          content['entities'] = {
            theme: 'table',
            header: [
              { data: t(entity_info.label) },
              { data: t('Operations') }
            ],
            rows: rows,
            attributes: {
              'class': 'table' /* @TODO this is bootstrap specific */
            }
          };

          var linkFn = $compile(dg_render(content));
          var content = linkFn(scope);
          element.append(content);




        });


      }
    };
  });

/**
 *
 */
function dg_entity_form_builder($compile, scope, element, entity) {
  try {
    //dpm('dg_entity_form_builder');
    //console.log(scope);

    // Extract the entity type and bundle, then place the entity onto the form state values.
    var entity_type = scope.entity_type;
    var bundle = scope.bundle;
    scope.form_state = { values: entity }; // @TODO don't drop it directly into the scope like this, use a form id key


    // Set up form defaults.
    var form = dg_form_defaults(entity_type + "_edit_form", scope);
    form.entity = entity;
    form.entity_type = entity_type;
    form.bundle = bundle;

    // Place entity keys as hidden elements on the form.
    // @TODO this is pretty static, can we be more dynamic here?
    var entity_info = dg_entity_get_info(entity_type);
    var entity_keys = entity_info.entity_keys;
    //dpm('entity_info');
    //console.log(entity_info);
    if (!dg_empty(entity_keys.bundle)) {
      form.elements[entity_keys.bundle] = {
        type: 'hidden',
        default_value: bundle
      };
    }
    var default_value = null;
    if (entity && entity[entity_keys.id]) { default_value = entity[entity_keys.id]; }
    form.elements[entity_keys.id] = {
      type: 'hidden',
      default_value: default_value
    };
    if (entity_keys.language) {
      var default_value = dg_language_default();
      if (entity && entity[entity_keys.language]) { default_value = entity[entity_keys.language]; }
      form.elements[entity_keys.language] = {
        type: 'hidden',
        default_value: default_value
      };
    }

    // Grab this entity's extra fields and add them as form elements.
    // @TODO users and vocabularies don't have bundles from Drupal!
    var extras = dg_field_info_extra_fields(entity_type, bundle, 'form');
    //dpm('extras');
    //console.log(extras);
    for (var name in extras) {
      if (!extras.hasOwnProperty(name)) { continue; }
      var extra = extras[name];
      var default_value = null;
      if (entity && entity[entity_keys.label]) { default_value = entity[entity_keys.label]; }
      form.elements[name] = {
        title: t(extra.label),
        type: 'textfield',
        default_value: default_value
      };
    }

    // Grab this entity's field info instances.
    var instances = dg_field_info_instances(
      entity_type,
      bundle
    );
    //dpm('instances');
    //console.log(instances);

    // Render each field instance...
    for (var field_name in instances) {
      if (!instances.hasOwnProperty(field_name)) { continue; }
      //dpm(field_name);

      var instance = instances[field_name];
      var info = dg_field_info_field(field_name);
      var module = instance.widget.module;
      var cardinality = info.cardinality;

      // Instantiate a form element for this field.
      var element_theme = cardinality == '1' ? null : 'field_multiple_value_form';
      form.elements[field_name] = {
        type: 'container',
        field_name: field_name,
        entity_type: entity_type,
        bundle: bundle,
        language: 'und', // @TODO hard coded language here
        und: [{  // @TODO hard coded language here
          theme: element_theme
        }]
      };

      // For each delta on the field...
      var delta = 0;
      while (delta !== null) {
        //dpm(delta);
        delta = null; // break the loop.
      }



      // Extract the drupalgap display mode and the module name in
      // charge of the field's formatter view hook.
      /*var display = instance.display.drupalgap;
       var module = display.module;
       var hook = module + '_field_widget_form';*/

      // Invoke the hook_field_widget_form(), if it exists.
      //if (!dg_function_exists(hook)) { console.log(hook + '() missing!'); continue; }
      /*content[field_name] = window[hook](
       entity_type,
       entity,
       dg_field_info_field(field_name),
       instance,
       entity.language,
       entity[field_name][entity.language],
       display
       );*/

    }

    // Submit button.
    form.elements.submit = {
      type: 'submit',
      value: t('Save')
    };

    // Place the form into the scope.
    // @TODO placing the form directly into the scope without an id is going to be bad in the long run!
    scope.form = form;

    // @TODO great place for a hook

    //element.replaceWith($compile(dg_render(content))(scope));
    element.append(dg_ng_compile_form($compile, scope));
  }
  catch (error) {
    console.log('dg_entity_form_builder - ' + error);
  }
}

/**
 *
 */
function dg_entity_page_view(entity_type, entity_id) {
  try {
    return '<entity-view></entity-view>';
  }
  catch (error) { console.log('dg_entity_page_view - ' + error); }
}

/**
 *
 */
function dg_entity_page_add(entity_type) {
  try {
    var entity_info = dg_entity_get_info(entity_type);
    //console.log(entity_info);
    var content = {};
    var items = [];
    for (var bundle in entity_info.bundles) {
      if (!entity_info.bundles.hasOwnProperty(bundle)) { continue; }
      var bundle_object = entity_info.bundles[bundle];
      items.push(l(t(bundle_object.label), entity_type + '/add/' + bundle));
    }
    content['bundles'] = {
      theme: 'item_list',
      items: items,
      title: t('Create ' + entity_info.label)
    };
    return content;
  }
  catch (error) {
    console.log('dg_entity_page_add - ' + error);
  }
}

/**
 *
 */
function dg_entity_page_edit(entity_type, entity_id) {
  try {
    return '<entity-edit></entity-edit>';
  }
  catch (error) { console.log('dg_entity_page_view - ' + error); }
}


/**
 *
 */
function dg_entity_page_list(entity_type) {
  try {
    // @NOTE - entity_type gets converted to entityType in Angular's eyes.
    return '<entity-list entity_type="' + entity_type + '"></entity-list>';
  }
  catch (error) { console.log('dg_entity_page_list - ' + error); }
}

angular.module('dg_field', ['drupalgap']);
angular.module('dg_image', ['drupalgap']);

/**
 * Implements hook_field_formatter_view().
 * @param {String} entity_type
 * @param {Object} entity
 * @param {Object} field
 * @param {Object} instance
 * @param {String} langcode
 * @param {Object} items
 * @param {*} display
 * @return {Object}
 */
function image_field_formatter_view(entity_type, entity, field, instance,
  langcode, items, display) {
  try {
    var element = [];
    for (var delta in items) {
      if (!items.hasOwnProperty(delta)) { continue; }
      var item = items[delta];
      var theme = dg_empty(display.settings.image_style) ?
        'image' : 'image_style';
      var image = {
        theme: theme,
        alt: item.alt,
        title: item.title
      };
      if (!dg_empty(theme)) {
        image.style_name = display.settings.image_style;
        image.path = item.uri;
      }
      else { image.path = drupalgap_image_path(item.uri); }
      element.push(image);
    }
    return element;
  }
  catch (error) { console.log('image_field_formatter_view - ' + error); }
}

/**
 * Implementation of theme_image().
 * @param {Object} variables
 * @return {String}
 */
function theme_image(variables) {
  try {
    // Turn the path, alt and title into attributes if they are present.
    if (variables.path) { variables.attributes['ng-src'] = variables.path; }
    if (variables.alt) { variables.attributes.alt = variables.alt; }
    if (variables.title) { variables.attributes.title = variables.title; }
    // Render the image.
    return '<img ' + dg_attributes(variables.attributes) + ' />';
  }
  catch (error) { console.log('theme_image - ' + error); }
}

/**
 * Implementation of theme_image_style().
 * @param {Object} variables
 * @return {String}
 */
function theme_image_style(variables) {
  try {
    variables.path = image_style_url(variables.style_name, variables.path);
    return theme_image(variables);
  }
  catch (error) { console.log('theme_image - ' + error); }
}

/**
 * Given an image style name and image uri, this will return the absolute URL
 * that can be used as a src value for an img element.
 * @param {String} style_name
 * @param {String} path
 * @return {String}
 */
function image_style_url(style_name, path) {
  try {
    var drupalSettings = dg_ng_get('drupalSettings');
    var src =
      drupalSettings.site_path + drupalSettings.base_path + path;
    if (src.indexOf('public://') != -1) {
      src = src.replace(
        'public://',
        drupalSettings.file_public_path +
          '/styles/' +
          style_name +
          '/public'
      );
    }
    else if (src.indexOf('private://') != -1) {
      src = src.replace(
        'private://',
        drupalSettings.file_private_path +
          '/styles/' +
          style_name +
          '/private'
      );
    }
    return src;
  }
  catch (error) { console.log('image_style_url - ' + error); }
}


angular.module('dg_menu', [])
  .service('dgMenuAccessCallback', ['$q', '$http', 'drupalSettings', dgMenuAccessCallback]);

/**
 *
 * @param delta
 * @returns {*}
 */
function dgMenuAccessCallback(route) {
  try {

  }
  catch (error) {
    console.log('dgMenuAccessCallback - ' + error);
  }
}

/**
 * Implements hook_block_view().
 * @param {String} delta
 * @return {String}
 */
function menu_block_view(delta) {
  try {
    //dpm('menu_block_view');
    //console.log(delta);
    var menu = dg_menu_get(delta);
    if (menu.links.length == 0) { return ''; }
    var items = [];
    for (var i = 0; i < menu.links.length; i++) {
      // @TODO make sure user has access to path.
      items.push(theme('link', menu.links[i]));
    }
    return {
      links: {
        markup: theme('item_list', {
          items: items,
          attributes: menu.attributes
        })
      }
    };
  }
  catch (error) { console.log('menu_block_view - ' + error); }
}

angular.module('dg_node', ['drupalgap']);

/**
 *
 */
function node_index_page(nodes) {
  try {
    var html = '';
    var rows = [];
    for (var i in nodes) {
      var node = nodes[i];
      rows.push([
        l(t(node.title), 'node/' + node.nid),
        node.type,
        l(node.uid, 'user/' + node.uid),
        node.status,
        node.changed,
        theme('item_list', {
          items: [
            l(t('edit'), 'node/' + node.nid + '/edit'),
            l(t('delete'), null)
          ]
        })
      ]);
    }
    html += theme('table', {
      header: [
        { data: t('Title') },
        { data: t('Type') },
        { data: t('Author') },
        { data: t('Status') },
        { data: t('Updated') },
        { data: t('Operations') },
      ],
      rows: rows,
      attributes: {
        'class': 'table' /* @TODO this is bootstrap specific */
      }
    });
    return html;
  }
  catch (error) {
    console.log('node_index_page - ' + error);
  }
}

angular.module('dg_options', ['drupalgap']);

/**
 * Implements hook_field_widget_form().
 * @param {Object} form
 * @param {Object} form_state
 * @param {Object} field
 * @param {Object} instance
 * @param {String} langcode
 * @param {Object} items
 * @param {Number} delta
 * @param {Object} element
 * @return {*}
 */
function options_field_widget_form(form, form_state, field, instance, langcode,
                                   items, delta, element) {
  try {
    switch (element.type) {
      case 'checkbox':
        // If the checkbox has a default value of 1, check the box.
        if (items[delta].default_value == 1) { items[delta].checked = true; }
        break;
      case 'radios':
        break;
      case 'list_boolean':
        switch (instance.widget.type) {
          case 'options_onoff':
            // Switch an on/off boolean to a checkbox and place its on/off
            // values as attributes. Depending on the allowed values, we may
            // have to iterate over an array, or an object to get the on/off
            // values.
            items[delta].type = 'checkbox';
            var off = null;
            var on = null;
            if ($.isArray(field.settings.allowed_values)) {
              for (var key in field.settings.allowed_values) {
                if (off === null) { off = key; }
                else { on = key; }
              }
            }
            else {
              for (var value in field.settings.allowed_values) {
                if (!field.settings.allowed_values.hasOwnProperty(value)) { continue; }
                var label = field.settings.allowed_values[value];
                if (off === null) { off = value; }
                else { on = value; }
              }
            }
            items[delta].options.attributes['off'] = off;
            items[delta].options.attributes['on'] = on;
            // If the value equals the on value, then check the box.
            if (
              typeof items[delta] !== 'undefined' && items[delta].value == on
            ) { items[delta].options.attributes['checked'] = 'checked'; }
            break;
          default:
            console.log(
              'WARNING: options_field_widget_form list_boolean with ' +
              'unsupported type (' + instance.widget.type + ')'
            );
            break;
        }
        break;
      case 'select':
      case 'list_text':
      case 'list_float':
      case 'list_integer':
        if (instance) {
          switch (instance.widget.type) {
            case 'options_select':
              items[delta].type = 'select';
              // If the select list is required, add a 'Select' option and set
              // it as the default.  If it is optional, place a "none" option
              // for the user to choose from.
              var text = '- None -';
              if (items[delta].required) {
                text = '- ' + t('Select a value') + ' -';
              }
              items[delta].options[''] = text;
              if (empty(items[delta].value)) { items[delta].value = ''; }
              // If more than one value is allowed, turn it into a multiple
              // select list.
              if (field.cardinality != 1) {
                items[delta].options.attributes['data-native-menu'] = 'false';
                items[delta].options.attributes['multiple'] = 'multiple';
              }
              break;
            case 'options_buttons':
              // If there is one value allowed, we turn this into radio
              // button(s), otherwise they will become checkboxes.
              var type = 'checkboxes';
              if (field.cardinality == 1) { type = 'radios'; }
              items[delta].type = type;
              break;
            default:
              console.log(
                'WARNING: options_field_widget_form - unsupported widget (' +
                instance.widget.type + ')'
              );
              return false;
              break;
          }
          // If there are any allowed values, place them on the options
          // list. Then check for a default value, and set it if necessary.
          if (field && field.settings.allowed_values) {
            for (var key in field.settings.allowed_values) {
              if (!field.settings.allowed_values.hasOwnProperty(key)) { continue; }
              var value = field.settings.allowed_values[key];
              // Don't place values that are objects onto the options
              // (i.e. commerce taxonomy term reference fields).
              if (typeof value === 'object') { continue; }
              // If the value already exists in the options, then someone
              // else has populated the list (e.g. commerce), so don't do
              // any processing.
              if (typeof items[delta].options[key] !== 'undefined') {
                break;
              }
              // Set the key and value for the option.
              items[delta].options[key] = value;
            }
            if (instance.default_value && instance.default_value[delta] &&
              typeof instance.default_value[delta].value !== 'undefined') {
              items[delta].value = instance.default_value[delta].value;
            }
          }
        }
        break;
      /*case 'taxonomy_term_reference':
        // Change the item type to a hidden input.
        items[delta].type = 'hidden';
        // What vocabulary are we using?
        var machine_name = field.settings.allowed_values[0].vocabulary;
        var taxonomy_vocabulary =
          taxonomy_vocabulary_machine_name_load(machine_name);

        var widget_type = false;
        if (instance.widget.type == 'options_select') {
          widget_type = 'select';
        }
        else {
          console.log(
            'WARNING: options_field_widget_form() - ' + instance.widget.type +
            ' not yet supported for ' + element.type + ' form elements!'
          );
          return false;
        }
        var widget_id = items[delta].id + '-' + widget_type;
        // If the select list is required, add a 'Select' option and set
        // it as the default.  If it is optional, place a "none" option
        // for the user to choose from.
        var text = '- ' + t('None') + ' -';
        if (items[delta].required) {
          text = '- ' + t('Select a value') + ' -';
        }
        items[delta].children.push({
          type: widget_type,
          attributes: {
            id: widget_id,
            onchange: "_theme_taxonomy_term_reference_onchange(this, '" +
            items[delta].id +
            "');"
          },
          options: { '': text }
        });
        // Attach a pageshow handler to the current page that will load the
        // terms into the widget.
        var options = {
          'page_id': drupalgap_get_page_id(drupalgap_path_get()),
          'jqm_page_event': 'pageshow',
          'jqm_page_event_callback':
            '_theme_taxonomy_term_reference_load_items',
          'jqm_page_event_args': JSON.stringify({
            'taxonomy_vocabulary': taxonomy_vocabulary,
            'widget_id': widget_id
          })
        };
        // Pass the field name so the page event handler can be called for
        // each item.
        items[delta].children.push({
          markup: drupalgap_jqm_page_event_script_code(
            options,
            field.field_name
          )
        });
        break;*/
    }
  }
  catch (error) { console.log('options_field_widget_form - ' + error); }
}

angular.module('dg_services', ['drupalgap']);
angular.module('dg_system', ['drupalgap'])

// hook_menu()
.config(['$routeProvider', 'drupalgapSettings',
    function($routeProvider, drupalgapSettings) {
      $routeProvider.when('/dg', {
          templateUrl: 'themes/spi/page.tpl.html',
          controller: 'dg_page_controller',
          page_callback: 'dg_system_page'
      })
      .otherwise({
        redirectTo: drupalgapSettings.front
      });
  }
]);

// @TODO attach to module instead of app.
dgApp.directive("dgMain", function($compile, $injector) {
    return {
      link: function(scope, element) {

        var linkFn = $compile(dg_render(menu_execute_active_handler($compile, $injector) ));
        var content = linkFn(scope);
        element.append(content);

      }
    };
});

/**
 *
 */
function dg_system_page() {
  try {
    var user = dg_user_get();
    if (user.uid) {
      // User is authenticated...
      return '<p>Hello ' + user.name + '!</p>';
    }
    else {
      // User is anonymous...
      return '<p>Welcome visitor...</p>';
    }
  }
  catch (error) { console.log('dg_system_page - ' + error); }
}

/**
 * Implements hook_block_info().
 * @return {Object}
 */
function system_block_info() {
  
  try {
    
    // Set up default blocks.
    var blocks = {
      main: { },
      messages: { },
      logo: { },
      logout: { },
      title: { },
      powered_by: { },
      help: { }
    };

    // Make additional blocks for each system menu.
    var system_menus = menu_list_system_menus();
    for (var menu_name in system_menus) {
        if (!system_menus.hasOwnProperty(menu_name)) { continue; }
        var menu = system_menus[menu_name];
        var block_delta = menu.menu_name;
        blocks[block_delta] = {
          //name: block_delta,
          //delta: block_delta,
          module: 'menu'
        };
    }

    return blocks;
    
  }
  catch (error) { console.log('system_block_info - ' + error); }
}

/**
 * Implements hook_block_view().
 * @param {String} delta
 * @return {String}
 */
function system_block_view(delta) {
  try {
    switch (delta) {
      case 'main':
        // This is the main content block, it is required to be in a theme's
        // region for the content of a page to show up (nodes, users, taxonomy,
        // comments, etc). Here we use it as an Angular directive, dgMain.
        return '<div dg-main></div>';
        break;
      default:
        return '';
        break;
    }
  }
  catch (error) { console.log('system_block_info - ' + error); }
}


angular.module('dg_text', ['drupalgap']);

/**
 * Implements hook_field_formatter_view().
 * @param {String} entity_type
 * @param {Object} entity
 * @param {Object} field
 * @param {Object} instance
 * @param {String} langcode
 * @param {Object} items
 * @param {*} display
 * @return {Object}
 */
function text_field_formatter_view(entity_type, entity, field, instance,
  langcode, items, display) {
  try {
    var element = [];
    for (var delta in items) {
      if (!items.hasOwnProperty(delta)) { continue; }
      var item = items[delta];
      // Grab the field value, but use the safe_value if we have it.
      var value = item.value;
      if (typeof item.safe_value !== 'undefined') {
        value = item.safe_value;
      }
      element.push({ markup: value });
    }
    return element;
  }
  catch (error) { console.log('text_field_formatter_view - ' + error); }
}

/**
 * Implements hook_field_widget_form().
 * @param {Object} form
 * @param {Object} form_state
 * @param {Object} field
 * @param {Object} instance
 * @param {String} langcode
 * @param {Object} items
 * @param {Number} delta
 * @param {Object} element
 */
function text_field_widget_form(form, form_state, field, instance, langcode, items, delta, element) {
  try {
    //dpm('text_field_widget_form');
    //console.log(arguments)
    //console.log(field);
    //console.log(instance);
    //console.log(items);
    //console.log(element);
    var type = null;
    switch (instance.widget.type) {
      case 'search': type = 'search'; break;
      case 'text': type = 'textfield'; break;
      case 'textarea':
      case 'text_long':
      case 'text_with_summary':
      case 'text_textarea':
      case 'text_textarea_with_summary':
        type = 'textarea';
    }
    element.type = type;
    element.attributes.rows = instance.widget.settings.rows;
    return element;
  }
  catch (error) { console.log('text_field_widget_form - ' + error); }
}

angular.module('dg_user', ['drupalgap'])

// ~ hook_menu()
.config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/user/login', {
          templateUrl: 'themes/spi/page.tpl.html',
          controller: 'dg_page_controller',
          page_callback: 'drupalgap_get_form',
          page_arguments: ['user_login_form']
      });
      $routeProvider.when('/user/logout', {
          templateUrl: 'themes/spi/page.tpl.html',
          controller: 'dg_page_controller',
          page_callback: 'dg_user_logout_callback'
      });
}])

.directive("userLoginForm", function($compile) {
    return {

      controller: function($scope, drupal) {

        // Set up form defaults.
        var form = dg_form_defaults("user_login_form", $scope);

        // Build form elements.
        form.entity_type = 'user';
        form.bundle = null;
        form.elements.name = {
          type: 'textfield',
          title: t('Username'),
          title_placeholder: true,
          required: true
        };
        form.elements.pass = {
          type: 'password',
          title: t('Password'),
          title_placeholder: true,
          required: true,
          attributes: {
            //onkeypress: "drupalgap_form_onkeypress('" + form.id + "')"
          }
        };
        form.elements.submit = {
          type: 'submit',
          value: t('Login')
        };
        /*if (user_register_access()) {
          form.buttons['create_new_account'] = {
            title: t('Create new account'),
            attributes: {
              onclick: "drupalgap_goto('user/register')"
            }
          };
        }
        form.buttons['forgot_password'] = {
          title: t('Request new password'),
            attributes: {
              onclick: "drupalgap_goto('user/password')"
            }
        };*/

        // Form submit handler.
        form.submit.push(function(form, form_state) {
            drupal.user_login(
              form_state.values.name,
              form_state.values.pass
            ).then(function(data) {

              var action = typeof form.action !== 'undefined' ?
                form.action : 'user/' + data.user.uid;
              drupalgap_goto(action);

            });
        });

        // Place the form into the scope.
        // @TODO placing the form directly into the scope without an id is going to be bad in the long run!
        $scope.form = form;

      },

      link: function(scope, element) {

        // Add the form to the element.
        element.append(dg_ng_compile_form($compile, scope));

      }

    };
});

/**
 *
 */
function dg_user_logout_callback() {
  try {
    var drupal = dg_ng_get('drupal');
    var drupalgapSettings = dg_ng_get('drupalgapSettings');
    drupal.user_logout().then(function(data) {
        drupalgap_goto(drupalgapSettings.front);
    });
  }
  catch (error) { console.log('dg_user_logout_callback - ' + error); }
}

/**
 *
 * @returns {*|Object}
 */

function dg_user_access(permission) {
  try {
    dpm('dg_user_access');
    console.log(arguments);
    var access = false;
    var account = typeof arguments[1] !== 'undefined' ?
      arguments[1] : dg_user_get();
    dpm('checking ' + account.name + ' for ' + permission);
    if (account.uid == 1) { return true; }
    if (!account.permissions) { return false; }
    for (var delta in account.permissions) {
      if (!account.permissions.hasOwnProperty(delta)) { continue; }
      var item = account.permissions[delta];
      if (item.permission == permission) {
        access = true;
        break;
      }
    }
    return access;
  }
  catch (error) {
    console.log('dg_user_access - ' + error);
  }
}
/**
 *
 */
function dg_user_defaults() {
  try {
    return drupal_user_defaults();
  }
  catch (error) { console.log('dg_user_defaults - ' + error); }
}

/**
 *
 */
function dg_user_get() {
  try {
    return drupalgap.user;
  }
  catch (error) { console.log('dg_user_get - ' + error); }
}

/**
 *
 */
function dg_user_set(user) {
  try {
    drupalgap.user = user;
  }
  catch (error) { console.log('dg_user_set - ' + error); }
}

/**
 * Given a user role (string), this determines if the current user has the role.
 * Returns true if the user has the role, false otherwise. You may pass in a
 * user account object to check against a certain account, instead of the
 * current user.
 * @param {String} role
 * @return {Boolean}
 */
function dg_user_has_role(role) {
  try {
    var has_role = false;
    var account = null;
    if (arguments[1]) { account = arguments[1]; }
    else { account = dg_user_get(); }
    for (var rid in account.roles) {
        if (!account.roles.hasOwnProperty(rid)) { continue; }
        var value = account.roles[rid];
        if (role == value) {
          has_role = true;
          break;
        }
    }
    return has_role;
  }
  catch (error) { console.log('dg_user_has_role - ' + error); }
}


