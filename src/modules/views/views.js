// Holds onto views contexts on a per page basis.
var _views_embedded_views = {};

/**
 * Gets an embedded view for the given page id.
 * @param {String} page_id
 * @returns {Object}
 */
function views_embedded_view_get(page_id) {
  try {
    if (!_views_embedded_views[page_id]) { return null; }
    var property = arguments[1];
    if (!property) { return _views_embedded_views[page_id]; }
    return _views_embedded_views[page_id][property];
  }
  catch (error) { console.log('views_embedded_view_get - ' + error); }
}

/**
 * Given a page id, property name and value, this will set the value for the
 * embedded view.
 * @param {String} page_id
 * @param {String} property
 * @param {*} value
 */
function views_embedded_view_set(page_id, property, value) {
  try {
    if (!_views_embedded_views[page_id]) {
      _views_embedded_views[page_id] = {};
    }
    _views_embedded_views[page_id][property] = value;
  }
  catch (error) { console.log('views_embedded_view_set - ' + error); }
}

/**
 * Given a page id, this will delete the embedded view for the page from
 * memory. Returns true if successful, false otherwise.
 * @param page_id
 * @returns {boolean}
 */
function views_embedded_view_delete(page_id) {
  try {
    if (!_views_embedded_views[page_id]) { return false; }
    var property = arguments[1];
    if (!property) { delete _views_embedded_views[page_id]; }
    else { delete _views_embedded_views[page_id][property]; }
    return true;
  }
  catch (error) { console.log('views_embedded_view_delete - ' + error); }
}

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

    //console.log(form);
    //console.log(form_state);
    //console.log(options);

    // @TODO we tried to make the filters collapsible, but jQM doesn't seem to
    // like collapsibles with form inputs in them... weird.
    //var title = form.title ? form.title : 'Filter';
    //form.prefix += '<div data-role="collapsible"><h2>' + title + '</h2>';

    // Attach the variables to the form so it can be used later.
    form.variables = options.variables;

    for (var views_field in options.filter) {
        if (!options.filter.hasOwnProperty(views_field)) { continue; }
        var filter = options.filter[views_field];

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
            continue;
          }

          // We have a handler, let's call it so the element can be assembled.
          window[handler](form, form_state, element, filter, field);

      }
      else {
          // This is NOT an entity field, so it is probably a core field (e.g.
          // nid, status, etc). Let's assemble the element. In some cases we may
          // just be able to forward it to a pre-existing handler.

          // "Has taxonomy term" exposed filter.
          if (filter.definition.handler == 'views_handler_filter_term_node_tid') {
            element.type = 'autocomplete';
            var autocomplete = {
              remote: true,
              custom: true,
              handler: 'index',
              entity_type: 'taxonomy_term',
              value: 'name',
              label: 'name',
              filter: 'name'
            };
            if (filter.options.vocabulary != '') {
              autocomplete.vid = taxonomy_vocabulary_get_vid_from_name(filter.options.vocabulary);
            }
            $.extend(element, autocomplete, true);
          }
          else if (element.type == 'select') {
            list_views_exposed_filter(form, form_state, element, filter, null);
          }
          else {
            dpm(
              'WARNING: views_exposed_form() - I do not know how to handle ' +
              'the exposed filter for the "' + views_field + '" field'
            );
            console.log(filter);
            continue;
          }
      }

      // Finally attach the assembled element to the form.
      if (element_id) { form.elements[element_id] = element; }

    }

    // Add the submit button.
    form.elements['submit'] = {
      type: 'submit',
      value: options.exposed_data.submit
    };

    // Add the reset button, if necessary.
    if (
      options.exposed_data.reset &&
      views_embedded_view_get(form.variables.page_id, 'exposed_filter_reset')
    ) {
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
    var page_id = form.variables.page_id;
    // Assemble the query string from the form state values.
    var query = '';
    for (var key in form_state.values) {
        if (!form_state.values.hasOwnProperty(key)) { continue; }
        var value = form_state.values[key];
        if (empty(value)) { continue; }
        query += key + '=' + encodeURIComponent(value) + '&';
    }
    if (!empty(query)) { query = query.substr(0, query.length - 1); }

    // If there is a query set aside from previous requests, and it is equal to
    // the submitted query, then stop the submission. Otherwise remove it from
    // the path.
    var _query = views_embedded_view_get(page_id, 'exposed_filter_query');
    if (_query) {
      if (_query == query) { return; }
      if (form.variables.path.indexOf('&' + _query) != -1) {
        form.variables.path =
          form.variables.path.replace('&' + _query, '');
      }
    }

    // Set aside a copy of the query string, so it can be removed from the path
    // upon subsequent submissions of the form.
    views_embedded_view_set(page_id, 'exposed_filter_query', query);

    // Indicate that we have an exposed filter, so the reset button can easily
    // be shown/hidden.
    views_embedded_view_set(page_id, 'exposed_filter_reset', true);

    // Update the path for the view, reset the pager, hold onto the variables,
    // then theme the view.
    form.variables.path += '&' + query;
    form.variables.page = 0;
    views_embedded_view_set(
      page_id,
      'exposed_filter_submit_variables',
      form.variables
    );
    _theme_view(form.variables);

  }
  catch (error) { console.log('views_exposed_form_submit - ' + error); }
}

/**
 * Handles clicks on the views exposed filter form's reset button.
 */
function views_exposed_form_reset() {
  try {
    var page_id = drupalgap_get_page_id();
    // Reset the path to the view, the page, and the global vars, then re-theme
    // the view.
    var exposed_filter_submit_variables =
      views_embedded_view_get(page_id, 'exposed_filter_submit_variables');
    exposed_filter_submit_variables.path =
      exposed_filter_submit_variables.path.replace(
        '&' + views_embedded_view_get(page_id, 'exposed_filter_query'),
        ''
      );
    exposed_filter_submit_variables.page = 0;
    views_embedded_view_set(
      page_id,
      'exposed_filter_submit_variables',
      exposed_filter_submit_variables
    );
    views_embedded_view_set(page_id, 'exposed_filter_reset', false);
    views_embedded_view_set(page_id, 'exposed_filter_query', null);
    _theme_view(exposed_filter_submit_variables);
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

    // Keep track of the page id for context.
    var page_id = drupalgap_get_page_id();
    variables.page_id = page_id;

    // Since we'll by making an asynchronous call to load the view, we'll just
    // return an empty div container, with a script snippet to load the view.
    variables.attributes['class'] += 'view ';
    var html =
      '<div ' + drupalgap_attributes(variables.attributes) + ' ></div>';
    var options = {
      page_id: page_id,
      jqm_page_event: 'pageshow',
      jqm_page_event_callback: '_theme_view',
      jqm_page_event_args: JSON.stringify(variables)
    };
    return html += drupalgap_jqm_page_event_script_code(options, variables.attributes.id);
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
            views_embedded_view_set(options.page_id, 'results', results);
            views_embedded_view_set(options.page_id, 'options', options);
            if (!options.success) { return; }
            options.results = results;

            // Render the view if there are some results, or if there are no results and an
            // empty_callback has been specified. Otherwise remove the empty div container for
            // the view from the DOM.
            if (results.view.count != 0 || results.view.count == 0 && options.empty_callback) {
              options.success(theme('views_view', options));
            }
            else {
              var elem = document.getElementById(options.attributes.id);
              elem.parentElement.removeChild(elem);
            }
          }
          catch (error) {
            console.log('views_embed_view - success - ' + error);
          }
        },
        error: function(xhr, status, message) {
          try {
            views_embedded_view_set(options.page_id, 'results', null);
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
    var results = views_embedded_view_get(variables.page_id, 'results');
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

    // Render the exposed filters if there are any, and the developer didn't explicitly exclude
    // them via the Views Render Array.
    var views_exposed_form_html = '';
    if (typeof results.view.exposed_data !== 'undefined' &&
      (typeof variables.exposed_filters === 'undefined' || variables.exposed_filters)
    ) {
      views_exposed_form_html = drupalgap_get_form(
        'views_exposed_form', {
          exposed_data: results.view.exposed_data,
          exposed_raw_input: results.view.exposed_raw_input,
          filter: results.view.filter,
          variables: variables
        }
      );
    }

    // Determine views container selector and place it in the global context.
    var selector = '#' + variables.page_id + ' #' + variables.attributes.id;
    views_embedded_view_set(variables.page_id, 'selector', selector);

    // Are the results empty? If so, return the empty callback's html, if it
    // exists. Often times, the empty callback will want to place html that
    // needs to be enhanced by jQM, therefore we'll set a timeout to trigger
    // the creation of the content area.
    // @TODO putting views_litepager support here is a hack, we should be
    // implementing views_litepager_views_view for theme_views_view() instead.
    var views_litepager_present = module_exists('views_litepager');
    if (
      (results.view.count == 0 && !views_litepager_present) ||
      (views_litepager_present && results.view.pages == null && results.view.count == 0)
    ) {
      $(selector).hide();
      setTimeout(function() {
          $(selector).trigger('create').show('fast');
      }, 100);
      if (
        variables.empty_callback &&
        function_exists(variables.empty_callback)
      ) {
        var empty_callback = window[variables.empty_callback];
        return views_exposed_form_html + drupalgap_render(empty_callback(results.view));
      }
      return html + views_exposed_form_html;
    }

    // The results are not empty...

    // Append the exposed filter html.
    html += views_exposed_form_html;

    // Render all the rows.
    var result_formats = drupalgap_views_get_result_formats(variables);
    var rows = '' + result_formats.open + drupalgap_views_render_rows(
      variables,
      results,
      root,
      child,
      result_formats.open_row,
      result_formats.close_row
    ) + result_formats.close;

    // If we have any pages, render the pager above or below the results
    // according to the pager_pos setting.
    var pager = '';
    if (results.view.pages) { pager = theme('pager', variables); }
    var pager_pos = 'top';
    if (typeof variables.pager_pos !== 'undefined') {
      pager_pos = variables.pager_pos;
    }

    // Append the rendered rows and the pager to the html string according to
    // the pager position, unless the views infinite scroll module is enabled,
    // then no pager at all.
    // @TODO having this special case for views_infinite_scroll is a hack, we
    // obviously need a hook or something around here...
    if (
      module_exists('views_infinite_scroll') &&
      views_infinite_scroll_ok()
    ) { html += rows; }
    else if (pager_pos == 'top') {
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
    // @TODO putting views_litepager support here is a hack, we should be
    // implementing views_litepager_pager() for theme_pager() instead.
    var views_litepager_present = module_exists('views_litepager');
    if (
      (count == 0 && !views_litepager_present) ||
      (views_litepager_present && variables.results.view.pages == null)
    ) { return html; }
    // Add the pager items to the list.
    var items = [];
    if (page != 0) { items.push(theme('pager_previous', variables)); }
    if (
      (page != pages - 1 && !views_litepager_present) ||
      views_litepager_present
    ) { items.push(theme('pager_next', variables)); }
    if (items.length > 0) {
      // Make sure we have an id to use since we need to dynamically build the
      // navbar container for the pager. If we don't have one, generate a random
      // one.
      var id = 'theme_pager_' + user_password();
      var attrs = {
        id: id,
        'class': 'pager',
        'data-role': 'navbar'
      };
      html += '<div ' + drupalgap_attributes(attrs) + '>' + theme('item_list', {
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
    variables.page = parseInt(variables.results.view.page) + 1;
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
    variables.page = parseInt(variables.results.view.page) - 1;
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
 * A helper function used to retrieve the various open and closing tags for
 * views results, depending on their format.
 * @param {Object} variables
 * @return {Object}
 */
function drupalgap_views_get_result_formats(variables) {
  try {
    var result_formats = {};

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

    // Add a views-results class
    if (typeof format_attributes['class'] === 'undefined') {
      format_attributes['class'] = '';
    }
    format_attributes['class'] += ' views-results ';

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
    result_formats.open = open;
    result_formats.close = close;
    result_formats.open_row = open_row;
    result_formats.close_row = close_row;
    return result_formats;
  }
  catch (error) { console.log('drupalgap_views_get_result_formats - ' + error); }
}

/**
 * A helper function used to render a views result's rows.
 * @param {Object}
 * @param {Object}
 * @param {String}
 * @param {String}
 * @param {String}
 * @param {String}
 * @return {String}
 */
function drupalgap_views_render_rows(variables, results, root, child, open_row, close_row) {
  try {
    var html = '';
    for (var count in results[root]) {
      if (!results[root].hasOwnProperty(count)) { continue; }
      var object = results[root][count];
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
      html += open_row + row_content + close_row;
    }
    return html;
  }
  catch (error) { console.log('drupalgap_views_render_rows - ' + error); }
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
