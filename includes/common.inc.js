/**
 * Converts a JSON object to an XML/HTML tag attribute string and returns the
 * string.
 */
function drupalgap_attributes(attributes) {
  try {
    if (drupalgap.settings.debug) {
      console.log('drupalgap_attributes()');
      console.log(JSON.stringify(arguments));
    }
    var attribute_string = '';
    $.each(attributes, function(name, value){
        attribute_string += name + '="' + value + '" ';
    });
    return attribute_string;
  }
  catch (error) {
    alert('drupalgap_attributes - ' + error);
  }
}


/**
 *
 */
/*function l() {
  try {
    if (drupalgap.settings.debug) {
      console.log('l()');
      console.log(JSON.stringify(arguments));
    }
  }
  catch (error) {
    alert('l - ' + error);
  }
}*/

/**
 * Given a page assembled by template_process_page(), this renders the html
 * string of the page content and returns the html string.
 */
function drupalgap_render_page(page) {
  try {
    if (drupalgap.settings.debug) {
      console.log('drupalgap_render_page()');
      console.log(JSON.stringify(arguments));
    }
    // Extract the menu link path and page callback function.
    var menu_link = drupalgap.menu_links[page.path];
    var page_callback = menu_link.page_callback;
    var fn = window[page_callback];
    if (drupalgap.settings.debug) { console.log(page_callback + '()'); }
    // Retrieve the output.
    var output = fn();
    // Render the content based on the output type.
    var content = '';
    // What type of output did we end up with? Plain html or a render object?
    var output_type = $.type(output);
    // If the output came back as a string, we can render it as is.
    if (output_type === "string") {
      if (drupalgap.settings.debug) { console.log(output); }
      content = output;
    }
    // If the output came back as on object, render each element in it through
    // the theme system.
    else if (output_type === "object") {
      if (drupalgap.settings.debug) { console.log(JSON.stringify(output)); }
      $.each(output, function(element, variables){
          content += theme(variables.theme, variables);
      });
    }
    return content;
  }
  catch (error) {
    alert('drupalgap_render_page - ' + error);
  }
}


