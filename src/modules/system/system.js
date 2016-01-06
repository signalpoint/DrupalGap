dg.modules.system = new dg.Module();

dg.modules.system.blocks = function() {
  var blocks = {};
  blocks.main = {
    build: function () {
      return new Promise(function(ok, err) {
        ok(dg.content);
      });
    }
  };
  return blocks;
};