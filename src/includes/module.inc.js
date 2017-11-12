dg.modules = jDrupal.modules;

dg.Module = function() { };

// Extend the jDrupal Module prototype.
dg.Module.prototype = new jDrupal.Module;
dg.Module.prototype.constructor = dg.Module;


dg.Module.prototype.routing = function() {
  return null;
};

/**
 * Given a module name, this will create the corresponding DG8 module, attach it to the DOM and to the dg object, then
 * it returns the dg.Module object.
 * @param moduleName {String}
 * @returns {dg.Module}
 */
dg.createModule = function(moduleName) {
  var moduleExists = !!window[moduleName];
  if (moduleExists) { return window[moduleName]; } // Don't let anyone overwrite a module.
  var module = new dg.Module(); // Create the module.
  window[moduleName] = module; // Attach it to the DOM.
  dg.modules[moduleName] = module; // Attach a copy to DrupalGap.
  return module;
};
