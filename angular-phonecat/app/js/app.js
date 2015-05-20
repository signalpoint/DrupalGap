'use strict';

/* App Module */

var phonecatApp = angular.module('phonecatApp', [
  'ngRoute',
  'ngSanitize',
  'phonecatAnimations',
  'phonecatControllers',
  'phonecatFilters',
  'phonecatServices'
]);

/**
 *
 */
function dgResolveController() {
  try {
    
  }
  catch (error) { console.log('dgResolveController - ' + error); }
}

phonecatApp.config(['$routeProvider',
  function($routeProvider) {
    
    // Load DrupalGap.
    drupalgap_onload();
    
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
      if (!menu_link.controller && menu_link.page_callback) {
        console.log('DEPRECATED: phonecatApp - routeProvider | rename the ' + path + ' menu link path\'s page_callback property name to controller');
        menu_link.controller = menu_link.page_callback;
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
      console.log(menu_link);
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
    $routeProvider.otherwise({
        redirectTo: '/' + drupalgap.settings.front
    });

  }]);

