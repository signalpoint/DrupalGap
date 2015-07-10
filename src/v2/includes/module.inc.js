/**
 * @see https://api.drupal.org/api/drupal/includes!module.inc/function/module_implements/7
 */
function dg_module_implements(hook) {
  var modules = [];
  for (var module_name in drupalgap.modules) {
    if (!drupalgap.modules.hasOwnProperty(module_name)) { continue; }
    var module = drupalgap.modules[module_name];
    if (dg_function_exists(module_name + '_' + hook)) { modules.push(module_name); }
  }
  return modules;
}

/**
 * @see https://api.drupal.org/api/drupal/includes!module.inc/function/module_invoke/7
 */
function dg_module_invoke(module, hook) {
  try {
    //dpm('dg_module_invoke');
    //dpm(arguments);
    var module_invocation_results = null;
    var module_arguments = Array.prototype.slice.call(arguments);
    var function_name = module + '_' + hook;
    if (dg_function_exists(function_name)) {
      var fn = window[function_name];
      module_arguments.splice(0, 2);
      if (module_arguments.length == 0) { module_invocation_results = fn(); }
      else { module_invocation_results = fn.apply(null, module_arguments); }
    }
    return module_invocation_results;
  }
  catch (error) { console.log('dg_module_invoke - ' + error); }
}

/**
 * @see https://api.drupal.org/api/drupal/includes!module.inc/function/module_invoke_all/7
 */
function dg_module_invoke_all(hook) {
  try {
    //dpm('dg_module_invoke_all');
    //dpm(arguments);
    var hook_args = Array.prototype.slice.call(arguments);
    hook_args.splice(0, 1);
    var results = [];
    for (var module_name in drupalgap.modules) {
      if (!drupalgap.modules.hasOwnProperty(module_name)) { continue; }
      var module = drupalgap.modules[module_name];
      var function_name = module_name + '_' + hook;
      if (dg_function_exists(function_name)) {
        var fn = window[function_name];
        var invocation_results = null;
        if (hook_args.length) { invocation_results = fn.apply(null, hook_args); }
        else { invocation_results = fn(); }
        if (dg_is_array(invocation_results)) {
          for (var i = 0; i < invocation_results.length; i++) {
            results.push(invocation_results[i]);
          }
        }
        else { results.push(invocation_results); }
      }
    }
    return results;
  }
  catch (error) {
    console.log('dg_module_invoke_all - ' + error);
  }
}
