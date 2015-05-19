/**
 * Given a block delta, this will return the corresponding
 * block from drupalgap.blocks.
 * @param {String} delta
 * @return {Object}
 */
function drupalgap_block_load(delta) {
  try {
    var block = null;
    if (drupalgap.blocks) {
      for (var index in drupalgap.blocks) {
          if (!drupalgap.blocks.hasOwnProperty(index)) { continue; }
          var object = drupalgap.blocks[index];
          if (object[delta]) {
            block = object[delta];
            break;
          }
      }
    }
    if (block == null) {
      var msg = 'drupalgap_block_load - ' + t('failed to load') + ' "' + delta +
        '" ' + t('block!');
      drupalgap_alert(msg);
    }
    return block;
  }
  catch (error) { console.log('drupalgap_block_load - ' + error); }
}

/**
 * Renders the html string for a block.
 * @param {Object} region
 * @param {String} current_path
 * @param {String} block_delta
 * @param {Object} block_settings
 * @param {Object} block_counts
 * @return {String}
 */
function drupalgap_block_render(region, current_path, block_delta,
  block_settings, block_counts) {
  try {
    var html = '';
    // Check the block's visibility settings. If an access_callback
    // function is specified on the block's settings, we'll call that
    // to determine the visibility, otherwise we'll fall back to the
    // default visibility determination mechanism.
    var render_block = false;
    if (
      block_settings.access_callback &&
      drupalgap_function_exists(block_settings.access_callback)
    ) {
      var fn = window[block_settings.access_callback];
      render_block = fn({
          path: current_path,
          delta: block_delta,
          region: region.name,
          theme: drupalgap.settings.theme,
          settings: block_settings
      });
    }
    else if (drupalgap_check_visibility('block', block_settings)) {
      render_block = true;
      // The 'offline' and 'error' pages only have the 'main' system
      // block visible.
      if (block_delta != 'main' && (
        current_path == 'offline' || current_path == 'error')
      ) { render_block = false; }
    }
    if (render_block) {
      var block = drupalgap_block_load(block_delta);
      if (block_counts) { block_counts.block_count++; }
      if (menu_load(block_delta) && block_counts) {
        block_counts.block_menu_count++;
      }
      if (block) {
        html = module_invoke(
          block.module,
          'block_view',
          block_delta,
          region
        );
      }
    }
    return html;
  }
  catch (error) { console.log('drupalgap_block_render - ' + error); }
}

