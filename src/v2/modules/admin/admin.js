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
    $routeProvider.when('/admin/content', {
      templateUrl: 'themes/spi/page.tpl.html',
      controller: 'dg_page_controller',
      page_callback: 'dg_admin_content_page'
    });
}])
  .directive('dgAdminContentPage', function($compile) {
    return {
      controller: function($scope, drupal) {
        $scope.dg_admin = {
          content: drupal.node_index()
        };
      },
      link: function(scope, element, attrs) {
        scope.dg_admin.content.then(function(nodes) {
          var html = '';
          var items = [];
          for (var i in nodes) {
            var node = nodes[i];
            items.push(l(t(node.title), 'node/' + node.nid));
          }
          if (!dg_empty(items)) {
            html += theme('item_list', { items: items });
          }
          var linkFn = $compile(html);
          var content = linkFn(scope);
          element.append(content);
        });
      }
    };
  });

function dg_admin_page() {
  var content = {};
  content['links'] = {
    theme: 'item_list',
    items: [
      l(t('Connect'), 'admin/connect'),
      l(t('Content'), 'admin/content')
    ]
  };
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
    dg_ng_get('scope').dg_connect = JSON.stringify(result.data);
  });
  return content;
}

function dg_admin_content_page() {
  try {
    var content = {};
    content['nodes'] = {
      markup: '<dg-admin-content-page></dg-admin-content-page>'
    };
    return content;
  }
  catch (error) {
    console.log('dg_admin_content_page - ' + error);
  }
}



