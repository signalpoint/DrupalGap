dgApp.config(function(drupalgapSettings) {

  //dpm('config() - initializing...');
  //console.log(arguments);

  // @WARNING only certain providers like constants are available here, no scope
  // or value available here...

  //console.log($provide.value('drupalgapSettings').$get());
  
  drupalgap_onload(drupalgapSettings);

  // @TODO this should be included via index.html as a script, if possible
  // @WARNING Synchronous XMLHttpRequest on the main thread is deprecated because of its
  // detrimental effects to the end user's experience.
  drupalgap_service_resource_extract_results({
      service: 'system',
      resource: 'connect',
      data: drupalgap_json_load()
  });

});

/**
 *
 */
function drupalgap_onload(drupalgapSettings) {
  try {
    drupalgap_load_blocks(drupalgapSettings);
    drupalgap_load_menus(drupalgapSettings);
  }
  catch (error) { console.log('drupalgap_onload - ' + error); }
}

dgApp.config(function() {
    
    return;
  
  dpm('config() - building entity views...');
  
  // For each entity type...
  for (var entity_type in drupalgap.field_info_instances) {
    if (!drupalgap.field_info_instances.hasOwnProperty(entity_type)) { continue; }
    var entity_bundles = drupalgap.field_info_instances[entity_type];
    
    // Initialize a place for this entity type's view(s) templates.
    drupalgap.views.templates[entity_type] = {};
    
    // For each bundle on the entity type...
    for (var bundle in entity_bundles) {
      if (!entity_bundles.hasOwnProperty(bundle)) { continue; }
      
      // Grab the field instances for this entity type and bundle.
      var instances = entity_bundles[bundle];
      //console.log(instances);

      // If there are no fields on the bundle, skip it.
      if (typeof instances !== 'object') {
        dpm('skipping ' + entity_type + '/' + bundle + ', no fields on it...');
        continue;
      }
      
      // Make a view template for each entity mode.
      drupalgap.views.templates[entity_type][bundle] = { };
      var modes = ['view', 'edit'];
      for (var i = 0; i < modes.length; i++) {
        var mode = modes[i];
        var template = '';
        switch (mode) {
        case 'view':
          template = '{{' + entity_type + '.' + entity_primary_key_title(entity_type) + '}}';
          break;
        case 'edit':
          template = '{{' + entity_type + '.' + entity_primary_key_title(entity_type) + '}}';
          break;
        }
        drupalgap.views.templates[entity_type][bundle][mode] = {
          template: '<div ng-model="' + entity_type + '">' + template + '</div>'
        };
      }

      var field_weights = {};
      var field_displays = {};
      
      // For each field on the instance...
      for (var field_name in instances) {
        if (!instances.hasOwnProperty(field_name)) { continue; }
        var field = instances[field_name];
        //console.log(field);
        
        // Determine which display mode to use. The default mode will be used
        // if the drupalgap display mode is not present.
        var display = drupalgap_field_display(field);
        
        // Skip hidden fields.
        if (display.type == 'hidden') { continue; }
        
        // Save the field display and weight.
        field_displays[field_name] = display;
        field_weights[field_name] = display.weight;
        
      }
      
      //dpm('field_weights');
      //console.log(field_weights);
      //dpm('field_displays');
      //console.log(field_displays);
      
      // Extract the field weights and sort them.
      var extracted_weights = [];
      for (var field_name in field_weights) {
          if (!field_weights.hasOwnProperty(field_name)) { continue; }
          var weight = field_weights[field_name];
          extracted_weights.push(weight);
      }
      extracted_weights.sort(function(a, b) { return a - b; });

      // For each sorted weight, locate the field with the corresponding weight,
      // then render it's field content.
      var completed_fields = [];
      for (var weight_index in extracted_weights) {
          if (!extracted_weights.hasOwnProperty(weight_index)) { continue; }
          var target_weight = extracted_weights[weight_index];
          for (var field_name in field_weights) {
              if (!field_weights.hasOwnProperty(field_name)) { continue; }
              var weight = field_weights[field_name];
              if (target_weight == weight) {
                if (completed_fields.indexOf(field_name) == -1) {
                  completed_fields.push(field_name);
                  
                  var modes = ['view', 'edit'];
                  for (var i = 0; i < modes.length; i++) {
                    var mode = modes[i];
                    var hook_name = mode == 'view' ?
                      'hook_field_formatter_view' : 'hook_field_widget_form'
                    var attrs = drupalgap_attributes({
                      'ng-controller': hook_name,
                      field_name: field_name
                    });
                    drupalgap.views.templates[entity_type][bundle][mode].template +=
                      '<div ' + attrs + '>{{' + field_name + '}}</div>';
                  }
                  
                  /*entity.content += drupalgap_entity_render_field(
                    entity_type,
                    entity,
                    field_name,
                    field_info[field_name],
                    field_displays[field_name]
                  );*/
                  break;
                }
              }
          }
      }
      
      //console.log('views templates');
      //console.log(drupalgap.views.templates);

    }

  }
  
});

// CONFIGURE HOOK_MENU() ITEMS AS ANGULAR ROUTES
dgApp.config(['$routeProvider',
  function($routeProvider) {
    
    return;

    dpm('config() - building route provider...');
    //console.log(arguments);

    // Attach hook_menu() paths to Angular's routeProvider.
    for (var path in drupalgap.menu_links) {
      if (!drupalgap.menu_links.hasOwnProperty(path)) { continue; }

      // Extract the menu link.
      var menu_link = drupalgap.menu_links[path];

      // Skip 'MENU_DEFAULT_LOCAL_TASK' items.
      if (menu_link.type == 'MENU_DEFAULT_LOCAL_TASK') {
        console.log('WARNING: dgApp - deprecated | MENU_DEFAULT_LOCAL_TASK on path: ' + path);
        continue;
      }

      // Use the active theme's page template as the templateUrl, if one wasn't
      // provided.
      // @TODO hard coded theme? bad bad bad
      if (!menu_link.templateUrl) {
        menu_link.templateUrl = 'themes/spi/page.tpl.html';
      }

      // Determine the menu link's controller, by first falling back to the
      // page_callback property which we'll warn the developer about, otherwise
      // we'll use menu_link object for the routeProvider.
      if (!menu_link.controller && menu_link.page_callback) {
        menu_link.controller = 'drupalgap_goto_controller';
      }
      else if (!menu_link.controller) {
        console.log('WARNING: dgApp - routeProvider | no controller provided for path: ' + path);
      }

      // Add the menu link to Angular's routeProvider.
      // @TODO apparently attaching all the controllers at once, instead of on
      // demand is expensive, seek alternative routes in utilizing controllers.
      //console.log(menu_link);
      // @TODO by attaching the complete hook_menu item link here, DG stuff ends
      // up in the same object as an Angular route, and we may or may not be
      // colliding with how Angular does things.
      $routeProvider.when('/' + path, menu_link);

    }

    // Set the otherwise ruling to load the front page.
    $routeProvider.otherwise({
        redirectTo: '/' + drupalgap.settings.front
    });

  }]);

