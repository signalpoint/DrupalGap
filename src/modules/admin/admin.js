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
            dg.l(dg.t('Content'), 'node/add')
          ]
        };
        ok(content);
      });
    }
  };
  return blocks;
};
