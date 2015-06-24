/**
 * @deprecated
 */
function drupalgap_attributes(attributes) {
  try {
    console.log(
      'DEPRECATED - drupalgap_attributes(): use dg_attributes() instead in ' +
      arguments.callee.caller.name + '()'
    );
    return dg_attributes(attributes);
  }
  catch (error) { console.log('drupalgap_attributes - ' + error); }
}

/**
 * @deprecated
 */
function drupalgap_function_exists(name) {
  try {
    console.log(
      'DEPRECATED - drupalgap_function_exists(): use dg_function_exists() instead in ' +
      arguments.callee.caller.name + '()'
    );
    return dg_function_exists(name);
  }
  catch (error) { console.log('drupalgap_function_exists - ' + error); }
}

/**
 * @deprecated
 */
function drupalgap_get_camel_case(str) {
  try {
    console.log('DEPRECATED - drupalgap_get_camel_case(), use dg_get_camel_case() instead');
    return dg_get_camel_case(str);
  }
  catch (error) { console.log('drupalgap_get_camel_case - ' + error); }
}

/**
 * @deprecated
 */
function drupalgap_kill_camel_case(str, separator) {
  try {
    console.log('DEPRECATED - drupalgap_kill_camel_case(), use dg_kill_camel_case() instead');
    return dg_kill_camel_case(str, separator);
  }
  catch (error) { console.log('drupalgap_kill_camel_case - ' + error); }
}

