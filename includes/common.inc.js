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
    // Add the page id to drupalgap.pages.
    drupalgap.pages.push(page_id);
  }
  catch (error) {
    alert('drupalgap_add_page_to_dom - ' + error);
  }
}

/**
 * Removes all pages from the DOM except the current one.
 */
function drupalgap_remove_pages_from_dom() {
  try {
    var current_page_id = drupalgap_get_page_id(drupalgap_path_get());
    $.each(drupalgap.pages, function(index, page_id){
        if (current_page_id != page_id) {
          $('#' + page_id).empty().remove();
        }
    });
    // Reset drupalgap.pages to only contain the current page id.
    drupalgap.pages = [current_page_id];
  }
  catch (error) { drupalgap_error(error); }
}

/**
 * Converts a JSON object to an XML/HTML tag attribute string and returns the
 * string.
 */
function drupalgap_attributes(attributes) {
  try {
    var attribute_string = '';
    if (attributes) {
      $.each(attributes, function(name, value){
          if (value != '') {
            // TODO - if someone passes in a value with double quotes, this will
            // break. e.g. 'onclick':'_drupalgap_form_submit("' + form.id + "');'
            // will break, but 'onclick':'_drupalgap_form_submit(\'' + form.id + '\');'
            // will work.
            attribute_string += name + '="' + value + '" ';  
          }
      });
    }
    return attribute_string;
  }
  catch (error) { drupalgap_error(error); }
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
    if (typeof data === 'undefined') {
      console.log('drupalgap_check_visibility - WARNING - no data provided for type (' + type + ')');
    }
    // Roles.
    else if (typeof data.roles !== 'undefined' && data.roles && data.roles.value && data.roles.value.length != 0) {
      $.each(data.roles.value, function(role_index, role){
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
          // Break out of the loop if already determined to be visible.
          if (visible) { return false; }
      });
    }
    // Pages.
    else if (typeof data.pages !== 'undefined' && data.pages && data.pages.value && data.pages.value.length != 0) {
      $.each(data.pages.value, function(page_index, path){
          if (path == '') {
            path = drupalgap.settings.front;
          }
          if (path == drupalgap_path_get()) {
            if (data.pages.mode == 'include') { visible = true; }
            else if (data.pages.mode == 'exclude') { visible = false; }
          }
          else {
            if (data.pages.mode == 'include') { visible = false; }
            else if (data.pages.mode == 'exclude') { visible = true; }
          }
          // Break out of the loop if already determined to be visible.
          if (visible) { return false; }
      });
    }
    return visible;
  }
  catch (error) {
    alert('drupalgap_check_visibility - ' + error);
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
 * Change the page to the previous page.
 */
function drupalgap_back() {
  try {
    drupalgap.back = true;
    history.back();
    drupalgap_path_set(drupalgap.back_path);
    return false;
  }
  catch (error) {
    alert('drupalgap_back' + error);
  }
}

/**
 * Given an error message, this will log the message to the console and goto
 * the error page, if it isn't there already. If drupalgap.settings.debug is set
 * to true, this function will also alert the error. You may optionally send in
 * a second message that will be displayed to the user via an alert dialog box.
 */
function drupalgap_error(message) {
  try {
    // Generate a developer error message, log it to the console, then alert
    // the message if debugging is enabled.
    var error_message = 'drupalgap_error() - ' +
                        arguments.callee.caller.name + ' - ' +
                        message;
    console.log(error_message);
    if (drupalgap.settings.debug) { alert(error_message); }
    // If a message for the user was passed in, display it to the user.
    if (arguments[1]) { alert(arguments[1]); }
    // Goto the error page if we are not already there.
    if (drupalgap_path_get() != 'error') { drupalgap_goto('error'); }
  }
  catch (error) {
    alert('drupalgap_error - ' + error);
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
    
    // Extract any incoming options, set any defaults that weren't provided,
    // then populate the global page options variable.
    var options = {};
    if (arguments[1]) {
      options = arguments[1];
      if (typeof options.form_submission === 'undefined') {
        options.form_submission = false;
      }
    }
    drupalgap.page.options = options;
    
    // Prepare the path.
    path = drupalgap_goto_prepare_path(path);
    if (!path) { return false; }
    
    // Determine the router path.
    var router_path = drupalgap_get_menu_link_router_path(path);
    
    // Make sure we have a menu link item that can handle this router path,
    // otherwise we'll goto the 404 page.
    if (!drupalgap.menu_links[router_path]) {
      // Is anyone trying to handle this 404?
      var new_path = false;
      var invocation_results = module_invoke_all('404', router_path);
      if (invocation_results) {
        $.each(invocation_results, function(index, result){
            if (result !== false) {
              new_path = result;
              return false;
            }
        });
      }
      // If a 404 handler provided a new path use it, otherwise just use the
      // system 404 page. Either way, update the router path before continuing
      // with a normal page build.
      if (new_path) { path = new_path; }
      else { path = '404/' + path; }
      router_path = drupalgap_get_menu_link_router_path(path);
    }
    
    // If the new router path is the same as the current router path and the new
    // path is the same as the current path, don't go anywhere, unless it is a
    // form submission, then continue.
    if (router_path == drupalgap_router_path_get() &&
        drupalgap_path_get() == path && 
        !options.form_submission) {
      return false;
    }
    
    // Grab the page id.
    var page_id = drupalgap_get_page_id(path);
    
    // Return if we are trying to go to the path we are already on, unless this
    // was a form submission, then we'll let the page rebuild itself. For
    // accurracy we compare the jQM active page url with the destination page id.
    if (drupalgap_jqm_active_page_url() == page_id && options.form_submission) {
      return false;
    }
    
    // Save the back path.
    drupalgap.back_path = drupalgap_path_get();
    
    // Set the current menu path to the path input.
    drupalgap_path_set(path);
    
    // Set the drupalgap router path.
    drupalgap_router_path_set(router_path);

    // If the page is already in the DOM and we're asked to reload it, then
    // remove the page and let it rebuild itself. If we're not reloading the
    // page and we're not in the middle of a form submission, prevent the page
    // from processing then change to it.
    if (drupalgap_page_in_dom(page_id)) {
      // If there are any hook_menu() item options for this router path, bring
      // them into the current options without overwriting any existing values.
      if (drupalgap.menu_links[router_path].options) {
        options = $.extend({}, drupalgap.menu_links[router_path].options, options);
      }
      // Reload the page? If so, remove the page from the DOM, delete the
      // reloadPage option, then set the reloadingPage option to true so others
      // down the line will know the page is reloading. We can't pass along the
      // actual reloadPage option since it may collide with jQM later on.
      if (typeof options.reloadPage !== 'undefined' && options.reloadPage) {
        drupalgap_remove_page_from_dom(page_id);
        delete options.reloadPage;
        options.reloadingPage = true;
      }
      else if (!options.form_submission) {
        drupalgap.page.process = false;
        $.mobile.changePage('#' + page_id, options);
        return;
      }
    }
    else if (typeof options.reloadPage !== 'undefined' && options.reloadPage) {
      // The page is not in the DOM, and we're being asked to reload it, this
      // can't happen, so we'll just delete the reloadPage option.
      delete options.reloadPage;
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
      
      // If options wasn't set, set it as an empty JSON object.
      if (typeof options === 'undefined') { options = {}; }
      
      // Load the page template html file. Determine if we are going to cache
      // the template file or not.
      var file_options = {};
      if (drupalgap.settings.cache &&
          drupalgap.settings.cache.theme_registry !== 'undefined' &&
          !drupalgap.settings.cache.theme_registry) {
          file_options.cache = false;
       }
      var html = drupalgap_file_get_contents(page_template_path, file_options);
      
      if (html) {
        
        // Add page to DOM.
        drupalgap_add_page_to_dom(page_id, html);
        
        // Setup change page options if necessary.
        if (drupalgap_path_get() == path && options.form_submission) {
          options.allowSamePageTransition = true;
        }
        
        // Let's change to the page.
        if (typeof parent.window.ripple === 'function') {
          // The Ripple emulator seems to not like the 'index.html' prefix,
          // so we'll remove that.
          $.mobile.changePage('#' + page_id, options);
        }
        else {
          // Default change page.
          $.mobile.changePage('index.html#' + page_id, options);
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
    // If the path is an empty string, change it to the front page path.
    if (path == '') {
      if (!drupalgap.settings.front) {
        alert("drupalgap_goto_prepare_path - no 'front' page specified in settings.js!");
        return false;
      }
      else {
        path = drupalgap.settings.front;
      }
    }
    // Change 'user' to 'user/login' for anonymous users, or change it to
    // e.g. 'user/123/view' for authenticated users.
    else if (path == 'user') {
      if (drupalgap.user.uid != 0) {
        path = 'user/' + drupalgap.user.uid + '/view';
      }
      else {
        path = 'user/login';
      }
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
 * Returns the URL of the active jQuery Mobile page.
 */
function drupalgap_jqm_active_page_url() {
  try {
    // WARNING: when the app first loads, this value may be much different than
    // you expect. It certainly is not the front page path, because on Android
    // for example it returns '/android_asset/www/index.html'.
    return $.mobile.activePage.data('url');
  }
  catch (error) {
    alert('drupalgap_jqm_active_page_url - ' + error);
  }
}

/**
 * Get the current DrupalGap path.
 */
function drupalgap_path_get() {
  try {
    var path = drupalgap.path;
    
    return path;
  }
  catch (error) {
    alert('drupalgap_path_get - ' + error);
  }
}

/**
 * Set the current DrupalGap path.
 */
function drupalgap_path_set(path) {
  try {
    drupalgap.path = path;
  }
  catch (error) {
    alert('drupalgap_path_set - ' + error);
  }
}

/**
 * Get the current DrupalGap router_path.
 */
function drupalgap_router_path_get() {
  try {
    var router_path = drupalgap.router_path;
    
    return router_path;
  }
  catch (error) {
    alert('drupalgap_router_path_get - ' + error);
  }
}

/**
 * Set the current DrupalGap router_path.
 */
function drupalgap_router_path_set(router_path) {
  try {
    drupalgap.router_path = router_path;
  }
  catch (error) {
    alert('drupalgap_router_path_set - ' + error);
  }
}

/**
 * Renders the html string of the page content that is stored in
 * drupalgap.output.
 */
function drupalgap_render_page() {
  try {
    if (drupalgap.settings.debug) {
      console.log('drupalgap_render_page()');
      console.log(JSON.stringify(arguments));
    }
    // Since the page output has already been assembled, render the content
    // based on the output type. The output type will either be an html string
    // or a drupalgap render object.
    var output = drupalgap.output;
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
      alert('drupalgap_render_region - there are no blocks for the "' +
            drupalgap.settings.theme + ' " theme in the settings.js file!');
      return '';
    }
    // Grab the current path.
    var current_path = drupalgap_path_get();
    // Let's render the region...
    var region_html = '';
    // If the region has blocks specified in it under the theme in settings.js...
    if (eval('drupalgap.settings.blocks[drupalgap.settings.theme].' + region.name)) {
      // If a class attribute hasn't yet been provided, set a default, then
      // append a system class name for the region onto its attributes array.
      if (!region.attributes['class']) { region.attributes['class'] = ''; }
      region.attributes['class'] += ' region_' + region.name + ' ';
      // Open the region container.
      region_html += '<div ' + drupalgap_attributes(region.attributes)  + '>';
      // If there are any links attached to this region, render them first.
      if (region.links && region.links.length > 0) {
        for (var i = 0; i < region.links.length; i++) {
          // Extract the data associated with this link. If it has a 'region'
          // property then it is coming from a hook_menu, if it doesn't then it
          // is coming from settings.js.
          var data = null;
          if (typeof region.links[i].region === 'undefined') {
            data = region.links[i]; // link defined in settings.js
            // TODO - we need to warn people that they can't make a custom menu
            // with a machine name of 'regions' now that this machine name is a
            // "system" name for rendering links in regions.
          }
          else {
            data = region.links[i].region; // link defined via hook_menu()
          }
          // Check link's region visiblity settings. Links will not be rendered
          // on the system 'offline' or 'error' pages.
          var render_link = false;
          if (drupalgap_check_visibility('region', data)) {
            render_link = true;
            if (current_path == 'offline' || current_path == 'error') {
              render_link = false;
            }
            if (render_link) {
              region_html += l(region.links[i].title, region.links[i].path, data.options);
            }
          }
        }
      }
      // Render each block in the region.
      $.each(eval('drupalgap.settings.blocks[drupalgap.settings.theme].' + region.name), function(block_delta, block_settings){
          // Check the block's visibility settings.
          var render_block = false;
          if (drupalgap_check_visibility('block', block_settings)) {
            render_block = true;
            // The 'offline' and 'error' pages only have the 'main' system block visible.
            if (block_delta != 'main' && (current_path == 'offline' || current_path == 'error')) {
              render_block = false;
            }
          }
          if (render_block) {
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
 * An interal callback used to handle the setting of the page title during the
 * pageshow event.
 */
function _drupalgap_page_title_pageshow(page_arguments) {
  try {
    var router_path = drupalgap_router_path_get();
    // Set the page title. First we'll see if the hook_menu() item has a
    // title variable set, then check for a title_callback function.
    var title_arguments = [];
    if (typeof drupalgap.menu_links[router_path].title !== 'undefined') {
      drupalgap_set_title(drupalgap.menu_links[router_path].title);
    }
    if (typeof drupalgap.menu_links[router_path].title_callback !== 'undefined') {
      var function_name = drupalgap.menu_links[router_path].title_callback;
      if (drupalgap_function_exists(function_name)) {
        // Grab the title callback function.
        var fn = window[function_name];
        // Place the internal success callback handler on the front of the
        // title arguments.
        title_arguments.unshift(_drupalgap_page_title_pageshow_success);
        // Are there any additional arguments to send to the title callback?
        if (drupalgap.menu_links[router_path].title_arguments) {
          // For each title argument, if the argument is an integer, grab the
          // corresponding arg(#), otherwise just push the arg onto the title
          // arguments.
          var args = arg(null, drupalgap_path_get());
          $.each(drupalgap.menu_links[router_path].title_arguments, function(index, object){
              if (is_int(object) && args[object]) { title_arguments.push(args[object]); }
              else { title_arguments.push(object); }
          });
        }
        // Call the title callback function with the title arguments.
        drupalgap_set_title(fn.apply(null, Array.prototype.slice.call(title_arguments)));
      }
    }
    else {
      _drupalgap_page_title_pageshow_success(drupalgap_get_title());
    }
  }
  catch (error) { drupalgap_error(error); }
}

/**
 * An internal function used to set the page title when the page title callback
 * function is successful.
 */
function _drupalgap_page_title_pageshow_success(title) {
  try {
    $('h1#drupalgap_page_title').html(title);
  }
  catch (error) { drupalgap_error(error); }
}

/**
 * Implementation of arg(index = null, path = null).
 */
function arg() {
  try {
    var result = null;
    // If there were zero or one arguments provided.
    if (arguments.length == 0 || arguments.length == 1) {
      // Split the path into parts.
      var drupalgap_path = drupalgap_path_get();
      var args = drupalgap_path.split('/');
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
 * Given an entity type and an entity id, this will load the entity JSON object
 * then send it to the success callback provided in the options. It will first
 * try to load the entity from local storage, if it can't it will retrieve the
 * entity from the Drupal server then save it to local storage. Local storage
 * load and save attempts will be ignored if entity caching is disabled.
 */
function entity_load(entity_type, ids) {
  try {
    if (!is_int(ids)) {
      alert('entity_load(' + entity_type + ') - only single ids supported at this time, sorry!');
      return false;
    }
    var entity = false;
    // Grab the entity id.
    var entity_id = ids;
    // Grab any options.
    var options = null;
    if (arguments[2]) { options = arguments[2]; }
    // Confirm caller attached a success callback function.
    if (!options || typeof options.success !== 'function') {
      var dev_msg = 'No success callback function was provided to ' + entity_type + '_load(' + entity_id + ') by caller!';
      var user_msg = 'Sorry, there was a problem loading ' + entity_type + ' #' + entity_id + '!';
      drupalgap_error(dev_msg, user_msg);
      return;
    }
    // If entity caching is enabled, try to load the entity from local storage.
    // If a copy is available in local storage, send it to the success callback.
    if (drupalgap.settings.cache.entity && drupalgap.settings.cache.entity.enabled) {
      entity = _entity_load_from_local_storage(entity_type, entity_id, options);
      if (entity) {
        options.success(entity);
        return;
      }
    }
    
    // We didn't load the entity from local storage. Let's grab it from the
    // Drupal server instead.
    var entity_types = [
      'comment',
      'file',
      'node',
      'taxonomy_term',
      'taxonomy_vocabulary',
      'user'
    ];
    if ($.inArray(entity_type, entity_types) && drupalgap.services[entity_type]) {
      var primary_key = drupalgap_entity_get_primary_key(entity_type);
      var call_options = {
        /*'async':false,*/
        success:function(data){
          // Set the entity equal to the returned data.
          entity = data;
          // Is entity caching enabled? 
          if (drupalgap.settings.cache.entity && drupalgap.settings.cache.entity.enabled) {
            // Set the expiration time as a property on the entity that can be
            // used later.
            if (drupalgap.settings.cache.entity.expiration !== 'undefined') {
              var expiration = time() + drupalgap.settings.cache.entity.expiration;
              if (drupalgap.settings.cache.entity.expiration == 0) { expiration = 0; }
              entity.drupalgap_expiration = expiration;
            }
            // Save the entity to local storage.
            window.localStorage.setItem(
              entity_local_storage_key(entity_type, entity_id),
              JSON.stringify(entity)
            );
          }
          // Send the entity back to the caller's success callback function.
          options.success(entity);
        }
      };
      call_options[primary_key] = entity_id;
      drupalgap.services[entity_type].retrieve.call(call_options);
    }
    else {
      drupalgap_error('Failed to load entity! (' + entity_type + ', ' + entity_id + ')');
    }
  }
  catch (error) { drupalgap_error(error); }
}

/**
 * An internal function used by entity_load() to attempt loading an entity
 * from local storage.
 */
function _entity_load_from_local_storage(entity_type, entity_id, options) {
  try {
    var entity = false;
    // Get the local storage key. 
    var local_storage_key = entity_local_storage_key(entity_type, entity_id);
    // Process options if necessary.
    if (options) {
      // If we are resetting, remove the item from localStorage.
      if (options.reset) { window.localStorage.removeItem(local_storage_key); }
    }
    // Attempt to load the entity from local storage.
    entity = window.localStorage.getItem(local_storage_key);
    if (entity) {
      entity = JSON.parse(entity); 
      // We successfully loaded the entity from local storage. If it expired
      // remove it from local storage then continue onward with the entity
      // retrieval from Drupal. Otherwise return the local storage entity copy.
      if (typeof entity.drupalgap_expiration !== 'undefined' &&
          entity.drupalgap_expiration != 0 &&
          time() > entity.drupalgap_expiration) {
        window.localStorage.removeItem(local_storage_key);
        entity = false;
      }
      else {
        // The entity has not yet expired. If the current page options
        // indicate reloadingPage is true (and the reset option wasn't set to
        // false) then we'll grab a fresh copy of the entity from Drupal.
        // If the page is reloading and the developer didn't call for a reset,
        // then just return the cached copy.
        if (drupalgap.page.options && drupalgap.page.options.reloadingPage) {
          // Reloading page... cached entity is still valid.
          if (typeof drupalgap.page.options.reset !== 'undefined' && drupalgap.page.options.reset == false) {
            // We were told to not reset it, so we'll use the cached copy.
            return entity;
          }
          else {
            // Remove the entity from local storage and reset it.
            window.localStorage.removeItem(local_storage_key);
            entity = false;
          }
        }
      }
    }
    return entity;
  }
  catch (error) { drupalgap_error(error); }
}

/*function element_set_attributes(element, map) {
  try {
    $.each(map, function(property, attribute){
        // If the key is numeric, the attribute name needs to be taken over.
        if (is_int(property)) {
          property = attribute;
        }
        // Do not overwrite already existing attributes.
        if (element[property] && element.attributes[attribute]) {
          element.attributes[attribute] = element[property];
        }
    });
  }
  catch (error) { drupalgap_error(error); }
}*/
 
/**
 * Given an entity type and the entity id, this will return the local storage
 * key to be used when saving/loading the entity from local storage.
 */
function entity_local_storage_key(entity_type, id) {
  try {
    return entity_type + '_' + id;
  }
  catch (error) { drupalgap_error(error); }
}

/*function entity_save(entity_type, entity) {
  try {
    
  }
  catch (error) { drupalgap_error(error); }
}*/

/**
 * Implemtation of l().
 */
function l() {
  try {
    // Grab the text and the path from the arguments and then build a simple
    // link object.
    var text = arguments[0];
    var path = arguments[1];
    var link = {'text':text, 'path':path};
    // Determine if there are any incoming link options, if there are, attach
    // them to the link object. If there are any attributes, extract them from
    // the options and attach them directly to the link object.
    var options = null;
    if (arguments[2]) {
      options = arguments[2];
      if (options.attributes) { link.attributes = options.attributes; }
      link.options = options;
    }
    return theme('link', link);
  }
  catch (error) {
    alert('l - ' + error);
  }
}

