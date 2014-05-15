// Initialize the Drupal JSON object and run the bootstrap, if necessary.
var Drupal = {}; drupal_init();

/**
 * Initializes the Drupal JSON object.
 */
function drupal_init() {
  try {
    if (!Drupal) { Drupal = {}; }

    // General properties.
    Drupal.csrf_token = false;
    Drupal.sessid = null;
    Drupal.user = drupal_user_defaults();

    // Settings.
    Drupal.settings = {
      app_directory: 'app',
      base_path: '/',
      cache: {
        entity: {
          enabled: false,
          expiration: 3600
        },
        views: {
          enabled: false,
          expiration: 3600
        }
      },
      debug: false,
      endpoint: '',
      file_public_path: 'sites/default/files',
      language_default: 'und',
      site_path: ''
    };
    // Includes. Although we no longer dynamically load the includes, we want
    // to place them each in their own JSON object, so we have an easy way to
    // access them.
    Drupal.includes = {};
    Drupal.includes['module'] = {};
    // Modules. Although we no longer dynamically load the core modules, we want
    // to place them each in their own JSON object, so we have an easy way to
    // access them.
    Drupal.modules = {
      core: {},
      contrib: {},
      custom: {}
    };
  }
  catch (error) { console.log('drupal_init - ' + error); }
}

/**
 * Equivalent to PHP's date function. You may optionally pass in a second int
 * timestamp argument (number of milliseconds since epoch, not the number of
 * seconds since the epoch) to format that particular time, otherwise it'll
 * default to the current time.
 * @param {String} format The format of the outputted date string.
 * @return {String}
 * @see http://php.net/manual/en/function.date.php
 */
function date(format) {
  try {
    // @TODO - move this function to jDrupal and create a github gist for it.
    // Let's figure out the timestamp and date.
    var d = null;
    var timestamp = null;
    if (arguments[1]) {
      timestamp = arguments[1];
      d = new Date(timestamp);
    }
    else {
      d = new Date();
      timestamp = d.getTime();
    }
    var result = '';
    for (var i = 0; i < format.length; i++) {
      var character = format.charAt(i);
      switch (character) {

        /* DAY */

        // Day of the month, 2 digits with leading zeros: 01 to 31
        case 'd':
          var day = '' + d.getDate();
          if (day.length == 1) { day = '0' + day; }
          result += day;
          break;

        // A textual representation of a day, three letters: Mon through Sun
        case 'D':
          var day = d.getDay();
          switch (day) {
            case 0: result += 'Sun'; break;
            case 1: result += 'Mon'; break;
            case 2: result += 'Tue'; break;
            case 3: result += 'Wed'; break;
            case 4: result += 'Thu'; break;
            case 5: result += 'Fri'; break;
            case 6: result += 'Sat'; break;
          }
          break;

        /* WEEK */

        /* MONTH */

        // Numeric representation of a month, with leading zeros: 01 through 12
        case 'm':
          var month = '' + (d.getMonth() + 1);
          if (month.length == 1) { month = '0' + month; }
          result += month;
          break;

        /* YEAR */

        // A full numeric representation of a year, 4 digits.
        // Examples: 1999 or 2003
        case 'Y':
          result += d.getFullYear();
          break;

        /* TIME */

        // 24-hour format of an hour with leading zeros: 00 through 23
        case 'H':
          var hours = '' + d.getHours();
          if (hours.length == 1) { hours = '0' + hours; }
          result += hours;
          break;

        // Minutes with leading zeros: 00 to 59
        case 'i':
          var minutes = '' + d.getMinutes();
          if (minutes.length == 1) { minutes = '0' + minutes; }
          result += minutes;
          break;

        default:
          // Any characters that we don't know how to process, just place them
          // onto the result.
          result += character;
          break;
      }
    }
    return result;
  }
  catch (error) { console.log('date - ' + error); }
}

/**
 * Given a JSON object or string, this will print it to the console. It accepts
 * an optional boolean as second argument, if it is false the output sent to the
 * console will not use pretty printing in a Chrome/Ripple environment.
 * @param {Object} data
 */
function dpm(data) {
  try {
    // Show the caller name.
    //var caller = arguments.callee.caller.name + '()';
    //console.log(caller);
    if (data) {
      if (typeof parent.window.ripple === 'function') {
        if (typeof arguments[1] !== 'undefined' && arguments[1] == false) {
          console.log(JSON.stringify(data));
        }
        else {
          console.log(data);
        }
      }
      else if (typeof data === 'object') { console.log(JSON.stringify(data)); }
      else { console.log(data); }
    }
    else { console.log('<null>'); }
  }
  catch (error) { console.log('dpm - ' + error); }
}

/**
 * Returns a default JSON object representing an anonymous Drupal user account.
 * @return {Object}
 */
function drupal_user_defaults() {
  try {
    return {
      uid: '0',
      roles: {'1': 'anonymous user'},
      permissions: []
    };
  }
  catch (error) { console.log('drupal_user_defaults - ' + error); }
}

/**
 * Returns true if given value is empty. A generic way to test for emptiness.
 * @param {*} value
 * @return {Boolean}
 */
function empty(value) {
  try {
    return (typeof value === 'undefined' || value === null || value == '');
  }
  catch (error) { console.log('empty - ' + error); }
}

/**
 * Given a JS function name, this returns true if the function exists in the
 * scope, false otherwise.
 * @param {String} name
 * @return {Boolean}
 */
function function_exists(name) {
  try {
    return (eval('typeof ' + name) == 'function');
  }
  catch (error) {
    alert('function_exists - ' + error);
  }
}

/**
 * Given an integer http status code, this will return the title of it.
 * @param {Number} status
 * @return {String} title
 */
function http_status_code_title(status) {
  try {
    // @todo - this can be replaced by using the statusText propery on the XHR
    // object.
    //https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#Properties
    var title = '';
    switch (status) {
      case 200: title = 'OK'; break;
      case 401: title = 'Unauthorized'; break;
      case 404: title = 'Not Found'; break;
      case 406: title = 'Not Acceptable'; break;
      case 500: title = 'Internal Server Error'; break;
    }
    return title;
  }
  catch (error) {
    console.log('http_status_code_title - ' + error);
  }
}

/**
 * Checks if the needle string, is in the haystack array. Returns true if it is
 * found, false otherwise. Credit: http://stackoverflow.com/a/15276975/763010
 * @param {String} needle
 * @param {Array} haystack
 * @return {Boolean}
 */
function in_array(needle, haystack) {
  try {
    return (haystack.indexOf(needle) > -1);
  }
  catch (error) { console.log('in_array - ' + error); }
}

/**
 * Given an argument, this will return true if it is an int, false otherwise.
 * @param {Number} n
 * @return {Boolean}
 */
function is_int(n) {
  // Credit: http://stackoverflow.com/a/3886106/763010
  if (typeof n === 'string') {
    n = parseInt(n);
  }
  return typeof n === 'number' && n % 1 == 0;
}

/**
 * Get the default language from Drupal.settings.
 * @return {String}
 */
function language_default() {
  try {
    if (Drupal.settings.language_default &&
      Drupal.settings.language_default != '') {
      return Drupal.settings.language_default;
    }
    return 'und';
  }
  catch (error) { console.log('language_default - ' + error); }
}

/**
 * Javascript equivalent of php's time() function.
 * @return {Number}
 */
function time() {
  var d = new Date();
  return Math.floor(d / 1000);
}

/**
 * Given a string, this will change the first character to upper case and return
 * the new string.
 * @param {String} str
 * @return {String}
 */
function ucfirst(str) {
  // http://kevin.vanzonneveld.net
  // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   bugfixed by: Onno Marsman
  // +   improved by: Brett Zamir (http://brett-zamir.me)
  // *     example 1: ucfirst('kevin van zonneveld');
  // *     returns 1: 'Kevin van zonneveld'
  str += '';
  var f = str.charAt(0).toUpperCase();
  return f + str.substr(1);
}

/**
 * Determines which modules are implementing a hook. Returns an array with the
 * names of the modules which are implementing this hook. If no modules
 * implement the hook, it returns false.
 * @param {String} hook
 * @return {Array}
 */
function module_implements(hook) {
  try {
    var modules_that_implement = [];
    if (hook) {
      var bundles = module_types();
      for (var i = 0; i < bundles.length; i++) {
        var bundle = bundles[i];
        for (var module in Drupal.modules[bundle]) {
          if (Drupal.modules[bundle].hasOwnProperty(module)) {
            if (function_exists(module + '_' + hook)) {
              modules_that_implement.push(module);
            }
          }
        }
      }
    }
    if (modules_that_implement.length == 0) { return false; }
    return modules_that_implement;
  }
  catch (error) { console.log('module_implements - ' + error); }
}

/**
 * Given a module name and a hook name, this will invoke that module's hook.
 * @param {String} module
 * @param {String} hook
 * @return {*}
 */
function module_invoke(module, hook) {
  try {
    var module_invocation_results = null;
    if (drupalgap_module_load(module)) {
      var module_arguments = Array.prototype.slice.call(arguments);
      var function_name = module + '_' + hook;
      if (function_exists(function_name)) {
        // Get the hook function.
        var fn = window[function_name];
        // Remove the module name and hook from the arguments.
        module_arguments.splice(0, 2);
        // If there are no arguments, just call the hook directly, otherwise
        // call the hook and pass along all the arguments.
        if (Object.getOwnPropertyNames(module_arguments).length == 0) {
          module_invocation_results = fn();
        }
        else { module_invocation_results = fn.apply(null, module_arguments); }
      }
    }
    else {
      console.log(
        'WARNING: module_invoke() - Failed to load module: ' + module
      );
    }
    return module_invocation_results;
  }
  catch (error) { console.log('module_invoke - ' + error); }
}

var module_invoke_results = null;
var module_invoke_continue = null;
/**
 * Given a hook name, this will invoke all modules that implement the hook.
 * @param {String} hook
 * @return {Array}
 */
function module_invoke_all(hook) {
  try {
    // Prepare the invocation results.
    module_invoke_results = new Array();
    // Copy the arguments and remove the hook name from the first index so the
    // rest can be passed along to the hook.
    var module_arguments = Array.prototype.slice.call(arguments);
    module_arguments.splice(0, 1);
    // Try to fire the hook in every module.
    module_invoke_continue = true;
    var bundles = module_types();
    for (var i = 0; i < bundles.length; i++) {
      var bundle = bundles[i];
      for (var module in Drupal.modules[bundle]) {
        if (Drupal.modules[bundle].hasOwnProperty(module)) {
          var function_name = module + '_' + hook;
          if (function_exists(function_name)) {
            // If there are no arguments, just call the hook directly,
            // otherwise call the hook and pass along all the arguments.
            var invocation_results = null;
            if (module_arguments.length == 0) {
              invocation_results = module_invoke(module, hook);
            }
            else {
              // Place the module name and hook name on the front of the
              // arguments.
              module_arguments.unshift(module, hook);
              var fn = window['module_invoke'];
              invocation_results = fn.apply(null, module_arguments);
              module_arguments.splice(0, 2);
            }
            if (typeof invocation_results !== 'undefined') {
              module_invoke_results.push(invocation_results);
            }
          }
        }
      }
    }
    return module_invoke_results;
  }
  catch (error) { console.log('module_invoke_all - ' + error); }
}

/**
 * Given a module name, this will return the module inside Drupal.modules, or
 * false if it fails to find it.
 * @param {String} name
 * @return {Object|Boolean}
 */
function module_load(name) {
  try {
    var bundles = module_types();
    for (var i = 0; i < bundles.length; i++) {
      var bundle = bundles[i];
      if (Drupal.modules[bundle][name]) {
        return Drupal.modules[bundle][name];
      }
    }
    return false;
  }
  catch (error) { console.log('module_load - ' + error); }
}

/**
 * Initializes and returns a JSON object template that all modules should use
 * when declaring themselves.
 * @param {String} name
 * @return {Object}
 */
function module_object_template(name) {
  try {
    return { 'name': name };
  }
  catch (error) { console.log('module_object_template - ' + error); }
}

/**
 * Returns an array of module type names.
 * @return {Array}
 */
function module_types() {
  try {
    return ['core', 'contrib', 'custom'];
  }
  catch (error) { console.log('module_types - ' + error); }
}

/**
 * Loads a comment.
 * @param {Number} cid
 * @param {Object} options
 */
function comment_load(cid, options) {
  try {
    entity_load('comment', cid, options);
  }
  catch (error) { console.log('comment_load - ' + error); }
}

/**
 * Saves a comment.
 * @param {Object} comment
 * @param {Object} options
 */
function comment_save(comment, options) {
  try {
    entity_save('comment', null, comment, options);
  }
  catch (error) { console.log('comment_save - ' + error); }
}

/**
 * Delete an entity.
 * @param {String} entity_type
 * @param {Number} ids
 * @param {Object} options
 */
function entity_delete(entity_type, ids, options) {
  try {
    var function_name = entity_type + '_delete';
    if (function_exists(function_name)) {
      var fn = window[function_name];
      fn(ids, options);
    }
    else {
      console.log('WARNING: entity_delete - unsupported type: ' + entity_type);
    }
  }
  catch (error) { console.log('entity_delete - ' + error); }
}

/**
 * Given an entity type and the entity id, this will return the local storage
 * key to be used when saving/loading the entity from local storage.
 * @param {String} entity_type
 * @param {Number} id
 * @return {String}
 */
function entity_local_storage_key(entity_type, id) {
  try {
    return entity_type + '_' + id;
  }
  catch (error) { drupalgap_error(error); }
}

/**
 * Loads an entity.
 * @param {String} entity_type
 * @param {Number} ids
 * @param {Object} options
 */
function entity_load(entity_type, ids, options) {
  try {
    if (!is_int(ids)) {
      // @todo - if an array of ints is sent in, call entity_index() instead.
      alert('entity_load(' + entity_type + ') - only single ids supported!');
      return;
    }
    var entity_id = ids;
    // If entity caching is enabled, try to load the entity from local storage.
    // If a copy is available in local storage, send it to the success callback.
    var entity = false;
    if (Drupal.settings.cache.entity && Drupal.settings.cache.entity.enabled) {
      entity = _entity_local_storage_load(entity_type, entity_id, options);
      if (entity) {
        if (options.success) { options.success(entity); }
        return;
      }
    }

    // Verify the entity type is supported.
    if (!in_array(entity_type, entity_types())) {
      var message = 'WARNING: entity_load - unsupported type: ' + entity_type;
      console.log(message);
      if (options.error) { options.error(null, null, message); }
      return;
    }

    // We didn't load the entity from local storage. Let's grab it from the
    // Drupal server instead. First, let's build the call options.
    var primary_key = entity_primary_key(entity_type);
    var call_options = {
      success: function(data) {
        try {
          // Set the entity equal to the returned data.
          entity = data;
          // Is entity caching enabled?
          if (Drupal.settings.cache.entity &&
              Drupal.settings.cache.entity.enabled) {
            // Set the expiration time as a property on the entity that can be
            // used later.
            if (Drupal.settings.cache.entity.expiration !== 'undefined') {
              var expiration = time() + Drupal.settings.cache.entity.expiration;
              if (Drupal.settings.cache.entity.expiration == 0) {
                expiration = 0;
              }
              entity.expiration = expiration;
            }
            // Save the entity to local storage.
            _entity_local_storage_save(entity_type, entity_id, entity);
          }
          // Send the entity back to the caller's success callback function.
          if (options.success) { options.success(entity); }
        }
        catch (error) {
          console.log('entity_load - success - ' + error);
        }
      },
      error: function(xhr, status, message) {
        try {
          if (options.error) { options.error(xhr, status, message); }
        }
        catch (error) {
          console.log('entity_load - error - ' + error);
        }
      }
    };

    // Finally, determine the entity's retrieve function and call it.
    var function_name = entity_type + '_retrieve';
    if (function_exists(function_name)) {
      call_options[primary_key] = entity_id;
      var fn = window[function_name];
      fn(ids, call_options);
    }
    else {
      console.log('WARNING: ' + function_name + '() does not exist!');
    }
  }
  catch (error) { console.log('entity_load - ' + error); }
}

/**
 * An internal function used by entity_load() to attempt loading an entity
 * from local storage.
 * @param {String} entity_type
 * @param {Number} entity_id
 * @param {Object} options
 * @return {Object}
 */
function _entity_local_storage_load(entity_type, entity_id, options) {
  try {
    var entity = false;
    // Process options if necessary.
    if (options) {
      // If we are resetting, remove the item from localStorage.
      if (options.reset) {
        _entity_local_storage_delete(entity_type, entity_id);
      }
    }
    // Attempt to load the entity from local storage.
    var local_storage_key = entity_local_storage_key(entity_type, entity_id);
    entity = window.localStorage.getItem(local_storage_key);
    if (entity) {
      entity = JSON.parse(entity);
      // We successfully loaded the entity from local storage. If it expired
      // remove it from local storage then continue onward with the entity
      // retrieval from Drupal. Otherwise return the local storage entity copy.
      if (typeof entity.expiration !== 'undefined' &&
          entity.expiration != 0 &&
          time() > entity.expiration) {
        _entity_local_storage_delete(entity_type, entity_id);
        entity = false;
      }
      else {

        // @todo - this code belongs to DrupalGap! Figure out how to bring the
        // idea of DrupalGap modules into jDrupal that way jDrupal can provide
        // a hook for DrupalGap to take care of this code!

        // The entity has not yet expired. If the current page options
        // indicate reloadingPage is true (and the reset option wasn't set to
        // false) then we'll grab a fresh copy of the entity from Drupal.
        // If the page is reloading and the developer didn't call for a reset,
        // then just return the cached copy.
        if (drupalgap && drupalgap.page.options &&
          drupalgap.page.options.reloadingPage) {
          // Reloading page... cached entity is still valid.
          if (typeof drupalgap.page.options.reset !== 'undefined' &&
            drupalgap.page.options.reset == false) {
            // We were told to not reset it, so we'll use the cached copy.
            return entity;
          }
          else {
            // Remove the entity from local storage and reset it.
            _entity_local_storage_delete(entity_type, entity_id);
            entity = false;
          }
        }
      }
    }
    return entity;
  }
  catch (error) { console.log('_entity_load_from_local_storage - ' + error); }
}

/**
 * An internal function used to save an entity to local storage.
 * @param {String} entity_type
 * @param {Number} entity_id
 * @param {Object} entity
 */
function _entity_local_storage_save(entity_type, entity_id, entity) {
  try {
    window.localStorage.setItem(
      entity_local_storage_key(entity_type, entity_id),
      JSON.stringify(entity)
    );
  }
  catch (error) { console.log('_entity_local_storage_save - ' + error); }
}

/**
 * An internal function used to delete an entity from local storage.
 * @param {String} entity_type
 * @param {Number} entity_id
 */
function _entity_local_storage_delete(entity_type, entity_id) {
  try {
    var storage_key = entity_local_storage_key(
      entity_type,
      entity_id
    );
    window.localStorage.removeItem(storage_key);
  }
  catch (error) { console.log('_entity_local_storage_delete - ' + error); }
}

/**
 * Returns an entity type's primary key.
 * @param {String} entity_type
 * @return {String}
 */
function entity_primary_key(entity_type) {
  try {
    var key;
    switch (entity_type) {
      case 'comment': key = 'cid'; break;
      case 'file': key = 'fid'; break;
      case 'node': key = 'nid'; break;
      case 'taxonomy_term': key = 'tid'; break;
      case 'taxonomy_vocabulary': key = 'vid'; break;
      case 'user': key = 'uid'; break;
      default:
        console.log(
          'entity_primary_key - unsupported entity type (' + entity_type + ')'
        );
        break;
    }
    return key;
  }
  catch (error) { console.log('entity_primary_key - ' + error); }
}

/**
 * Saves an entity.
 * @param {String} entity_type
 * @param {String} bundle
 * @param {Object} entity
 * @param {Object} options
 */
function entity_save(entity_type, bundle, entity, options) {
  try {
    var function_name;
    switch (entity_type) {
      case 'comment':
        if (!entity.cid) { function_name = 'comment_create'; }
        else { function_name = 'comment_update'; }
        break;
      case 'file':
        function_name = 'file_create';
        break;
      case 'node':
        if (!entity.language) { entity.language = language_default(); }
        if (!entity.nid) { function_name = 'node_create'; }
        else { function_name = 'node_update'; }
        break;
      case 'user':
        if (!entity.uid) { function_name = 'user_create'; }
        else { function_name = 'user_update'; }
        break;
      case 'taxonomy_term':
        if (!entity.tid) { function_name = 'taxonomy_term_create'; }
        else { function_name = 'taxonomy_term_update'; }
        break;
      case 'taxonomy_vocabulary':
        if (!entity.vid) { function_name = 'taxonomy_vocabulary_create'; }
        else { function_name = 'taxonomy_vocabulary_update'; }
        break;
    }
    if (function_name && function_exists(function_name)) {
      var fn = window[function_name];
      fn(entity, options);
    }
    else {
      console.log('WARNING: entity_save - unsupported type: ' + entity_type);
    }
  }
  catch (error) { console.log('entity_save - ' + error); }
}

/**
 * Returns an array of entity type names.
 * @return {Array}
 */
function entity_types() {
  try {
    return [
      'comment',
      'file',
      'node',
      'taxonomy_term',
      'taxonomy_vocabulary',
      'user'
    ];
  }
  catch (error) { console.log('entity_types - ' + error); }
}

/**
 * Loads a file, given a file id.
 * @param {Number} fid
 * @param {Object} options
 */
function file_load(fid, options) {
  try {
    entity_load('file', fid, options);
  }
  catch (error) { console.log('file_load - ' + error); }
}

/**
 * Saves a file.
 * @param {Object} file
 * @param {Object} options
 */
function file_save(file, options) {
  try {
    entity_save('file', null, file, options);
  }
  catch (error) { console.log('file_save - ' + error); }
}

/**
 * Loads a node.
 * @param {Number} nid
 * @param {Object} options
 */
function node_load(nid, options) {
  try {
    entity_load('node', nid, options);
  }
  catch (error) { console.log('node_load - ' + error); }
}

/**
 * Saves a node.
 * @param {Object} node
 * @param {Object} options
 */
function node_save(node, options) {
  try {
    entity_save('node', node.type, node, options);
  }
  catch (error) { console.log('node_save - ' + error); }
}

/**
 * Loads a taxonomy term.
 * @param {Number} tid
 * @param {Object} options
 */
function taxonomy_term_load(tid, options) {
  try {
    entity_load('taxonomy_term', tid, options);
  }
  catch (error) { console.log('taxonomy_term_load - ' + error); }
}

/**
 * Saves a taxonomy term.
 * @param {Object} taxonomy_term
 * @param {Object} options
 */
function taxonomy_term_save(taxonomy_term, options) {
  try {
    entity_save('taxonomy_term', null, taxonomy_term, options);
  }
  catch (error) { console.log('taxonomy_term_save - ' + error); }
}

/**
 * Loads a taxonomy vocabulary.
 * @param {Number} vid
 * @param {Object} options
 */
function taxonomy_vocabulary_load(vid, options) {
  try {
    entity_load('taxonomy_vocabulary', vid, options);
  }
  catch (error) { console.log('taxonomy_vocabulary_load - ' + error); }
}

/**
 * Saves a taxonomy vocabulary.
 * @param {Object} taxonomy_vocabulary
 * @param {Object} options
 */
function taxonomy_vocabulary_save(taxonomy_vocabulary, options) {
  try {
    entity_save('taxonomy_vocabulary', null, taxonomy_vocabulary, options);
  }
  catch (error) { console.log('taxonomy_vocabulary_save - ' + error); }
}

/**
 * Loads a user account.
 * @param {Number} uid
 * @param {Object} options
 */
function user_load(uid, options) {
  try {
    entity_load('user', uid, options);
  }
  catch (error) { console.log('user_load - ' + error); }
}

/**
 * Saves a user account.
 * @param {Object} account
 * @param {Object} options
 */
function user_save(account, options) {
  try {
    entity_save('user', null, account, options);
  }
  catch (error) { console.log('user_save - ' + error); }
}

/**
 * Generates a random user password.
 * @return {String}
 */
function user_password() {
  try {
    // credit: http://stackoverflow.com/a/1349426/763010
    var length = 10;
    if (arguments[0]) { length = arguments[0]; }
    var password = '';
    var possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz23456789';
    for (var i = 0; i < length; i++) {
      password += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return password;
  }
  catch (error) { console.log('user_password - ' + error); }
}

/**
 * The Drupal services JSON object.
 */
Drupal.services = {};

/**
 * Drupal Services XMLHttpRequest Object.
 * @param {Object} options
 */
Drupal.services.call = function(options) {
  try {

    options.debug = false;

    // Make sure the settings have been provided for Services.
    if (!services_ready()) {
      var error = 'Set the site_path and endpoint on Drupal.settings!';
      options.error(null, null, error);
      return;
    }

    module_invoke_all('services_preprocess', options);

    // Build the Request, URL and extract the HTTP method.
    var request = new XMLHttpRequest();
    var url = Drupal.settings.site_path +
              Drupal.settings.base_path + '?q=';
    // Use an endpoint, unless someone passed in an empty string.
    if (typeof options.endpoint === 'undefined') {
      url += Drupal.settings.endpoint + '/';
    }
    else if (options.endpoint != '') {
      url += options.endpoint + '/';
    }
    url += options.path;
    var method = options.method.toUpperCase();
    if (Drupal.settings.debug) { console.log(method + ': ' + url); }

    // Request Success Handler
    request.onload = function(e) {
      try {
        if (request.readyState == 4) {
          // Build a human readable response title.
          var title = request.status + ' - ' +
            http_status_code_title(request.status);
          // 200 OK
          if (request.status == 200) {
            if (Drupal.settings.debug) { console.log('200 - OK'); }
            // Extract the JSON result, or throw an error if the response wasn't
            // JSON.
            var result = null;
            var response_header = request.getResponseHeader('Content-Type');
            if (response_header.indexOf('application/json') == -1) {
              console.log(
                'Drupal.services.call - ERROR - response header was ' +
                response_header + ' instead of application/json'
              );
              console.log(request.responseText);
            }
            else { result = JSON.parse(request.responseText); }
            // Give modules a chance to pre post process the results, send the
            // results to the success callback, then give modules a chance to
            // post process the results.
            module_invoke_all(
              'services_request_pre_postprocess_alter',
              options,
              result
            );
            options.success(result);
            module_invoke_all(
              'services_request_postprocess_alter',
              options,
              result
            );
            module_invoke_all('services_postprocess', options, result);
          }
          else {
            // Not OK...
            if (Drupal.settings.debug) {
              console.log(method + ': ' + url + ' - ' + title);
              console.log(request.responseText);
              console.log(request.getAllResponseHeaders());
            }
            if (request.responseText) { console.log(request.responseText); }
            else { dpm(request); }
            if (typeof options.error !== 'undefined') {
              var message = request.responseText || '';
              if (!message || message == '') { message = title; }
              options.error(request, request.status, message);
            }
            module_invoke_all('services_postprocess', options, request);
          }
        }
        else {
          console.log(
            'Drupal.services.call - request.readyState = ' + request.readyState
          );
        }
      }
      catch (error) {
        // Not OK...
        if (Drupal.settings.debug) {
          console.log(method + ' (ERROR): ' + url + ' - ' + title);
          console.log(request.responseText);
          console.log(request.getAllResponseHeaders());
        }
        console.log('Drupal.services.call - onload - ' + error);
      }
    };

    // Get the CSRF Token and Make the Request.
    services_get_csrf_token({
        debug: options.debug,
        success: function(token) {
          try {
            // Async, or sync? By default we'll use async if none is provided.
            var async = true;
            if (typeof options.async !== 'undefined' &&
              options.async === false) { async = false; }

            // Open the request.
            request.open(method, url, async);

            // Determine content type header, if necessary.
            var contentType = null;
            if (method == 'POST') {
              contentType = 'application/json';
              // The user login resource needs a url encoded data string.
              if (options.service == 'user' &&
                options.resource == 'login') {
                contentType = 'application/x-www-form-urlencoded';
              }
            }
            else if (method == 'PUT') { contentType = 'application/json'; }

            // Anyone overriding the content type?
            if (options.contentType) { contentType = options.contentType; }

            // Set the content type on the header, if we have one.
            if (contentType) {
              request.setRequestHeader('Content-type', contentType);
            }

            // Add the token to the header if we have one.
            if (token) {
              request.setRequestHeader('X-CSRF-Token', token);
            }

            // Send the request with or without data.
            if (typeof options.data !== 'undefined') {
              // Print out debug information if debug is enabled. Don't print
              // out any sensitive debug data containing passwords.
              if (Drupal.settings.debug) {
                var show = true;
                if (options.service == 'user' &&
                  in_array(options.resource, ['login', 'create', 'update'])) {
                  show = false;
                }
                if (show) {
                  if (typeof options.data === 'object') {
                    console.log(JSON.stringify(options.data));
                  }
                  else { console.log(options.data); }
                }
              }
              request.send(options.data);
            }
            else { request.send(null); }

          }
          catch (error) {
            console.log(
              'Drupal.services.call - services_get_csrf_token - success - ' +
              error
            );
          }
        },
        error: function(xhr, status, message) {
          try {
            console.log(
              'Drupal.services.call - services_get_csrf_token - ' + message
            );
            if (options.error) { options.error(xhr, status, message); }
          }
          catch (error) {
            console.log(
              'Drupal.services.call - services_get_csrf_token - error - ' +
              error
            );
          }
        }
    });

  }
  catch (error) {
    console.log('Drupal.services.call - error - ' + error);
  }
};

/**
 * Gets the CSRF token from Services.
 * @param {Object} options
 */
function services_get_csrf_token(options) {
  try {

    var token;

    // Are we resetting the token?
    if (options.reset) { Drupal.sessid = null; }

    // Do we already have a token? If we do, return it the success callback.
    if (Drupal.sessid) { token = Drupal.sessid; }
    if (token) {
      if (options.success) { options.success(token); }
      return;
    }

    // We don't have a token, let's get it from Drupal...

    // Build the Request and URL.
    var token_request = new XMLHttpRequest();
    var token_url = Drupal.settings.site_path +
              Drupal.settings.base_path +
              '?q=services/session/token';

    // Token Request Success Handler
    token_request.onload = function(e) {
      try {
        if (token_request.readyState == 4) {
          var title = token_request.status + ' - ' +
            http_status_code_title(token_request.status);
          if (token_request.status != 200) { // Not OK
            console.log(token_url + ' - ' + title);
            console.log(token_request.responseText);
          }
          else { // OK
            // Set Drupal.sessid with the token, then return the token to the
            // success function.
            token = token_request.responseText;
            Drupal.sessid = token;
            if (options.success) { options.success(token); }
          }
        }
        else {
          console.log(
            'services_get_csrf_token - readyState - ' + token_request.readyState
          );
        }
      }
      catch (error) {
        console.log(
          'services_get_csrf_token - token_request. onload - ' + error
        );
      }
    };

    // Open the token request.
    token_request.open('GET', token_url, true);

    // Send the token request.
    token_request.send(null);
  }
  catch (error) { console.log('services_get_csrf_token - ' + error); }
}

/**
 * Checks if we're ready to make a Services call.
 * @return {Boolean}
 */
function services_ready() {
  try {
    var result = true;
    if (Drupal.settings.site_path == '') {
      result = false;
      console.log('jDrupal\'s Drupal.settings.site_path is not set!');
    }
    if (Drupal.settings.endpoint == '') {
      result = false;
      console.log('jDrupal\'s Drupal.settings.endpoint is not set!');
    }
    return result;
  }
  catch (error) { console.log('services_ready - ' + error); }
}

/**
 * Given the options for a service call, the service name and the resource name,
 * this will attach the names and their values as properties on the options.
 * @param {Object} options
 * @param {String} service
 * @param {String} resource
 */
function services_resource_defaults(options, service, resource) {
  try {
    if (!options.service) { options.service = service; }
    if (!options.resource) { options.resource = resource; }
  }
  catch (error) { console.log('services_resource_defaults - ' + error); }
}

/**
 * Creates a comment.
 * @param {Object} comment
 * @param {Object} options
 */
function comment_create(comment, options) {
  try {
    services_resource_defaults(options, 'comment', 'create');
    entity_create('comment', null, comment, options);
  }
  catch (error) { console.log('comment_create - ' + error); }
}

/**
 * Retrieves a comment.
 * @param {Number} ids
 * @param {Object} options
 */
function comment_retrieve(ids, options) {
  try {
    services_resource_defaults(options, 'comment', 'retrieve');
    entity_retrieve('comment', ids, options);
  }
  catch (error) { console.log('comment_retrieve - ' + error); }
}

/**
 * Update a comment.
 * @param {Object} comment
 * @param {Object} options
 */
function comment_update(comment, options) {
  try {
    services_resource_defaults(options, 'comment', 'update');
    entity_update('comment', null, comment, options);
  }
  catch (error) { console.log('comment_update - ' + error); }
}

/**
 * Delete a comment.
 * @param {Number} cid
 * @param {Object} options
 */
function comment_delete(cid, options) {
  try {
    services_resource_defaults(options, 'comment', 'delete');
    entity_delete('comment', cid, options);
  }
  catch (error) { console.log('comment_delete - ' + error); }
}

/**
 * Perform a comment index.
 * @param {Object} query
 * @param {Object} options
 */
function comment_index(query, options) {
  try {
    services_resource_defaults(options, 'comment', 'index');
    entity_index('comment', query, options);
  }
  catch (error) { console.log('comment_index - ' + error); }
}

/**
 * Creates an entity.
 * @param {String} entity_type
 * @param {String} bundle
 * @param {Object} entity
 * @param {Object} options
 */
function entity_create(entity_type, bundle, entity, options) {
  try {
    Drupal.services.call({
        method: 'POST',
        async: options.async,
        path: entity_type + '.json',
        service: options.service,
        resource: options.resource,
        entity_type: entity_type,
        bundle: bundle,
        data: JSON.stringify(entity),
        success: function(data) {
          try {
            if (options.success) { options.success(data); }
          }
          catch (error) { console.log('entity_create - success - ' + error); }
        },
        error: function(xhr, status, message) {
          try {
            if (options.error) { options.error(xhr, status, message); }
          }
          catch (error) { console.log('entity_create - error - ' + error); }
        }
    });
  }
  catch (error) { console.log('entity_create - ' + error); }
}

/**
 * Retrieves an entity.
 * @param {String} entity_type
 * @param {Number} ids
 * @param {Object} options
 */
function entity_retrieve(entity_type, ids, options) {
  try {
    Drupal.services.call({
        method: 'GET',
        path: entity_type + '/' + ids + '.json',
        service: options.service,
        resource: options.resource,
        entity_type: entity_type,
        entity_id: ids,
        success: function(data) {
          try {
            if (options.success) { options.success(data); }
          }
          catch (error) { console.log('entity_retrieve - success - ' + error); }
        },
        error: function(xhr, status, message) {
          try {
            if (options.error) { options.error(xhr, status, message); }
          }
          catch (error) { console.log('entity_retrieve - error - ' + error); }
        }
    });
  }
  catch (error) { console.log('entity_retrieve - ' + error); }
}

/**
 * Updates an entity.
 * @param {String} entity_type
 * @param {String} bundle
 * @param {Object} entity
 * @param {Object} options
 */
function entity_update(entity_type, bundle, entity, options) {
  try {
    var entity_wrapper = _entity_wrap(entity_type, entity);
    var primary_key = entity_primary_key(entity_type);
    Drupal.services.call({
        method: 'PUT',
        path: entity_type + '/' + entity[primary_key] + '.json',
        service: options.service,
        resource: options.resource,
        entity_type: entity_type,
        entity_id: entity[entity_primary_key(entity_type)],
        bundle: bundle,
        data: JSON.stringify(entity_wrapper),
        success: function(data) {
          try {
            _entity_local_storage_delete(entity_type, entity[primary_key]);
            if (options.success) { options.success(data); }
          }
          catch (error) { console.log('entity_update - success - ' + error); }
        },
        error: function(xhr, status, message) {
          try {
            if (options.error) { options.error(xhr, status, message); }
          }
          catch (error) { console.log('entity_update - error - ' + error); }
        }
    });
  }
  catch (error) { console.log('entity_update - ' + error); }
}

/**
 * Deletes an entity.
 * @param {String} entity_type
 * @param {Number} entity_id
 * @param {Object} options
 */
function entity_delete(entity_type, entity_id, options) {
  try {
    Drupal.services.call({
        method: 'DELETE',
        path: entity_type + '/' + entity_id + '.json',
        service: options.service,
        resource: options.resource,
        entity_type: entity_type,
        entity_id: entity_id,
        success: function(data) {
          try {
            _entity_local_storage_delete(entity_type, entity_id);
            if (options.success) { options.success(data); }
          }
          catch (error) { console.log('entity_delete - success - ' + error); }
        },
        error: function(xhr, status, message) {
          try {
            if (options.error) { options.error(xhr, status, message); }
          }
          catch (error) { console.log('entity_delete - error - ' + error); }
        }
    });
  }
  catch (error) { console.log('entity_delete - ' + error); }
}

/**
 * Performs an entity index.
 * @param {String} entity_type
 * @param {String} query
 * @param {Object} options
 */
function entity_index(entity_type, query, options) {
  try {
    var query_string;
    if (typeof query === 'object') {
      query_string = entity_index_build_query_string(query);
    }
    else if (typeof query === 'string') {
      query_string = query;
    }
    if (query_string) { query_string = '&' + query_string; }
    else { query_string = ''; }
    Drupal.services.call({
        method: 'GET',
        path: entity_type + '.json' + query_string,
        service: options.service,
        resource: options.resource,
        entity_type: entity_type,
        success: function(result) {
          try {
            if (options.success) { options.success(result); }
          }
          catch (error) { console.log('entity_index - success - ' + error); }
        },
        error: function(xhr, status, message) {
          try {
            if (options.error) { options.error(xhr, status, message); }
          }
          catch (error) { console.log('entity_index - error - ' + error); }
        }
    });
  }
  catch (error) { console.log('entity_index - ' + error); }
}
/**
 * Builds a query string from a query object for an entity index resource.
 * @param {Object} query
 * @return {String}
 */
function entity_index_build_query_string(query) {
  try {
    var result = '';
    if (!query) { return result; }
    if (query.fields) { // array
      var fields = '';
      for (var i = 0; i < query.fields.length; i++) {
        fields += encodeURIComponent(query.fields[i]) + ',';
      }
      if (fields != '') {
        fields = 'fields=' + fields.substring(0, fields.length - 1);
        result += fields + '&';
      }
    }
    if (query.parameters) { // object
      var parameters = '';
      for (var parameter in query.parameters) {
          if (query.parameters.hasOwnProperty(parameter)) {
            var key = encodeURIComponent(parameter);
            var value = encodeURIComponent(query.parameters[parameter]);
            parameters += 'parameters[' + key + ']=' + value + '&';
          }
      }
      if (parameters != '') {
        parameters = parameters.substring(0, parameters.length - 1);
        result += parameters + '&';
      }
    }
    if (typeof query.page !== 'undefined') { // int
      result += 'page=' + encodeURIComponent(query.page) + '&';
    }
    if (typeof query.page_size !== 'undefined') { // int
      result += 'page_size=' + encodeURIComponent(query.page_size) + '&';
    }
    return result.substring(0, result.length - 1);
  }
  catch (error) { console.log('entity_index_build_query_string - ' + error); }
}

/**
 * Wraps an entity in a JSON object, keyed by its type.
 * @param {String} entity_type
 * @param {Object} entity
 * @return {String}
 */
function _entity_wrap(entity_type, entity) {
  try {
    // We don't wrap taxonomy or users.
    var entity_wrapper = {};
    if (entity_type == 'taxonomy_term' ||
      entity_type == 'taxonomy_vocabulary' ||
      entity_type == 'user') {
      entity_wrapper = entity;
    }
    else { entity_wrapper[entity_type] = entity; }
    return entity_wrapper;
  }
  catch (error) { console.log('_entity_wrap - ' + error); }
}

/**
 * Creates a file.
 * @param {Object} file
 * @param {Object} options
 */
function file_create(file, options) {
  try {
    services_resource_defaults(options, 'file', 'create');
    entity_create('file', null, file, options);
  }
  catch (error) { console.log('file_create - ' + error); }
}

/**
 * Retrieves a file.
 * @param {Number} ids
 * @param {Object} options
 */
function file_retrieve(ids, options) {
  try {
    services_resource_defaults(options, 'file', 'retrieve');
    entity_retrieve('file', ids, options);
  }
  catch (error) { console.log('file_retrieve - ' + error); }
}

/**
 * Creates a node.
 * @param {Object} node
 * @param {Object} options
 */
function node_create(node, options) {
  try {
    services_resource_defaults(options, 'node', 'create');
    entity_create('node', node.type, node, options);
  }
  catch (error) { console.log('node_create - ' + error); }
}

/**
 * Retrieves a node.
 * @param {Number} ids
 * @param {Object} options
 */
function node_retrieve(ids, options) {
  try {
    services_resource_defaults(options, 'node', 'retrieve');
    entity_retrieve('node', ids, options);
  }
  catch (error) { console.log('node_retrieve - ' + error); }
}

/**
 * Update a node.
 * @param {Object} node
 * @param {Object} options
 */
function node_update(node, options) {
  try {
    services_resource_defaults(options, 'node', 'update');
    entity_update('node', node.type, node, options);
  }
  catch (error) { console.log('node_update - ' + error); }
}

/**
 * Delete a node.
 * @param {Number} nid
 * @param {Object} options
 */
function node_delete(nid, options) {
  try {
    services_resource_defaults(options, 'node', 'delete');
    entity_delete('node', nid, options);
  }
  catch (error) { console.log('node_delete - ' + error); }
}

/**
 * Perform a node index.
 * @param {Object} query
 * @param {Object} options
 */
function node_index(query, options) {
  try {
    services_resource_defaults(options, 'node', 'index');
    entity_index('node', query, options);
  }
  catch (error) { console.log('node_index - ' + error); }
}

/**
 * System connect call.
 * @param {Object} options
 */
function system_connect(options) {
  try {

    // Build a system connect object.
    var system_connect = {
      service: 'system',
      resource: 'connect',
      method: 'POST',
      path: 'system/connect.json',
      success: function(data) {
        try {
          Drupal.user = data.user;
          if (options.success) { options.success(data); }
        }
        catch (error) { console.log('system_connect - success - ' + error); }
      },
      error: function(xhr, status, message) {
        try {
          if (options.error) { options.error(xhr, status, message); }
        }
        catch (error) { console.log('system_connect - error - ' + error); }
      }
    };

    // If we don't have a token, grab one first.
    if (!Drupal.csrf_token) {
      services_get_csrf_token({
          success: function(token) {
            try {
              if (options.debug) { console.log('Grabbed new token.'); }
              // Now that we have a token, make the system connect call.
              Drupal.csrf_token = true;
              Drupal.services.call(system_connect);
            }
            catch (error) {
              console.log(
                'system_connect - services_csrf_token - success - ' + message
              );
            }
          },
          error: function(xhr, status, message) {
            try {
              if (options.error) { options.error(xhr, status, message); }
            }
            catch (error) {
              console.log(
                'system_connect - services_csrf_token - error - ' + message
              );
            }
          }
      });
    }
    else {
      // We already have a token, make the system connect call.
      if (options.debug) { console.log('Token already available.'); }
      Drupal.services.call(system_connect);
    }
  }
  catch (error) {
    console.log('system_connect - ' + error);
  }
}

/**
 * Creates a taxonomy term.
 * @param {Object} taxonomy_term
 * @param {Object} options
 */
function taxonomy_term_create(taxonomy_term, options) {
  try {
    services_resource_defaults(options, 'taxonomy_term', 'create');
    entity_create('taxonomy_term', null, taxonomy_term, options);
  }
  catch (error) { console.log('taxonomy_term_create - ' + error); }
}

/**
 * Retrieves a taxonomy term.
 * @param {Number} ids
 * @param {Object} options
 */
function taxonomy_term_retrieve(ids, options) {
  try {
    services_resource_defaults(options, 'taxonomy_term', 'retrieve');
    entity_retrieve('taxonomy_term', ids, options);
  }
  catch (error) { console.log('taxonomy_term_retrieve - ' + error); }
}

/**
 * Update a taxonomy term.
 * @param {Object} taxonomy_term
 * @param {Object} options
 */
function taxonomy_term_update(taxonomy_term, options) {
  try {
    services_resource_defaults(options, 'taxonomy_term', 'update');
    entity_update('taxonomy_term', null, taxonomy_term, options);
  }
  catch (error) { console.log('taxonomy_term_update - ' + error); }
}

/**
 * Delete a taxonomy term.
 * @param {Number} tid
 * @param {Object} options
 */
function taxonomy_term_delete(tid, options) {
  try {
    services_resource_defaults(options, 'taxonomy_term', 'delete');
    entity_delete('taxonomy_term', tid, options);
  }
  catch (error) { console.log('taxonomy_term_delete - ' + error); }
}

/**
 * Perform a taxonomy_term index.
 * @param {Object} query
 * @param {Object} options
 */
function taxonomy_term_index(query, options) {
  try {
    services_resource_defaults(options, 'taxonomy_term', 'index');
    entity_index('taxonomy_term', query, options);
  }
  catch (error) { console.log('taxonomy_term_index - ' + error); }
}

/**
 * Creates a taxonomy vocabulary.
 * @param {Object} taxonomy_vocabulary
 * @param {Object} options
 */
function taxonomy_vocabulary_create(taxonomy_vocabulary, options) {
  try {
    // Set a default machine name if one wasn't provided.
    if (!taxonomy_vocabulary.machine_name && taxonomy_vocabulary.name) {
      taxonomy_vocabulary.machine_name =
        taxonomy_vocabulary.name.toLowerCase().replace(' ', '_');
    }
    services_resource_defaults(options, 'taxonomy_vocabulary', 'create');
    entity_create('taxonomy_vocabulary', null, taxonomy_vocabulary, options);
  }
  catch (error) { console.log('taxonomy_vocabulary_create - ' + error); }
}

/**
 * Retrieves a comment.
 * @param {Number} ids
 * @param {Object} options
 */
function taxonomy_vocabulary_retrieve(ids, options) {
  try {
    services_resource_defaults(options, 'taxonomy_vocabulary', 'retrieve');
    entity_retrieve('taxonomy_vocabulary', ids, options);
  }
  catch (error) { console.log('taxonomy_vocabulary_retrieve - ' + error); }
}

/**
 * Update a taxonomy vocabulary.
 * @param {Object} taxonomy_vocabulary
 * @param {Object} options
 */
function taxonomy_vocabulary_update(taxonomy_vocabulary, options) {
  try {
    // We need to make sure a machine_name was provided, otherwise it seems the
    // Services module will update a vocabulary and clear out its machine_name
    // if we don't provide it.
    if (!taxonomy_vocabulary.machine_name ||
      taxonomy_vocabulary.machine_name == '') {
      var message = 'taxonomy_vocabulary_update - missing machine_name';
      console.log(message);
      if (options.error) {
        options.error(null, 406, message);
      }
      return;
    }
    services_resource_defaults(options, 'taxonomy_vocabulary', 'update');
    entity_update('taxonomy_vocabulary', null, taxonomy_vocabulary, options);
  }
  catch (error) { console.log('taxonomy_vocabulary_update - ' + error); }
}

/**
 * Delete a taxonomy vocabulary.
 * @param {Number} vid
 * @param {Object} options
 */
function taxonomy_vocabulary_delete(vid, options) {
  try {
    services_resource_defaults(options, 'taxonomy_vocabulary', 'delete');
    entity_delete('taxonomy_vocabulary', vid, options);
  }
  catch (error) { console.log('taxonomy_vocabulary_delete - ' + error); }
}

/**
 * Perform a taxonomy_vocabulary index.
 * @param {Object} query
 * @param {Object} options
 */
function taxonomy_vocabulary_index(query, options) {
  try {
    services_resource_defaults(options, 'taxonomy_vocabulary', 'index');
    entity_index('taxonomy_vocabulary', query, options);
  }
  catch (error) { console.log('taxonomy_vocabulary_index - ' + error); }
}

/**
 * Creates a user.
 * @param {Object} account
 * @param {Object} options
 */
function user_create(account, options) {
  try {
    services_resource_defaults(options, 'user', 'create');
    entity_create('user', null, account, options);
  }
  catch (error) { console.log('user_create - ' + error); }
}

/**
 * Retrieves a user.
 * @param {Number} ids
 * @param {Object} options
 */
function user_retrieve(ids, options) {
  try {
    services_resource_defaults(options, 'user', 'retrieve');
    entity_retrieve('user', ids, options);
  }
  catch (error) { console.log('user_retrieve - ' + error); }
}

/**
 * Updates a user.
 * @param {Object} account
 * @param {Object} options
 */
function user_update(account, options) {
  try {
    var mode = 'create';
    if (account.uid) { mode = 'update'; }
    services_resource_defaults(options, 'user', mode);
    entity_update('user', null, account, options);
  }
  catch (error) { console.log('user_update - ' + error); }
}

/**
 * Delete a user.
 * @param {Number} uid
 * @param {Object} options
 */
function user_delete(uid, options) {
  try {
    services_resource_defaults(options, 'user', 'create');
    entity_delete('user', uid, options);
  }
  catch (error) { console.log('user_delete - ' + error); }
}

/**
 * Perform a user index.
 * @param {Object} query
 * @param {Object} options
 */
function user_index(query, options) {
  try {
    services_resource_defaults(options, 'user', 'create');
    entity_index('user', query, options);
  }
  catch (error) { console.log('user_index - ' + error); }
}

/**
 * Registers a user.
 * @param {Object} account
 * @param {Object} options
 */
function user_register(account, options) {
  try {
    Drupal.services.call({
        service: 'user',
        resource: 'register',
        method: 'POST',
        path: 'user/register.json',
        data: JSON.stringify(account),
        success: function(data) {
          try {
            if (options.success) { options.success(data); }
          }
          catch (error) { console.log('user_register - success - ' + error); }
        },
        error: function(xhr, status, message) {
          try {
            if (options.error) { options.error(xhr, status, message); }
          }
          catch (error) { console.log('user_register - error - ' + error); }
        }
    });
  }
  catch (error) { console.log('user_retrieve - ' + error); }
}

/**
 * Login user.
 * @param {String} name
 * @param {String} pass
 * @param {Object} options
 */
function user_login(name, pass, options) {
  try {
    var valid = true;
    if (!name || typeof name !== 'string') {
      valid = false;
      console.log('user_login - invalid name');
    }
    if (!pass || typeof pass !== 'string') {
      valid = false;
      console.log('user_login - invalid pass');
    }
    if (!valid) {
      if (options.error) { options.error(null, 406, 'user_login - bad input'); }
      return;
    }
    Drupal.services.call({
        service: 'user',
        resource: 'login',
        method: 'POST',
        path: 'user/login.json',
        data: 'username=' + encodeURIComponent(name) +
             '&password=' + encodeURIComponent(pass),
        success: function(data) {
          try {
            // Now that we are logged in, we need to get a new CSRF token, and
            // then make a system connect call.
            Drupal.user = data.user;
            Drupal.sessid = null;
            services_get_csrf_token({
                success: function(token) {
                  try {
                    if (options.success) {
                      system_connect({
                          success: function(result) {
                            try {
                              if (options.success) { options.success(data); }
                            }
                            catch (error) {
                              console.log(
                                'user_login - system_connect - success - ' +
                                error
                              );
                            }
                          },
                          error: function(xhr, status, message) {
                            try {
                              if (options.error) {
                                options.error(xhr, status, message);
                              }
                            }
                            catch (error) {
                              console.log(
                                'user_login - system_connect - error - ' +
                                error
                              );
                            }
                          }
                      });
                    }
                  }
                  catch (error) {
                    console.log(
                      'user_login - services_get_csrf_token - success - ' +
                      error
                    );
                  }
                },
                error: function(xhr, status, message) {
                  console.log(
                    'user_login - services_get_csrf_token - error - ' +
                    message
                  );
                  if (options.error) { options.error(xhr, status, message); }
                }
            });
          }
          catch (error) { console.log('user_login - success - ' + error); }
        },
        error: function(xhr, status, message) {
          try {
            if (options.error) { options.error(xhr, status, message); }
          }
          catch (error) { console.log('user_login - error - ' + error); }
        }
    });
  }
  catch (error) {
    console.log('user_login - ' + error);
  }
}

/**
 * Logout current user.
 * @param {Object} options
 */
function user_logout(options) {
  try {
    Drupal.services.call({
        service: 'user',
        resource: 'logout',
        method: 'POST',
        path: 'user/logout.json',
        success: function(data) {
          try {
            // Now that we logged out, clear the sessid and call system connect.
            Drupal.user = drupal_user_defaults();
            Drupal.sessid = null;
            system_connect({
                success: function(result) {
                  try {
                    if (options.success) { options.success(data); }
                  }
                  catch (error) {
                    console.log(
                      'user_logout - system_connect - success - ' +
                      error
                    );
                  }
                },
                error: function(xhr, status, message) {
                  try {
                    if (options.error) { options.error(xhr, status, message); }
                  }
                  catch (error) {
                    console.log(
                      'user_logout - system_connect - error - ' +
                      error
                    );
                  }
                }
            });
          }
          catch (error) { console.log('user_logout - success - ' + error); }
        },
        error: function(xhr, status, message) {
          try {
            if (options.error) { options.error(xhr, status, message); }
          }
          catch (error) { console.log('user_logout - error - ' + error); }
        }
    });
  }
  catch (error) {
    console.log('user_login - ' + error);
  }
}

