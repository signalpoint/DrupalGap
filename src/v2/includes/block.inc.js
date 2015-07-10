/**
 *
 */
function drupalgap_block_load(delta) {
  try {
    for (var index in drupalgap.blocks) {
      if (!drupalgap.blocks.hasOwnProperty(index)) { continue; }
      var block = drupalgap.blocks[index];
      if (block.delta == delta) { return block; }
    }
    return null;
  }
  catch (error) { console.log('drupalgap_block_load - ' + error); }
}

/**
 *
 */
function drupalgap_render_block(delta, block) {
  try {
    angular.merge(block, drupalgap_block_load(delta));
    //console.log('loaded block');
    //console.log(block);
    var function_name = block.module + '_block_view';
    if (!dg_function_exists(function_name)) {
      console.log('WARNING: ' + function_name + '() does not exist, so we are skipping this block: ' + delta);
      return '';
    }
    return dg_render(window[function_name](block.delta));
  }
  catch (error) { console.log('drupalgap_render_block - ' + error); }
}

