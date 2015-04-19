/**
 * This will return the query string arguments for the page. You may optionally
 * pass in a key to get its value, pass in a key then a value to set the key
 * equal to the value, and you may optionally pass in a third argument to use
 * a specific page id, otherwise DrupalGap will automatically use the
 * appropriate page id.
 * @return {String|NULL}
 */
function _GET() {
  try {

    // Set up defaults.
    var get = false;
    var set = false;
    var key = null;
    var value = null;

    // Are we setting? If so, grab the value and key to set.
    if (typeof arguments[1] !== 'undefined') {
      set = true;
      value = arguments[1];
      if (typeof arguments[0] !== 'undefined') { key = arguments[0]; }
      else {
        console.log('WARNING: _GET - missing key for value (' + value + ')');
        return null;
      }
    }

    // Are we getting a certain value? If so, grab the key to get.
    else if (typeof arguments[0] !== 'undefined') {
      get = true;
      key = arguments[0];
    }

    // Otherwise we are getting the whole page.
    else { get = true; }

    // Now perform the get or set...

    // Get.
    if (get) {

      // If a page id was provided use it, otherwise use the current page's id.
      var id = null;
      if (typeof arguments[2] !== 'undefined') { id = arguments[2]; }
      else { id = drupalgap_get_page_id(); }

      // Now that we know the page id, lets return the value if a key was
      // provided, otherwise return the whole query string object for the page.
      if (typeof _dg_GET[id] !== 'undefined') {
        if (!key) { return _dg_GET[id]; }
        else if (typeof _dg_GET[id][key] !== 'undefined') {
          return _dg_GET[id][key];
        }
        return null;
      }

    }

    // Set.
    else if (set) {

      // If we were given a path, use its page id as the property index, other
      // wise we'll use the current page (which is different than the
      // destination page!).
      var id = null;
      if (typeof arguments[2] !== 'undefined') {
        id = drupalgap_get_page_id(arguments[2]);
      }
      else { id = drupalgap_get_page_id(); }

      // If the id hasn't been instantiated, do so. Then set the key and value
      // onto it.
      if (typeof _dg_GET[id] === 'undefined') { _dg_GET[id] = {}; }
      if (value) { _dg_GET[id][key] = value; }

    }
    return null;
  }
  catch (error) { console.log('_GET - ' + error); }
}

/**
 * Each time we use drupalgap_goto to change a page, this function is called on
 * the pagebeforehange event. If we're not moving backwards, or navigating to
 * the same page, this will preproccesses the page, then processes it.
 */
$(document).on('pagebeforechange', function(e, data) {
    try {
      // If we're moving backwards, reset drupalgap.back and return.
      if (drupalgap && drupalgap.back) {
        drupalgap.back = false;
        return;
      }
      // If the jqm active page url is the same as the page id of the current
      // path, return.
      if (
        drupalgap_jqm_active_page_url() ==
        drupalgap_get_page_id(drupalgap_path_get())
      ) { return; }
      // We only want to process the page we are going to, not the page we are
      // coming from. When data.toPage is a string that is our destination page.
      if (typeof data.toPage === 'string') {

        // If drupalgap_goto() determined that it is necessary to prevent the
        // default page from reloading, then we'll skip the page
        // processing and reset the prevention boolean.
        if (drupalgap && !drupalgap.page.process) {
          drupalgap.page.process = true;
        }
        else if (drupalgap) {
          // Pre process, then process the page.
          template_preprocess_page(drupalgap.page.variables);
          template_process_page(drupalgap.page.variables);
        }

      }
    }
    catch (error) { console.log('pagebeforechange - ' + error); }
});

/**
 * Implementation of template_preprocess_page().
 * @param {Object} variables
 */
function template_preprocess_page(variables) {
  try {
    // Set up default attribute's for the page's div container.
    if (typeof variables.attributes === 'undefined') {
      variables.attributes = {};
    }

    // @todo - is this needed?
    variables.attributes['data-role'] = 'page';

    // Call all hook_preprocess_page functions.
    module_invoke_all('preprocess_page');

    // Place the variables into drupalgap.page
    drupalgap.page.variables = variables;
  }
  catch (error) { console.log('template_preprocess_page - ' + error); }
}

/**
 * Implementation of template_process_page().
 * @param {Object} variables
 */
function template_process_page(variables) {
  try {
    var drupalgap_path = drupalgap_path_get();
    // Execute the active menu handler to assemble the page output. We need to
    // do this before we render the regions below.
    drupalgap.output = menu_execute_active_handler();
    // For each region, render it, then replace the placeholder in the page's
    // html with the rendered region.
    var page_id = drupalgap_get_page_id(drupalgap_path);
    var page_html = $('#' + page_id).html();
    if (!page_html) { return; }
    $.each(drupalgap.theme.regions, function(index, region) {
        page_html = page_html.replace(
          '{:' + region.name + ':}',
          drupalgap_render_region(region)
        );
    });
    $('#' + page_id).html(page_html);
  }
  catch (error) { console.log('template_process_page - ' + error); }
}

/**
 * Given a path, this will return the id for the page's div element.
 * For example, a string path of 'foo/bar' would result in an id of 'foo_bar'.
 * If no path is provided, it will return the current page's id.
 * @param {String} path
 * @return {String}
 */
function drupalgap_get_page_id(path) {
  try {
    if (!path) { path = drupalgap_path_get(); }
    var id = path.toLowerCase().replace(/\//g, '_').replace(/-/g, '_');
    return id;
  }
  catch (error) { console.log('drupalgap_get_page_id - ' + error); }
}

/**
 * Given a page id, the theme's page.tpl.html string, and the menu link object
 * (all bundled in options) this takes the page template html and adds it to the
 * DOM. It doesn't actually render the page, that is taken care of by the
 * pagebeforechange handler.
 * @param {Object} options
 */
function drupalgap_add_page_to_dom(options) {
  try {
    // Prepare the default page attributes, then merge in any customizations
    // from the hook_menu() item, then inject the attributes into the
    // placeholder. We have to manually add our default class name after the
    // extend until this issue is resolved:
    // https://github.com/signalpoint/DrupalGap/issues/321
    var attributes = {
      id: options.page_id,
      'data-role': 'page'
    };
    attributes =
      $.extend(true, attributes, options.menu_link.options.attributes);
    attributes['class'] +=
      ' ' + drupalgap_page_class_get(drupalgap.router_path);
    options.html = options.html.replace(
      /{:drupalgap_page_attributes:}/g,
      drupalgap_attributes(attributes)
    );
    // Add the html to the page and the page id to drupalgap.pages.
    $('body').append(options.html);
    drupalgap.pages.push(options.page_id);
  }
  catch (error) { console.log('drupalgap_add_page_to_dom - ' + error); }
}

/**
 * Attempts to remove given page from the DOM, will not remove the current page.
 * You may force the removal by passing in a second argument as a JSON object
 * with a 'force' property set to true. You may pass in a third argument to
 * specify the current page, otherwise it will default to what DrupalGap thinks
 * is the current page. No matter what, the current page (specified or not)
 * can't be removed from the DOM, because jQM always needs one page in the DOM.
 * @param {String} page_id
 */
function drupalgap_remove_page_from_dom(page_id) {
  try {
    var current_page_id = null;
    if (typeof arguments[2] !== 'undefined') { current_page_id = arguments[2]; }
    else { current_page_id = drupalgap_get_page_id(drupalgap_path_get()); }
    var options = {};
    if (typeof arguments[1] !== 'undefined') { options = arguments[1]; }
    if (current_page_id != page_id || options.force) {
      $('#' + page_id).empty().remove();
      delete drupalgap.pages[page_id];
      // We'll remove the query string, unless we were instructed to leave it.
      if (
        typeof _dg_GET[page_id] !== 'undefined' &&
        (typeof options.leaveQuery === 'undefined' || !options.leaveQuery)
      ) { delete _dg_GET[page_id]; }
    }
    else {
      console.log('WARNING: drupalgap_remove_page_from_dom() - not removing ' +
        'the current page (' + page_id + ') from the DOM!');
    }
  }
  catch (error) { console.log('drupalgap_remove_page_from_dom - ' + error); }
}

/**
 * Removes all pages from the DOM except the current one.
 */
function drupalgap_remove_pages_from_dom() {
  try {
    var current_page_id = drupalgap_get_page_id(drupalgap_path_get());
    $.each(drupalgap.pages, function(index, page_id) {
        if (current_page_id != page_id) {
          drupalgap_remove_page_from_dom(page_id, null, current_page_id);
        }
    });
    // Reset drupalgap.pages to only contain the current page id.
    drupalgap.pages = [current_page_id];
    // Reset the drupalgap.views.ids array.
    drupalgap.views.ids = [];
    // Reset the jQM page events.
    drupalgap.page.jqm_events = [];
    // Reset the back path.
    drupalgap.back_path = [];
  }
  catch (error) { console.log('drupalgap_remove_pages_from_dom - ' + error); }
}

/**
 * Given a router path, this will return the CSS class name that can be used for
 * the page container.
 * @param {String} router_path The page router path.
 * @return {String} A css class name.
 */
function drupalgap_page_class_get(router_path) {
  try {
    // Replace '/' and '%' with underscores, then trim any trailing underscores.
    var class_name = router_path.replace(/[\/%]/g, '_');
    while (class_name.lastIndexOf('_') == class_name.length - 1) {
      class_name = class_name.substr(0, class_name.length - 1);
    }
    return class_name;
  }
  catch (error) { console.log('drupalgap_page_class_get - ' + error); }
}

/**
 * Returns true if the given page id's page div already exists in the DOM.
 * @param {String} page_id
 * @return {Boolean}
 */
function drupalgap_page_in_dom(page_id) {
  try {
    var pages = $("body div[data-role$='page']");
    var page_in_dom = false;
    if (pages && pages.length > 0) {
      $.each(pages, function(index, page) {
          if (($(page).attr('id')) == page_id) {
            page_in_dom = true;
            return false;
          }
      });
    }
    return page_in_dom;
  }
  catch (error) { console.log('drupalgap_page_in_dom - ' + error); }
}

/**
 * Returns true if the current page is the front page, false otherwise.
 * @return {Boolean}
 */
function drupalgap_is_front_page() {
  try {
    return drupalgap_path_get() == drupalgap.settings.front;
  }
  catch (error) { console.log('drupalgap_is_front_page - ' + error); }
}

/**
 * Returns the URL of the active jQuery Mobile page.
 * @return {String}
 */
function drupalgap_jqm_active_page_url() {
  try {
    // WARNING: when the app first loads, this value may be much different than
    // you expect. It certainly is not the front page path, because on Android
    // for example it returns '/android_asset/www/index.html'. Also, when the
    // app first loads, activePage is null, so just return an empty string.
    if (!$.mobile.activePage) { return ''; }
    return $.mobile.activePage.data('url');
  }
  catch (error) { console.log('drupalgap_jqm_active_page_url - ' + error); }
}

/**
 * Renders the html string of the page content that is stored in
 * drupalgap.output.
 * @return {String}
 */
function drupalgap_render_page() {
  try {
    // Since the page output has already been assembled, render the content
    // based on the output type. The output type will either be an html string
    // or a drupalgap render object.
    var output = drupalgap.output;
    var output_type = $.type(output);
    var content = '';

    // If the output came back as a string, we can render it as is. If the
    // output came back as on object, render each element in it through the
    // theme system.
    if (output_type === 'string') {
      // The page came back as an html string.
      content = output;
    }
    else if (output_type === 'object') {
      // The page came back as a render object. Let's define the names of
      // variables that are reserved for theme processing.
      var render_variables = ['theme', 'view_mode', 'language'];

      // Is there a theme value specified in the output and the registry?
      if (output.theme && drupalgap.theme_registry[output.theme]) {

        // Extract the theme object template and determine the template file
        // name and path.
        var template = drupalgap.theme_registry[output.theme];
        var template_file_name = output.theme.replace(/_/g, '-') + '.tpl.html';
        var template_file_path = template.path + '/' + template_file_name;

        // Make sure the template file exists.
        if (drupalgap_file_exists(template_file_path)) {

          // Loads the template file's content into a string.
          var template_file_html = drupalgap_file_get_contents(
            template_file_path
          );
          if (template_file_html) {

            // What variable placeholders are present in the template file?
            var placeholders = drupalgap_get_placeholders_from_html(
              template_file_html
            );
            if (placeholders) {

              // Replace each placeholder with html.
              // @todo - each placeholder should have its own container div and
              // unique id.
              $.each(placeholders, function(index, placeholder) {
                  var html = '';
                  if (output[placeholder]) {
                    // Grab the element variable from the output.
                    var element = output[placeholder];
                    // If it is markup, render it as is, if it is themeable,
                    // then theme it.
                    if (output[placeholder].markup) {
                      html = output[placeholder].markup;
                    }
                    else if (output[placeholder].theme) {
                      html = theme(output[placeholder].theme, element);
                    }
                    // Now remove the variable from the output.
                    delete output[placeholder];
                  }
                  // Now replace the placeholder with the html, even if it was
                  // empty.
                  template_file_html = template_file_html.replace(
                    '{:' + placeholder + ':}',
                    html
                  );
              });
            }
            else {
              // There were no place holders found, do nothing, ok.
            }

            // Finally add the rendered template file to the content.
            content += template_file_html;
          }
          else {
            console.log(
              'drupalgap_render_page - failed to get file contents (' +
                template_file_path +
              ')'
            );
          }
        }
        else {
          console.log(
            'drupalgap_render_page - template file does not exist (' +
              template_file_path +
              ')'
            );
        }
      }

      // Iterate over any remaining variables and theme them.
      // @todo - each remaining variables should have its own container div and
      // unique id, similar to the placeholder div containers mentioned above.
      $.each(output, function(element, variables) {
          if ($.inArray(element, render_variables) == -1) {
            content += theme(variables.theme, variables);
          }
      });
    }

    // Now that we are done assembling the content into an html string, we can
    // return it.
    return content;
  }
  catch (error) { console.log('drupalgap_render_page - ' + error); }
}

