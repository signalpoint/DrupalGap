angular.module('dgEntity', ['drupalgap'])

// ~ hook_menu()
.config(['$routeProvider', function($routeProvider) {

      var entity_types = drupal_entity_types();
      
      // Add routes to view and edit entities.
      for (var i = 0; i < entity_types.length; i++) {
        var entity_type = entity_types[i];
        var route = '/' + entity_type + '/:' + drupal_entity_primary_key(entity_type);
        // View.
        $routeProvider.when(route, {
            templateUrl: 'themes/spi/page.tpl.html',
            controller: 'dg_page_controller',
            page_callback: 'dg_entity_page_view',
            page_arguments: [0, 1]
        });
        // Edit.
        $routeProvider.when(route + '/edit', {
          templateUrl: 'themes/spi/page.tpl.html',
          controller: 'dg_page_controller',
          page_callback: 'dg_entity_page_edit',
          page_arguments: [0, 1]
        });
      }
      
}])

.directive("entityView", function($compile, drupal) {
    return {
      controller: function($scope) {
        var entity_type = arg(0);
        var entity_id = arg(1);
        $scope.entity_type = entity_type;
        $scope.entity_id = entity_id;
        $scope.loading++;
        $scope.entity_load = {
          entity: drupal[entity_type + '_load'](entity_id)
        };
      },
      //replace: true,
      link: function(scope, element, attrs) {
        scope.entity_load.entity.then(function (entity) {
            //console.log(scope);
            //console.log(entity);

          scope.loading--;

          var entity_type = scope.entity_type;
            
          var content = { };

          // Add the "title" of this entity to the content.
          content[drupal_entity_primary_key(entity_type)] = {
            theme: 'header',
            text: entity[drupal_entity_primary_key_title(entity_type)]
          };
            
          // Grab this entity's field info instances.
          var instances = drupalgap_field_info_instances(
            entity_type,
            entity.type // @TODO support all entity type bundles, not just node content types
          );
          console.log(drupalgap.field_info_instances);
          console.log(instances);
            
            // Render each field instance...
            for (var field_name in instances) {
              if (!instances.hasOwnProperty(field_name)) { continue; }
              var instance = instances[field_name];
              
              // Extract the drupalgap display mode and the module name in
              // charge of the field's formatter view hook.
              var display = instance.display.drupalgap;
              var module = display.module;
              var hook = module + '_field_formatter_view';

              dpm(hook);
              
              // Invoke the hook_field_formmater_view(), if it exists.
              if (!dg_function_exists(hook)) { console.log(hook + '() missing!'); continue; }
              content[field_name] = window[hook](
                entity_type,
                entity,
                dg_field_info_field(field_name),
                instance,
                entity.language,
                entity[field_name][entity.language],
                display
              );
              
            }

          // @TODO great place for a hook
            
            element.replaceWith($compile(drupalgap_render(content))(scope));
        });
      }
    };
})

  .directive("entityEdit", function($compile, drupal) {
    return {
      controller: function($scope) {
        var entity_type = arg(0);
        var entity_id = arg(1);
        $scope.entity_type = entity_type;
        $scope.entity_id = entity_id;
        $scope.loading++;
        $scope.entity_load = {
          entity: drupal[entity_type + '_load'](entity_id)
        };
      },
      //replace: true,
      link: function(scope, element, attrs) {
        scope.entity_load.entity.then(function (entity) {
          //console.log(scope);
          //console.log(entity);

          scope.loading--;

          var content = { markup: '<p>Edit that shitty node with the title of ' + entity.title + '!</p>' };

          var entity_type = scope.entity_type;

          // Grab this entity's field info instances.
          var instances = drupalgap_field_info_instances(
            entity_type,
            entity.type // @TODO support all entity type bundles, not just node content types
          );
          console.log(drupalgap.field_info_instances);
          console.log(instances);

          // Render each field instance...
          for (var field_name in instances) {
            if (!instances.hasOwnProperty(field_name)) { continue; }
            var instance = instances[field_name];

            // Extract the drupalgap display mode and the module name in
            // charge of the field's formatter view hook.
            /*var display = instance.display.drupalgap;
            var module = display.module;
            var hook = module + '_field_widget_form';*/

            // Invoke the hook_field_widget_form(), if it exists.
            //if (!dg_function_exists(hook)) { console.log(hook + '() missing!'); continue; }
            /*content[field_name] = window[hook](
              entity_type,
              entity,
              dg_field_info_field(field_name),
              instance,
              entity.language,
              entity[field_name][entity.language],
              display
            );*/

          }

          // @TODO great place for a hook

          element.replaceWith($compile(drupalgap_render(content))(scope));
        });
      }
    };
  });

/**
 *
 */
function dg_entity_page_view(entity_type, entity_id) {
  try {
    return '<entity-view></entity-view>';
  }
  catch (error) { console.log('dg_entity_page_view - ' + error); }
}

/**
 *
 */
function dg_entity_page_edit(entity_type, entity_id) {
  try {
    return '<entity-edit></entity-edit>';
  }
  catch (error) { console.log('dg_entity_page_view - ' + error); }
}
