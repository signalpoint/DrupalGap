// @see https://api.drupal.org/api/drupal/core!modules!block!src!Entity!Block.php/class/Block/8

// @see https://www.drupal.org/node/2101565

/**
 * The Block constructor.
 * @param {String} module The module name that implements the block.
 * @param {String} id The block id.
 * @param {Object} implementation Provided by the module that implements the block (includes the build function, ...)
 * @param {Object} config The block config object from settings.js, pre-merged with any defaults.
 * @constructor
 */
dg.Block = function(module, id, implementation, config) {

  // Merge the block module's implementation onto the block's instance. This merges both properties (e.g. _attributes)
  // and functions (e.g. build).
  for (var item in implementation) {
    if (!implementation.hasOwnProperty(item)) { continue; }
    this[item] = implementation[item];
  }

  // Merge the config (from settings.js) onto the instance as properties.
  for (var setting in config) {
    if (!config.hasOwnProperty(setting)) { continue; }
    this['_' + setting] = config[setting];
  }

  // Set remaining default values when needed.
  if (!this._id) { this._id = id; }
  if (!this._module) { this._module = module; }
  if (!this._format) { this._format = 'div'; }
  dg.setRenderElementDefaults(this);
  if (!this._attributes.id) { this._attributes.id = dg.cleanCssIdentifier(id); }

};

/**
 * Gets a block property value and returns it.
 * @param {String}
 * @returns {*}
 */
dg.Block.prototype.get = function(name) {
  var propName = '_' + name;
  return typeof this[propName] !== 'undefined' ? this[propName] : null;
};

/**
 * Sets a block property value
 * @param {Sting} name
 * @param {*} value
 */
dg.Block.prototype.set = function(name, value) {
  var propName = '_' + name;
  this[propName] = value;
};

/**
 * A wrapper function around to invoke the block's build function and hook_block_view_alter().
 * @returns {Promise}
 */
dg.Block.prototype.buildWrapper = function() {
  var self = this;
  return new Promise(function(ok, err) {
    self.build().then(function(element) {
      dg.setRenderElementDefaults(element);
      // @TODO - elements that are just a string (i.e. not a render elemtn) can't be altered.
      jDrupal.moduleInvokeAll('block_view_alter', element, self).then(function() {
        self.set('content', element);
        ok(self);
      });
    });
  });
};

/**
 * A stub function for a block's build.
 * @returns {*}
 */
dg.Block.prototype.build = function() {
  // abstract
  return new Promise(function(ok, err) { ok(''); });
};

/**
 *
 * @returns {Object}
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

      // Prep some helper variables and grab the block config from settings.js.
      dg.blocks = {};
      var appBlocks = {};
      var themeName = dg.config('theme').name;
      var blockSettings = dg.settings.blocks[themeName];
      var blockCount = 0;

      // First, figure out what blocks are defined in the settings.js file and set them aside. Warn the developer if
      // there are no blocks defined.

      // Iterate over each region mentioned in the theme settings...
      for (var region in blockSettings) {
        if (!blockSettings.hasOwnProperty(region)) { continue; }

        // Iterate over each block mentioned in the region settings...
        var weight = 0;
        for (var themeBlock in blockSettings[region]) {
          if (!blockSettings[region].hasOwnProperty(themeBlock)) { continue; }

          // Create a simple block JSON object from the block's config in the settings.js file. Force set the region,
          // and set a default weight if one isn't already set. Keep in mind that these simple block JSON objects will
          // be used to instantiate a Block shortly, so all properties can be set flat on the object (i.e. no underscore
          // prefix necessary), because they'll be turned into Block properties shortly, and we want the settings.js
          // block config to be simple. Along the way keep track of how many blocks we have, and always keep the next
          // weight ready for any blocks that don't have it pre configured.
          var block = blockSettings[region][themeBlock];
          block.region = region;
          block.weight = typeof block.weight !== 'undefined' ? block.weight : weight;
          weight = block.weight + 1;
          appBlocks[themeBlock] = block;
          blockCount++;

        }
      }
      if (blockCount == 0) { console.log(dg.t('No blocks found in settings.js for the theme: ' + themeName)); }

      //console.log('loaded the blocks from settings.js');
      //console.log(appBlocks);

      // Gather all the blocks defined by modules, and then instantiate only the blocks defined by the app's config.
      var modules = jDrupal.modulesLoad();
      for (var module in modules) {

        // Skip modules without blocks.
        if (!modules.hasOwnProperty(module) || !modules[module].blocks) { continue; }
        var blocks = modules[module].blocks();
        if (!blocks) { continue; }

        // For each block provided by the module (skipping any blocks not mentioned by the app)...
        for (block in blocks) {
          if (!blocks.hasOwnProperty(block) || !appBlocks[block]) { continue; }

          // Extract the block's implementation from the module.
          var implementation = blocks[block];

          // Make sure this block isn't overwriting another block.
          // Create an instance of the block, warn if someone overwrites somebody
          // else's block.
          if (dg.blocks[block]) {
            var msg = 'WARNING - The "' + block + '" block provided by the "' + dg.blocks[block].get('module') + '" ' +
              'module has been overwritten by the "' + module + '" module.';
            console.log(msg);
          }

          // Create an instance of the block.
          dg.blocks[block] = new dg.Block(module, block, implementation, appBlocks[block]);

        }
      }

      //console.log('blocks have been loaded');
      //console.log(dg.blocks);

      //ok(dg.blocks);
      //return dg.blocks;
    }
    //else {
      //ok(dg.blocks);
      return dg.blocks;
    //}
  //});
};

/**
 *
 * @param id
 * @returns {null}
 */
dg.blockLoad = function(id) { return dg.blocks[id] ? dg.blocks[id] : null; };
