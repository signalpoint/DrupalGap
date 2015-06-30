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
    if (variables.markup) { return variables.markup; }
    var content = '';

    // First see if the current theme implements the hook, if it does use it, if
    // it doesn't fallback to the core theme implementation of the hook.
    var theme_function = drupalgap.settings.theme + '_' + hook;
    if (!function_exists(theme_function)) {
      theme_function = 'theme_' + hook;
      if (!function_exists(theme_function)) {
        var caller = null;
        if (arguments.callee.caller) {
          caller = arguments.callee.caller.name;
        }
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
    
    // Attributes are coming in, if there are any in options.attributes,
    // merge them into variables.attributes.
    else if (variables.options && variables.options.attributes) {
      // @TODO update to angular 1.4 to get the merge function
      //variables.attributes = merge(variables.attributes, variables.options.attributes);
      variables.attributes = angular.extend({}, variables.attributes, variables.options.attributes);
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
    // Render the video player.
    return '<video controls ' + drupalgap_attributes(variables.attributes) +
    '></video>';
  }
  catch (error) { console.log('theme_video - ' + error); }
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

