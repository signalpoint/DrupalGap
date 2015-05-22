'use strict';

/* App Module */

var phonecatApp = angular.module('phonecatApp', [
    'ngRoute',
    'ngSanitize',
    'phonecatControllers',
    'jdrupal-ng'
]).config(function() {

    // @WARNING only providers available here, no scope available here...

    drupalgap_onload();

}).run(['$rootScope', '$routeParams', '$location', function($rootScope, $routeParams, $location) {

      dpm('phonecatApp.run()');
      console.log(arguments);

      drupalgap_ng_set('routeParams', $routeParams);
      drupalgap_ng_set('location', $location);

      // Watch for changes in the Angular route (this is fired twice per route change)...
      $rootScope.$on("$locationChangeStart", function(event, next, current) {

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

      });
  }]);

angular.module('jdrupal-ng').config(function($provide) {
    $provide.value('jdrupalSettings', {
        site_path: 'http://localhost/drupal-7',
        endpoint: 'drupalgap'
    });
    console.log('configure that beast from the app!');
    console.log(arguments);
});

  // @TODO attach this directly to the object we're building above.
phonecatApp.config(['$routeProvider',
  function($routeProvider) {
    
    dpm('phonecatApp.config()');
    console.log(arguments);
    
    // @TODO this should be included via index.html as a script.
    // @WARNING to get this file navigate to ?q=drupalgap/connect in your
    // browser then save it at the path mentioned below.
    // @WARNING Synchronous XMLHttpRequest on the main thread is deprecated because of its
    // detrimental effects to the end user's experience.
    drupalgap_service_resource_extract_results({
        service: 'system',
        resource: 'connect',
        data: JSON.parse(drupalgap_file_get_contents('js/drupalgap_connect.json'))
    });
    
    // Attach hoom_menu() paths to Angular's routeProvider.
    for (var path in drupalgap.menu_links) {
      if (!drupalgap.menu_links.hasOwnProperty(path)) { continue; }
      
      // Extract the menu link.
      var menu_link = drupalgap.menu_links[path];
      
      // Skip 'MENU_DEFAULT_LOCAL_TASK' items.
      if (menu_link.type == 'MENU_DEFAULT_LOCAL_TASK') {
        console.log('WARNING: phonecatApp - deprecated | MENU_DEFAULT_LOCAL_TASK on path: ' + path);
        continue;
      }
      
      // Use the active theme's page template as the templateUrl, if one wasn't
      // provided.
      if (!menu_link.templateUrl) {
        menu_link.templateUrl = 'js/drupalgap/themes/spi/page.tpl.html';
      }
      
      // Determine the menu link's controller, by first falling back to the
      // page_callback property which we'll warn the developer about, otherwise
      // we'll use menu_link object for the routeProvider.
      /*if (!menu_link.controller && menu_link.page_callback) {
        console.log('DEPRECATED: phonecatApp - routeProvider | rename the ' + path + ' menu link path\'s page_callback property name to controller');
        menu_link.controller = menu_link.page_callback;
      }*/
      if (!menu_link.controller && menu_link.page_callback) {
        menu_link.controller = 'drupalgap_goto_controller';
        // @WARNING - dynamically resolving page arguments always gets stuck
        // with the last menu link item in this loop...
        /*menu_link.resolve = {
          menu_link: function() {
            dpm('grabbing the menu link now!');
            console.log(menu_link);
            return menu_link.page_callback;
          }
        };*/
      }
      else if (!menu_link.controller) {
        console.log('WARNING: phonecatApp - routeProvider | no controller provided for path: ' + path);
      }
      
      // Warn the developer that each page_argument must be converted to an
      // Angular "resolve".
      /*var page_arguments = [];
      if (typeof menu_link.page_arguments !== 'undefined') {
        console.log('UPGRADE: phonecatApp - routeProvider | convert the page_arguments into a "resolve" on path: ' + path);
      }*/
      
      // Add the menu link to Angular's routeProvider.
      // @TODO apparently attaching all the controllers at once, instead of on
      // demand is expensive, seek alternative routes in utilizing controllers.
      //console.log(menu_link);
      // @TODO by attaching the complete hook_menu item link here, DG stuff ends
      // up in the same object as an Angular route, and we may or may not be
      // colliding with how they do things.
      $routeProvider.when('/' + path, menu_link);
    }

    /* each page_argument can be dynamically resolved here!!! */
    /*$routeProvider.when('/user/login', {
        templateUrl: 'js/drupalgap/src/modules/user/views/user_login_form.html',
        controller: 'user_login_form',
        resolve: {
          form: function($q, $timeout) {
            return drupalgap_form_load('user_login_form');
          }
        }
    });*/

    // @TODO - we can't be setting the path and router path like this, because
    // if we start on something other than the front page (i.e. a hash is in the
    // url), this will set off incorrect values.
    
    // Set the app's front page on the routeProvider.
    //drupalgap_path_set(drupalgap.settings.front);

    // Determine and set the drupalgap router path.
    //drupalgap_router_path_set(drupalgap_get_menu_link_router_path(drupalgap.settings.front));

    // Set the otherwise ruling to load the front page.
    $routeProvider.otherwise({
        redirectTo: '/' + drupalgap.settings.front
    });

  }]);

