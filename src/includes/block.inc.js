// @see https://api.drupal.org/api/drupal/core!modules!block!src!Entity!Block.php/class/Block/8

// @see https://www.drupal.org/node/2101565

/**
 * The Block constructor.
 * @param {String} module The module name that implements the block.
 * @param {String} id The block id.
 * @param {Object} implementation Provided by the module that implements the block (includes the build function, ...)
 * @param {Object} config The block config object from settings.js.
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
    this[setting] = config[setting];
  }

  // Set remaining default values when needed.
  if (!this._id) { this._id = id; }
  if (!this._module) { this._module = module; }
  if (!this._format) { this._format = 'div'; }
  if (!this._prefix) { this._prefix = ''; }
  if (!this._suffix) { this._suffix = ''; }
  if (!this._routes) { this._routes = []; }
  //if (!this._roles) { this._roles = []; } // @TODO see if this works after we get routes working.
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

  // @TODO WARNING - it appears drupal 8.0.3 stopped returning user roles to us upon user load... confirm, take action, etc.

  var self = this;
  var account = dg.currentUser();
  return new Promise(function(ok, err) {

    // We assume the block is visible, unless proven otherwise.
    var visible = true;

    var done = function() {
      ok({
        visible: visible,
        block: self
      });
    };

    // Check access visibility rules, if any.
    var access = self.get('access');
    if (access) {
      visible = access.call();
      done();
      return;
    }
    
    // Check roles visibility rules, if any.
    var roles = self.get('roles');
    if (roles) {
      visible = false; // Since we have a roles rule, instantly set it to false to make the dev prove the visibility.
      for (var i = 0; i < roles.length; i++) {
        if (account.hasRole(roles[i].target_id)) { visible = roles[i].visible; }
        else { visible = !roles[i].visible; }
        if (visible) { break; }
      }
    }

    // Check routes visibility rules, if any.
    var routes = self.get('routes');
    if (routes.length) {
      visible = false; // Since we have a route rule, instantly set it to false to make the dev prove the visibility.
      var route = dg.getRoute();
      for (var i = 0; i < routes.length; i++) {
        if (route.key == routes[i].key) {
          // If there's a role check for it, otherwise just defer to the visible value.
          if (routes[i].target_id) {
            if (account.hasRole(routes[i].target_id)) {
              visible = routes[i].visible;
              if (visible) { break; }
            }
          }
          else {
            visible = routes[i].visible;
            if (visible) { break; }
          }
        }
      }
    }
    done();

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
          // be used to instantiate a Block shortly. Along the way keep track of how many blocks we have, and always
          // keep the next weight ready for any blocks that don't have it pre configured.
          var block = blockSettings[region][themeBlock];
          block._region = region;
          block._weight = typeof block._weight !== 'undefined' ? block._weight : weight;
          weight = block._weight + 1;
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
