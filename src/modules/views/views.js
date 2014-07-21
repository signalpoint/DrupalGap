/**
 * Given a path to a Views Datasource (Views JSON) view, this will get the
 * results and pass them along to the provided success callback.
 * @param {String} path
 * @param {Object} options
 */
function views_datasource_get_view_result(path, options) {
  try {
    // Since we do not use clean URLs, replace any potential question marks from
    // the path with an ampersand so the path will not be invalid.
    if (path.indexOf('?') != -1) {
      var replacement = path.replace('?', '&');
      path = replacement;
    }
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
              // Add the path to the result.
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
    // Throw a warning if no id is provided.
    if (!variables.attributes.id) {
      console.log(
        'WARNING: theme_view() - No id specified on attributes! ' +
        'A random id will be generated instead.'
      );
      variables.attributes.id = 'views-view--' + user_password();
    }
    // Since we'll by making an asynchronous call to load the view, we'll just
    // return an empty div container, with a script snippet to load the view.
    variables.attributes['class'] += 'view ';
    var html =
      '<div ' + drupalgap_attributes(variables.attributes) + ' ></div>';
    var options = {
      page_id: drupalgap_get_page_id(),
      jqm_page_event: 'pageshow',
      jqm_page_event_callback: '_theme_view',
      jqm_page_event_args: JSON.stringify(variables)
    };
    return html += drupalgap_jqm_page_event_script_code(options);
  }
  catch (error) { console.log('theme_view - ' + error); }
}

/**
 * An internal function used to theme a view.
 * @param {Object} variables
 */
function _theme_view(variables) {
  try {
    // Determine what page of the view we're on.
    var page = 0;
    if (variables.page) { page = variables.page; }
    // Make a copy of variables and prepare the success callback for embedding
    // the view.
    var variables_copy = $.extend(
      {},
      {
        success: function(html) {
          try {
            $('#' + variables.attributes.id).html(html);
          }
          catch (error) {
            console.log('_theme_view - success - ' + error);
          }
        }
      },
      variables
    );
    // Finally, embed the view.
    views_embed_view(variables.path + '&page=' + page, variables_copy);
  }
  catch (error) { console.log('_theme_view - ' + error); }
}

// A global variable used to hold the current views' results during a views
// embed view call.
var _views_embed_view_results = null;

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
            _views_embed_view_results = results;
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
            _views_embed_view_results = null;
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
    var results = _views_embed_view_results;
    if (!results) { return html; }
    // Extract the root and child object name.
    var root = results.view.root;
    var child = results.view.child;
    // Is there a title to display?
    if (variables.title) {
      var title_attributes = variables.title_attributes ?
        drupalgap_attributes(variables.title_attributes) : '';
      html +=
        '<div ' + title_attributes + '><h2>' + variables.title + '</h2></div>' +
        theme('views_spacer', null);
    }
    // Are the results empty? If so, return the empty callback's html, if it
    // exists. Often times, the empty callback will want to place html that
    // needs to be enhanced by jQM, therefore we'll set a timeout to trigger
    // the creation of the content area.
    if (results.view.count == 0 && variables.empty_callback &&
      function_exists(variables.empty_callback)
    ) {
      var empty_callback = window[variables.empty_callback];
      var selector = '#' + drupalgap_get_page_id() + ' #' + id;
      $(selector).hide();
      setTimeout(function() {
          $(selector).trigger('create').show('fast');
      }, 100);
      return empty_callback(results.view);
    }
    // Depending on the format, let's render the container opening and closing,
    // and then render the rows.
    if (!variables.format) { variables.format = 'unformatted_list'; }
    var open = '';
    var close = '';
    var open_row = '';
    var close_row = '';
    switch (variables.format) {
      case 'ul':
        open = '<ul data-role="listview">';
        close = '</ul>';
        open_row = '<li>';
        close_row = '</li>';
        break;
      case 'ol':
        open = '<ol data-role="listview">';
        close = '</ol>';
        open_row = '<li>';
        close_row = '</li>';
        break;
      case 'table':
      case 'jqm_table':
        var table_attributes = '';
        if (variables.format == 'jqm_table') {
          table_attributes = drupalgap_attributes({
            'data-role': 'table',
            'data-mode': 'reflow'
          });
          console.log(
            'WARNING: theme_views_view() - jqm_table not supported, yet'
          );
        }
        open = '<table ' + table_attributes + '>';
        close = '</table>';
        open_row = '<tr>';
        close_row = '</tr>';
        break;
      case 'unformatted_list':
      default:
        open = '<div class="views-rows">';
        close = '</div>';
        open_row = '<div>';
        close_row = '</div>';
        break;
    }
    var rows = '' + open;
    $.each(results[root], function(count, object) {
        // Extract the row.
        var row = object[child];
        // Mark the row count.
        row.count = count;
        // If a row_callback function exists, call it to render the row,
        // otherwise use the default row render mechanism.
        var row_content = '';
        if (variables.row_callback && function_exists(variables.row_callback)) {
          row_callback = window[variables.row_callback];
          row_content = row_callback(results.view, row);
        }
        else { row_content = JSON.stringify(row); }
        rows += open_row + row_content + close_row;
    });
    rows += close;
    // If we have any pages, render the pager above or below the results
    // according to the pager_pos setting.
    var pager = '';
    if (results.view.pages) { pager = theme('pager', variables); }
    var pager_pos = 'top';
    if (typeof variables.pager_pos !== 'undefined') {
      pager_pos = variables.pager_pos;
    }
    // Append the rendered rows and the pager to the html string according to
    // the pager position.
    if (pager_pos == 'top') {
      html += pager + theme('views_spacer', null) + rows;
    }
    else if (pager_pos == 'bottom') {
      html += rows + theme('views_spacer', null) + pager;
    }
    else {
      console.log('WARNING: theme_views_view - unsupported pager_pos (' +
        pager_pos +
      ')');
    }
    // Since the views content is injected dynamically after the page is loaded,
    // we need to have jQM refresh the page to add its styling.
    var selector =
      '#' + drupalgap_get_page_id() +
      ' #' + variables.attributes.id;
    $(selector).hide();
    setTimeout(function() {
        $(selector).trigger('create').show('fast');
    }, 100);
    return html;
  }
  catch (error) { console.log('theme_views_view - ' + error); }
}

/**
 * Themes a spacer that can be placed between displayed components of the view.
 * @param {Object} variables
 * @return {String}
 */
function theme_views_spacer(variables) {
  try {
    return '<h2 class="dg_empty_list_header">&nbsp;</h2>';
  }
  catch (error) { console.log('theme_views_spacer - ' + error); }
}

/**
 * Themes a pager.
 * @param {Object} variables
 * @return {String}
 */
function theme_pager(variables) {
  try {
    var html = '';
    // Extract the view and pager data.
    var view = variables.results.view;
    var page = view.page;
    var pages = view.pages;
    var count = view.count;
    var limit = view.limit;
    var page = view.page;
    // If we don't have any results, return.
    if (count == 0) { return html; }
    // Add the pager items to the list.
    var items = [];
    if (page != 0) { items.push(theme('pager_previous', variables)); }
    if (page != pages - 1) { items.push(theme('pager_next', variables)); }
    if (items.length > 0) {
      // Make sure we have an id to use since we need to dynamically build the
      // navbar container for the pager. If we don't have one, generate a random
      // one.
      var id = 'theme_pager_' + user_password();
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
 * @param {Object} link_vars
 * @return {String}
 */
function theme_pager_link(variables, link_vars) {
  try {
    var onclick = _theme_pager_link_onclick(variables);
    return "<a href='#' onclick='" + onclick + "'>" + link_vars.text + '</a>';
  }
  catch (error) { console.log('theme_pager_link - ' + error); }
}

/**
 * An internal function used to generate the onclick handler JS for a pager
 * link.
 * @param {Object} variables
 * @return {String}
 */
function _theme_pager_link_onclick(variables) {
  try {
    // Make a copy of variables. While doing so remove any results from it
    // because we don't want them in the onclick handler's html. The results
    // will be available in the _views_embed_view_results variable if they are
    // needed
    var copy = $.extend({ }, { }, variables);
    if (copy.results) { delete copy.results; }
    var onclick = '_theme_pager_link_click(' + JSON.stringify(copy) + ')';
    return onclick;
  }
  catch (error) { console.log('_theme_pager_link_onclick - ' + error); }
}

/**
 * An internal function used to handle clicks on pager links.
 * @param {Object} variables
 */
function _theme_pager_link_click(variables) {
  try {
    _theme_view(variables);
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
    variables.page = variables.results.view.page + 1;
    var link_vars = {
      text: '&raquo;',
      attributes: {
        'class': 'pager_next'
      }
    };
    html = theme_pager_link(variables, link_vars);
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
    variables.page = variables.results.view.page - 1;
    var link_vars = {
      text: '&laquo;',
      attributes: {
        'class': 'pager_previous'
      }
    };
    html = theme_pager_link(variables, link_vars);
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

