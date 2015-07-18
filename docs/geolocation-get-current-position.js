angular.module('my_module', ['drupalgap'])

// Configure module route provider, which is similar to hook_menu() in Drupal.
.config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/my_module/map', {
          templateUrl: dg_templateUrl(),
          controller: 'dg_page_controller',
          page_callback: 'my_module_map_page'
      });
}])

.directive('myModuleMap', function($compile) {
    return {
      controller: function($scope) { },
      link: function(scope, element) {
        
        // Grab the user's current position...
        navigator.geolocation.getCurrentPosition(

          // Success
          function (position) {
            var html = '<p>' +
              'Latitude: '          + position.coords.latitude          + '<br />' +
              'Longitude: '         + position.coords.longitude         + '<br />' +
              'Altitude: '          + position.coords.altitude          + '<br />' +
              'Accuracy: '          + position.coords.accuracy          + '<br />' +
              'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '<br />' +
              'Heading: '           + position.coords.heading           + '<br />' +
              'Speed: '             + position.coords.speed             + '<br />' +
              'Timestamp: '         + position.timestamp                + '<br />' +
            '</p>';
            element.append(dg_ng_compile($compile, scope, html));
          },

          // Error
          function (error) {
            console.log(
              'Code: '    + error.code    + '\n' +
              'Message: ' + error.message + '\n'
            );
          }

        );

      }
    };
})

;

function my_module_map_page() {
  var content = {};
  content['map'] = {
    markup: '<my-module-map></my-module-map>'
  };
  return content;
}

