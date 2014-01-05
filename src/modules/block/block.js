/**
 * Load a block from a given module and block delta value.
 */
/*function block_load(module, delta) {
  try {
    if (drupalgap.settings.debug) {
      console.log('block_load()');
      console.log(JSON.stringify(arguments));
    }
  }
  catch (error) {
    alert('block_load - ' + error);
  }
}*/

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
      if (delta == 'header') {
        msg +=
          ' - Did you rename your "header" block to "title" in settings.js?';
      }
      alert(msg);
    }
    if (drupalgap.settings.debug && drupalgap.settings.debug_level == 2) {
      console.log(JSON.stringify(block));
    }
    return block;
  }
  catch (error) { console.log('drupalgap_block_load - ' + error); }
}

