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
 */
function drupalgap_block_load(delta) {
  try {
    if (drupalgap.settings.debug) {
      console.log('drupalgap_block_load(' + delta + ')');
    }
    var block = null;
    if (drupalgap.blocks) {
      $.each(drupalgap.blocks, function(index, object){
          if (object[delta]) {
            block = object[delta];
            return false;
          }
      });
    }
    if (block == null) {
      alert('drupalgap_block_load - block load failed: ' + delta);
    }
    if (drupalgap.settings.debug && drupalgap.settings.debug_level == 2) {
      console.log(JSON.stringify(block));
    }
    return block;
  }
  catch (error) {
    alert('drupalgap_block_load - ' + error);
  }
}

