/**
 * Given a block delta, this will return the corresponding
 * block from drupalgap.blocks.
 * @param {String} delta
 * @return {Object}
 */
function drupalgap_block_load(delta) {
  try {
    var block = null;
    if (drupalgap.blocks) {
      $.each(drupalgap.blocks, function(index, object) {
          if (object[delta]) {
            block = object[delta];
            return false;
          }
      });
    }
    if (block == null) {
      var msg = 'drupalgap_block_load - failed to load "' + delta + '" block!';
      drupalgap_alert(msg);
    }
    return block;
  }
  catch (error) { console.log('drupalgap_block_load - ' + error); }
}

