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

// Create the app with its dependencies.
var dgApp = angular.module('dgApp', dg_dependencies);

// Run the app.
dgApp.run([
    '$rootScope', '$routeParams', '$location', '$http', 'drupal', 'drupalSettings', 'drupalgapSettings',
    function($rootScope, $routeParams, $location, $http, drupal, drupalSettings, drupalgapSettings) {
      
      // Warn if there is no sitePath specified.
      if (typeof drupalSettings.sitePath === 'undefined' || dg_empty(drupalSettings.sitePath)) {
        alert(t('You must specify a sitePath for the drupalSettings in the app.js file!'));
        return;
      }

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

