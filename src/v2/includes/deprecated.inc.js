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
 * @see dg_check_connection()
 */
function drupalgap_check_connection() {
  console.log(
    'DEPRECATED - drupalgap_check_connection(): use dg_check_connection() instead in ' +
    arguments.callee.caller.name + '()'
  );
  return dg_check_connection();
}

/**
 * @deprecated
 * @see dg_check_visibility().
 */
function drupalgap_check_visibility(type, data) {
  console.log(
    'DEPRECATED - drupalgap_check_visibility(): use dg_check_visibility() instead in ' +
    arguments.callee.caller.name + '()'
  );
  return dg_check_visibility(data);
}

/**
 * @deprecated
 */
function drupalgap_field_info_field(field_name) {
  try {
    console.log(
      'DEPRECATED - drupalgap_field_info_field(): use dg_field_info_field() instead in ' +
      arguments.callee.caller.name + '()'
    );
    return dg_field_info_field(field_name);
  }
  catch (error) { console.log('drupalgap_field_info_field - ' + error); }
}

/**
 * @deprecated
 */
function drupalgap_field_info_instance(entity_type, field_name, bundle_name) {
  console.log(
    'DEPRECATED - drupalgap_field_info_instance(): use dg_field_info_instance() instead in ' +
    arguments.callee.caller.name + '()'
  );
  return dg_field_info_instance(entity_type, field_name, bundle_name)
}

/**
 * @deprecated
 */
function drupalgap_field_info_instances(entity_type, bundle_name) {
  console.log(
    'DEPRECATED - drupalgap_field_info_instances(): use dg_field_info_instances() instead in ' +
    arguments.callee.caller.name + '()'
  );
  return dg_field_info_instances(entity_type, bundle_name);
}

/**
 * @deprecated
 * @see dg_file_exists()
 */
function drupalgap_file_exists(path) {
  console.log(
    'DEPRECATED - drupalgap_file_exists(): use dg_file_exists() instead in ' +
    arguments.callee.caller.name + '()'
  );
  return dg_file_exists(path);
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
 * Given a form_id, this will return a form with a directive attribute for it.
 * @param {String} form_id
 * @return {String}
 * @deprecated
 */
/*function drupalgap_get_form(form_id) {
  try {
    console.log(
      'DEPRECATED - drupalgap_get_form() - instead, use a directive with this name: ' +
      dg_get_camel_case(form_id)
    );
    return;
  }
  catch (error) { console.log('drupalgap_get_form - ' + error); }
}*/

/**
 * @deprecated
 */
function drupalgap_form_defaults(form_id) {
  try {
    console.log(
      'DEPRECATED - drupalgap_form_defaults(): use dg_form_defaults() instead in ' +
      arguments.callee.caller.name + '(), and pass $scope to it'
    );
    return dg_form_defaults(form_id);
  }
  catch (error) { console.log('drupalgap_form_defaults - ' + error); }
}

/**
 * @deprecated
 */
function drupalgap_file_get_contents(path, options) {
  try {
    console.log(
      'DEPRECATED - drupalgap_file_get_contents(): use dg_file_get_contents() instead in ' +
      arguments.callee.caller.name + '()'
    );
    return dg_file_get_contents(path, options);
  }
  catch (error) { console.log('drupalgap_file_get_contents - ' + error); }
}

/**
 * @deprecated
 */
function drupalgap_form_get_element_id(name, form_id) {
  console.log(
    'DEPRECATED - drupalgap_form_get_element_id(): use dg_form_get_element_id() instead in ' +
    arguments.callee.caller.name + '()'
  );
  return dg_form_get_element_id(name, form_id);
}

/**
 * @deprecated
 */
function drupalgap_form_render(form) {
  console.log(
    'DEPRECATED - drupalgap_form_render(): use dg_form_render() instead in ' +
    arguments.callee.caller.name + '()'
  );
  return dg_form_render(form);
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

/**
 *
 */
function drupalgap_ng_get(key) {
  try {
    console.log(
      'DEPRECATED - drupalgap_ng_get(): use dg_ng_get() instead in ' +
      arguments.callee.caller.name + '()'
    );
    return dg_ng_get(key);
  }
  catch (error) { console.log('drupalgap_ng_get - ' + error); }
}

/**
 *
 */
function drupalgap_ng_set(key, value) {
  try {
    console.log(
      'DEPRECATED - drupalgap_ng_set(): use dg_ng_set() instead in ' +
      arguments.callee.caller.name + '()'
    );
    dg_ng_set(key, value);
  }
  catch (error) { console.log('drupalgap_ng_set - ' + error); }
}

/**
 * Get the current DrupalGap path.
 * @return {String}
 */
function drupalgap_path_get() {
  try {
    console.log(
      'DEPRECATED - drupalgap_path_get(): use dg_path_get() instead in ' +
      arguments.callee.caller.name + '()'
    );
    return dg_path_get();
  }
  catch (error) { console.log('drupalgap_path_get - ' + error); }
}

/**
 * Set the current DrupalGap path.
 * @param {String} path
 * @deprecated
 */
function drupalgap_path_set(path) {
  console.log(
    'DEPRECATED - drupalgap_path_set(): is now handled by Angular, the caller is being ignored:' +
    arguments.callee.caller.name + '()'
  );
  return;
}

/**
 * @see dg_render()
 * @deprecated
 * @param content
 * @returns {String}
 */
function drupalgap_render(content) {
  console.log(
    'DEPRECATED - drupalgap_render(): use dg_render() instead in ' +
    arguments.callee.caller.name + '()'
  );
  return dg_render(content);
}

/**
 * @deprecated
 * @see dg_user_has_role()
 */
function drupalgap_user_has_role() {
  console.log(
    'DEPRECATED - drupalgap_user_has_role(): use dg_user_has_role() instead in ' +
    arguments.callee.caller.name + '()'
  );
  if (arguments.length == 1) { return dg_user_has_role(arguments[0]); }
  else if (arguments.length == 2) {
    return dg_user_has_role(arguments[0], arguments[0]);
  }
}

/**
 * @deprecated
 * @see drupal_entity_primary_key_title()
 */
function entity_primary_key(entity_type) {
  console.log(
    'DEPRECATED - entity_primary_key(): use drupal_entity_primary_key() instead in ' +
    arguments.callee.caller.name + '()'
  );
  return drupal_entity_primary_key(entity_type);
}

/**
 * @deprecated
 * @see drupal_entity_primary_key_title()
 */
function entity_primary_key_title(entity_type) {
  console.log(
    'DEPRECATED - entity_primary_key_title(): use drupal_entity_primary_key_title() instead in ' +
    arguments.callee.caller.name + '()'
  );
  return drupal_entity_primary_key_title(entity_type);
}

/**
 * @deprecated
 */
function empty(value) {
  console.log(
    'DEPRECATED - empty(): use dg_empty() instead in ' +
    arguments.callee.caller.name + '()'
  );
  return dg_empty(value);
}

/**
 * Set the current DrupalGap path.
 * @param {String} path
 * @deprecated
 */
function is_int(n) {
  console.log(
    'DEPRECATED - is_int(): use dg_is_int() instead in ' +
    arguments.callee.caller.name + '()'
  );
  return dg_is_int(n);
}

/**
 *
 */
function language_default() {
  try {
    console.log(
      'DEPRECATED - language_default(): use dg_language_default() instead in ' +
      arguments.callee.caller.name + '()'
    );
    return dg_language_default();
  }
  catch (error) { console.log('language_default - ' + error); }
}

/**
 * @deprecated
 * @see dg_module_implements()
 */
function module_implements(hook) {
  console.log(
    'DEPRECATED - module_implements(): use dg_module_implements() instead in ' +
    arguments.callee.caller.name + '()'
  );
  return dg_module_implements(hook);
}

/**
 * @see https://api.drupal.org/api/drupal/includes!module.inc/function/module_invoke/7
 */
function module_invoke(module, hook) {
  console.log(
    'DEPRECATED - module_invoke(): use dg_module_invoke() instead in ' +
    arguments.callee.caller.name + '()'
  );
  return dg_module_invoke.apply(null, Array.prototype.slice.call(arguments));
}

/**
 * @deprecated
 * @see module_invoke_all()
 */
function module_invoke_all(hook) {
  console.log(
    'DEPRECATED - module_invoke_all(): use dg_module_invoke_all() instead in ' +
    arguments.callee.caller.name + '()'
  );
  if (arguments.length == 1) { return dg_module_invoke_all(hook); }
  return dg_module_invoke_all.apply(null, Array.prototype.slice.call(arguments));
}
