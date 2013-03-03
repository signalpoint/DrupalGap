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
 * Given a path, this will change the current page in the app.
 */
function drupalgap_goto(path) {
  try {
    if (drupalgap.settings.debug) {
      console.log('drupalgap_goto()');
      console.log(JSON.stringify(arguments));
      console.log('$.mobile.activePage[0].id = ' + $.mobile.activePage[0].id);
    }
    // If the path was an empty sting, set it to the front page.
    if (path == '') {
      path = drupalgap.settings.front;
    }
    var status_code = drupalgap_page_http_status_code(path);
    switch (status_code) {
      case 200:
        // Set the current menu path to the path input.
        drupalgap.path = path;
        if (drupalgap.settings.debug) {
          console.log(JSON.stringify(drupalgap.menu_links[path]));
        }
        // Now use jQM to change the page. If this is the first page load,
        // we need to change the page directly to the theme's page.tpl.html,
        // otherwise all subsequent goto's just need a forced pagebeforeshow
        // event to be triggered.
        if ($.mobile.activePage[0].id == '') {
          // First time.
          $.mobile.changePage("DrupalGap/themes/easystreet/page.tpl.html");
        }
        else {
          // All other times.
          // Force the pagebeforeshow event.
          drupalgap_pagebeforeshow();
        }
        break;
      default:
        alert('drupalgap_goto(' + path + ') => (' + status_code + ')');
        break;
    }
    
    /*if (path && drupalgap.menu_links[path]) {
      
			
      var menu_link = drupalgap.menu_links[path];
      var page_callback = menu_link['page callback']
      if (eval('typeof ' + page_callback) == 'function') {
        var fn = window[page_callback];
        fn();
      }
    }*/
  }
  catch (error) {
    alert('drupalgap_goto - ' + error);
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
    // Extract the menu link path, page callback function and any page arguments,
    // then call the page callback function with any args and hold on to the
    // rendered output.
    var menu_link = drupalgap.menu_links[page.path];
    var page_callback = menu_link.page_callback;
    var fn = window[page_callback];
    if (drupalgap.settings.debug) { console.log(page_callback + '()'); }
    var output = '';
    if (menu_link.page_arguments) {
      output = fn.apply(null, Array.prototype.slice.call(menu_link.page_arguments));
      //output = fn.call(null, menu_link.page_arguments);
    }
    else {
      output = fn();
    }
    
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


