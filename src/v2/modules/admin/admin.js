angular.module('dgAdmin', ['drupalgap'])

// hook_menu()
.config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/admin', {
          templateUrl: 'themes/spi/page.tpl.html',
          controller: 'dg_page_controller',
          page_callback: 'dg_admin_page'
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
    theme: 'item_list',
    items: [
      l(t('Connect'), 'admin/connect')
    ]
  };
  return content;
}

function dg_admin_connect_page() {
  $http = dg_ng_get('http');
  drupalSettings = dg_ng_get('drupalSettings');
  var path = drupalSettings.site_path + drupalSettings.base_path + '?q=drupalgap/connect';
  $http.get(path).then(function(result) {
      if (result.status != 200) { return; }
      console.log(result);
  });
}

