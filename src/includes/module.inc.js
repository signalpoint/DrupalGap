dg.Module = function() {

};

// Extend the jDrupal Module prototype.
dg.Module.prototype = new jDrupal.Module;
dg.Module.prototype.constructor = dg.Module;

/**
 *
 * @returns {null}
 */
dg.Module.prototype.routing = function() {
  return null;
};