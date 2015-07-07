angular.module('dgAdmin', ['drupalgap'])

// hook_menu()
.config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/admin', {
          templateUrl: 'themes/spi/page.tpl.html',
          controller: 'dg_page_controller',
          page_callback: 'dg_admin_page',
        access_arguments: ['administer drupalgap']
      });
      $routeProvider.when('/admin/connect', {
          templateUrl: 'themes/spi/page.tpl.html',
          controller: 'dg_page_controller',
          page_callback: 'dg_admin_connect_page'
      });
}]);

function dg_admin_page() {
  var content = {};
  content['links'] = {
    title: t('DrupalGap'),
    theme: 'item_list',
    items: [ // @TODO these links should be render arrays and theme_item_list should allow for render array items!
      l(t('Connect'), 'admin/connect')
    ]
  };
  var entity_info = dg_entity_get_info();
  for (var entity_type in entity_info) {
    if (!entity_info.hasOwnProperty(entity_type)) { continue; }
    var entity = entity_info[entity_type];
    content[entity_type] = {
      theme: 'fieldset',
      title: entity.plural_label,
      children: [
        {
          theme: 'item_list',
          items: [
            l(t('List'), 'admin/' + entity_type), // @TODO should be a render array
            l(t('Add'), entity_type + '/add'), // @TODO should be a render array
          ]
        }

      ]
    }
  }
  return content;
}

function dg_admin_connect_page() {
  var content = {};
  content['connect'] = {
    theme: 'textarea',
    attributes: {
      'ng-model': 'dg_connect'
    }
  };
  $http = dg_ng_get('http');
  drupalSettings = dg_ng_get('drupalSettings');
  var path = drupalSettings.site_path + drupalSettings.base_path + '?q=drupalgap/connect';
  $http.get(path).then(function(result) {
    if (result.status != 200) { return; }
    console.log(result.data);
    dg_ng_get('scope').dg_connect = JSON.stringify(result.data);
  });
  return content;
}
