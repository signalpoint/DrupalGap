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
    // Set up default attributes for the page's div container.
    if (typeof variables.attributes === 'undefined') {
      variables.attributes = {};
    }

    // @todo - is this needed?
    // @UPDATE - this should be used, but these page attributes are ignored
    // by drupalgap_add_page_to_dom()!
    variables.attributes['data-role'] = 'page';

    module_invoke_all('preprocess_page', variables);

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
    var page = $('#' + page_id);
    var page_html = $(page).html();
    if (!page_html) { return; }
    for (var index in drupalgap.theme.regions) {
        if (!drupalgap.theme.regions.hasOwnProperty(index)) { continue; }
        var region = drupalgap.theme.regions[index];
        var _region = {};
        $.extend(true, _region, region);
        page_html = page_html.replace(
          '{:' + region.name + ':}',
          drupalgap_render_region(_region)
        );
    }
    $(page).html(page_html);
    module_invoke_all('post_process_page', variables);
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
      var currentPage = $('#' + current_page_id);
      // Preserve and re-apply style to current page, @see https://github.com/signalpoint/DrupalGap/issues/837
      var style = $(currentPage).attr('style');
      $('#' + page_id).empty().remove();
      if (style) { $(currentPage).attr('style', style); }
      var page_index = drupalgap.pages.indexOf(page_id);
      if (page_index > -1) { drupalgap.pages.splice(page_index, 1); }
      // We'll remove the query string, unless we were instructed to leave it.
      if (
        typeof _dg_GET[page_id] !== 'undefined' &&
        (typeof options.leaveQuery === 'undefined' || !options.leaveQuery)
      ) { delete _dg_GET[page_id]; }
      // Remove any embedded view for the page.
      views_embedded_view_delete(page_id);
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
    var pages = drupalgap.pages.slice(0);
    for (var index in pages) {
        if (!pages.hasOwnProperty(index)) { continue; }
        var page_id = pages[index];
        if (current_page_id != page_id) {
          drupalgap_remove_page_from_dom(page_id, null, current_page_id);
        }
    }
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
      for (var index in pages) {
          if (!pages.hasOwnProperty(index)) { continue; }
          var page = pages[index];
          if (($(page).attr('id')) == page_id) {
            page_in_dom = true;
            break;
          }
      }
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
    module_invoke_all('page_build', drupalgap.output);
    return drupalgap_render(drupalgap.output);
  }
  catch (error) { console.log('drupalgap_render_page - ' + error); }
}
