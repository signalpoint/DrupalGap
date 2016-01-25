// @TODO change region properties to use an underscore prefix.
// This will allow us to easily separate properties from blocks within settings.js

/**
 * The Form Element prototype.
 * @constructor
 */
dg.Region = function(config) {
  this.format = 'div';
  for (var setting in config) {
    if (!config.hasOwnProperty(setting)) { continue; }
    this[setting] = config[setting];
  }
};

/**
 *
 * @param property
 * @returns {null}
 */
dg.Region.prototype.get = function(property) {
  return typeof this[property] !== 'undefined' ? this[property] : null;
};

/**
 *
 * @param property
 * @param value
 */
dg.Region.prototype.set = function(property, value) {
  this[property] = value;
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
