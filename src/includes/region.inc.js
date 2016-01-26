// @TODO change region properties to use an underscore prefix.
// This will allow us to easily separate properties from blocks within settings.js

/**
 * The Region prototype.
 * @constructor
 */
dg.Region = function(id, config) {
  this._id = id;

  // Let the config from the theme's region overwrite anything it wants.
  for (var setting in config) {
    if (!config.hasOwnProperty(setting)) { continue; }
    this[setting] = config[setting];
  }

  // Set any missing defaults.
  if (!this._attributes) { this._attributes = {}; }
  if (!this._attributes.id) { this._attributes.id = id; }
  if (!this._format) { this._format = 'div'; }
  if (!this._prefix) { this._prefix = ''; }
  if (!this._suffix) { this._suffix = ''; }
};

/**
 *
 * @param prop
 * @returns {null}
 */
dg.Region.prototype.get = function(prop) {
  var propName = '_' + prop;
  return typeof this[propName] !== 'undefined' ? this[propName] : null;
};

/**
 *
 * @param property
 * @param value
 */
dg.Region.prototype.set = function(prop, value) {
  var propName = '_' + property;
  this[propName] = value;
};

/**
 *
 */
dg.loadRegions = function() {

};

/**
 *
 * @returns {Array}
 */
dg.Region.prototype.getBlocks = function() {
  var blocks = dg.blocksLoad();
  var sorted = {};
  for (var block in blocks) {
    if (!blocks.hasOwnProperty(block)) { continue; }
    if (blocks[block].get('region') == this.get('id')) {
      sorted[blocks[block].get('weight')] = block;
    }
  }
  var result = [];
  for (var sort in sorted) {
    if (!sorted.hasOwnProperty(sort)) { continue; }
    result.push(sorted[sort]);
  }
  return result;
};
