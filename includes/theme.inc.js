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
    alert('woot tootin!');
    // Preprocess the page, then process it.
    template_preprocess_page(drupalgap.page.variables);
    template_process_page(drupalgap.page.variables);
  }
  catch (error) {
    alert('drupalgap_pagebeforeshow - ' + error);
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
 * Implementation of template_process_page().
 */
function template_process_page(variables) {
  try {
    if (drupalgap.settings.debug) {
      console.log('template_process_page()');
      console.log(JSON.stringify(arguments));
    }
    // Fill in page template variables.
    $("div[data-role$='header'] h1").html('SuperMan');
    console.log(JSON.stringify(drupalgap.page.variables));
    $.each(drupalgap.page.variables, function(variable, value){
        alert(variable + ' = ' + value);
    });
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

