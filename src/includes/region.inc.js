/**
 * Given a region, this renders it and all the blocks in it. The blocks are
 * specified in the settings.js file, they are bundled under a region, which in
 * turn is bundled under a theme name. Returns an empty string if it fails.
 * @param {Object} region
 * @return {String}
 */
function drupalgap_render_region(region) {
  try {
    // @TODO - this function is getting huge. Break it up into many more
    // manageable functions.

    // Make sure there are blocks specified for this theme in settings.js.
    if (!drupalgap.settings.blocks[drupalgap.settings.theme]) {
      var msg = 'WARNING: drupalgap_render_region() - there are no blocks ' +
        'for the "' + drupalgap.settings.theme + '" theme in the settings.js ' +
        'file!';
      console.log(msg);
      return '';
    }

    // Grab the current path.
    var current_path = drupalgap_path_get();

    // Let's render the region...
    var region_html = '';

    // If the region has blocks specified for it in the theme in settings.js...
    if (drupalgap.settings.blocks[drupalgap.settings.theme][region.name]) {

      // If a class attribute hasn't yet been provided, set a default, then
      // append a system class name for the region onto its attributes array.
      if (!region.attributes['class']) { region.attributes['class'] = ''; }
      region.attributes['class'] += ' region_' + region.name + ' ';

      // Open the region container.
      region_html += '<div ' + drupalgap_attributes(region.attributes) + '>';

      // If there are any links attached to this region, render them first.
      var region_link_count = 0;
      var region_link_popup_count = 0;
      if (region.links && region.links.length > 0) {

        // Let's first iterate over all of the region links and keep counts of
        // any links that use the ui-btn-left and ui-btn-right class attribute.
        // This will allow us to properly wrap region links in a control group.
        var ui_btn_left_count = 0;
        var ui_btn_right_count = 0;
        $.each(region.links, function(index, link) {
            var data = menu_region_link_get_data(link);
            if (!drupalgap_check_visibility('region', data)) { return; }
            region_link_count++;
            var css_class = drupalgap_link_get_class(link);
            if (css_class) {
              var side = menu_region_link_get_side(css_class);
              if (side == 'left') { ui_btn_left_count++; }
              else if (side == 'right') { ui_btn_right_count++; }
            }
        });

        // We need to separately render each side of the header (left, right).
        // That allows us to properly wrap the links with a control group if
        // it is needed.
        var region_link_html = '';
        var ui_btn_left_html = '';
        var ui_btn_right_html = '';
        for (var i = 0; i < region.links.length; i++) {

          // Grab the link and its data.
          var region_link = region.links[i];
          var data = menu_region_link_get_data(region_link);

          // Check link's region visiblity settings. Links will not be rendered
          // on certain system pages.
          // @TODO - this additional call to drupalgap_check_visibility() here
          // may be expensive, consider setting aside the results from the call
          // above, and using them here.
          if (drupalgap_check_visibility('region', data)) {

            // Don't render the link on certain system pages.
            if (in_array(current_path, ['offline', 'error', 'user/logout'])) {
              continue;
            }

            // If this is a popup region link, set the jQM attributes to make
            // this link function as a popup (dropdown) menu. Set the default
            // link icon, if it isn't set.
            var link_text = region_link.title;
            var link_path = region_link.path;
            if (data.options.popup) {

              region_link_popup_count++;

              // If the link text isn't set, and the data icon pos isn't set,
              // set it the data icon pos so the button and icon are rendered
              // properly.
              if (
                (!link_text || empty(link_text)) &&
                typeof data.options.attributes['data-iconpos'] === 'undefined'
              ) { data.options.attributes['data-iconpos'] = 'notext'; }

              // If data-rel, data-icon, data-role aren't set, set them.
              if (
                typeof data.options.attributes['data-rel'] === 'undefined'
              ) { data.options.attributes['data-rel'] = 'popup'; }
              if (
                typeof data.options.attributes['data-icon'] === 'undefined'
              ) { data.options.attributes['data-icon'] = 'bars'; }
              if (
                typeof data.options.attributes['data-role'] === 'undefined'
              ) { data.options.attributes['data-role'] = 'button'; }

              // Popup menus need a dynamic href value on the link, so we
              // always overwrite it.
              link_path = null;
              data.options.attributes['href'] =
                '#' + menu_container_id(data.options.popup_delta);
            }
            else {

              // Set the data-role to a button, if one isn't already set.
              if (typeof data.options.attributes['data-role'] === 'undefined') {
                data.options.attributes['data-role'] = 'button';
              }

            }

            // If it has notext for the icon position, force the text to be
            // an nbsp.
            if (data.options.attributes['data-iconpos'] == 'notext') {
              link_text = '&nbsp;';
            }

            // Render the link on the proper side.
            var css_class = drupalgap_link_get_class(region_link);
            var side = menu_region_link_get_side(css_class);
            var link_html = l(link_text, link_path, data.options);
            if (side == 'left') { ui_btn_left_html += link_html; }
            else if (side == 'right') { ui_btn_right_html += link_html; }

          }

        }

        // If there was more than one link on a side, wrap it in a control
        // group, and remove the ui-btn class from the links.
        if (ui_btn_left_count > 1) {
          var attrs = {
            'data-type': 'horizontal',
            'data-role': 'controlgroup',
            'class': 'ui-btn-left'
          };
          ui_btn_left_html = '<div ' + drupalgap_attributes(attrs) + '>' +
            ui_btn_left_html.replace(/ui-btn-left/g, '') +
          '</div>';
        }
        if (ui_btn_right_count > 1) {
          var attrs = {
            'data-type': 'horizontal',
            'data-role': 'controlgroup',
            'class': 'ui-btn-right'
          };
          ui_btn_right_html = '<div ' + drupalgap_attributes(attrs) + '>' +
            ui_btn_right_html.replace(/ui-btn-right/g, '') +
          '</div>';
        }

        // Finally render the ui sides on the region.
        region_html += ui_btn_left_html + ui_btn_right_html;
      }

      // Render each block in the region. Determine how many visible blocks are
      // in the region.
      var block_count = 0;
      var block_menu_count = 0;
      $.each(drupalgap.settings.blocks[drupalgap.settings.theme][region.name],
        function(block_delta, block_settings) {

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
            block_count++;
            if (menu_load(block_delta)) { block_menu_count++; }
            if (block) {
              region_html += module_invoke(
                block.module,
                'block_view',
                block_delta,
                region
              );
            }
          }
      });

      // If this was a header or footer, and there were only region links
      // rendered, place an empty header in the region.
      if (
        in_array(region.attributes['data-role'], ['header', 'footer']) &&
        (
          block_count == 0 && region_link_count > 0 ||
          block_count - block_menu_count == 0
        ) ||
        (
          region_link_count > 0 &&
          region_link_popup_count >= block_menu_count &&
          block_count == 0
        )
      ) {
        // Show an empty header if we're not collapsing on an empty region.
        if (
          typeof region.collapse_on_empty === 'undefined' ||
          region.collapse_on_empty === false
        ) { region_html += '<h2>&nbsp;</h2>'; }
      }

      // Close the region container.
      region_html += '</div><!-- ' + region.name + ' -->';

    }
    return region_html;
  }
  catch (error) { console.log('drupalgap_render_region - ' + error); }
}

