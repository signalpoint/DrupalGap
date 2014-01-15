var _views_view_id;
var _views_view_previous_page;
var _views_view_row_callback;

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
 * Themes a view.
 * @param {Object} variables
 * @return {String}
 */
function theme_view(variables) {
  try {
    // Since we'll by making an asynchronous call to load the view, we'll just
    // return an empty div container, with a script snippet to load the view.
    var html = '<div id="' + _views_view_id + '" class="view"></div>';
    var options = {
      page_id: drupalgap_get_page_id(),
      jqm_page_event: 'pageshow',
      jqm_page_event_callback: '_theme_view',
      jqm_page_event_args: JSON.stringify(variables)
    };
    html += drupalgap_jqm_page_event_script_code(options);
    return html;
  }
  catch (error) { console.log('theme_view - ' + error); }
}

/**
 * An internal function used to theme a view.
 * @param {Object} variables
 */
function _theme_view(variables) {
  try {
    var page = 0;
    if (variables.page) { page = variables.page; }
    views_embed_view(variables.path + '&page=' + page, {
        row_callback: variables.row_callback,
        empty_callback: variables.empty_callback,
        success: function(html) {
          $('#' + variables.attributes.id).html(html);
        }
    });
  }
  catch (error) { console.log('_theme_view - ' + error); }
}

/**
 * Returns the html string to options.success, used to embed a view.
 * @param {String} path
 * @param {Object} options
 */
function views_embed_view(path, options) {
  try {
    views_datasource_get_view_result(path, {
        success: function(results) {
          try {
            if (!options.success) { return; }
            options.results = results;
            // We need a unique id for the div container, so if one isn't
            // provided, generate one randomly.
            if (!options.attributes) { options.attributes = {}; }
            var id = options.attributes.id;
            if (!id) {
              id = 'view-' + user_password();
              options.attributes.id = id;
            }
            _views_view_id = id;
            _views_view_row_callback = options.row_callback;
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
    // Are the results empty? If so, return the empty callback's html, if it
    // exists.
    if (results[root].length == 0 && variables.empty_callback &&
      function_exists(variables.empty_callback)) {
      var empty_callback = window[variables.empty_callback];
      return empty_callback(variables);
    }
    // Render the pager, if necessary.
    var pager = '';
    if (results.pager) { pager += theme('pager', variables); }
    // Are we rendering the pager above the results (default)?
    html += pager;
    // Render the rows.
    var rows = '<div class="views-rows">';
    $.each(results[root], function(count, object) {
        var row = object[child];
        if (variables.row_callback && function_exists(variables.row_callback)) {
          row_callback = window[variables.row_callback];
          rows += row_callback(row);
        }
        else {
          rows += '<div>' + JSON.stringify(row) + '</div>';
        }
    });
    rows += '</div>';
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
    _theme_view({
        path: path.replace('&page=' + _views_view_previous_page, ''),
        page: page,
        row_callback: _views_view_row_callback,
        attributes: {
          options: _views_view_id
        }
    });
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


/**
 * @deprecated - Use views_datasource_get_view_result() instead.
 */
drupalgap.views_datasource = {
  'options': { },
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

