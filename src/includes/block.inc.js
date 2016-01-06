// @see https://api.drupal.org/api/drupal/core!modules!block!src!Entity!Block.php/class/Block/8

// @see https://www.drupal.org/node/2101565

// @TODO change block properties to use an underscore prefix.

/**
 * The BLock prototype.
 * @constructor
 */
dg.Block = function(config) {
  this.format = 'div';
  for (var setting in config) {
    if (!config.hasOwnProperty(setting)) { continue; }
    this[setting] = config[setting];
  }
};

dg.Block.prototype.get = function(property) {
  return typeof this[property] !== 'undefined' ? this[property] : null;
};
dg.Block.prototype.set = function(property, value) {
  this[property] = value;
};
dg.Block.prototype.buildWrapper = function() {
  var self = this;
  return new Promise(function(ok, err) {
    self.build().then(function(content) {
      self.set('content', content);
      ok(self);
    });
  });
};
dg.Block.prototype.build = function() {
  // abstract
  return new Promise(function(ok, err) { ok(''); });
};

dg.blocksLoad = function() {
  //return new Promise(function(ok, err) {
    if (!dg.blocks) {

      dg.blocks = {};

      // First, figure out what blocks are defined in the settings.js file and
      // set them aside. Warn the developer if there are no blocks defined.
      var appBlocks = {};
      var themeName = dg.config('theme').name;
      var blockSettings = drupalgap.settings.blocks[themeName];
      var blockCount = 0;
      // Iterate over each region mentioned in the theme settings...
      for (var region in blockSettings) {
        if (!blockSettings.hasOwnProperty(region)) { continue; }
        // Iterate over each block mentioned in the theme's region settings...
        for (var themeBlock in blockSettings[region]) {
          if (!blockSettings[region].hasOwnProperty(themeBlock)) { continue; }
          var block = blockSettings[region][themeBlock];
          block.region = region;
          appBlocks[themeBlock] = block;
          blockCount++;
        }
      }
      if (blockCount == 0) {
        var msg = 'WARNING: No blocks were found for the "' + themeName + '" theme in settings.js';
        console.log(msg);
      }

      //console.log('loaded the blocks from settings.js');
      //console.log(appBlocks);

      // Gather all the blocks defined by modules, and then instantiate only
      // the blocks defined by the app.

      // For each module that overwrites the "blocks" function on their prototype...
      var modules = jDrupal.modulesLoad();
      for (var module in modules) {

        // Skip modules without blocks.
        if (!modules.hasOwnProperty(module) || !modules[module].blocks) { continue; }
        var blocks = modules[module].blocks();
        if (!blocks) { continue; }

        // For each block provided by the module (skipping any blocks not
        // mentioned by the app)...
        for (block in blocks) {
          if (!blocks.hasOwnProperty(block) || !appBlocks[block]) { continue; }

          // Extract the block's config from the module and set any defaults.
          var config = blocks[block];
          if (!config.id) { config.id = block; }
          if (!config.module) { config.module = module; }
          if (!config.attributes) { config.attributes = {}; }
          if (!config.attributes.id) { config.attributes.id = block; }

          // Create an instance of the block, warn if someone overwrites somebody
          // else's block.
          if (dg.blocks[block]) {
            var msg = 'WARNING - The "' + block + '" block provided by the "' + dg.blocks[block].get('module') + '" ' +
              'module has been overwritten by the "' + config.module + '" module.';
            console.log(msg);
          }
          dg.blocks[block] = new dg.Block(config);

          // Merge the block config from settings.js into the block instance.
          // @TODO turn this into dg.extend().
          for (var setting in appBlocks[block]) {
            if (!appBlocks[block].hasOwnProperty(setting)) { continue; }
            dg.blocks[block].set(setting, appBlocks[block][setting]);
          }
        }
      }

      //console.log('blocks have been loaded');
      //console.log(dg.blocks);

      //ok(dg.blocks);
      return dg.blocks;
    }
    else {
      //ok(dg.blocks);
      return dg.blocks;
    }
  //});
};

dg.blockLoad = function(id) {
  return dg.blocks[id] ? dg.blocks[id] : null;
};