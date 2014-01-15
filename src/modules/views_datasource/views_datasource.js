var _views_view_router_path;
var _views_view_previous_page;

/**
 * Given a path to a Views Datasource (Views JSON) view, this will get the
 * results and pass them along to the provided success callback.
 * @param {String} path
 * @param {Object} options
 */
function views_datasource_get_view_result(path, options) {
  try {
    // If local storage caching is enabled, let's see if we can load the results
    // from there. If we successfully loaded the result, make sure it didn't
    // expire. If it did expire, remove it from local storage. If we don't have
    // it in local storage, or local storage caching is disabled, call Drupal to
    // get the results. After the results are fetched, save them to local
    // storage with an expiration time, if necessary. We use the path of the
    // view as the local storage key.
    // If we are resetting, remove the item from localStorage.
    if (options.reset) { window.localStorage.removeItem(path); }
    else if (Drupal.settings.cache.views.enabled) {
      var result = window.localStorage.getItem(path);
      if (result) {
        // Loaded from local storage, did it expire?
        result = JSON.parse(result);
        if (typeof result.expiration !== 'undefined' &&
          result.expiration != 0 &&
          time() > result.expiration
        ) {
          // Expired, remove from local storage.
          window.localStorage.removeItem(path);
        }
        else if (options.success) {
          // Did not expire yet, use it.
          options.success(result);
          return;
        }
      }
    }
    Drupal.services.call({
        endpoint: '',
        service: 'views_datasource',
        resource: '',
        method: 'GET',
        path: path,
        success: function(result) {
          try {
            if (options.success) {
              // Add the parh to the result.
              result.path = path;
              // If any views caching is enabled, cache the results in local
              // storage.
              if (Drupal.settings.cache.views.enabled) {
                var expiration =
                  time() + Drupal.settings.cache.views.expiration;
                if (Drupal.settings.cache.views.expiration == 0) {
                  expiration = 0;
                }
                // Saving to local storage.
                result.expiration = expiration;
                window.localStorage.setItem(path, JSON.stringify(result));
              }
              options.success(result);
            }
          }
          catch (error) {
            console.log(
              'views_datasource_get_view_result - success - ' + error
            );
          }
        },
        error: function(xhr, status, message) {
          try {
            if (options.error) { options.error(xhr, status, message); }
          }
          catch (error) {
            console.log('views_datasource_get_view_result - error - ' + error);
          }
        }
    });
  }
  catch (error) { console.log('views_datasource_get_view_result - ' + error); }
}

/**
 * Returns the html string to options.success, used to embed a view.
 * @param {String} path
 * @param {Object} options
 */
function views_embed_view(path, options) {
  try {
    _views_view_router_path = drupalgap_router_path_get();
    views_datasource_get_view_result(path, {
        success: function(results) {
          try {
            if (!options.success) { return; }
            options.results = results;
            var html = theme('views_view', options);
            options.success(html);
          }
          catch (error) {
            console.log('views_embed_view - success - ' + error);
          }
        },
        error: function(xhr, status, message) {
          try {
            if (options.error) { options.error(xhr, status, message); }
          }
          catch (error) {
            console.log('views_embed_view - error - ' + error);
          }
        }
    });
  }
  catch (error) { console.log('views_embed_view - ' + error); }
}

/**
 * @deprecated - views_datasource_get_view_result() instead.
 */
drupalgap.views_datasource = {
  'options': { /* these are set by drupalgap_api_default_options() */ },
  'call': function(options) {
    try {
      var msg = 'WARNING: drupalgap.views_datasource has been deprecated! ' +
      'Use views_datasource_get_view_result() instead.';
      console.log(msg);
      views_datasource_get_view_result(options.path, options);
    }
    catch (error) { console.log('drupalgap.views_datasource - ' + error); }
  }
};

/**
 * Theme's a view.
 * @param {Object} variables
 * @return {String}
 */
function theme_views_view(variables) {
  try {
    var html = '';
    // Extract the results.
    var results = variables.results;
    // Determine the root and child object name. We use nodes and node by
    // default, unless one was provided.
    var root = 'nodes'; if (variables.root) { root = variables.root; }
    var child = 'node'; if (variables.child) { child = variables.child; }
    // Render the pager, if necessary.
    var pager = '';
    if (results.pager) { pager += theme('pager', variables); }
    // Are we rendering the pager above the results (default)?
    html += pager;
    // Render the rows.
    var rows = '';
    $.each(results[root], function(count, object) {
        var row = object[child];
        rows += '<div>' + JSON.stringify(row) + '</div>';
    });
    html += rows;
    // @todo - Are we rendering the pager below the results?
    return html;
  }
  catch (error) { console.log('theme_views_view - ' + error); }
}

/**
 * Themes a pager.
 * @param {Object} variables
 * @return {String}
 */
function theme_pager(variables) {
  try {
    var html = '';
    // Extract the pager data.
    var pager = variables.results.pager;
    var page = pager.page;
    var pages = pager.pages;
    var count = pager.count;
    var limit = pager.limit;
    var page = pager.page;
    // Add css class name(s).
    //variables.attributes.class += ' pager';
    // Add the pager items to the list.
    var items = [];
    if (page != 0) { items.push(theme('pager_previous', variables)); }
    if (page != pages - 1) { items.push(theme('pager_next', variables)); }
    if (items.length > 0) {
      // Make sure we have an id to use since we need to dynamically build the
      // navbar container for the pager. If we don't have one, generate a random
      // one.
      var id = variables.attributes.id;
      if (!id) { id = 'theme_pager_' + user_password(); }
      html += '<div id="' + id + '" data-role="navbar">' + theme('item_list', {
          items: items
      }) + '</div>' +
      '<script type="text/javascript">' +
        '$("#' + id + '").navbar();' +
      '</script>';
    }
    //'$("#' + drupalgap_get_page_id(drupalgap_path_get()) + '").page();' +
    return html;
  }
  catch (error) { console.log('theme_pager - ' + error); }
}

/**
 * Themes a pager link.
 * @param {Object} variables
 * @return {String}
 */
function theme_pager_link(variables) {
  try {
    var link_vars = {
      attributes: {
        onclick: "_theme_pager_link_click('" +
          variables.path + "', " +
          variables.page +
        ')'
      }
    };
    return l(variables.text, null, link_vars);
  }
  catch (error) { console.log('theme_pager_link - ' + error); }
}

/**
 * An internal function used to handle clicks on pager links.
 * @param {String} path
 * @param {String} page
 */
function _theme_pager_link_click(path, page) {
  try {
    if (drupalgap.menu_links[_views_view_router_path] &&
      drupalgap.menu_links[_views_view_router_path].pageshow
    ) {
      var pageshow = window[
        drupalgap.menu_links[_views_view_router_path].pageshow
      ];
      // If the path already has a 'page' arg in it, remove it.
      var new_path = path.replace('&page=' + _views_view_previous_page, '') +
        '&page=' + page;
      pageshow(new_path);
    }
  }
  catch (error) { console.log('_theme_pager_link_click - ' + error); }
}

/**
 * Themes a pager next link.
 * @param {Object} variables
 * @return {String}
 */
function theme_pager_next(variables) {
  try {
    var html;
    var page = variables.results.pager.page;
    _views_view_previous_page = page;
    var link_vars = {
      text: '&raquo;',
      path: variables.results.path,
      page: (page + 1),
      attributes: {
        'class': 'pager_next'
      }
    };
    html = theme_pager_link(link_vars);
    return html;
  }
  catch (error) { console.log('theme_pager_next - ' + error); }
}

/**
 * Themes a pager previous link.
 * @param {Object} variables
 * @return {String}
 */
function theme_pager_previous(variables) {
  try {
    var html;
    var page = variables.results.pager.page;
    _views_view_previous_page = page;
    var link_vars = {
      text: '&laquo;',
      path: variables.results.path,
      page: (page - 1),
      attributes: {
        'class': 'pager_previous'
      }
    };
    html = theme_pager_link(link_vars);
    return html;
  }
  catch (error) { console.log('theme_pager_previous - ' + error); }
}

