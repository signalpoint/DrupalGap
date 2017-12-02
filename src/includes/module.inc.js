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

/**
 * Given a module name and the name of a function within that module, this will call that function and return its
 * result.
 * @param moduleName
 * @param functionName
 */
dg.invoke = function(moduleName, functionName) {
  var module = jDrupal.moduleLoad(moduleName);
  return module && module[functionName] ? module[functionName]() : null;
};
