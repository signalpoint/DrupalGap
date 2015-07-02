/**
 * Implementation of theme().
 * @param {String} hook
 * @param {Object} variables
 * @return {String}
 */
function theme(hook, variables) {
  try {
    
    //dpm('theme(' + hook + ')');
    //console.log(variables);
    
    // If there is HTML markup present, just return it as is. Otherwise, run
    // the theme hook and send along the variables.
    if (!variables) { variables = {}; }
    if (variables.markup) { return variables.markup; }
    var content = '';
    
    // Determine the theme function and verify its existence.
    var theme_function = 'theme_' + hook;
    if (!dg_function_exists(theme_function)) {
      console.log(theme_function + '() is missing!');
      return '';
    }
    
    // @TODO check for modules implementing the theme hook.
    
    // @TODO check for the current theme implementing the theme hook.
    
    if (typeof variables.attributes === 'undefined') {
      variables.attributes = {};
    }
    // If there is no class name, set an empty one.
    if (!variables.attributes['class']) { variables.attributes['class'] = ''; }
    
    if (!window[theme_function]) { return ''; }
    var fn = window[theme_function];
    content = fn.call(null, variables);
    return content;
    
  }
  catch (error) { console.log('theme - ' + error); }
}

/**
 * Themes a fieldset widget.
 * @param {Object} variables
 * @return {String}
 */
function theme_fieldset(variables) {
  try {
    var title = typeof variables.title !== 'undefined' ?
      variables.title : null;
    var description = typeof variables.description !== 'undefined' ?
      variables.description : null;
    var children = typeof variables.children !== 'undefined' ?
      variables.children : null;
    var html = '<fieldset ' + dg_attributes(variables.attributes) + '>';
    if (title) { html += '<legend><span class="fieldset-legend">' + title + '</span></legend>'; }
    html += '<div class="fieldset-wrapper">';
    if (description) { html += '<div class="fieldset-description">' + description + '</div>'; }
    if (children) { html += dg_render(children); }
    return html + '</div></fieldset>';
  }
  catch (error) { console.log('theme_fieldset - ' + error); }
}

/**
 * Themes a header widget.
 * @param {Object} variables
 * @return {String}
 */
function theme_header(variables) {
  try {
    var type = typeof variables.type !== 'undefined' ?
      variables.type : 'h1';
    var text = typeof variables.text !== 'undefined' ?
      variables.text : '';
    var html = '<' + type + ' ' + dg_attributes(variables.attributes) + '>' +
      text +
    '</' + type + '>';
    return html;
  }
  catch (error) { console.log('theme_header - ' + error); }
}

/**
 * Implementation of theme_item_list().
 * @param {Object} variables
 * @return {String}
 */
function theme_item_list(variables) {
  try {
    //dpm('theme_item_list');
    //console.log(variables);


    var items = variables['items'];
    var title = variables['title'];
    var type = typeof variables['type'] !== 'undefined' ?
      variables['type'] : 'ul';
    var attributes = variables['attributes'];

    // Only output the list container and title, if there are any list items.
    // Check to see whether the block title exists before adding a header.
    // Empty headers are not semantic and present accessibility challenges.
    var output = '<div class="item-list">';
    if (title && title != '') {
      output += '<h3>' + title + '</h3>';
    }

    if (!dg_empty(items)) {
      output += '<' + type + ' ' + dg_attributes(attributes) + '>';
      var num_items = items.length;
      var i = 0;
      for (var delta in items) {
        if (!items.hasOwnProperty(delta)) { continue; }
        var item = items[delta];
        attributes = {
          'class': '' // @TODO need to support arrays!
        };
        var children = [];
        var data = '';
        i++;
        if ($.type(item) !== 'string') { // @TODO jQuery dependency here!
          for (var key in item) {
            if (!item.hasOwnProperty(key)) { continue; }
            var value = item[key];
            if (key == 'data') {
              data = value;
            }
            else if (key == 'children') {
              children = value;
            }
            else {
              attributes[key] = value;
            }
          }
        }
        else {
          data = item;
        }
        if (children.length > 0) {
          // Render nested list.
          data += theme_item_list({
            items: children,
            title: null,
            type: type,
            attributes: attributes
          });
        }
        if (i == 1) {
          //attributes ['class'][] = 'first';
          attributes['class'] += ' first ';
        }
        if (i == num_items) {
          //attributes ['class'][] = 'last';
          attributes ['class'] += ' last ';
        }
        output += '<li ' + dg_attributes(attributes) + '>' + data + "</li>\n";
      }
      output += '</' + type + '>';
    }
    output += '</div>';
    return output;
  }
  catch (error) { console.log('theme_item_list - ' + error); }
}

/**
 * Implementation of theme_link().
 * @param {Object} variables
 * @return {String}
 */
function theme_link(variables) {
  try {
    //dpm('theme_link');
    //console.log(variables);
    var text = '';
    if (variables.text) { text = variables.text; }
    else if (variables.title) { text = variables.title; }
    if (typeof variables.path !== 'undefined' && variables.path != null) {

      // If the path begins with a hashtag, just render the link as is with the
      // hashtag for the href.
      /*if (variables.path.indexOf('#') == 0) {
        variables.attributes['href'] = variables.path;
        return '<a ' + dg_attributes(variables.attributes) + '>' +
          text +
        '</a>';
      }*/

      // By default our onclick will use a drupalgap_goto(). If we have any
      // incoming link options, then modify the link accordingly.
      if (variables.options) {

        // Use an InAppBrowser?
        if (variables.options.InAppBrowser) {
          variables.attributes['onclick'] =
            "javascript:window.open('" + variables.path + "', '_blank', 'location=yes');";
        }

        else {

          // Prepare the path.
          /*variables.path = _drupalgap_goto_prepare_path(variables.path);

          if (typeof variables.attributes['href'] === 'undefined') {
            variables.attributes['href'] = '#/' + variables.path;
          }*/

          // All other options need to be extracted into a JSON string for the
          // onclick handler.

          /*var goto_options = '';
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
              '{' + goto_options + '});';*/

        }
      }
      else {
        
        // No link options are coming in...
        
        
        
      }
      
      if (typeof variables.attributes['href'] === 'undefined') {
        variables.attributes['href'] = '#/' + variables.path;
      }

      // Is this link active?
      if (variables.path == dg_path_get()) {
        if (variables.attributes['class'].indexOf('active') == -1) {
          variables.attributes['class'] += ' active ';
        }
      }

      // Finally, return the link.
      return '<a ' + dg_attributes(variables.attributes) + '>' + text + '</a>';

    }
    else {

      // The link has no path, so just render the text and attributes.
      if (typeof variables.attributes.href === 'undefined') {
        variables.attributes.href = '#';
      }
      return '<a ' + dg_attributes(variables.attributes) + '>' +
        text +
      '</a>';

    }
  }
  catch (error) { console.log('theme_link - ' + error); }
}

/**
 * Implementation of theme_table().
 * @param {Object} variables
 * @return {String}
 */
function theme_table(variables) {
  try {
    var html = '<table ' + dg_attributes(variables.attributes) + '>';
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
