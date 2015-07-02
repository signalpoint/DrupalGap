/**
 *
 */
function drupalgap_load_blocks(drupalgapSettings) {
  try {
    //dpm('drupalgap_load_blocks');
    //console.log(drupalgapSettings);
    
    // For each module type specified in drupalgapSettings (core, contrib,
    // custom)...
    var modules = drupalgapSettings.modules;
    for (var type in modules) {
      if (!modules.hasOwnProperty(type)) { continue; }
      
      // For each module within the type...
      var _modules = modules[type];
      for (var name in _modules) {
        if (!_modules.hasOwnProperty(name)) { continue; }
        
        var function_name = name + '_block_info';
        
        // Skip any modules that don't implement hook_block_info().
        if (!dg_function_exists(function_name)) { continue; }
        
        // Call the implementation of hook_block_info() for the current module,
        // then iterate over each of its blocks, placing them onto
        // drupalgap.blocks one by one.
        var module = _modules[name];
        var blocks = window[function_name]();
        //console.log(name);
        //console.log(blocks);
        for (var delta in blocks) {
          if (!blocks.hasOwnProperty(delta)) { continue; }
          var block = blocks[delta];
          if (!block.delta) { block.delta = delta; }
          if (!block.module) { block.module = name; }
          
          // Merge in any block settings.
          //angular.merge(block);
          
          // Add the block to drupalgap.blocks.
          drupalgap.blocks.push(block);
        }

      }

    }
    //dpm('BLOCKS!');
    //console.log(drupalgap.blocks);
  }
  catch (error) { console.log('drupalgap_load_blocks - ' + error); }
}

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

