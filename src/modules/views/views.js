// Used to hold onto the current views' exposed filter query string.
var _views_exposed_filter_query = null;

// Used to mark if the exposed filter's reset button is shown or not.
var _views_exposed_filter_reset = false;

// Used to hold onto the current views' exposed filter submit's theme variables.
var _views_exposed_filter_submit_variables = null;

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
 * The exposed filter form builder.
 * @param {Object} form
 * @param {Object} form_state
 * @param {Object} options
 * @return {Object}
 */
function views_exposed_form(form, form_state, options) {
  try {

    // @TODO we tried to make the filters collapsible, but jQM doesn't seem to
    // like collapsibles with form inputs in them... weird.
    //var title = form.title ? form.title : 'Filter';
    //form.prefix += '<div data-role="collapsible"><h2>' + title + '</h2>';

    // Attach the variables to the form so it can be used later.
    form.variables = options.variables;

    $.each(options.filter, function(views_field, filter) {

        // Prep the element basics.
        var element_id = null;
        var element = null;
        // @TODO - This ID is NOT unique enough, it will cause DOM collisions if
        // the same exposed filter gets used twice...
        // @TODO - we should be attaching the value right here, so filter
        // implementors don't need to extract it on their own. Once this is
        // implemented. Then update *_views_exposed_filter() to use this value
        // instead.
        element_id = filter.options.expose.identifier;
        element = {
          id: element_id,
          type: filter.options.group_info.widget,
          title: filter.options.expose.label,
          required: filter.options.expose.required,
          options: {
            attributes: {
              id: drupalgap_form_get_element_id(element_id, form.id)
            }
          },
          views_field: views_field,
          filter: filter,
          children: []
        };
        // Attach the value to the element, if there is one.
        // @TODO Add multi value support.
        //if (!empty(filter.value)) { element.value = filter.value[0]; }

        // Grab the field name and figure out which module is in charge of it.
        var field_name = filter.definition.field_name;
        if (field_name) {

          // This is an entity field...

          // Grab the field info, and determine the module that will handle it.
          // Then see if hook_views_exposed_filter() has been implemented by
          // that module. That module will be used to assemble the element. If
          // we don't have a handler then just skip the filter.
          var field = drupalgap_field_info_field(field_name);
          var module = field.module;
          var handler = module + '_views_exposed_filter';
          if (!drupalgap_function_exists(handler)) {
            dpm(
              'WARNING: views_exposed_form() - ' + handler + '() must be ' +
              'created to assemble the ' + field.type + ' filter used by ' +
              field_name
            );
            return;
          }

          // We have a handler, let's call it so the element can be assembled.
          window[handler](form, form_state, element, filter, field);

        }
        else {
          // This is NOT an entity field, so it is probably a core field (e.g.
          // nid, status, etc). Let's assemble the element. In some cases we may
          // just be able to forward it to a pre-existing handler.
          if (element.type == 'select') {
            list_views_exposed_filter(form, form_state, element, filter, null);
          }
          else {
            dpm(
              'WARNING: views_exposed_form() - I do not know how to handle ' +
              'the exposed filter for the "' + views_field + '" field'
            );
            dpm(filter);
            return;
          }
        }

        // Finally attach the assembled element to the form.
        if (element_id) { form.elements[element_id] = element; }

    });

    // Add the submit button.
    form.elements['submit'] = {
      type: 'submit',
      value: options.exposed_data.submit
    };

    // Add the reset button, if necessary.
    if (options.exposed_data.reset && _views_exposed_filter_reset) {
      form.buttons['reset'] = {
        title: options.exposed_data.reset,
        attributes: {
          id: form.id + '-reset',
          onclick: 'views_exposed_form_reset()'
        }
      };
    }

    //form.suffix += '</div>';

    return form;
  }
  catch (error) { console.log('views_exposed_form - ' + error); }
}

/**
 * The exposed filter submission handler.
 * @param {Object} form
 * @param {Object} form_state
 */
function views_exposed_form_submit(form, form_state) {
  try {

    // Assemble the query string from the form state values.
    var query = '';
    $.each(form_state.values, function(key, value) {
        if (empty(value)) { return; }
        query += key + '=' + encodeURIComponent(value) + '&';
    });
    if (!empty(query)) { query = query.substr(0, query.length - 1); }

    // If there is a query set aside from previous requests, and it is equal to
    // the submitted query, then stop the submission. Otherwise remove it from
    // the path.
    if (_views_exposed_filter_query) {
      if (_views_exposed_filter_query == query) { return; }
      if (
        form.variables.path.indexOf('&' + _views_exposed_filter_query) != -1
      ) {
        form.variables.path =
        form.variables.path.replace('&' + _views_exposed_filter_query, '');
      }
    }

    // Set aside a copy of the query string, so it can be removed from the path
    // upon subsequent submissions of the form.
    _views_exposed_filter_query = query;

    // Indicate that we have an exposed filter, so the reset button can easily
    // be shown/hidden.
    _views_exposed_filter_reset = true;

    // Update the path for the view, reset the pager, hold onto the variables,
    // then theme the view.
    form.variables.path += '&' + query;
    form.variables.page = 0;
    _views_exposed_filter_submit_variables = form.variables;
    _theme_view(form.variables);

  }
  catch (error) { console.log('views_exposed_form_submit - ' + error); }
}

/**
 * Handles clicks on the views exposed filter form's reset button.
 */
function views_exposed_form_reset() {
  try {
    // Reset the path to the view, the page, and the global vars, then re-theme
    // the view.
    _views_exposed_filter_submit_variables.path =
      _views_exposed_filter_submit_variables.path.replace(
        '&' + _views_exposed_filter_query,
        ''
      );

    _views_exposed_filter_submit_variables.page = 0;
    _views_exposed_filter_reset = false;
    _views_exposed_filter_query = null;
    _theme_view(_views_exposed_filter_submit_variables);
  }
  catch (error) { console.log('views_exposed_form_reset - ' + error); }
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
    // Since multiple pages can stack up in the DOM, warn the developer if they
    // re-use a Views ID that is already in the DOM. If the ID hasn't been used
    // yet, add it to the drupalgap.views.ids array.
    if (in_array(variables.attributes.id, drupalgap.views.ids)) {
      // Double check to make sure it is actually in the DOM. If it wasn't
      // really in the DOM, remove the id from drupalgap.views.ids and continue
      // onward.
      if (!$('#' + variables.attributes.id)) {
        // @see http://stackoverflow.com/a/3596141/763010
        drupalgap.views.ids.splice(
          $.inArray(variables.attributes.id, drupalgap.views.ids),
          1
        );
      }
      else {
        dpm(
          'WARNING: theme_view() - this id already exists in the DOM: #' +
          variables.attributes.id +
          ' - the view will be rendered into the first container that is ' +
          'located in the DOM - if you are re-using this same view, it is ' +
          'recommended to append a unique identifier (e.g. an entity id) to ' +
          'your views id, that way you can re-use the same view across ' +
          'multiple pages.'
        );
      }
    }
    else { drupalgap.views.ids.push(variables.attributes.id); }
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
    // Figure out the format.
    if (!variables.format) { variables.format = 'unformatted_list'; }
    // Extract the root and child object name.
    var root = results.view.root;
    var child = results.view.child;
    // Is there a title to display?
    if (variables.title) {
      var title_attributes = variables.title_attributes ?
        variables.title_attributes : null;
      html += theme(
        'header',
        { text: variables.title, attributes: title_attributes }
      );
      // Place spacers after the header for each format, except unformatted.
      if (variables.format != 'unformatted') {
        html += theme('views_spacer', null);
      }
    }
    // Render the exposed filters, if there are any.
    var views_exposed_form_html = '';
    if (typeof results.view.exposed_data !== 'undefined') {
      views_exposed_form_html = drupalgap_get_form(
        'views_exposed_form', {
          exposed_data: results.view.exposed_data,
          exposed_raw_input: results.view.exposed_raw_input,
          filter: results.view.filter,
          variables: variables
        }
      );
    }
    // Are the results empty? If so, return the empty callback's html, if it
    // exists. Often times, the empty callback will want to place html that
    // needs to be enhanced by jQM, therefore we'll set a timeout to trigger
    // the creation of the content area.
    if (results.view.count == 0) {
      var selector = '#' + drupalgap_get_page_id() +
        ' #' + variables.attributes.id;
      $(selector).hide();
      setTimeout(function() {
          $(selector).trigger('create').show('fast');
      }, 100);
      if (
        variables.empty_callback &&
        function_exists(variables.empty_callback)
      ) {
        var empty_callback = window[variables.empty_callback];
        return views_exposed_form_html + empty_callback(results.view);
      }
      return html + views_exposed_form_html;
    }
    // Append the exposed filter html.
    html += views_exposed_form_html;
    // Depending on the format, let's render the container opening and closing,
    // and then render the rows.
    if (!variables.format) { variables.format = 'unformatted_list'; }
    var open = '';
    var close = '';
    var open_row = '';
    var close_row = '';
    // Prepare the format's container attributes.
    var format_attributes = {};
    if (typeof variables.format_attributes !== 'undefined') {
      format_attributes = $.extend(
        true,
        format_attributes,
        variables.format_attributes
      );
    }
    switch (variables.format) {
      case 'ul':
        if (typeof format_attributes['data-role'] === 'undefined') {
          format_attributes['data-role'] = 'listview';
        }
        open = '<ul ' + drupalgap_attributes(format_attributes) + '>';
        close = '</ul>';
        open_row = '<li>';
        close_row = '</li>';
        break;
      case 'ol':
        if (typeof format_attributes['data-role'] === 'undefined') {
          format_attributes['data-role'] = 'listview';
        }
        open = '<ol ' + drupalgap_attributes(format_attributes) + '>';
        close = '</ol>';
        open_row = '<li>';
        close_row = '</li>';
        break;
      case 'table':
      case 'jqm_table':
        if (variables.format == 'jqm_table') {
          if (typeof format_attributes['data-role'] === 'undefined') {
            format_attributes['data-role'] = 'table';
          }
          if (typeof format_attributes['data-mode'] === 'undefined') {
            format_attributes['data-mode'] = 'reflow';
          }
          console.log(
            'WARNING: theme_views_view() - jqm_table not supported, yet'
          );
        }
        open = '<table ' + drupalgap_attributes(format_attributes) + '>';
        close = '</table>';
        open_row = '<tr>';
        close_row = '</tr>';
        break;
      case 'unformatted_list':
      default:
        if (typeof format_attributes['class'] === 'undefined') {
          format_attributes['class'] = '';
        }
        format_attributes['class'] += ' views-rows';
        open = '<div ' + drupalgap_attributes(format_attributes) + '>';
        close = '</div>';
        open_row = '';
        close_row = '';
        break;
    }
    var rows = '' + open;
    $.each(results[root], function(count, object) {
        // Extract the row.
        var row = object[child];
        // Mark the row position.
        row._position = count;
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
      html += pager;
      if (!empty(pager)) { html += theme('views_spacer', null); }
      html += rows;
    }
    else if (pager_pos == 'bottom') {
      html += rows;
      if (!empty(pager)) { html += theme('views_spacer', null); }
      html += pager;
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
    return '<h2 class="dg_empty_list_header">&nbsp;</h2>';
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
    if (!link_vars.attributes) { link_vars.attributes = {}; }
    link_vars.attributes.href = '#';
    var attributes = drupalgap_attributes(link_vars.attributes);
    return "<a onclick='" + _theme_pager_link_onclick(variables) + "' " +
      attributes + '>' +
      link_vars.text +
    '</a>';
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

