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
    if (drupalgap.settings.debug && drupalgap.settings.debug_level == 2) {
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
 */
function drupalgap_get_page_id(path) {
  try {
    if (drupalgap.settings.debug) {
      console.log('drupalgap_get_page_id(' + path + ')');
    }
    var id = path.toLowerCase().replace(/\//g, '_').replace(/-/g, '_');
    if (drupalgap.settings.debug) {
      console.log(id);
    }
    return id;
  }
  catch (error) {
    alert('drupalgap_get_page_id - ' + error);
  }
}

/**
 * Returns the path to a system item (module, theme, etc.).
 */
function drupalgap_get_path(type, name) {
  try {
    if (drupalgap.settings.debug) {
      console.log('drupalgap_get_path(' + type + ', ' + name + ')');
    }
    var path = null;
    if (type == 'module') {
      var found_module = false;
      $.each(drupalgap.modules, function(bundle, modules){
          if (found_module) { return false; }
          else {
            $.each(modules, function(index, module){
                if (module.name == name) {
                  found_module = true;
                  path = 'DrupalGap';
                  if (bundle == 'core') { path += '/modules'; }
                  else if (bundle == 'contrib') { path += '/app/modules'; }
                  else if (bundle == 'custom') { path += '/app/modules/custom'; }
                  else {
                    alert('drupalgap_get_path - unknown module bundle (' + bundle + ')');
                    return false; 
                  }
                  path += '/' + name;
                  return false;
                }
            });
          }
      });
    }
    else {
      alert('drupalgap_get_path - unsupported type (' + type + ')');
    }
    return path;
  }
  catch (error) {
    alert('drupalgap_get_path - ' + error);
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
        if (drupalgap.settings.debug) {
          console.log(JSON.stringify(drupalgap.menu_links[path]));
        }
        // Set the current menu path to the path input.
        drupalgap.path = path;
        // Grab the page id.
        var page_id = drupalgap_get_page_id(path);
        // Check to see if the page already exists in the DOM.
        var pages = $("body div[data-role$='page']");
        var page_in_dom = false;
        if (pages) {
          $.each(pages, function(index, page){
              console.log(index);
              if (($(page).attr('id')) == page_id) {
                page_in_dom = true;
                return false;
              }
          });
        }
        // If the page is already in the DOM, remove it.
        if (page_in_dom) {
          $('#' + page_id).empty().remove();
        }
        // Generate a JQM page by running it through the theme then attach the
        // page to the <body> of the document, then change to the page. Remember,
        // the rendering of the page does not take place here, that is covered by
        // the pagebeforechange event which happens after we change the page here.
        var html = drupalgap_file_get_contents('DrupalGap/themes/easystreet3/page.tpl.html');
        if (html) {
          drupalgap_add_page_to_dom(page_id, html);
          $.mobile.changePage('index.html#' + page_id);
        }
        else {
          alert("drupalgap_goto - failed to load theme's page.tpl.html file");
        }
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
    // Generate the page output.
    var output = menu_execute_active_handler();
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
      // Let's define the names of variables that are reserved for theme
      // processing.
      var render_variables = ['theme', 'view_mode', 'language'];
      
      // Is there a theme value specified in the output and the registry?
      if (output.theme && eval('drupalgap.theme_registry.' + output.theme)) {
        // Extract the theme object template.
        var template = eval('drupalgap.theme_registry.' + output.theme + ';');
        console.log(JSON.stringify(template));
        // Determine template file name and path.
        var template_file_name = output.theme.replace(/_/g,'-') + '.tpl.html';
        var template_file_path = template.path + '/' + template_file_name;
        if (drupalgap_file_exists(template_file_path)) {
          var template_file_html = drupalgap_file_get_contents(template_file_path);
          if (template_file_html) {
            content += template_file_html;
          }
          else {
            alert('drupalgap_render_page - failed to get file contents (' + template_file_path + ')');
          }
        }
        else {
          alert('drupalgap_render_page - template file does not exist (' + template_file_path + ')');
        }
      }
      
      // Iterate over any other variables and theme them.
      $.each(output, function(element, variables){
          if ($.inArray(element, render_variables) == -1) {
            content += theme(variables.theme, variables);  
          }
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
    // If the region has blocks specified in it under the theme in settings.js,
    // render each block in the region.
    var region_html = '';
    if (eval('drupalgap.settings.blocks[drupalgap.settings.theme].' + region.name)) {
      region_html += '<div ' + drupalgap_attributes(region.attributes)  + '>';
      $.each(eval('drupalgap.settings.blocks[drupalgap.settings.theme].' + region.name), function(block_delta, block_settings){
          // Check the block's visibility rules.
          var show_block = true;
          // If there are any roles specified in the block settings
          if (block_settings.roles && block_settings.roles.value && block_settings.roles.value.length != 0) {
            $.each(block_settings.roles.value, function(role_index, role){
                var has_role = false;
                if (drupalgap_user_has_role(role)) {
                  // User has role, show/hide the block accordingly.
                  if (block_settings.roles.mode == 'include') { show_block = true; }
                  if (block_settings.roles.mode == 'exclude') { show_block = false; }
                }
                else {
                  // User does not have role, show/hide the block accordingly.
                  if (block_settings.roles.mode == 'include') { show_block = false; }
                  if (block_settings.roles.mode == 'exclude') { show_block = true; }
                }
            });
          }
          if (show_block) {
            var block = drupalgap_block_load(block_delta);
            if (block) {
              region_html += module_invoke(block.module, 'block_view', block_delta);
            }
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
 * Implementation of arg(index = null, path = null).
 */
function arg() {
  try {
    if (drupalgap.settings.debug && drupalgap.settings.debug_level == 2) {
      console.log('arg()');
      console.log(JSON.stringify(arguments));
    }
    var result = null;
    // If there were zero or one arguments provided.
    if (arguments.length == 0 || arguments.length == 1) {
      // Split the path into parts.
      var args = drupalgap.path.split('/');
      // If no arguments were provided just return the split array, otherwise
      // return whichever argument was requested.
      if (arguments.length == 0) { result = args; }
      else if (args[arguments[0]]) { result = args[arguments[0]]; }
    }
    else {
      // A path was provided, split it into parts, then return the split array
      // if they didn't request a specific index, otherwise return the value of
      // the specific index inside the split array.
      var path = arguments[1];
      var args = path.split('/');
      if (arguments[0] && args[arguments[0]]) { result = args[arguments[0]]; }
      else { result = args; }
    }
    return result;
  }
  catch (error) {
    alert('arg - ' + error);
  }
}

/**
 * Implemtation of l().
 */
function l() {
  try {
    if (drupalgap.settings.debug && drupalgap.settings.debug_level == 2) {
      console.log('l()');
      console.log(JSON.stringify(arguments));
    }
    var text = arguments[0];
    var path = arguments[1];
    var link = {'text':text, 'path':path};
    var options = null;
    if (arguments[2]) {
      options = arguments[2];
      if (options.attributes) { link.attributes = options.attributes; }
    }
    return theme('link', link);
  }
  catch (error) {
    alert('l - ' + error);
  }
}

