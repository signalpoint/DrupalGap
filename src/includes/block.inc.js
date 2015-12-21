// @see https://api.drupal.org/api/drupal/core!modules!block!src!Entity!Block.php/class/Block/8

// @see https://www.drupal.org/node/2101565

/**
 * The Form Element prototype.
 * @constructor
 */
dg.Block = function(config) {
  console.log('config');
  console.log(config);
  console.log(this);
  this.id = config.id;
  this.module = config.module;
  //this.region = null;
};

dg.Block.prototype.get = function(property) {
  return typeof this[property] !== 'undefined' ? this[property] : null;
};
dg.Block.prototype.set = function(property, value) {
  this[property] = value;
};
dg.Block.prototype.build = function() {
  // abstract
  return new Promise(function(ok, err) {
    ok('<p>block content</p>');
  });
};

dg.blocksLoad = function() {
  return new Promise(function(ok, err) {
    if (!dg.blocks) {

      dg.blocks = {};

      // First, figure out what blocks are defined in the settings.js file and
      // set them aside.
      var appBlocks = {};
      var blockSettings = drupalgap.settings.blocks[dg.config('theme').name];
      // Iterate over each region mentioned in the theme settings...
      for (var region in blockSettings) {
        if (!blockSettings.hasOwnProperty(region)) { continue; }
        // Iterate over each block mentioned in the theme's region settings...
        for (var themeBlock in blockSettings[region]) {
          if (!blockSettings[region].hasOwnProperty(themeBlock)) { continue; }
          var block = blockSettings[region][themeBlock];
          block.region = region;
          appBlocks[themeBlock] = block;
        }
      }

      console.log('loaded the blocks from settings.js');
      console.log(appBlocks);


      // Gather all the blocks defined by modules, and then instantiate only
      // the blocks defined by the app.

      // For each module that overwrites the "blocks" function on their prototype...
      var modules = jDrupal.modulesLoad();
      for (var module in modules) {

        // Skip modules without blocks.
        if (!modules.hasOwnProperty(module) || !window[module].blocks) { continue; }
        var blocks = window[module].blocks();
        if (!blocks) { continue; }

        // For each block provided by the module (skipping any blocks not
        // mentioned by the app)...
        for (block in blocks) {
          if (!blocks.hasOwnProperty(block) || !appBlocks[block]) { continue; }

          // Extract the block's config from the module and set any defaults.
          var config = blocks[block];
          if (!config.id) { config.id = block; }
          if (!config.module) { config.module = module; }

          // Create an instance of the block, warn if someone overwrites somebody
          // else's block.
          console.log('creating new block: ' + block);
          console.log(config);
          if (dg.blocks[block]) {
            var msg = 'WARNING - The "' + block + '" block provided by the "' + dg.blocks[block].get('module') + '" ' +
              'module has been overwritten by the "' + config.module + '" module.';
            console.log(msg);
          }
          dg.blocks[block] = new dg.Block(config);

          // Merge the block settings into the block.
          // @TODO turn this into dg.extend().
          for (var setting in appBlocks[block]) {
            if (!appBlocks[block].hasOwnProperty(setting)) { continue; }
            dg.blocks[block].set(setting, appBlocks[block][setting]);
          }
        }
      }

      console.log('blocks have been loaded');
      console.log(dg.blocks);

      ok(dg.blocks);

      return;

      jDrupal.moduleInvokeAll('block_info').then(function(modules) {
        // Grab the current theme's block settings.
        var blockSettings = drupalgap.settings.blocks[dg.config('theme').name];
        // Iterate over each module that has a block(s)...
        for (var i = 0; i < modules.length; i++) {
          // Iterate over the block(s)...
          for (block in modules[i]) {
            if (!modules[i].hasOwnProperty(block)) { continue; }
            var _block = modules[i][block];
            // Iterate over each region mentioned in the theme settings...
            for (var region in blockSettings) {
              if (!blockSettings.hasOwnProperty(region)) { continue; }
              // Iterate over each block mentioned in the theme's region settings...
              for (var themeBlock in blockSettings[region]) {
                if (!blockSettings[region].hasOwnProperty(themeBlock)) { continue; }
                if (themeBlock == _block.delta) {
                  // Merge the block settings into the block.
                  // @TODO turn this into dg.extend().
                  for (var setting in blockSettings[region][themeBlock]) {
                    if (!blockSettings[region][themeBlock].hasOwnProperty(setting)) { continue; }
                    _block[setting] = blockSettings[region][themeBlock][setting];
                  }
                  break;
                }
              }
            }
            dg.blocks.push(_block);
          }
        }
        ok(dg.blocks);
      });
    }
    else { ok(dg.blocks); }
  });
};

dg.blockLoad = function(module, delta) {
  return new Promise(function(ok, err) {
    var block = null;
    dg.blocksLoad().then(function(blocks) {
      for (var i = 0; i < blocks.length; i++) {
        if (blocks[i].module == module && blocks[i].delta == delta) {
          block = blocks[i];
          break;
        }
      }
    });
    ok(block);
  });
};