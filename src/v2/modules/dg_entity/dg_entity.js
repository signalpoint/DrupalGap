angular.module('dg_entity', ['drupalgap'])

// ~ hook_menu()
.config(['$routeProvider', function($routeProvider) {

    var entity_types = dg_entity_types();
    console.log(entity_types);
      
      // Add routes to view and edit entities.
      for (var i = 0; i < entity_types.length; i++) {

        var entity_type = entity_types[i];
        var entity = dg_entity_get_info(entity_type);
        var route = '/' + entity_type + '/:' + entity.entity_keys.id;

        // Add.
        $routeProvider.when('/' + entity_type + '/add', {
          templateUrl: 'themes/spi/page.tpl.html',
          controller: 'dg_page_controller',
          page_callback: 'dg_entity_page_add',
          page_arguments: [0]
        });
        $routeProvider.when('/' + entity_type + '/add/:bundle', {
          templateUrl: 'themes/spi/page.tpl.html',
          controller: 'dg_page_controller',
          page_callback: 'dg_entity_page_edit',
          page_arguments: [0, 2]
        });

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
          //console.log(drupalgap.field_info_instances);
          //console.log(instances);
            
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
        var is_new = entity_id == 'add' ? true : false;
        $scope.entity_type = entity_type;
        $scope.bundle = is_new ? arg(2) : null;

        // Existing entity.
        if (!is_new) {
          $scope.entity_id = entity_id;
          $scope.loading++;
          $scope.entity_load = {
            entity: drupal[entity_type + '_load'](entity_id)
          };
          return;
        }

      },
      //replace: true,
      link: function(scope, element, attrs) {

        // New entity.
        if (!scope.entity_load) {
          dg_entity_form_builder($compile, scope, element, null);
          return;
        }

        // Existing entity.
        scope.entity_load.entity.then(function (entity) {
          //console.log(scope);
          //console.log(entity);
          scope.loading--;
          var entity_info = dg_entity_get_info(scope.entity_type);
          scope.bundle = entity[entity_info.entity_keys.bundle];
          dg_entity_form_builder($compile, scope, element, entity);
        });

      }
    };
  })
  .directive('entityList', function($compile, drupal) {
    return {
      controller: function($scope) {
        var entity_type = arg(1);
        $scope.entity_type = entity_type;
        $scope.loading++;
        $scope.entity_index = {
          entities: drupal[entity_type + '_index']()
        };
      },
      link: function(scope, element, attrs) {
        scope.entity_index.entities.then(function (entities) {
          scope.loading--;

          var entity_type = attrs['entityType'];

          // If someone is providing an index page for this entity type use it.
          var fn = window[entity_type + '_index_page'];
          if (dg_function_exists(fn)) {
            var linkFn = $compile(dg_render(fn(entities)));
            var content = linkFn(scope);
            element.append(content);
            return;
          }

          // Nobody is providing a listing page for this entity type, let's
          // spit out a generic table listing for the entity type's index....

          var entity_info = dg_entity_get_info(entity_type);

          var rows = [];
          for (var index in entities) {
            if (!entities.hasOwnProperty(index)) { continue; }
            var entity = entities[index];

            rows.push([
              l(t(entity[entity_info.entity_keys.label]), entity_type + '/' + entity[entity_info.entity_keys.id]),
              theme('item_list', {
                items: [
                  l(t('edit'), entity_type + '/' + entity[entity_info.entity_keys.id] + '/edit'),
                  l(t('delete'), null)
                ]
              })
            ]);

          }

          var content = {};
          var label = typeof entity_info.plural_label !== 'undefined' ?
            entity_info.plural_label : entity_info.label;
          content['label'] = {
            markup: '<h2>' + t(label) + '</h2>'
          };
          content['entities'] = {
            theme: 'table',
            header: [
              { data: t(entity_info.label) },
              { data: t('Operations') }
            ],
            rows: rows,
            attributes: {
              'class': 'table' /* @TODO this is bootstrap specific */
            }
          };

          var linkFn = $compile(dg_render(content));
          var content = linkFn(scope);
          element.append(content);




        });


      }
    };
  });

/**
 *
 */
function dg_entity_form_builder($compile, scope, element, entity) {
  try {
    //dpm('dg_entity_form_builder');
    //console.log(scope);

    // Extract the entity type and bundle, then place the entity onto the form state values.
    var entity_type = scope.entity_type;
    var bundle = scope.bundle;
    scope.form_state = { values: entity }; // @TODO don't drop it directly into the scope like this, use a form id key


    // Set up form defaults.
    var form = dg_form_defaults(entity_type + "_edit_form", scope);
    form.entity = entity;
    form.entity_type = entity_type;
    form.bundle = bundle;

    // Place entity keys as hidden elements on the form.
    // @TODO this is pretty static, can we be more dynamic here?
    var entity_info = dg_entity_get_info(entity_type);
    var entity_keys = entity_info.entity_keys;
    //dpm('entity_info');
    //console.log(entity_info);
    if (!dg_empty(entity_keys.bundle)) {
      form.elements[entity_keys.bundle] = {
        type: 'hidden',
        default_value: bundle
      };
    }
    var default_value = null;
    if (entity && entity[entity_keys.id]) { default_value = entity[entity_keys.id]; }
    form.elements[entity_keys.id] = {
      type: 'hidden',
      default_value: default_value
    };
    if (entity_keys.language) {
      var default_value = dg_language_default();
      if (entity && entity[entity_keys.language]) { default_value = entity[entity_keys.language]; }
      form.elements[entity_keys.language] = {
        type: 'hidden',
        default_value: default_value
      };
    }

    // Grab this entity's extra fields and add them as form elements.
    // @TODO users and vocabularies don't have bundles from Drupal!
    var extras = dg_field_info_extra_fields(entity_type, bundle, 'form');
    //dpm('extras');
    //console.log(extras);
    for (var name in extras) {
      if (!extras.hasOwnProperty(name)) { continue; }
      var extra = extras[name];
      var default_value = null;
      if (entity && entity[entity_keys.label]) { default_value = entity[entity_keys.label]; }
      form.elements[name] = {
        title: t(extra.label),
        type: 'textfield',
        default_value: default_value
      };
    }

    // Grab this entity's field info instances.
    var instances = dg_field_info_instances(
      entity_type,
      bundle
    );
    //dpm('instances');
    //console.log(instances);

    // Render each field instance...
    for (var field_name in instances) {
      if (!instances.hasOwnProperty(field_name)) { continue; }
      //dpm(field_name);

      var instance = instances[field_name];
      var info = dg_field_info_field(field_name);
      var module = instance.widget.module;
      var cardinality = info.cardinality;

      // Instantiate a form element for this field.
      var element_theme = cardinality == '1' ? null : 'field_multiple_value_form';
      form.elements[field_name] = {
        type: 'container',
        field_name: field_name,
        entity_type: entity_type,
        bundle: bundle,
        language: 'und', // @TODO hard coded language here
        und: [{  // @TODO hard coded language here
          theme: element_theme
        }]
      };

      // For each delta on the field...
      var delta = 0;
      while (delta !== null) {
        //dpm(delta);
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

    // Submit button.
    form.elements.submit = {
      type: 'submit',
      value: t('Save')
    };

    // Place the form into the scope.
    // @TODO placing the form directly into the scope without an id is going to be bad in the long run!
    scope.form = form;

    // @TODO great place for a hook

    //element.replaceWith($compile(dg_render(content))(scope));
    element.append(dg_ng_compile_form($compile, scope));
  }
  catch (error) {
    console.log('dg_entity_form_builder - ' + error);
  }
}

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
function dg_entity_page_add(entity_type) {
  try {
    var entity_info = dg_entity_get_info(entity_type);
    //console.log(entity_info);
    var content = {};
    var items = [];
    for (var bundle in entity_info.bundles) {
      if (!entity_info.bundles.hasOwnProperty(bundle)) { continue; }
      var bundle_object = entity_info.bundles[bundle];
      items.push(l(t(bundle_object.label), entity_type + '/add/' + bundle));
    }
    content['bundles'] = {
      theme: 'item_list',
      items: items,
      title: t('Create ' + entity_info.label)
    };
    return content;
  }
  catch (error) {
    console.log('dg_entity_page_add - ' + error);
  }
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
    // @NOTE - entity_type gets converted to entityType in Angular's eyes.
    return '<entity-list entity_type="' + entity_type + '"></entity-list>';
  }
  catch (error) { console.log('dg_entity_page_list - ' + error); }
}
