// Used to render the "dg-page" directive attribute from the theme's
// page.tpl.html file.
dgApp.directive("dgPage", function($compile, drupalgapSettings) {
    return {
      controller: function($scope, drupal, dgConnect, dgOffline) {
        
        //dpm('dgPage controller');

        dg_ng_set('scope', $scope);

        $scope.loading = 0;
        
        /*dgConnect.json_load().then(function(json) {
            dpm('made it back!');
            console.log(json);
        });*/

        if (!dg_check_connection()) {
          
          // We don't have a connection...
          
          //dpm('making an offline promise...');
          
          // Make a promise to the offline link.
          $scope.loading++;
          $scope.offline = {
            data: dgOffline.connect()
          };
          
        }
        else {

          // We have a connection...
          
          //dpm('making an online promise...');
          
          // Make a promise to the connect link.
          $scope.loading++;
          $scope.connect = {
            data: drupal.connect()
          };

        }
      },
      link: function(scope, element, attrs) {
        
        //dpm('dgPage link');
        
        if (scope.offline) {
          scope.offline.data.then(function(data) {
              
            //dpm('dgPage link offline');
              
            // Offline...

            scope.loading--;

            //dpm('fullfilled the offline promise!');
            //console.log(data);
              
            // Set the drupalgap user and session info.
            dg_session_set(data);

            dg_page_compile($compile, drupalgapSettings, scope, element, attrs);
              
          });  
        }
        else if (scope.connect) {
          
          scope.connect.data.then(function (data) {
              
            //dpm('dgPage link online');
              
            // Online...

            scope.loading--;
            
            //dpm('fullfilled the connection promise!');
            //console.log(data);
              
            dg_session_set(data);

            // Does the user have access to this route?
            if (!dg_route_access()) {
            }
            else {
            }

            dg_page_compile($compile, drupalgapSettings, scope, element, attrs);

          });

        }

      }
    };
});

function dg_page_access() {
  try {

  }
  catch (error) {
    console.log('dg_page_access - ' + error);
  }
}

dgApp.controller('dg_page_controller', [
    '$scope', '$sce', '$route', '$location', '$routeParams',
    function($scope, $sce, $route, $location, $routeParams) {
      try {

        //dpm('dg_page_controller');
        //console.log(arguments);
  
        // Place the route into the global dg ng, we don't do this in run()
        // because the route isn't fully initialized until this controller is
        // invoked.
        dg_ng_set('route', $route);
  
      }
      catch (error) { console.log('dg_page_controller - ' + error); }
  }
]);

/**
 *
 */
function dg_page_compile($compile, drupalgapSettings, scope, element, attrs) {
  try {
    var theme = drupalgapSettings.theme;
    var template = '';
    for (var name in theme.regions) {
      if (!theme.regions.hasOwnProperty(name)) { continue; }
      var region = theme.regions[name];
      template += drupalgap_render_region(angular.merge({}, region));
    }
    var linkFn = $compile(template);
    var content = linkFn(scope);
    element.append(content);
  }
  catch (error) { console.log('dg_page_compile - ' + error); }
}

/**
 *
 */
function dg_templateUrl() {
  try {
    return 'themes/spi/page.tpl.html';
  }
  catch (error) { console.log('dg_templateUrl - ' + error); }
}

