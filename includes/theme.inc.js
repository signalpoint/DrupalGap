/**
 *
 */
$(document).bind( "pagebeforechange", function( e, data ) {
    try {
      if (drupalgap.settings.debug) {
        console.log('pagebeforechange()');
      }
      if ( typeof data.toPage === "string" ) {
        //alert('pagebeforechange: ' + $.mobile.path.parseUrl(data.toPage).hash);
      }
      // Preprocess the page, then process it.
      /*template_preprocess_page(drupalgap.page.variables);
      template_process_page(drupalgap.page.variables);
      e.preventDefault();*/
    }
    catch (error) {
      alert('pagebeforechange - ' + error);
    }
});

/**
 * This function is called by the jQM pagebeforeshow() implementation inside the
 * page.tpl.html file of the current DrupalGap theme. It preprocesses the variables
 * for the page template. (TODO - We weren't able to implement the jQM pagebeforeshow
 * in this file, instead it had to be in the <script></script> tag in the
 * page.tpl.html file of the current theme, or else the event would never fire. So
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
 * Implementation of theme_link().
 */
function theme_link(variables) {
  try {
    return '<a ' + 
      'onclick="javascript:drupalgap_goto(\'' + variables.path + '\');" ' +
      drupalgap_attributes(variables.attributes) +
    '>' + variables.text + '</a>';
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
    // Set the page content to the output.
    var content = drupalgap_render_page({'path':drupalgap.path});
    $("div[data-role$='content']").html(content).trigger("create");
    //$("div[data-role$='content']").html(content);
    //$("#" + drupalgap_get_page_id(drupalgap.path) + "div[data-role$='content']").html(content).trigger("create");
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

