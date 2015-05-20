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
      var menu_link = drupalgap.menu_links[path];
      /*$routeProvider.when('/' + path, {
          templateUrl: 'partials/phone-list.html',
          controller: 'PhoneListCtrl'
      });*/
    }
    
    /*
    when('/phones', {
        templateUrl: 'partials/phone-list.html',
        controller: 'PhoneListCtrl'
      }).
      when('/phones/:phoneId', {
        templateUrl: 'partials/phone-detail.html',
        controller: 'PhoneDetailCtrl'
      }).
    */
    
    $routeProvider.when('/user/login', {
        templateUrl: 'js/drupalgap/src/modules/user/views/user_login_form.html',
        controller: 'user_login_form',
        resolve: {
          /* each page_argument can be dynamically resolved here!!! */
          /* @TODO can we just promise a template here? */
          form: function($q, $timeout) {
            return drupalgap_form_load('user_login_form');
          }
        }
    });
    
    $routeProvider.otherwise({
        redirectTo: '/' + drupalgap.settings.front
    });

  }]);

