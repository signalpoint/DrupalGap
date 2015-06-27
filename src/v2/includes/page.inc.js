// Used to render the "dg-page" directive attribute from the theme's
// page.tpl.html file.
dgApp.directive("dgPage", function($compile, drupalgapSettings) {
    return {
      link: function(scope, element, attrs) {
        
        //dpm('dgPage - link...');
        var theme = drupalgapSettings.theme;
        //console.log(theme);

        var template = '';
        for (var name in theme.regions) {
          if (!theme.regions.hasOwnProperty(name)) { continue; }
          var region = theme.regions[name];
          template += drupalgap_render_region(region);
        }

        // Compile the template for Angular and append it to the directive's
        // html element.
        var linkFn = $compile(template);
        var content = linkFn(scope);
        element.append(content);

      }
    };
});

dgApp.controller('dg_page_controller', [
    '$scope', '$sce', '$route', '$location', '$routeParams',
    function($scope, $sce, $route, $location, $routeParams) {
      try {

        //dpm('dg_page_controller');
        //console.log(arguments);
  
        // Place the route into the global dg ng, we don't do this in run()
        // because the route isn't fully initalized until this controller is
        // invoked.
        dg_ng_set('route', $route);
  
      }
      catch (error) { console.log('dg_page_controller - ' + error); }
  }
]);

