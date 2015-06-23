angular.module('drupalgap', [])
  .value('drupalgapSettings', null);

// Set up default Angular dependencies for DrupalGap.
var dgAppDependencies = dg_ng_dependencies(); // grab default dependencies.

// Add on additional dependencies as needed.
//dgAppDependencies.push('angular-animate');

var dgApp = angular.module('dgApp', dgAppDependencies);

dgApp.run(['$rootScope', '$routeParams', '$location', function($rootScope, $routeParams, $location) {

      dpm('dgApp.run()');
      //console.log(arguments);

      //drupalgap_ng_set('routeParams', $routeParams);
      //drupalgap_ng_set('location', $location);

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
  }]);

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
        'dgUser'
    ];
  }
  catch (error) { console.log('dg_ng_dependencies - ' + error); }
}

