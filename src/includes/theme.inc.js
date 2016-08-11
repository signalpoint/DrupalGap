/**
 * Returns the path to the current DrupalGap theme, false otherwise.
 * @return {String|Boolean}
 */
function path_to_theme() {
  try {
    if (drupalgap.theme_path) {
      return drupalgap.theme_path;
    }
    else {
      console.log('path_to_theme - drupalgap.theme_path is not set!');
      return false;
    }
  }
  catch (error) { console.log('path_to_theme - ' + error); }
}

/**
 * Implementation of theme().
 * @param {String} hook
 * @param {Object} variables
 * @return {String}
 */
function theme(hook, variables) {
  try {

    // If there is HTML markup present, just return it as is. Otherwise, run
    // the theme hook and send along the variables.
    if (!variables) { variables = {}; }
    if (typeof variables.access !== 'undefined' && !variables.access) { return ''; }
    if (variables.markup) { return variables.markup; }
    var content = '';
    if (!hook) { return content; }

    // First see if the current theme implements the hook, if it does use it, if
    // it doesn't fallback to the core theme implementation of the hook.
    var theme_function = drupalgap.settings.theme + '_' + hook;
    if (!function_exists(theme_function)) {
      theme_function = 'theme_' + hook;

      // Fail safely an informative message if a bogus hook was passed in.
      if (!function_exists(theme_function)) {
        var caller = null;
        if (arguments.callee.caller) { caller = arguments.callee.caller.name; }
        var msg = 'WARNING: ' + theme_function + '() does not exist.';
        if (caller) { msg += ' Called by: ' + caller + '().' }
        console.log(msg);
        return content;
      }

    }

    // If no attributes are coming in, look to variables.options.attributes
    // as a secondary option, otherwise setup an empty JSON object for them.
    if (
      typeof variables.attributes === 'undefined' ||
      !variables.attributes
    ) {
      if (variables.options && variables.options.attributes) {
        variables.attributes = variables.options.attributes;
      }
      else {
        variables.attributes = {};
      }
    }
    // If there is no class name, set an empty one.
    if (!variables.attributes['class']) {
      variables.attributes['class'] = '';
    }
    var fn = window[theme_function];
    content = fn.call(null, variables);
    return content;
  }
  catch (error) { console.log('theme - ' + error); }
}

/**
 * Themes a button.
 * @param {Object} variables
 * @return {String}
 */
function theme_button(variables) {
  try {
    variables.attributes['data-role'] = 'button';
    var html = '<a ' + drupalgap_attributes(variables.attributes) + '>' +
      variables.text +
    '</a>';
    return html;
  }
  catch (error) { console.log('theme_button_link - ' + error); }
}

/**
 * Themes a button link.
 * @param {Object} variables
 * @return {String}
 */
function theme_button_link(variables) {
  try {
    variables.attributes['data-role'] = 'button';
    return theme_link(variables);
  }
  catch (error) { console.log('theme_button_link - ' + error); }
}

/**
 * Themes a collapsible widget.
 * @param {Object} variables
 * @return {String}
 */
function theme_collapsible(variables) {
  try {
    variables.attributes['data-role'] = 'collapsible';
    var header_type = 'h2';
    if (variables.header_type) { header_type = variables.header_type; }
    var header_attributes = {};
    if (variables.header_attributes) {
      header_attributes = variables.header_attributes;
    }
    var html = '<div ' + drupalgap_attributes(variables.attributes) + '>' +
      '<' + header_type + ' ' + drupalgap_attributes(header_attributes) + '>' +
        variables.header +
      '</' + header_type + '>' + variables.content + '</div>';
    return html;
  }
  catch (error) { console.log('theme_collapsible - ' + error); }
}

/**
 * Themes a collapsibleset widget.
 * @param {Object} variables
 * @return {String}
 */
function theme_collapsibleset(variables) {
  try {
    variables.attributes['data-role'] = 'collapsible-set';
    var html = '<div ' + drupalgap_attributes(variables.attributes) + '>';
    for (var index in variables.items) {
        if (!variables.items.hasOwnProperty(index)) { continue; }
        var item = variables.items[index];
        html += theme('collapsible', item);
    }
    html += '</div>';
    return html;
  }
  catch (error) { console.log('theme_collapsibleset - ' + error); }
}

/**
 * Themes a controlgroup widget.
 * @param {Object} variables
 * @return {String}
 */
function theme_controlgroup(variables) {
  try {
    variables.attributes['data-role'] = 'controlgroup';
    var html = '<div ' + drupalgap_attributes(variables.attributes) + '>';
    for (var index in variables.items) {
      if (!variables.items.hasOwnProperty(index)) { continue; }
      var item = variables.items[index];
      html += item;
    }
    html += '</div>';
    return html;
  }
  catch (error) { console.log('theme_controlgroup - ' + error); }
}

/**
 * Themes a header widget.
 * @param {Object} variables
 * @return {String}
 */
function theme_header(variables) {
  try {
    variables.attributes['data-role'] = 'header';
    if (typeof variables.type === 'undefined') { type = 'h2'; }
    var html = '<div ' + drupalgap_attributes(variables.attributes) + '>' +
      '<' + type + '>' + variables.text + '</' + type + '></div>';
    return html;
  }
  catch (error) { console.log('theme_header - ' + error); }
}

/**
 * Implementation of theme_image().
 * @param {Object} variables
 * @return {String}
 */
function theme_image(variables) {
  try {
    // Turn the path, alt and title into attributes if they are present.
    if (variables.path) { variables.attributes.src = variables.path; }
    if (variables.alt) { variables.attributes.alt = variables.alt; }
    if (variables.title) { variables.attributes.title = variables.title; }
    // Render the image.
    return '<img ' + drupalgap_attributes(variables.attributes) + ' />';
  }
  catch (error) { console.log('theme_image - ' + error); }
}


/**
 * Implementation of theme_audio().
 * @param {Object} variables
 * @return {String}
 */
function theme_audio(variables) {
  try {
    // Turn the path, alt and title into attributes if they are present.
    if (variables.path) { variables.attributes.src = variables.path; }
    if (variables.alt) { variables.attributes.alt = variables.alt; }
    if (variables.title) { variables.attributes.title = variables.title; }
    // Render the audio player.
    return '<audio controls ' + drupalgap_attributes(variables.attributes) +
    '></audio>';
  }
  catch (error) { console.log('theme_audio - ' + error); }
}

/**
 * Implementation of theme_video().
 * @param {Object} variables
 * @return {String}
 */
function theme_video(variables) {
  try {
    // Turn the path, alt and title into attributes if they are present.
    if (variables.path) { variables.attributes.src = variables.path; }
    if (variables.alt) { variables.attributes.alt = variables.alt; }
    if (variables.title) { variables.attributes.title = variables.title; }
    // Add the 'webkit-playsinline' attribute on iOS devices if no one made a
    // decision about it being there or not.
    if (
      typeof device !== 'undefined' &&
      device.platform == 'iOS' &&
      typeof variables.attributes['webkit-playsinline'] === 'undefined'
    ) { variables.attributes['webkit-playsinline'] = ''; }
    // Render the video player.
    return '<video ' + drupalgap_attributes(variables.attributes) +
    '></video>';
  }
  catch (error) { console.log('theme_video - ' + error); }
}

/**
 * Implementation of theme_image_style().
 * @param {Object} variables
 * @return {String}
 */
function theme_image_style(variables) {
  try {
    variables.path = image_style_url(variables.style_name, variables.path);
    return theme_image(variables);
  }
  catch (error) { console.log('theme_image - ' + error); }
}

/**
 * Theme's an item from an MVC collection.
 * @param {Object} variables
 * @return {String}
 */
function theme_item(variables) {
  try {
    var html = '';
    for (var field in variables.item) {
        if (!variables.item.hasOwnProperty(field)) { continue; }
        var value = variables.item[field];
        html +=
          '<h2>' + variables.model.fields[field].title + '</h2>' +
          '<p>' + value + '</p>';
    }
    return html;
  }
  catch (error) { console.log('theme_item - ' + error); }
}

/**
 * Implementation of theme_item_list().
 * @param {Object} variables
 * @return {String}
 */
function theme_item_list(variables) {
  try {
    // We'll theme an empty list unordered list by default, if there is a type
    // of list specified we'll use that, and if there are some items we'll
    // theme them too.
    var type = 'ul';
    if (variables.type) { type = variables.type; }
    var html = '';
    if (variables.title) { html += '<h2>' + variables.title + '</h2>'; }
    html += '<' + type + ' ' +
      drupalgap_attributes(variables.attributes) + '>';
    if (variables.items && variables.items.length > 0) {
      var listview = typeof variables.attributes['data-role'] !== 'undefined' &&
        variables.attributes['data-role'] == 'listview';
      for (var index = 0; index < variables.items.length; index++) {
        var item = variables.items[index];
        if (typeof item === 'string') {
          var icon = null;
          html += '<li';
          if (listview && (icon = $(item).attr('data-icon'))) {
            // If we're in a listview and the item specifies an icon,
            // add the icon attribute to the list item element.
            html += ' data-icon="' + icon + '"';
          }
          html += '>' + item + '</li>';
        }
        else if (typeof item === 'object') {
          var attributes = item.attributes ? item.attributes : {};
          var content = item.content ? item.content : '';
          html += '<li ' + drupalgap_attributes(attributes) + '>' + drupalgap_render(content) + '</li>';
        }
      }
    }
    html += '</' + type + '>';
    return html;
  }
  catch (error) { console.log('theme_item_list - ' + error); }
}

/**
 * Identical to theme_item_list, except this turns the list into a jQM listview.
 * @param {Object} variables
 * @return {String}
 */
function theme_jqm_item_list(variables) {
  try {
    if (variables.attributes) {
      if (
        variables.attributes['data-role'] &&
        variables.attributes['data-role'] != 'listview'
      ) { }
      else {
        variables.attributes['data-role'] = 'listview';
      }
    }
    else {
      variables.attributes['data-role'] = 'listview';
    }
    return theme_item_list(variables);
  }
  catch (error) { console.log('theme_jqm_item_list - ' + error); }
}

/**
 * Implementation of theme_link().
 * @param {Object} variables
 * @return {String}
 */
function theme_link(variables) {
  try {
    var text = '';
    if (variables.text) { text = variables.text; }
    if (typeof variables.path !== 'undefined' && variables.path != null) {

      // If the path begins with a hashtag, just render the link as is with the
      // hashtag for the href.
      if (variables.path.indexOf('#') == 0) {
        variables.attributes['href'] = variables.path;
        return '<a ' + drupalgap_attributes(variables.attributes) + '>' +
          text +
        '</a>';
      }

      // By default our onclick will use a drupalgap_goto(). If we have any
      // incoming link options, then modify the link accordingly.
      var onclick = 'drupalgap_goto(\'' + variables.path + '\');';
      if (variables.options) {

        // Use an InAppBrowser?
        if (variables.options.InAppBrowser) {
          onclick =
            "window.open('" + variables.path + "', '_blank', 'location=yes');";
        }

        else {

          // Prepare the path.
          variables.path = _drupalgap_goto_prepare_path(variables.path);

          // All other options need to be extracted into a JSON string for the
          // onclick handler.

          var goto_options = '';
          for (var option in variables.options) {
              if (!variables.options.hasOwnProperty(option)) { continue; }
              var value = variables.options[option];
              if (option == 'attributes') { continue; }
              if (typeof value === 'string') { value = "'" + value + "'"; }
              goto_options += option + ':' + value + ',';
          }
          onclick =
            'drupalgap_goto(\'' +
              variables.path + '\', ' +
              '{' + goto_options + '});';

        }
      }

      // Is this link active?
      if (variables.path == drupalgap_path_get()) {
        if (variables.attributes['class'].indexOf('ui-btn-active') == -1) {
          variables.attributes['class'] += ' ui-btn-active ';
        }
        if (variables.attributes['class'].indexOf('ui-state-persist') == -1) {
          variables.attributes['class'] += ' ui-state-persist ';
        }
      }

      // Finally, return the link.
      return '<a href="#" onclick="javascript:' + onclick + '"' +
        drupalgap_attributes(variables.attributes) + '>' + text + '</a>';

    }
    else {

      // The link has no path, so just render the text and attributes.
      if (typeof variables.attributes.href === 'undefined') {
        variables.attributes.href = '#';
      }
      return '<a ' + drupalgap_attributes(variables.attributes) + '>' +
        text +
      '</a>';

    }
  }
  catch (error) { console.log('theme_link - ' + error); }
}

/**
 * Themes the logout button.
 * @param {Object} variables
 * @return {String}
 */
function theme_logout(variables) {
  try {
    return bl(
      t('Logout'),
      'user/logout',
      {
        attributes: {
          'data-icon': 'action',
          'data-iconpos': 'right'
        }
      }
    );
  }
  catch (error) { console.log('theme_logout - ' + error); }
}

/**
 * Themes a popup widget.
 * @param {Object} variables
 * @return {String}
 */
function theme_popup(variables) {
  try {
    variables.attributes['data-role'] = 'popup';
    var button_attributes = {};
    if (variables.button_attributes) {
      button_attributes = variables.button_attributes;
    }
    button_attributes.href = '#' + variables.attributes.id;
    button_attributes['data-rel'] = 'popup';
    var html = bl(variables.button_text, null, {
        attributes: button_attributes
    }) +
    '<div ' + drupalgap_attributes(variables.attributes) + '>' +
      variables.content +
    '</div>';
    return html;
  }
  catch (error) { console.log('theme_popup - ' + error); }
}

/**
 * Implementation of theme_submit().
 * @param {Object} variables
 * @return {String}
 */
function theme_submit(variables) {
  try {
    return '<button ' + drupalgap_attributes(variables.attributes) + '>' +
      variables.element.value +
    '</button>';
  }
  catch (error) { console.log('theme_submit - ' + error); }
}

/**
 * Implementation of theme_table().
 * @param {Object} variables
 * @return {String}
 */
function theme_table(variables) {
  try {
    var html = '<table ' + drupalgap_attributes(variables.attributes) + '>';
    if (variables.header) {
      html += '<thead><tr>';
      for (var index in variables.header) {
          if (!variables.header.hasOwnProperty(index)) { continue; }
          var column = variables.header[index];
          if (column.data) {
            html += '<td>' + column.data + '</td>';
          }
      }
      html += '</tr></thead>';
    }
    html += '<tbody>';
    if (variables.rows) {
      for (var row_index in variables.rows) {
          if (!variables.rows.hasOwnProperty(row_index)) { continue; }
          var row = variables.rows[row_index];
          html += '<tr>';
          if (row) {
            for (var column_index in row) {
              if (!row.hasOwnProperty(column_index)) { continue; }
              var column = row[column_index];
              html += '<td>' + column + '</td>';
            }
          }
          html += '</tr>';
      }
    }
    return html + '</tbody></table>';
  }
  catch (error) { console.log('theme_table - ' + error); }
}

/**
 * Theme a jQueryMobile table.
 * @param {Object} variables
 * @return {String}
 */
function theme_jqm_table(variables) {
  try {
    variables.attributes['data-role'] = 'table';
    variables.attributes['data-mode'] = 'reflow';
    return theme_table(variables);
  }
  catch (error) { console.log('theme_jqm_table - ' + error); }
}

