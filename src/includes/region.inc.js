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

dg.Region.prototype.get = function(property) {
  return typeof this[property] !== 'undefined' ? this[property] : null;
};
dg.Region.prototype.set = function(property, value) {
  this[property] = value;
};

dg.loadRegions = function() {

};

dg.Region.prototype.getBlocks = function() {
  var blocks = dg.blocksLoad();
  var result = [];
  for (var block in blocks) {
    if (!blocks.hasOwnProperty(block)) { continue; }
    if (blocks[block].get('region') == this.get('id')) {
      result.push(block);
    }
  }
  return result;
};
