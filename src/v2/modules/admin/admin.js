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
          var rows = [];
          for (var i in nodes) {
            var node = nodes[i];
            rows.push([
              l(t(node.title), 'node/' + node.nid),
              node.type,
              l(node.uid, 'user/' + node.uid),
              node.status,
              node.changed,
              theme('item_list', {
                items: [
                  l(t('edit'), 'node/' + node.nid + '/edit'),
                  l(t('delete'), null)
                ]
              })
            ]);
          }
          html += theme('table', {
            header: [
              { data: t('Title') },
              { data: t('Type') },
              { data: t('Author') },
              { data: t('Status') },
              { data: t('Updated') },
              { data: t('Operations') },
            ],
            rows: rows,
            attributes: {
              'class': 'table' /* @TODO this is bootstrap specific */
            }
          });
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
    items: [ // @TODO these links should be render arrays and theme_item_list should allow for render array items!
      l(t('Connect'), 'admin/connect'),
      l(t('Content'), 'admin/content')
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
            l('List', 'admin/' + entity_type) // @TODO should be a render array.
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
