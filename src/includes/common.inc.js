/**
 * Given a page id, the theme's page.tpl.html string, and the menu link object
 * (all bundled in options) this takes the page template html and adds it to the
 * DOM. It doesn't actually render the page, that is taken care of by the
 * pagebeforechange handler.
 * @param {Object} options
 */
function drupalgap_add_page_to_dom(options) {
  try {
    // Prepare the default page attributes, then merge in any customizations
    // from the hook_menu() item, then inject the attributes into the
    // placeholder. We have to manually add our default class name after the
    // extend until this issue is resolved:
    // https://github.com/signalpoint/DrupalGap/issues/321
    var attributes = {
      id: options.page_id,
      'data-role': 'page'
    };
    attributes =
      $.extend(true, attributes, options.menu_link.options.attributes);
    attributes['class'] +=
      ' ' + drupalgap_page_class_get(drupalgap.router_path);
    options.html = options.html.replace(
      /{:drupalgap_page_attributes:}/g,
      drupalgap_attributes(attributes)
    );
    // Add the html to the page and the page id to drupalgap.pages.
    $('body').append(options.html);
    drupalgap.pages.push(options.page_id);
  }
  catch (error) { console.log('drupalgap_add_page_to_dom - ' + error); }
}

/**
 * Attempts to remove given page from the DOM, will not remove the current page.
 * You may force the removal by passing in a second argument as a JSON object
 * with a 'force' property set to true.
 * @param {String} page_id
 */
function drupalgap_remove_page_from_dom(page_id) {
  try {
    var current_page_id = drupalgap_get_page_id(drupalgap_path_get());
    var options = {};
    if (arguments[1]) { options = arguments[1]; }
    if (current_page_id != page_id || options.force) {
      $('#' + page_id).empty().remove();
      delete drupalgap.pages[page_id];
    }
    else {
      console.log('WARNING: drupalgap_remove_page_from_dom() - not removing ' +
        'the current page (' + page_id + ') from the DOM!');
    }
  }
  catch (error) { console.log('drupalgap_remove_page_from_dom - ' + error); }
}

/**
 * Removes all pages from the DOM except the current one.
 */
function drupalgap_remove_pages_from_dom() {
  try {
    var current_page_id = drupalgap_get_page_id(drupalgap_path_get());
    $.each(drupalgap.pages, function(index, page_id) {
        if (current_page_id != page_id) {
          $('#' + page_id).empty().remove();
        }
    });
    // Reset drupalgap.pages to only contain the current page id.
    drupalgap.pages = [current_page_id];
    // Reset the drupalgap.views.ids array.
    drupalgap.views.ids = [];
  }
  catch (error) { console.log('drupalgap_remove_pages_from_dom - ' + error); }
}

/**
 * Converts a JSON object to an XML/HTML tag attribute string and returns the
 * string.
 * @param {Object} attributes
 * @return {String{
 */
function drupalgap_attributes(attributes) {
  try {
    var attribute_string = '';
    if (attributes) {
      $.each(attributes, function(name, value) {
          if (value != '') {
            // @todo - if someone passes in a value with double quotes, this
            // will break. e.g.
            // 'onclick':'_drupalgap_form_submit("' + form.id + "');'
            // will break, but
            // 'onclick':'_drupalgap_form_submit(\'' + form.id + '\');'
            // will work.
            attribute_string += name + '="' + value + '" ';
          }
          else {
            // The value was empty, just place the attribute name on the
            // element.
            attribute_string += name + ' ';
          }
      });
    }
    return attribute_string;
  }
  catch (error) { console.log('drupalgap_attributes - ' + error); }
}

/**
 * Used by drupalgap_render_region to check the visibility settings on region
 * links and blocks. Just like Drupal Blocks, this function checks the
 * visibility rules specified by role or pages specified in data. Returns true
 * by default, otherwise it will return true or false depending on the first
 * visibility setting present in data.
 * @param {String} type
 * @param {Object} data
 * @return {Boolean}
 */
function drupalgap_check_visibility(type, data) {
  try {
    var visible = true;
    if (typeof data === 'undefined') {
      console.log(
        'drupalgap_check_visibility - WARNING - no data provided for type (' +
        type + ')'
      );
    }
    // Roles.
    else if (typeof data.roles !== 'undefined' &&
      data.roles && data.roles.value && data.roles.value.length != 0) {
      $.each(data.roles.value, function(role_index, role) {
          if (drupalgap_user_has_role(role)) {
            // User has role, show/hide the block accordingly.
            if (data.roles.mode == 'include') { visible = true; }
            if (data.roles.mode == 'exclude') { visible = false; }
          }
          else {
            // User does not have role, show/hide the block accordingly.
            if (data.roles.mode == 'include') { visible = false; }
            if (data.roles.mode == 'exclude') { visible = true; }
          }
          // Break out of the loop if already determined to be visible.
          if (visible) { return false; }
      });
    }
    // Pages.
    else if (typeof data.pages !== 'undefined' && data.pages &&
      data.pages.value && data.pages.value.length != 0) {
      var current_path = drupalgap_path_get();
      var current_path_parts = current_path.split('/');
      $.each(data.pages.value, function(page_index, path) {
          if (path == '') { path = drupalgap.settings.front; }
          if (path == current_path) {
            if (data.pages.mode == 'include') { visible = true; }
            else if (data.pages.mode == 'exclude') { visible = false; }
            return false;
          }
          else {
            // It wasn't a direct path match, is there a wildcard that matches
            // the router path?
            if (path.indexOf('*') != -1) {
              var router_path =
                drupalgap_get_menu_link_router_path(current_path);
              if (router_path.replace(/%/g, '*') == path) {
                if (data.pages.mode == 'include') { visible = true; }
                else if (data.pages.mode == 'exclude') { visible = false; }
                return false;
              }
              else {
                var path_parts = path.split('/');
                var match = true;
                if (path_parts.length == 0) { match = false; }
                else if (path_parts.length == current_path_parts.length) {
                  for (var i = 0; i < path_parts.length; i++) {
                    if (path_parts[i] != current_path_parts[i]) {
                      match = false;
                      break;
                    }
                  }
                }
                if (data.pages.mode == 'include') { visible = false; }
                else if (data.pages.mode == 'exclude') { visible = true; }
                if (!match) { visible = !visible; }
              }
            }
            else {
              // There's no wildcard in the rule, and it wasn't a direct path
              // match.
              if (data.pages.mode == 'include') { visible = false; }
              else if (data.pages.mode == 'exclude') { visible = true; }
            }
          }
      });
    }
    return visible;
  }
  catch (error) { console.log('drupalgap_check_visibility - ' + error); }
}

/**
 * Given an entity type and entity, this will return the bundle name as a
 * string for the given entity, or null if the bundle is N/A.
 * @param {String} entity_type The entity type.
 * @param {Object} entity The entity JSON object.
 * @return {*}
 */
function drupalgap_get_bundle(entity_type, entity) {
  try {
    var bundle = null;
    switch (entity_type) {
      case 'node': bundle = entity.type; break;
      case 'comment':
      case 'file':
      case 'user':
      case 'taxonomy_vocabulary':
      case 'taxonomy_term':
        // These entity types don't have a bundle.
        break;
      default:
        console.log(
          'WARNING: drupalgap_get_bundle - unsupported entity type (' +
            entity_type +
          ')'
        );
        break;
    }
    return bundle;
  }
  catch (error) { console.log('drupalgap_get_bundle - ' + error); }
}

/**
 * Given a path, this will return the id for the page's div element.
 * For example, a string path of 'foo/bar' would result in an id of 'foo_bar'.
 * If no path is provided, it will return the current page's id.
 * @param {String} path
 * @return {String}
 */
function drupalgap_get_page_id(path) {
  try {
    if (!path) { path = drupalgap_path_get(); }
    var id = path.toLowerCase().replace(/\//g, '_').replace(/-/g, '_');
    return id;
  }
  catch (error) { console.log('drupalgap_get_page_id - ' + error); }
}

/**
 * Returns the path to a system item (module, theme, etc.), returns false if it
 * can't find it.
 * @param {String} type
 * @param {String} name
 * @return {*}
 */
function drupalgap_get_path(type, name) {
  try {
    var path = null;
    if (type == 'module') {
      var found_module = false;
      $.each(Drupal.modules, function(bundle, modules) {
          if (found_module) { return false; }
          else {
            $.each(modules, function(index, module) {
                if (module.name == name) {
                  found_module = true;
                  path = '';
                  if (bundle == 'core') { path += 'modules'; }
                  else if (bundle == 'contrib') { path += 'app/modules'; }
                  else if (bundle == 'custom') { path += 'app/modules/custom'; }
                  else {
                    var msg = 'drupalgap_get_path - unknown module bundle (' +
                      bundle +
                    ')';
                    drupalgap_alert(msg);
                    return false;
                  }
                  path += '/' + name;
                  return false;
                }
            });
          }
      });
    }
    else if (type == 'theme') {
      if (name == 'easystreet3') { path = 'themes/' + name; }
      else { path = 'app/themes/' + name; }
    }
    else {
      console.log(
        'WARNING: drupalgap_get_path - unsupported type (' + type + ')'
      );
    }
    return path;
  }
  catch (error) { console.log('drupalgap_get_path - ' + error); }
}

/**
 * Change the page to the previous page.
 */
function drupalgap_back() {
  try {
    if ($('.ui-page-active').attr('id') == drupalgap.settings.front) {
      var msg = 'Exit ' + drupalgap.settings.title + '?';
      if (drupalgap.settings.exit_message) {
        msg = drupalgap.settings.exit_message;
      }
      drupalgap_confirm(msg, {
          confirmCallback: _drupalgap_back_exit
      });
    }
    else { _drupalgap_back(); }
  }
  catch (error) { console.log('drupalgap_back' + error); }
}

/**
 * Change the page to the previous page.
 */
function _drupalgap_back() {
  try {
    drupalgap.back = true;
    history.back();
    drupalgap_path_set(drupalgap.back_path.pop());
  }
  catch (error) { console.log('drupalgap_back' + error); }
}

/**
 * An internal function used to exit the app when the back button is clicked.
 * @param {Number} button Which button was pressed.
 */
function _drupalgap_back_exit(button) {
  try {
    button === 1 ? navigator.app.exitApp() : '';
  }
  catch (error) { console.log('_drupalgap_back_exit - ' + error); }
}

/**
 * Given an error message, this will log the message to the console and goto
 * the error page, if it isn't there already. If Drupal.settings.debug is set
 * to true, this function will also alert the error. You may optionally send in
 * a second message that will be displayed to the user via an alert dialog box.
 * @param {String} message
 */
function drupalgap_error(message) {
  try {
    // Generate a developer error message, log it to the console, then alert
    // the message if debugging is enabled.
    var error_message = 'drupalgap_error() - ' +
                        arguments.callee.caller.name + ' - ' +
                        message;
    dpm(error_message);
    if (Drupal.settings.debug) { drupalgap_alert(error_message); }
    // If a message for the user was passed in, display it to the user.
    if (arguments[1]) { drupalgap_alert(arguments[1]); }
    // Goto the error page if we are not already there.
    if (drupalgap_path_get() != 'error') { drupalgap_goto('error'); }
  }
  catch (error) { console.log('drupalgap_error - ' + error); }
}

/**
 * Given a link JSON object, this will return its attribute class value, or null
 * if it isn't set.
 * @param {Object} link
 * @return {String}
 */
function drupalgap_link_get_class(link) {
  try {
    var css_class = null;
    if (
      link.options && link.options.attributes &&
      link.options.attributes['class'] &&
      !empty(link.options.attributes['class'])
    ) { css_class = link.options.attributes['class']; }
    return css_class;
  }
  catch (error) { console.log('drupalgap_link_get_class - ' + error); }
}

/**
 * Given a router path, this will return the CSS class name that can be used for
 * the page container.
 * @param {String} router_path The page router path.
 * @return {String} A css class name.
 */
function drupalgap_page_class_get(router_path) {
  try {
    // Replace '/' and '%' with underscores, then trim any trailing underscores.
    var class_name = router_path.replace(/[\/%]/g, '_');
    while (class_name.lastIndexOf('_') == class_name.length - 1) {
      class_name = class_name.substr(0, class_name.length - 1);
    }
    return class_name;
  }
  catch (error) { console.log('drupalgap_page_class_get - ' + error); }
}

/**
 * Returns true if the given page id's page div already exists in the DOM.
 * @param {String} page_id
 * @return {Boolean}
 */
function drupalgap_page_in_dom(page_id) {
  try {
    var pages = $("body div[data-role$='page']");
    var page_in_dom = false;
    if (pages && pages.length > 0) {
      $.each(pages, function(index, page) {
          if (($(page).attr('id')) == page_id) {
            page_in_dom = true;
            return false;
          }
      });
    }
    return page_in_dom;
  }
  catch (error) { console.log('drupalgap_page_in_dom - ' + error); }
}

/**
 * Returns true if the current page is the front page, false otherwise.
 * @return {Boolean}
 */
function drupalgap_is_front_page() {
  try {
    return drupalgap_path_get() == drupalgap.settings.front;
  }
  catch (error) { console.log('drupalgap_is_front_page - ' + error); }
}

/**
 * Returns the URL of the active jQuery Mobile page.
 * @return {String}
 */
function drupalgap_jqm_active_page_url() {
  try {
    // WARNING: when the app first loads, this value may be much different than
    // you expect. It certainly is not the front page path, because on Android
    // for example it returns '/android_asset/www/index.html'. Also, when the
    // app first loads, activePage is null, so just return an empty string.
    if (!$.mobile.activePage) { return ''; }
    return $.mobile.activePage.data('url');
  }
  catch (error) { console.log('drupalgap_jqm_active_page_url - ' + error); }
}

/**
 * Get the current DrupalGap path.
 * @return {String}
 */
function drupalgap_path_get() {
  try {
    var path = drupalgap.path;
    return path;
  }
  catch (error) { console.log('drupalgap_path_get - ' + error); }
}

/**
 * Set the current DrupalGap path.
 * @param {String} path
 */
function drupalgap_path_set(path) {
  try { drupalgap.path = path; }
  catch (error) { console.log('drupalgap_path_set - ' + error); }
}

/**
 * Get the current DrupalGap router_path.
 * @return {String}
 */
function drupalgap_router_path_get() {
  try {
    var router_path = drupalgap.router_path;
    return router_path;
  }
  catch (error) { console.log('drupalgap_router_path_get - ' + error); }
}

/**
 * Set the current DrupalGap router_path.
 * @param {String} router_path
 */
function drupalgap_router_path_set(router_path) {
  try { drupalgap.router_path = router_path; }
  catch (error) { console.log('drupalgap_router_path_set - ' + error); }
}

/**
 * Renders the html string of the page content that is stored in
 * drupalgap.output.
 * @return {String}
 */
function drupalgap_render_page() {
  try {
    // Since the page output has already been assembled, render the content
    // based on the output type. The output type will either be an html string
    // or a drupalgap render object.
    var output = drupalgap.output;
    var output_type = $.type(output);
    var content = '';

    // If the output came back as a string, we can render it as is. If the
    // output came back as on object, render each element in it through the
    // theme system.
    if (output_type === 'string') {
      // The page came back as an html string.
      content = output;
    }
    else if (output_type === 'object') {
      // The page came back as a render object. Let's define the names of
      // variables that are reserved for theme processing.
      var render_variables = ['theme', 'view_mode', 'language'];

      // Is there a theme value specified in the output and the registry?
      if (output.theme && drupalgap.theme_registry[output.theme]) {

        // Extract the theme object template and determine the template file
        // name and path.
        var template = drupalgap.theme_registry[output.theme];
        var template_file_name = output.theme.replace(/_/g, '-') + '.tpl.html';
        var template_file_path = template.path + '/' + template_file_name;

        // Make sure the template file exists.
        if (drupalgap_file_exists(template_file_path)) {

          // Loads the template file's content into a string.
          var template_file_html = drupalgap_file_get_contents(
            template_file_path
          );
          if (template_file_html) {

            // What variable placeholders are present in the template file?
            var placeholders = drupalgap_get_placeholders_from_html(
              template_file_html
            );
            if (placeholders) {

              // Replace each placeholder with html.
              // @todo - each placeholder should have its own container div and
              // unique id.
              $.each(placeholders, function(index, placeholder) {
                  var html = '';
                  if (output[placeholder]) {
                    // Grab the element variable from the output.
                    var element = output[placeholder];
                    // If it is markup, render it as is, if it is themeable,
                    // then theme it.
                    if (output[placeholder].markup) {
                      html = output[placeholder].markup;
                    }
                    else if (output[placeholder].theme) {
                      html = theme(output[placeholder].theme, element);
                    }
                    // Now remove the variable from the output.
                    delete output[placeholder];
                  }
                  // Now replace the placeholder with the html, even if it was
                  // empty.
                  template_file_html = template_file_html.replace(
                    '{:' + placeholder + ':}',
                    html
                  );
              });
            }
            else {
              // There were no place holders found, do nothing, ok.
            }

            // Finally add the rendered template file to the content.
            content += template_file_html;
          }
          else {
            console.log(
              'drupalgap_render_page - failed to get file contents (' +
                template_file_path +
              ')'
            );
          }
        }
        else {
          console.log(
            'drupalgap_render_page - template file does not exist (' +
              template_file_path +
              ')'
            );
        }
      }

      // Iterate over any remaining variables and theme them.
      // @todo - each remaining variables should have its own container div and
      // unique id, similar to the placeholder div containers mentioned above.
      $.each(output, function(element, variables) {
          if ($.inArray(element, render_variables) == -1) {
            content += theme(variables.theme, variables);
          }
      });
    }

    // Now that we are done assembling the content into an html string, we can
    // return it.
    return content;
  }
  catch (error) { console.log('drupalgap_render_page - ' + error); }
}

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

/**
 * An interal callback used to handle the setting of the page title during the
 * pageshow event.
 * @param {*} page_arguments
 */
function _drupalgap_page_title_pageshow(page_arguments) {
  try {
    var router_path = drupalgap_router_path_get();
    // Set the page title. First we'll see if the hook_menu() item has a
    // title variable set, then check for a title_callback function.
    var title_arguments = [];
    if (typeof drupalgap.menu_links[router_path].title !== 'undefined') {
      drupalgap_set_title(drupalgap.menu_links[router_path].title);
    }
    if (
      typeof drupalgap.menu_links[router_path].title_callback !== 'undefined'
    ) {
      var function_name = drupalgap.menu_links[router_path].title_callback;
      if (drupalgap_function_exists(function_name)) {
        // Grab the title callback function.
        var fn = window[function_name];
        // Place the internal success callback handler on the front of the
        // title arguments.
        title_arguments.unshift(_drupalgap_page_title_pageshow_success);
        // Are there any additional arguments to send to the title callback?
        if (drupalgap.menu_links[router_path].title_arguments) {
          // For each title argument, if the argument is an integer, grab the
          // corresponding arg(#), otherwise just push the arg onto the title
          // arguments.
          var args = arg(null, drupalgap_path_get());
          $.each(
            drupalgap.menu_links[router_path].title_arguments,
            function(index, object) {
              if (is_int(object) && args[object]) {
                title_arguments.push(args[object]);
              }
              else { title_arguments.push(object); }
          });
        }
        // Call the title callback function with the title arguments.
        drupalgap_set_title(
          fn.apply(
            null,
            Array.prototype.slice.call(title_arguments)
          )
        );
      }
    }
    else {
      _drupalgap_page_title_pageshow_success(drupalgap_get_title());
    }
  }
  catch (error) { console.log('_drupalgap_page_title_pageshow - ' + error); }
}

/**
 * An internal function used to set the page title when the page title callback
 * function is successful.
 * @param {String} title
 */
function _drupalgap_page_title_pageshow_success(title) {
  try {
    var id = system_title_block_id(drupalgap_path_get());
    $('h1#' + id).html(title);
  }
  catch (error) {
    console.log('_drupalgap_page_title_pageshow_success - ' + error);
  }
}

/**
 * Implementation of arg(index = null, path = null).
 * @return {*}
 */
function arg() {
  try {
    var result = null;
    // If there were zero or one arguments provided.
    if (arguments.length == 0 || arguments.length == 1) {
      // Split the path into parts.
      var drupalgap_path = drupalgap_path_get();
      var args = drupalgap_path.split('/');
      // If no arguments were provided just return the split array, otherwise
      // return whichever argument was requested.
      if (arguments.length == 0) { result = args; }
      else if (args[arguments[0]]) { result = args[arguments[0]]; }
    }
    else {
      // A path was provided, split it into parts, then return the split array
      // if they didn't request a specific index, otherwise return the value of
      // the specific index inside the split array.
      var path = arguments[1];
      var args = path.split('/');
      if (arguments[0] && args[arguments[0]]) { result = args[arguments[0]]; }
      else { result = args; }
    }
    return result;
  }
  catch (error) { console.log('arg - ' + error); }
}

/**
 * Returns a link.
 * @return {String}
 */
function l() {
  try {
    // Grab the text and the path from the arguments and then build a simple
    // link object.
    var text = arguments[0];
    var path = arguments[1];
    var link = {'text': text, 'path': path};
    // Determine if there are any incoming link options, if there are, attach
    // them to the link object. If there are any attributes, extract them from
    // the options and attach them directly to the link object.
    var options = null;
    if (arguments[2]) {
      options = arguments[2];
      if (options.attributes) { link.attributes = options.attributes; }
      link.options = options;
    }
    return theme('link', link);
  }
  catch (error) { console.log('l - ' + error); }
}

/**
 * Returns a button link.
 * @return {String}
 */
function bl() {
  try {
    // Grab the text and the path.
    var text = arguments[0];
    var path = arguments[1];
    // Build the default options and attributes, if necessary.
    var options = null;
    if (arguments[2]) {
      options = arguments[2];
    }
    else { options = {}; }
    if (!options.attributes) { options.attributes = { }; }
    options.attributes['data-role'] = 'button';
    return l(text, path, options);
  }
  catch (error) { console.log('bl - ' + error); }
}

