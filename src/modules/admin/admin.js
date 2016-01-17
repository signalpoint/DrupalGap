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
            dg.l('Create content', 'node/add')
          ]
        };
        ok(content);
      });
    }
  };
  return blocks;
};