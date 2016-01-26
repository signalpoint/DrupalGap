dg.modules.admin = new dg.Module();

dg.modules.admin.blocks = function() {
  var blocks = {};
  blocks.admin_menu = {
    build: function () {
      return new Promise(function(ok, err) {
        //dg.theme('image', { _path: 'favicon.ico' }
        var content = {};
        content['menu'] = {
          _theme: 'item_list',
          _title: 'Administer',
          _items: [
            dg.l(dg.t('Home'), ''),
            dg.l(dg.t('Content'), 'node/add'),
            dg.l(dg.t('My account'), 'user/' + dg.currentUser().id()),
            dg.l(dg.t('Logout'), 'user/logout')
          ]
        };
        ok(content);
      });
    }
  };
  return blocks;
};
