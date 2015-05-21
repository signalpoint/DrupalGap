'use strict';

/* App Module */

var phonecatApp = angular.module('phonecatApp', [
    'ngRoute',
    'ngSanitize',
    'phonecatAnimations',
    'phonecatControllers',
    'phonecatFilters',
    'phonecatServices'
]).config(function() {

    // @WARNING only providers available here, no scope available here...

    drupalgap_onload();

}).run(['$rootScope', function($rootScope) {
  
      // Watch for changes in the Angular route (this is fired twice per route change)...
      $rootScope.$on("$locationChangeStart", function(event, next, current) {

          // Extract the current menu path from the Angular route, and warn
          // about any uncrecognized routes.
          var path_current = drupalgap_angular_get_route_path(current);
          var path_next = drupalgap_angular_get_route_path(next);           
          if (path_current == drupalgap_path_get()) { return; } // Don't process current path.
          if (!path_next) {
            if (!drupalgap_path_get()) { return; } // Don't warn about the first page load.
            console.log('locationChangeStart - unsupported path: ' + path_next);
          }

          // Set the current menu path to the path input.
          drupalgap_path_set(path_next);

          // Determine the router path.
          var router_path = drupalgap_get_menu_link_router_path(path_next);

          // Set the drupalgap router path.
          drupalgap_router_path_set(router_path);
          
          console.log('navigated to: ' + path_next);
          
      });
  }]);

  // @TODO attach this directly to the object we're building above.
phonecatApp.config(['$routeProvider',
  function($routeProvider) {
    
    
    // Attach hoom_menu() paths to Angular's routeProvider.
    for (var path in drupalgap.menu_links) {
      if (!drupalgap.menu_links.hasOwnProperty(path)) { continue; }
      
      // Extract the menu link.
      var menu_link = drupalgap.menu_links[path];
      
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
        menu_link.controller = 'drupalgap_page_callback_controller';
        // @WARNING - dynamically resolving page arguments always gets stuck
        // on the last menu link item.
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
      var page_arguments = [];
      if (typeof menu_link.page_arguments !== 'undefined') {
        console.log('UPGRADE: phonecatApp - routeProvider | convert the page_arguments into a "resolve" on path: ' + path);
      }
      
      // Add the menu link to Angular's routeProvider.
      // @TODO apparently attaching all the controllers at once, instead of on
      // demand is expensive, seek alternative routes in utilizing controllers.
      //console.log(menu_link);
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
    
    // Set the app's front page on the routeProvider.
    drupalgap_router_path_set(drupalgap.settings.front);
    $routeProvider.otherwise({
        redirectTo: '/' + drupalgap.settings.front
    });

  }]);

