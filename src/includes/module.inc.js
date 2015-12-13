drupalgap.Module = function() {

};

// Extend the jDrupal Module prototype.
drupalgap.Module.prototype = new jDrupal.Module;
drupalgap.Module.prototype.constructor = drupalgap.Node;

/**
 *
 * @returns {null}
 */
drupalgap.Module.prototype.routing = function() {
  return null;
};