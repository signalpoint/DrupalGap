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
    html = html.replace(/{:drupalgap_page_id:}/g, page_id);
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
          // TODO - if someone passes in a value with double quotes, this will
          // break. e.g. 'onclick':'_drupalgap_form_submit("' + form.id + "');'
          // will break, but 'onclick':'_drupalgap_form_submit(\'' + form.id + '\');'
          // will work.
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
 * Used by drupalgap_render_region to check the visibility settings on region
 * links and blocks. Just like Drupal Blocks, this function checks the visibility
 * rules specified by role or pages specified in data. Returns true by default,
 * otherwise it will return true or false depending on the first visibility
 * setting present in data.
 */
function drupalgap_check_visibility(type, data) {
  try {
    var visible = true;
    // Roles.
    if (data.roles && data.roles.value && data.roles.value.length != 0) {
      $.each(data.roles.value, function(role_index, role){
          var has_role = false;
          if (drupalgap_user_has_role(role)) {
            // User has role, show/hide the block accordingly.
            if (data.roles.mode == 'include') { visible = true; }
            if (data.roles.mode == 'exclude') { visible = false; }
          }
          else {
            // User does not have role, show/hide the block accordingly.
            if (data.roles.mode == 'include') { visible = false; }
            if (data.roles.mode == 'exclude') { visible = true; }
          }
          // Break out of the loop.
          return false;
      });
    }
    // Pages.
    else if (data.pages && data.pages.value && data.pages.value.length != 0) {
      $.each(data.pages.value, function(page_index, path){
          if (path == drupalgap.path) {
            if (data.pages.mode == 'include') { visible = true; }
            else if (data.pages.mode == 'exclude') { visible = false; }
          }
          else {
            if (data.pages.mode == 'include') { visible = false; }
            else if (data.pages.mode == 'exclude') { visible = true; }
          }
          // Break out of the loop.
          return false;
      });
    }
    return visible;
  }
  catch (error) {
    alert('drupalgap_check_visibility - ' + error);
  }
}


/**
 * Returns the current page path as a string.
 */
function drupalgap_get_current_path() {
  try {
    var path = '';
    var args = arg();
    if (args) {
      path = args.join('/');
    }
    return path;
  }
  catch (error) {
    alert('drupalgap_get_current_path - ' + error);
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
                  path = '';
                  if (bundle == 'core') { path += 'modules'; }
                  else if (bundle == 'contrib') { path += 'app/modules'; }
                  else if (bundle == 'custom') { path += 'app/modules/custom'; }
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
    }
    
    // Extract any incoming options, and set any defaults that weren't provided.
    var options = false;
    if (arguments[1]) {
      options = arguments[1];
      if (!options.form_submission) {
        options.form_submission = true;
      }
    }
    
    // Prepare the path.
    path = drupalgap_goto_prepare_path(path);
    
    // Return if we are trying to go to the path we are already on, unless this
    // was a form submission, then we'll let the page rebuild itself
    if (drupalgap.path == path && !options.form_submission) {
      return false;
    }
    
    // Is this a jQM path?
    if (path.indexOf('#') == 0) {
      // TODO - We'll just let internal jQM paths go through... for now...?
                // UPDATE - do we even deal with jQM paths anymore? Or I we only
                // using DrupalGap paths. Weight the pros and cons.
      $.mobile.changePage(path, {reloadPage:true});
      return false;
    }
    
    // Set the current menu path to the path input.
    drupalgap.path = path;

    // Grab the page id.
    var page_id = drupalgap_get_page_id(path);

    // If the page is already in the DOM, remove it.
    if (drupalgap_page_in_dom(page_id) && !options.form_submission) {
      $('#' + page_id).empty().remove();
    }

    // Generate the page.
    drupalgap_goto_generate_page_and_go(path, page_id, options);
    
  }
  catch (error) {
    alert('drupalgap_goto - ' + error);
  }
}

/**
 * Generate a JQM page by running it through the theme then attach the
 * page to the <body> of the document, then change to the page. Remember,
 * the rendering of the page does not take place here, that is covered by
 * the pagebeforechange event in theme.inc.js which happens after we change
 * the page here.
 */
function drupalgap_goto_generate_page_and_go(path, page_id, options) {
  try {
    var page_template_path = path_to_theme() + '/page.tpl.html';
    if (!drupalgap_file_exists(page_template_path)) {
      alert('drupalgap_goto_generate_page_and_go - page template does not exist! (' + page_template_path + ')');
    }
    else {
      var html = drupalgap_file_get_contents(page_template_path);
      if (html) {
        // Add page to DOM.
        drupalgap_add_page_to_dom(page_id, html);
        // Setup change page options if necessary.
        var changePageOptions = {};
        if (drupalgap.path == path && options.form_submission) {
          changePageOptions.allowSamePageTransition = true;
        }
        // The Ripple emulator seems to not like the 'index.html' prefix
        if (typeof parent.window.ripple === 'function') {
          $.mobile.changePage('#' + page_id, changePageOptions);
        }
        else {
          $.mobile.changePage('index.html#' + page_id, changePageOptions);
        }
      }
      else {
        alert("drupalgap_goto_generate_page_and_go - failed to load theme's page.tpl.html file");
      }
    }
  }
  catch (error) {
    alert('drupalgap_goto_generate_page_and_go - ' + error);
  }
}

/**
 * Given a path, this function will do any necessary conversions to the path so
 * it is better understood by the menu system. For example, a path of "" in
 * Drupal is used to represent the front page, so this function would turn the
 * "" value into the App's actual front page (drupalgap.settings.front) path
 * value so the menu system routes it correctly.
 */
function drupalgap_goto_prepare_path(path) {
  try {
    // If the path was an empty sting, set it to the front page.
    if (path == '') { path = drupalgap.settings.front; }  
    // If the path is to 'user', and the user is logged in, let's set the path
    // to 'user/[uid]' so the router path can be determined properly.
    else if (path == 'user' && drupalgap.user.uid != 0) {
      path = 'user/' + drupalgap.user.uid;
    }
    return path;
  }
  catch(error) {
    alert('drupalgap_goto_prepare_path - ' + error);
  }
}

/**
 * Returns true if the given page id's page div already exists in the DOM.
 */
function drupalgap_page_in_dom(page_id) {
  try {
    var pages = $("body div[data-role$='page']");
    var page_in_dom = false;
    if (pages && pages.length > 0) {
      $.each(pages, function(index, page){
          if (($(page).attr('id')) == page_id) {
            page_in_dom = true;
            return false;
          }
      });
    }
    return page_in_dom;
  }
  catch (error) {
    alert('drupalgap_page_in_dom - ' + error);
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
    // Generate the page output and render the content based on the output type.
    // The output type will either be an html string or a drupalgap render object.
    var output = menu_execute_active_handler();
    var output_type = $.type(output);
    var content = '';
    
    // If the output came back as a string, we can render it as is. If the
    // output came back as on object, render each element in it through the
    // theme system.
    if (output_type === "string") {
      // The page came back as an html string.
      content = output;
    }
    else if (output_type === "object") {
      
      // The page came back as a render object. Let's define the names of
      // variables that are reserved for theme processing.
      var render_variables = ['theme', 'view_mode', 'language'];
      
      // Is there a theme value specified in the output and the registry?
      if (output.theme && eval('drupalgap.theme_registry.' + output.theme)) {
        
        // Extract the theme object template and determine the template file
        // name and path.
        var template = eval('drupalgap.theme_registry.' + output.theme + ';');
        var template_file_name = output.theme.replace(/_/g,'-') + '.tpl.html';
        var template_file_path = template.path + '/' + template_file_name;
        
        // Make sure the template file exists.
        if (drupalgap_file_exists(template_file_path)) {
          
          // Loads the template file's content into a string.
          var template_file_html = drupalgap_file_get_contents(template_file_path);
          if (template_file_html) {
            
            // What variable placeholders are present in the template file?
            var placeholders = drupalgap_get_placeholders_from_html(template_file_html);
            if (placeholders) {
              
              // Replace each placeholder with html.
              if (drupalgap.settings.debug) {
                console.log(JSON.stringify(placeholders));
              }
              // TODO - each placeholder should have its own container div and
              // unique id
              $.each(placeholders, function(index, placeholder){
                  var html = '';
                  if (eval('output.' + placeholder)) {
                    // Grab the element variable from the output.
                    var element = eval('output.' + placeholder);
                    // If it is markup, render it as is, if it is themeable,
                    // then theme it.
                    if (eval('output.' + placeholder + '.markup')) {
                      html = eval('output.' + placeholder + '.markup');
                    }
                    else if (eval('output.' + placeholder + '.theme')) {
                      html = theme(eval('output.' + placeholder + '.theme'), element);
                    }
                    // Now remove the variable from the output.
                    delete output[placeholder];
                  }
                  // Now replace the placeholder with the html, even if it was empty.
                  eval('template_file_html = template_file_html.replace(/{:' + placeholder + ':}/g,html);');
              });
            }
            else {
              // There were no place holders found, do nothing, ok.
              if (drupalgap.settings.debug) {
                console.log('drupalgap_render_page - no placeholders found (' + template_file_html + ')');
              }
            }
            
            // Finally add the rendered template file to the content.
            content += template_file_html;
            if (drupalgap.settings.debug) {
              console.log(content);
            }
          }
          else {
            alert('drupalgap_render_page - failed to get file contents (' + template_file_path + ')');
          }
        }
        else {
          alert('drupalgap_render_page - template file does not exist (' + template_file_path + ')');
        }
      }
      
      // Iterate over any remaining variables and theme them.
      // TODO - each remaining variables should have its own container div and
      // unique id, similar to the placeholder div containers mentioned above.
      $.each(output, function(element, variables){
          if ($.inArray(element, render_variables) == -1) {
            content += theme(variables.theme, variables);  
          }
      });
    }
    
    // Now that we are done assembling the content into an html string, we can
    // return it.
    return content;
  }
  catch (error) {
    alert('drupalgap_render_page - ' + error);
  }
}

/**
 * Given a region, this renders it and all the blocks in it. The blocks are
 * specified in the settings.js file, they are bundled under a region, which in
 * turn is bundled under a theme name. Returns an empty string if it fails.
 */
function drupalgap_render_region(region) {
  try {
    if (drupalgap.settings.debug) {
      console.log('drupalgap_render_region(' + region.name + ')');
      console.log(JSON.stringify(arguments));
    }
    // Make sure there are blocks specified for this theme in settings.js.
    if (!eval('drupalgap.settings.blocks[drupalgap.settings.theme]')) {
      alert('drupalgap_render_region - region (' + region.name + ') not defined in settings.js blocks!');
      return '';
    }
    // Let's render the region...
    var region_html = '';
    
    // If the region has blocks specified in it under the theme in settings.js...
    if (eval('drupalgap.settings.blocks[drupalgap.settings.theme].' + region.name)) {
      // Open the region container.
      region_html += '<div ' + drupalgap_attributes(region.attributes)  + '>';
      // If there are any links attached to this region, render them first.
      if (region.links && region.links.length > 0) {
        for (var i = 0; i < region.links.length; i++) {
          // Check link's region visiblity settings.
          if (drupalgap_check_visibility('region', region.links[i].region)) {
            region_html += l(region.links[i].title, region.links[i].path, region.links[i].region.options);
          }
        }
      }
      // Render each block in the region.
      $.each(eval('drupalgap.settings.blocks[drupalgap.settings.theme].' + region.name), function(block_delta, block_settings){
          // Check the block's visibility settings.
          if (drupalgap_check_visibility('block', block_settings)) {
            var block = drupalgap_block_load(block_delta);
            if (block) {
              region_html += module_invoke(block.module, 'block_view', block_delta);
            }
          }
      });
      // Close the region container.
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

