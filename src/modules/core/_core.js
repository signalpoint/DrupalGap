dg.modules.core = new dg.Module();

/**
 * Implements hook_rest_preprocess().
 * @param xhr
 * @param data
 */
function core_rest_preprocess(xhr, data) { dg.spinnerShow(); }

/**
 * Implements hook_rest_post_process().
 * @param xhr
 */
function core_rest_post_process(xhr) { dg.spinnerHide(); }
