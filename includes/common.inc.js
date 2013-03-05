/**
 * Given a page id, and the theme's page.tpl.html string, this takes the page
 * template html and adds it to the DOM. It doesn't actually render the page,
 * that is taken care of by pagebeforechange when it calls the template system.
 */
function drupalgap_add_page_to_dom(page_id, html) {
  try {
    if (drupalgap.settings.debug) {
      console.log('drupalgap_add_page_to_dom()');
      console.log(JSON.stringify(arguments));
    }
    // Set the page id and add the page to the dom body.
    html = html.replace(/:drupalgap_page_id/g, page_id);
    $('body').append(html);
  }
  catch (error) {
    alert('drupalgap_add_page_to_dom - ' + error);
  }
}


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
    if (attributes) {
      $.each(attributes, function(name, value){
          attribute_string += name + '="' + value + '" ';
      });
    }
    return attribute_string;
  }
  catch (error) {
    alert('drupalgap_attributes - ' + error);
  }
}

/**
 * Given a path, this will return the id for the page's div element.
 * For example, a string path of 'foo/bar' would result in an id of 'foo_bar'.
 * <div id="foo_bar"></div>
 */
function drupalgap_get_page_id(path) {
  try {
    if (drupalgap.settings.debug) {
      console.log('drupalgap_get_page_id(' + path + ')');
      console.log(JSON.stringify(arguments));
    }
    var id = path.toLowerCase().replace(/\//g, '_');
    return id.replace(/-/g, '_');
  }
  catch (error) {
    alert('drupalgap_get_page_id - ' + error);
  }
}


/**
 * Given a path, this will change the current page in the app.
 */
function drupalgap_goto(path) {
  try {
    if (drupalgap.settings.debug) {
      console.log('drupalgap_goto(' + path + ')');
      console.log('$.mobile.activePage[0].id = ' + $.mobile.activePage[0].id);
      $.each($.mobile.activePage, function(index, object){
          console.log(index);
          console.log(object);
      }); 
    }
    // If the path was an empty sting, set it to the front page.
    if (path == '') { path = drupalgap.settings.front; }
    
    // Is this a jQM path?
    if (path.indexOf('#') == 0) {
      // We'll just let internal jQM paths go through... for now...?
      $.mobile.changePage(path, {reloadPage:true});
      return false;
    }
    
    // Determine the http status code and then route the user accordingly.
    var status_code = drupalgap_page_http_status_code(path);
    switch (status_code) {
      case 200:
        // Set the current menu path to the path input.
        drupalgap.path = path;
        if (drupalgap.settings.debug) {
          console.log(JSON.stringify(drupalgap.menu_links[path]));
        }
        // Generate a JQM page by running it through the theme then attach the
        // page to the <body> of the document, then change to the page.
        jQuery.ajax({
          type:'GET',
          url:'DrupalGap/themes/easystreet3/page.tpl.html',
          dataType:'html',
          data:null,
          async:false,
          success:function(html){
            // Now that we've grabbed the theme's page.tpl.html, let's assemble
            // the page
            var page_id = drupalgap_get_page_id(path);
            drupalgap_add_page_to_dom(page_id, html);
            $.mobile.changePage('index.html#' + page_id);
          },
          error: function(xhr, textStatus, errorThrown) {
            navigator.notification.alert(
              'Failed to load the page.tpl.html file!',
              function(){},
              'Error',
              'OK'
            );
          }
        });
        break;
      default:
        alert('drupalgap_goto(' + path + ') => (' + status_code + ')');
        break;
    }
  }
  catch (error) {
    alert('drupalgap_goto - ' + error);
  }
}

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

/**
 * Given a region, this renders it and all the blocks in it. The blocks are
 * specified in the settings.js file, they are bundled under a region, which in
 * turn is bundled under a theme name.
 */
function drupalgap_render_region(region) {
  try {
    if (drupalgap.settings.debug) {
      console.log('drupalgap_render_region(' + region.name + ')');
      console.log(JSON.stringify(arguments));
    }
    // If the region has blocks specified in it under the theme in settins.js,
    // render each block in the region.
    var region_html = '';
    if (drupalgap.settings.blocks[drupalgap.settings.theme][region.name]) {
      region_html += '<div ' + drupalgap_attributes(region.attributes)  + '>';
      $.each(drupalgap.settings.blocks[drupalgap.settings.theme][region.name], function(block_index, block_delta){
          var block = drupalgap_block_load(block_delta);
          if (block) {
            region_html += drupalgap_module_invoke(block.module, 'block_view', block_delta);
          }
      });
      region_html += '</div><!-- ' + region.name + ' -->';
    }
    return region_html;
  }
  catch (error) {
    alert('drupalgap_render_region - ' + error);
  }
}

/**
 * Implemtation of l().
 */
function l() {
  try {
    if (drupalgap.settings.debug) {
      console.log('l()');
      console.log(JSON.stringify(arguments));
    }
    var text = arguments[0];
    var path = arguments[1];
    return theme('link', {'text':text, 'path':path});
  }
  catch (error) {
    alert('l - ' + error);
  }
}

