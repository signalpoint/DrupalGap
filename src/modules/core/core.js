dg.modules.core = new dg.Module();

/**
 * Implements hook_rest_pre_process().
 * @param xhr
 * @param data
 */
function core_rest_pre_process(xhr, data) { dg.spinnerShow(); }

/**
 * Implements hook_rest_post_process().
 * @param xhr
 */
function core_rest_post_process(xhr) { dg.spinnerHide(); }

/**
 * Implements hook_pre_process_route_change().
 */
function core_pre_process_route_change(newPath, oldPath) {

  dg.clearBuckets();

}
