// Create the drupalgap object.
var drupalgap = {
  blocks: [],
  content_types_list: { }, /* holds info about each content type */
  date_formats: { }, /* @see system_get_date_formats() in Drupal core */
  date_types: { }, /* @see system_get_date_types() in Drupal core */
  entity_info: { },
  field_info_fields: { },
  field_info_instances: { },
  field_info_extra_fields: { },
  menus: { },
  ng: { }, /* holds onto angular stuff */
  remote_addr: null, /* php's $_SERVER['REMOTE_ADDR'] via system connect */
  sessid: null,
  session_name: null,
  site_settings: { }, /* holds variable settings from the Drupal site */
  user: { } /* holds onto the current user's account object */
};

// Create the drupalgap module for Angular.
angular.module('drupalgap', [])
  .value('drupalgapSettings', null)
  .service('dgConnect', ['$q', '$http', 'drupalSettings', dgConnect])
  .service('dgOffline', ['$q', dgOffline]);

// Create the app.
var dgApp = angular.module('dgApp', dg_ng_dependencies());

// Run the app.
dgApp.run([
    '$rootScope', '$routeParams', '$location', '$http', 'drupalSettings',
    function($rootScope, $routeParams, $location, $http, drupalSettings) {

      //dpm('dgApp.run()');
      //console.log(arguments);

      dg_ng_set('routeParams', $routeParams);
      dg_ng_set('location', $location);
      dg_ng_set('http', $http);
      dg_ng_set('drupalSettings', drupalSettings);

      // Watch for changes in the Angular route (this is fired twice per route change)...
      /*$rootScope.$on("$locationChangeStart", function(event, next, current) {

          // Extract the current menu path from the Angular route, and warn
          // about any uncrecognized routes.
          // @TODO this doesn't do anything, but it a good placeholder for
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
function dg_ng_dependencies() {
  try {
    return [
        'ngRoute',
        'ngSanitize',
        'angular-drupal',
        'drupalgap',
        'dgAdmin',
        'dgSystem',
        'dgText',
        'dgUser',
        'dgEntity' // IMPORTANT - order matters here, e.g. user/login will get
                   // routed to user/:uid if we put the dgEntity module before
                   // the dgUser module.
    ];
  }
  catch (error) { console.log('dg_ng_dependencies - ' + error); }
}

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
        "user": dg_user_default()
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

