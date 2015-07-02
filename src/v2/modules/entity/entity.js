angular.module('dgEntity', ['drupalgap'])

// ~ hook_menu()
.config(['$routeProvider', function($routeProvider) {

    // @TODO we don't have access to this because this config runs before the app's config,
    // maybe if we change it to a const instead of a value.
    //var entity_types = dg_entity_types();
    var entity_types = drupal_entity_types();
    console.log(entity_types);
      
      // Add routes to view and edit entities.
      for (var i = 0; i < entity_types.length; i++) {

        var entity_type = entity_types[i];
        // @TODO no access to entity type info yet! See above...
        //var entity = dg_entity_get_info(entity_type);
        //var route = '/' + entity_type + '/:' + entity.entity_keys.id;
        var route = '/' + entity_type + '/:' + drupal_entity_primary_key(entity_type);

        // View.
        $routeProvider.when(route, {
            templateUrl: 'themes/spi/page.tpl.html',
            controller: 'dg_page_controller',
            page_callback: 'dg_entity_page_view',
            page_arguments: [0, 1]
        });

        // Add.
        // @TODO

        // Edit.
        $routeProvider.when(route + '/edit', {
          templateUrl: 'themes/spi/page.tpl.html',
          controller: 'dg_page_controller',
          page_callback: 'dg_entity_page_edit',
          page_arguments: [0, 1]
        });

        // Admin list.
        $routeProvider.when('/admin/' + entity_type, {
          templateUrl: 'themes/spi/page.tpl.html',
          controller: 'dg_page_controller',
          page_callback: 'dg_entity_page_list',
          page_arguments: [1]
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
            
            element.replaceWith($compile(dg_render(content))(scope));
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
        //$scope.bundle = null; // @TODO we need the bundle here!
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
          console.log(entity);

          scope.loading--;

          var entity_type = scope.entity_type;
          //var bundle = scope.bundle; // @TODO we need the bundle here!

          // Set up form defaults.
          var form = dg_form_defaults(entity_type + "_edit_form", scope);

          // Build form elements.
          form.entity = entity;
          form.entity_type = entity_type;
          //form.bundle = bundle; // @TODO we need the bundle here!
          form.elements.submit = {
            type: 'submit',
            value: t('Save')
          };

          // Grab this entity's field info instances.
          var instances = drupalgap_field_info_instances(
            entity_type,
            entity.type // @TODO support all entity type bundles, not just node content types
          );
          //console.log(instances);

          // Render each field instance...
          for (var field_name in instances) {
            if (!instances.hasOwnProperty(field_name)) { continue; }
            var instance = instances[field_name];
            console.log(instance);
            var info = dg_field_info_field(field_name);
            var module = instance.widget.module;
            var cardinality = info.cardinality;
            dpm(cardinality);

            // Instantiate a form element for this field.
            form[field_name] = {
              field_name: field_name
            };

            // For each delta on the field...
            var delta = 0;
            while (delta !== null) {
              dpm(delta);
              delta = null; // break the loop.
            }



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

          // Place the form into the scope.
          // @TODO placing the form directly into the scope without an id is going to be bad in the long run!
          scope.form = form;

          // @TODO great place for a hook

          //element.replaceWith($compile(dg_render(content))(scope));
          element.append(dg_ng_compile_form($compile, scope));


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


/**
 *
 */
function dg_entity_page_list(entity_type) {
  try {
    return '<p>' + entity_type + '</p>';
  }
  catch (error) { console.log('dg_entity_page_list - ' + error); }
}

