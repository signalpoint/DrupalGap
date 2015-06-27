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
 * Implementation of theme_item_list().
 * @param {Object} variables
 * @return {String}
 */
function theme_item_list(variables) {
  try {
    dpm('theme_item_list');
    console.log(variables);
    // We'll theme an empty list unordered list by default, if there is a type
    // of list specified we'll use that, and if there are some items we'll
    // theme them too.
    var type = 'ul';
    if (variables.type) { type = variables.type; }
    var html = '';
    if (variables.title) { html += '<h2>' + variables.title + '</h2>'; }
    html += '<' + type + ' ' +
      dg_attributes(variables.attributes) + '>';
    if (variables.items && variables.items.length > 0) {
      var listview = typeof variables.attributes['data-role'] !== 'undefined' &&
        variables.attributes['data-role'] == 'listview';
      for (var index in variables.items) {
          if (!variables.items.hasOwnProperty(index)) { continue; }
          var item = variables.items[index];
          var icon = null;
          html += '<li';
          if (listview && (icon = $(item).attr('data-icon'))) {
            // If we're in a listview and the item specifies an icon,
            // add the icon attribute to the list item element.
            html += ' data-icon="' + icon + '"';
          }
          html += '>' + item + '</li>';
      }
    }
    html += '</' + type + '>';
    return html;
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
        if (variables.attributes['class'].indexOf('ui-btn-active') == -1) {
          variables.attributes['class'] += ' ui-btn-active ';
        }
        if (variables.attributes['class'].indexOf('ui-state-persist') == -1) {
          variables.attributes['class'] += ' ui-state-persist ';
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

