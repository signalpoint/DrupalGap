// @TODO modules should be encapsulated within the dg object instead of floating around...?
var dgSystem = new dg.Module();

dgSystem.blocks = function() {
  var blocks = {};
  blocks.main = { };
  console.log('got those blocks');
  return blocks;
};

function dgSystem_block_view(delta) {
  return new Promise(function(ok, err) {
    var content = '';
    if (delta == 'main') {
      content = 'Buckle up fuckaroo!';
    }
    ok(content);
  });
}

//dgSystemBlockMain = function() {
//
//};
//
//// Extend the entity prototype.
//dgSystemBlockMain.prototype = new dg.Block;
//dgSystemBlockMain.prototype.constructor = dgSystemBlockMain;