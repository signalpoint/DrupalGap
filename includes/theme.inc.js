/**
 * Each time we use drupalgap_goto to change a page, this function is called on
 * the pagebeforehange event. It preproccesses the page, then processes it.
 */
$(document).bind("pagebeforechange", function(e, data) {
    try {
      if (drupalgap.settings.debug) {
        console.log('pagebeforechange()');
      }
      if (typeof data.toPage === "string") {
        template_preprocess_page(drupalgap.page.variables);
        template_process_page(drupalgap.page.variables);
      }
      if (drupalgap.settings.debug) {
        // TODO - Is this log message getting hit twice on one page change?
        // If so, that's no bueno!
        console.log('pagebeforechange() - processed page');
      }
    }
    catch (error) {
      alert('pagebeforechange - ' + error);
    }
});

/**
 * Returns the path to the current DrupalGap theme, false otherwise.
 */
function path_to_theme() {
  try {
    if (drupalgap.settings.debug) {
      console.log('path_to_theme()');
    }
    if (drupalgap.theme_path) {
      return drupalgap.theme_path;
    }
    else {
      alert('path_to_theme - drupalgap.theme_path is not set!');
      return false;
    }
  }
  catch (error) {
    alert('path_to_theme - ' + error);
  }
}

/**
 * Implementation of theme().
 */
function theme(hook, variables) {
  try {
    if (drupalgap.settings.debug && drupalgap.settings.debug_level == 2) {
      console.log('theme()');
      console.log(JSON.stringify(arguments));
    }
    // If there is HTML markup present, just return it as is. Otherwise, run
    // the theme hook and send along the variables.
    if (variables.markup) {
      return variables.markup;
    }
    var theme_function = 'theme_' + hook;
    if (eval('typeof ' + theme_function) == 'function') {
      // If no attributes are coming in, look to variables.options.attributes
      // as a secondary option, otherwise setup an empty JSON object for them.
      if (typeof variables.attributes === "undefined") {
        if (variables.options && variables.options.attributes) {
          variables.attributes = variables.options.attributes;
        }
        else {
          variables.attributes = {};
        }
      }
      if (drupalgap.settings.debug && drupalgap.settings.debug_level == 2) {
        console.log(theme_function + '()');
        console.log(JSON.stringify(variables));
      }
      var fn = window[theme_function];
      var content = fn.call(null, variables);
      if (drupalgap.settings.debug && drupalgap.settings.debug_level == 2) { console.log(content); }
      return content;
    }
    else {
      console.log('WARNING: ' + theme_function + '() does not exist');
    }
  }
  catch (error) {
    alert('theme - ' + error);
  }
}

/**
 * Themes a button.
 */
function theme_button(variables) {
  try {
    variables.attributes['data-role'] = 'button';
    var html = '<a ' + drupalgap_attributes(variables.attributes) + '>' + variables.text + '</a>';
    return html;
  }
  catch (error) {
    alert('theme_button_link - ' + error);
  }
}

/**
 * Themes a button link.
 */
function theme_button_link(variables) {
  try {
    variables.attributes['data-role'] = 'button';
    return theme_link(variables);
  }
  catch (error) {
    alert('theme_button_link - ' + error);
  }
}


/**
 * Implementation of theme_image().
 */
function theme_image(variables) {
  try {
    // Turn the path, alt and title into attributes if they are present.
    if (variables.path) { variables.attributes.src = variables.path; }
    if (variables.alt) { variables.attributes.alt = variables.alt; }
    if (variables.title) { variables.attributes.title = variables.title; }
    // Make sure the image width doesn't exceed the device's width.
    if (!variables.attributes.style) { variables.attributes.style = ''; }
    variables.attributes.style += ' max-width: ' + $(document).width() + 'px; ';
    // Render the image.
    return '<img ' + drupalgap_attributes(variables.attributes) + ' />';
    //return '<img src="' + drupalgap_image_path(variables.path)  + '" />';
  }
  catch (error) {
    alert('theme_image - ' + error);
  }
}

/**
 * Implementation of theme_item_list().
 */

function theme_item_list(variables) {
  try {
    // We'll theme an empty list unordered list by default, if there is a type
    // of list specified we'll use that, and if there are some items we'll
    // theme them too.
    var type = 'ul';
    if (variables.type) { type = variables.type; }
    var html = '<' + type + ' ' + drupalgap_attributes(variables.attributes) + '>';
    if (variables.items && variables.items.length > 0) {
      $.each(variables.items, function(index, item){
          html += '<li>' + item + '</li>';
      });
    }
    html += '</' + type + '>';
    return html;
  }
  catch (error) {
    alert('theme_item_list - ' + error);
  }
}

/**
 * Identical to theme_item_list, except this turns the list into a jQM listview.
 */
function theme_jqm_item_list(variables) {
  try {
    if (variables.attributes) {
      if (variables.attributes['data-role'] && variables.attributes['data-role'] != 'listview') {
      }
      else {
        variables.attributes['data-role'] = 'listview';
      }
    }
    else {
      variables.attributes['data-role'] = 'listview';
    }
    return theme_item_list(variables);
  }
  catch (error) {
    alert('theme_jqm_item_list - ' + error);
  }
}

/**
 * Implementation of theme_link().
 */
function theme_link(variables) {
  try {
    var html = '<a ' + 
      'onclick="javascript:drupalgap_goto(\'' + variables.path + '\');" ' +
      drupalgap_attributes(variables.attributes) +
    '>' + variables.text + '</a>';
    return html;
  }
  catch (error) {
    alert('theme_link - ' + error);
  }
}

/**
 * Implementation of template_preprocess_page().
 */
function template_preprocess_page(variables) {
  try {
    if (drupalgap.settings.debug) {
      console.log('template_preprocess_page()');
      console.log(JSON.stringify(variables));
    }
    // Set up default attribute's for the page's div container.
    if (typeof variables.attributes === 'undefined') { variables.attributes = {}; }
    // TODO - is this needed?
    variables.attributes['data-role'] = 'page';
    
    // Call all hook_preprocess_page functions.
    module_invoke_all('preprocess_page');
    
    // Place the variables into drupalgap.page
    drupalgap.page.variables = variables;
    
    if (drupalgap.settings.debug) {
      console.log(JSON.stringify(drupalgap.page));
    }
  }
  catch (error) {
    alert('template_preprocess_page - ' + error);
  }
}

/**
 * Implementation of template_process_page(). The current page will have its
 * placeholders filled with the incoming variables. Default variables:
 *
 *   title - the current page title
 */
function template_process_page(variables) {
  try {
    if (drupalgap.settings.debug) {
      console.log('template_process_page()');
      console.log(JSON.stringify(arguments));
      console.log(drupalgap.path);
      console.log(JSON.stringify(drupalgap.menu_links[drupalgap.path]));
    }
    // For each region, render it, then replace the placeholder in the page's
    // html with the rendered region.
    var page_id = drupalgap_get_page_id(drupalgap.path);
    $.each(drupalgap.theme.regions, function(index, region){
        if (drupalgap.settings.debug) {
          console.log('template_process_page - rendering region (' + region.name + ') for page id (' + page_id + ')');
        }
        var page_html = $("#" + page_id).html();
        eval('page_html = page_html.replace(/{:' + region.name + ':}/g, drupalgap_render_region(region));');
        $("#" + page_id).html(page_html);
        if (drupalgap.settings.debug) {
          console.log('template_process_page - rendered region (' + region.name + ') for page id (' + page_id + ')');
        }
    });
  }
  catch (error) {
    alert('template_process_page - ' + error);
  }
}

