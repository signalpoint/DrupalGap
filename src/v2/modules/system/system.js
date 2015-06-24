angular.module('dgSystem', ['drupalgap']).config(function() {
    dpm('dgSystem - config');
});

dgApp.directive("dgMain", function($compile, $injector) {
    dpm('dgMain');
    return {
      link: function(scope, element) {
        
        dpm('dgMain - link...');
        
        // Compile the template for Angular and append it to the directive's
        // html element.
        var linkFn = $compile('<p>FUNK BUTTER!</p>'
          /*drupalgap_render(
            menu_execute_active_handler($compile, $injector)
          )*/
        );
        var content = linkFn(scope);
        element.append(content);

      }
    };
});

/**
 * Implements hook_block_info().
 * @return {Object}
 */
function system_block_info() {
    var blocks = {
      main: { },
      messages: { },
      logo: { },
      logout: { },
      title: { },
      powered_by: { },
      help: { }
    };
    // Make additional blocks for each system menu.
    /*var system_menus = menu_list_system_menus();
    for (var menu_name in system_menus) {
        if (!system_menus.hasOwnProperty(menu_name)) { continue; }
        var menu = system_menus[menu_name];
        var block_delta = menu.menu_name;
        blocks[block_delta] = {
          name: block_delta,
          delta: block_delta,
          module: 'menu'
        };
    }*/
    return blocks;
}

/**
 * Implements hook_block_view().
 * @param {String} delta
 * @return {String}
 */
function system_block_view(delta) {
  try {
    switch (delta) {
      case 'main':
        // This is the main content block, it is required to be in a theme's
        // region for the content of a page to show up (nodes, users, taxonomy,
        // comments, etc). Here we use it as an Angular directive, dgMain.
        return '<div dg-main></div>';
        break;
      default:
        return '';
        break;
    }
  }
  catch (error) { console.log('system_block_info - ' + error); }
}
