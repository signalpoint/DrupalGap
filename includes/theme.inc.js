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
    }
    catch (error) {
      alert('pagebeforechange - ' + error);
    }
});

/**
 * Implementation of theme().
 */
function theme(hook, variables) {
  try {
    if (drupalgap.settings.debug && drupalgap.settings.debug_level == 2) {
      console.log('theme()');
      console.log(JSON.stringify(arguments));
    }
    var theme_function = 'theme_' + hook;
    if (eval('typeof ' + theme_function) == 'function') {
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
      return '<div>' + theme_function + '() does not exist</div>';
    }
  }
  catch (error) {
    alert('theme - ' + error);
  }
}

/**
 *
 */
function theme_button_link(variables) {
  try {
    variables.attributes = {'data-role':'button'};
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
    return '<img src="' + drupalgap_image_path(variables.path)  + '" />';
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
    var html = '';
    if (variables.items) {
      html += '<ul ' + drupalgap_attributes(variables.attributes) + '>';
      $.each(variables.items, function(index, item){
          html += '<li>' + item + '</li>';
      });
      html += '</ul>';
    }
    return html;
  }
  catch (error) {
    alert('theme_item_list - ' + error);
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
    // TODO - this probably isn't needed... at least the dashboard id, that for
    // sure isn't needed.
    variables.attributes = [
      {'date-role':'page'},
      {'id':'drupalgap_dashboard'}
    ];
    
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
    $.each(drupalgap.theme.regions, function(index, region){
        var page_html = $("#" + drupalgap_get_page_id(drupalgap.path)).html();
        eval('page_html = page_html.replace(/:' + region.name + '/g, drupalgap_render_region(region));');
        $("#" + drupalgap_get_page_id(drupalgap.path)).html(page_html);
        if (drupalgap.settings.debug) {
          console.log(page_html);
        }
    });
    /*
    // Fill in page template variables...
    // Page title.
    if (!variables.title) {
      variables.title = drupalgap_get_title();
    }
    $("#" + drupalgap_get_page_id(drupalgap.path) + " div[data-role$='header']").html(variables.title);
    // Set the page content to the output.
    var content = drupalgap_render_page({'path':drupalgap.path});
    $("#" + drupalgap_get_page_id(drupalgap.path) + " div[data-role$='content']").html(content).trigger("create");
    */
  }
  catch (error) {
    alert('template_process_page - ' + error);
  }
}


/**
 * Implementation of template_preprocess().
 */
/*function template_preprocess() {
  
}*/

/**
 * TODO - undecided if this is needed because the contents of index.html
  (which is the equivalent of html.tpl.php in Drupal) doesn't need that
  level of flexibility at this time. Perhaps in the future though?
 */ 
/*function template_preprocess_html() {
  // 
}*/

