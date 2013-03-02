/**
 * This function is called by the current DrupalGap theme's page.html script
 * jQM pagebeforeshow() implementation. It preprocesses the variables for the
 * page template. (TODO - We weren't able to implement the jQM pagebeforeshow
 * in this file, instead it had to be in the <script></script> tag in the
 * page.html file of the current theme, or else the event would never fire. So
 * it was decided DrupalGap themes would have to call this function.) 
 */
function drupalgap_pagebeforeshow() {
  try {
    if (drupalgap.settings.debug) {
      console.log('drupalgap_pagebeforeshow()');
      console.log(JSON.stringify(arguments));
    }
    // Preprocess the page, then process it.
    template_preprocess_page(drupalgap.page.variables);
    template_process_page(drupalgap.page.variables);
  }
  catch (error) {
    alert('drupalgap_pagebeforeshow - ' + error);
  }
}

/**
 * Implementation of theme().
 */
function theme(hook, variables) {
  try {
    if (drupalgap.settings.debug) {
      console.log('theme()');
      console.log(JSON.stringify(arguments));
    }
    var theme_function = 'theme_' + hook;
    if (eval('typeof ' + theme_function) == 'function') {
      if (drupalgap.settings.debug) {
        console.log('theme_image()');
        console.log(JSON.stringify(variables));
      }
      var fn = window[theme_function];
      var content = fn.call(null, variables);
      if (drupalgap.settings.debug) { console.log(content); }
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
 * Implementation of theme_link().
 */
function theme_link(variables) {
  try {
    return '<a href="' + variables.path + '" ' + drupalgap_attributes(variables.attributes) + '>' +
      variables.text +
    '</a>';
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
    variables.attributes = [
      {'date-role':'page'},
      {'id':'drupalgap_dashboard'}
    ];
    
    // Call all hook_preprocess_page functions.
    drupalgap_module_invoke_all('preprocess_page');
    
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
    // Fill in page template variables...
    
    // Page title.
    if (!variables.title) {
      variables.title = drupalgap_get_title();
    }
    $("div[data-role$='header'] h1").html(variables.title);
    
    // Page content. Route the menu link path to its page callback function
    // to get the content of the current page.
    
    var page_404 = false;
    if (drupalgap.menu_links[drupalgap.path]) {
      var menu_link = drupalgap.menu_links[drupalgap.path];
      if (menu_link.page_callback) {
        var page_callback = menu_link.page_callback;
        if (eval('typeof ' + page_callback) == 'function') {
          var fn = window[page_callback];
          if (drupalgap.settings.debug) { console.log(page_callback + '()'); }
          // Render the content based on the output type.
          var content = '';
          var output = fn();
          var output_type = $.type(output); 
          if (output_type === "string") {
            if (drupalgap.settings.debug) { console.log(output); }
            // The output came back as a string, we can render it as is.
            content = output;
          }
          else if (output_type === "object") {
            if (drupalgap.settings.debug) { console.log(JSON.stringify(output)); }
            // The output came back as on object, render each element in it.
            $.each(output, function(element, variables){
                content += theme(variables.theme, variables);
            });
          }
          // Set the page content.
          $("div[data-role$='content']").html(content).trigger("create");
        }
        else {
          page_404 = true;
        }
      }
      else {
        page_404 = true;
      }
      
      
    }
    else {
      page_404 = true;
      
    }
    if (page_404) {
      alert('template_process_page - 404, oh no!');
    }
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

