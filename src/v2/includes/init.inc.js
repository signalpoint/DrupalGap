dgApp.config(function(drupalgapSettings) {

  //dpm('config() - initializing...');
  //console.log(arguments);

  // @WARNING only certain providers like constants are available here, no scope
  // or values available here...
  
  drupalgap_onload(drupalgapSettings);

});

/**
 *
 */
function drupalgap_onload(drupalgapSettings) {
  try {
    dg_module_invoke_all('install');
    drupalgap_load_blocks(drupalgapSettings);
    drupalgap_load_menus(drupalgapSettings);
  }
  catch (error) { console.log('drupalgap_onload - ' + error); }
}

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
function drupalgap_load_menus(drupalgapSettings) {
  try {
    if (!drupalgapSettings.menus) { return; }
    var menus = drupalgapSettings.menus;
    for (var name in menus) {
      if (!menus.hasOwnProperty(name)) { continue; }
      var menu = menus[name];
      if (!menu.links) { menu.links = []; }
      if (!menu.attributes) { menu.attributes = {}; }
      dg_menu_set(name, menu);
    }
  }
  catch (error) { console.log('drupalgap_load_menus - ' + error); }
}
