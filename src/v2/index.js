// Create the drupalgap object.
var drupalgap = {
  blocks: [],
  date_formats: { }, /* @see system_get_date_formats() in Drupal core */
  date_types: { }, /* @see system_get_date_types() in Drupal core */
  entity_info: {},
  field_info_fields: {},
  field_info_instances: {},
  field_info_extra_fields: {},
  ng: { }, /* holds onto angular stuff */
  remote_addr: null, /* php's $_SERVER['REMOTE_ADDR'] via system connect */
  site_settings: {}, /* holds variable settings from the Drupal site */
};

// Create the drupalgap module for Angular.
angular.module('drupalgap', [])
  .value('drupalgapSettings', null);

// Create the app.
var dgApp = angular.module('dgApp', dg_ng_dependencies());

// Run the app.
dgApp.run([
    '$rootScope', '$routeParams', '$location', 'drupalSettings',
    function($rootScope, $routeParams, $location, drupalSettings) {

      dpm('dgApp.run()');
      console.log(arguments);

      dg_ng_set('routeParams', $routeParams);
      dg_ng_set('location', $location);
      
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
        //'dgControllers',
        'angular-drupal',
        'drupalgap',
        'dgSystem',
        'dgUser'
    ];
  }
  catch (error) { console.log('dg_ng_dependencies - ' + error); }
}

