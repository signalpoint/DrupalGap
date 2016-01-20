dg.modules.admin = new dg.Module();

dg.modules.admin.blocks = function() {
  var blocks = {};
  blocks.admin_menu = {
    build: function () {
      return new Promise(function(ok, err) {
        var content = {};
        content['menu'] = {
          _theme: 'item_list',
          _items: [
            dg.l(dg.theme('image', { _path: 'favicon.ico' }), ''),
            dg.l('Content', 'node/add'),
            dg.l('My account', 'user/' + dg.currentUser().id()),
            dg.l('Logout', 'user/logout')
          ]
        };
        ok(content);
      });
    }
  };
  return blocks;
};