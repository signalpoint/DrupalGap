// @see https://api.drupal.org/api/drupal/core!modules!block!src!Entity!Block.php/class/Block/8

// @see https://www.drupal.org/node/2101565

// @TODO change block properties to use an underscore prefix.

/**
 * The Block constructor.
 * @param {String} module The module name that implements the block.
 * @param {String} id The block id.
 * @param {Object} config The block config object from settings.js, merged with any defaults.
 * @constructor
 */
dg.Block = function(module, id, config) {
  for (var setting in config) {
    if (!config.hasOwnProperty(setting)) { continue; }
    this[setting] = config[setting];
  }
  if (!this._id) { this._id = id; }
  if (!this._module) { this._module = module; }
  if (!this._format) { this._format = 'div'; }
  dg.setRenderElementDefaults(this);
  if (!this._attributes.id) { this._attributes.id = dg.cleanCssIdentifier(id); }
};

/**
 *
 * @param name
 * @returns {null}
 */
dg.Block.prototype.get = function(name) {
  var propName = '_' + name;
  return typeof this[propName] !== 'undefined' ? this[propName] : null;
};

/**
 *
 * @param name
 * @param value
 */
dg.Block.prototype.set = function(name, value) {
  var propName = '_' + name;
  this[propName] = value;
};

/**
 *
 * @returns {*}
 */
dg.Block.prototype.buildWrapper = function() {
  var self = this;
  return new Promise(function(ok, err) {
    self.build().then(function(element) {
      dg.setRenderElementDefaults(element);
      // @TODO - elements that are just a string can't be altered, e.g. powered by block.
      jDrupal.moduleInvokeAll('block_view_alter', element, self).then(function() {
        self.set('content', element);
        ok(self);
      });
    });
  });
};

/**
 *
 * @returns {*}
 */
dg.Block.prototype.build = function() {
  // abstract
  return new Promise(function(ok, err) { ok(''); });
};

/**
 *
 * @returns {*}
 */
dg.Block.prototype.getVisibility = function() {
  var self = this;
  var account = dg.currentUser();
  return new Promise(function(ok, err) {
    var visible = true;
    var roles = self.get('roles');
    if (roles) {
      for (var i = 0; i < roles.length; i++) {
        if (account.hasRole(roles[i].target_id)) { visible = roles[i].visible; }
        else { visible = !roles[i].visible; }
        if (!visible) { break; }
      }
    }
    ok({
      visible: visible,
      block: self
    });
  });
};

/**
 *
 * @returns {null|Array}
 */
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
        var weight = 0;
        for (var themeBlock in blockSettings[region]) {
          if (!blockSettings[region].hasOwnProperty(themeBlock)) { continue; }
          var block = blockSettings[region][themeBlock];
          block.region = region;
          block.weight = typeof block.weight !== 'undefined' ? block.weight : weight;
          weight = block.weight + 1;
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

          // Extract the block's config from the module.
          var config = blocks[block];

          // Make sure this block isn't overwriting another block.
          // Create an instance of the block, warn if someone overwrites somebody
          // else's block.
          if (dg.blocks[block]) {
            var msg = 'WARNING - The "' + block + '" block provided by the "' + dg.blocks[block].get('module') + '" ' +
              'module has been overwritten by the "' + module + '" module.';
            console.log(msg);
          }

          // Create an instance of the block.
          dg.blocks[block] = new dg.Block(module, block, config);

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

/**
 *
 * @param id
 * @returns {null}
 */
dg.blockLoad = function(id) { return dg.blocks[id] ? dg.blocks[id] : null; };