/**
 * Determines which modules are implementing a hook. Returns an array with the
 * names of the modules which are implementing this hook. If no modules
 * implement the hook, it returns false.
 */
function module_implements(hook) {
  try {
    if (drupalgap.settings.debug) {
      console.log('module_implements(' + hook + ')');
    }
    var modules_that_implement = [];
    //var sort = false;
    //var reset = false;
    //if (arguments[1] != false) { sort = arguments[1]; }
    //if (arguments[2] != false) { reset = arguments[2]; }
    if (hook) {
      $.each(drupalgap.modules, function(bundle, modules){
          $.each(modules, function(index, module){
              var function_name = module.name + '_' + hook;
              if (eval('typeof ' + function_name) == 'function') {
                modules_that_implement.push(module.name);
              }
          });
      });
    }
    if (modules_that_implement.length == 0) {
      return false;
    }
    return modules_that_implement;
  }
  catch (error) {
    alert('module_implements - ' + error);
  }
}


/**
 * Given a module name and a hook name, this will invoke that module's hook.
 */
function module_invoke(module_name, hook) {
  try {
    if (drupalgap.settings.debug) {
      console.log('module_invoke(' + module_name + ', ' + hook + ')');
      console.log(JSON.stringify(arguments));
    }
    var module_invocation_results = null;
    var module = drupalgap_module_load(module_name);
    if (module) {
      var module_arguments = Array.prototype.slice.call(arguments);
      var function_name = module.name + '_' + hook;
      if (eval('typeof ' + function_name) == 'function') {
        // Get the hook function.
        var fn = window[function_name];
        // Remove the module name and hook from the arguments.
        module_arguments.splice(0,2);
        // If there are no arguments, just call the hook directly, otherwise
        // call the hook and pass along all the arguments.
        if ($.isEmptyObject(module_arguments) ) { module_invocation_results = fn(); }
        else { module_invocation_results = fn.apply(null, module_arguments); }
        
      }
    }
    if (drupalgap.settings.debug) {
      console.log('module_invoke(' + module_name + ', ' + hook + ') - results');
      console.log(JSON.stringify(module_invocation_results));
    }
    return module_invocation_results;
  }
  catch (error) {
    alert('module_invoke - ' + error);
  }
}

var module_invoke_results = null;
var module_invoke_continue = null;
/**
 * Given a hook name, this will invoke all modules that implement the hook.
 */
function module_invoke_all(hook) {
  try {
    if (drupalgap.settings.debug) {
      console.log('module_invoke_all(' +  hook + ')');
      console.log(JSON.stringify(arguments));
    }
    // Prepare the invocation results.
    module_invoke_results = new Array();
    // Copy the arguments and remove the hook name from the first index so the
    // rest can be passed along to the hook.
    var module_arguments = Array.prototype.slice.call(arguments);
    module_arguments.splice(0,1);
    if (drupalgap.settings.debug) {
      console.log(JSON.stringify(module_arguments));
    }
    // Remove the hook name from the argumets
    // Try to fire the hook in every module.
    module_invoke_continue = true;
    $.each(drupalgap.modules, function(bundle, modules){
        $.each(modules, function(index, module){
            var function_name = module.name + '_' + hook;
            if (eval('typeof ' + function_name) == 'function') {
              // If there are no arguments, just call the hook directly, otherwise
              // call the hook and pass along all the arguments.
              var invocation_results = null;
              if ($.isEmptyObject(module_arguments) ) {
                invocation_results = module_invoke(module.name, hook);
              }
              else {
                // Place the module name and hook name on the front of the arguments.
                module_arguments.unshift(module.name, hook);
                var fn = window['module_invoke'];
                invocation_results = fn.apply(null, module_arguments);
                module_arguments.splice(0,2);
              }
              if (typeof invocation_results !== 'undefined') {
                module_invoke_results.push(invocation_results);
              }
            }
        });
    });
    if (drupalgap.settings.debug) {
      console.log(JSON.stringify(module_invoke_results));
    }
    return module_invoke_results;
  }
  catch (error) {
    alert('module_invoke_all - ' + error);
  }
}

