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
 * Returns the path to the current DrupalGap theme, false otherwise.
 * @return {String|Boolean}
 */
function path_to_theme() {
  try {
    if (drupalgap.theme_path) {
      return drupalgap.theme_path;
    }
    else {
      console.log('path_to_theme - drupalgap.theme_path is not set!');
      return false;
    }
  }
  catch (error) { console.log('path_to_theme - ' + error); }
}

/**
 * Implementation of theme().
 * @param {String} hook
 * @param {Object} variables
 * @return {String}
 */
function theme(hook, variables) {
  try {

    // If there is HTML markup present, just return it as is. Otherwise, run
    // the theme hook and send along the variables.
    if (!variables) { variables = {}; }
    if (variables.markup) { return variables.markup; }
    var content = '';

    // First see if the current theme implements the hook, if it does use it, if
    // it doesn't fallback to the core theme implementation of the hook.
    var theme_function = drupalgap.settings.theme + '_' + hook;
    if (!function_exists(theme_function)) {
      theme_function = 'theme_' + hook;
      if (!function_exists(theme_function)) {
        var caller = null;
        if (arguments.callee.caller) {
          caller = arguments.callee.caller.name;
        }
        var msg = 'WARNING: ' + theme_function + '() does not exist.';
        if (caller) { msg += ' Called by: ' + caller + '().' }
        console.log(msg);
        return content;
      }
    }

    // If no attributes are coming in, look to variables.options.attributes
    // as a secondary option, otherwise setup an empty JSON object for them.
    if (
      typeof variables.attributes === 'undefined' ||
      !variables.attributes
    ) {
      if (variables.options && variables.options.attributes) {
        variables.attributes = variables.options.attributes;
      }
      else {
        variables.attributes = {};
      }
    }
    // If there is no class name, set an empty one.
    if (!variables.attributes['class']) {
      variables.attributes['class'] = '';
    }
    var fn = window[theme_function];
    content = fn.call(null, variables);
    return content;
  }
  catch (error) { console.log('theme - ' + error); }
}

/**
 * Autocomplete global variables. Used to hold onto various global variables
 * needed for an autocomplete.
 */
// The autocomplete text field input selector.
var _theme_autocomplete_input_selector;

// The autocomplete remote boolean.
var _theme_autocomplete_remote;

// The theme autocomplete variables.
var _theme_autocomplete_variables;

/**
 * Themes an autocomplete.
 * @param {Object} variables
 * @return {String}
 */
function theme_autocomplete(variables) {
  try {
    var html = '';

    // Hold onto a copy of the variables.
    _theme_autocomplete_variables = variables;

    // Are we dealing with a remote data set.
    var remote = false;
    if (variables.remote) { remote = true; }
    variables.remote = remote;
    _theme_autocomplete_remote = variables.remote;

    // Make sure we have an id to use on the list.
    var id = null;
    if (variables.attributes.id) { id = variables.attributes.id; }
    else {
      id = 'autocomplete_' + user_password();
      variables.attributes.id = id;
    }

    // We need a hidden input to hold the value.
    html += theme('hidden', { attributes: { id: id } });

    // Now we need an id for the list.
    var list_id = id + '-list';

    // Build the widget variables.
    var widget = {
      attributes: {
        'id': list_id,
        'data-role': 'listview',
        'data-filter': 'true',
        'data-inset': 'true',
        'data-filter-placeholder': '...'
      }
    };

    // Handle a remote data set.
    var js = '';
    if (variables.remote) {
      widget.items = [];
      // We have a remote data set.
      js += '<script type="text/javascript">' +
        '$("#' + list_id + '").on("filterablebeforefilter", function(e, d) { ' +
          '_theme_autocomplete(this, e, d); ' +
        '});' +
      '</script>';
    }
    else {
      // Prepare the items then set the data filter reveal attribute.
      widget.items = _theme_autocomplete_prepare_items(variables);
      widget.attributes['data-filter-reveal'] = true;
    }

    // Save a reference to the autocomplete text field input.
    var selector = '#' + drupalgap_get_page_id() +
      ' input[data-type="search"]';
    js += '<script type="text/javascript">' +
      '_theme_autocomplete_input_selector = \'' + selector + '\';' +
    '</script>';

    // Theme the list and add the js to it, then return the html.
    html += theme('item_list', widget);
    html += js;
    return html;
  }
  catch (error) { console.log('theme_autocomplete - ' + error); }
}

/**
 * An internal function used to handle remote data for an autocomplete.
 * @param {Object} list The unordered list that displays the items.
 * @param {Object} e
 * @param {Object} data
 */
function _theme_autocomplete(list, e, data) {
  try {
    // Make sure a filter is present.
    if (typeof _theme_autocomplete_variables.filter === 'undefined') {
      console.log(
        '_theme_autocomplete - A "filter" was not supplied.'
      );
      return;
    }
    // Make sure a value and/or label has been supplied so we know how to render
    // the items in the autocomplete list.
    var value_provided =
      typeof _theme_autocomplete_variables.value !== 'undefined' ? true : false;
    var label_provided =
      typeof _theme_autocomplete_variables.label !== 'undefined' ? true : false;
    if (!value_provided && !label_provided) {
      console.log(
        '_theme_autocomplete - A "value" and/or "label" was not supplied.'
      );
      return;
    }
    else {
      // We have a value and/or label. If one isn't provided, set it equal to
      // the other.
      if (!value_provided) {
        _theme_autocomplete_variables.value =
          _theme_autocomplete_variables.label;
      }
      else if (!label_provided) {
        _theme_autocomplete_variables.label =
          _theme_autocomplete_variables.value;
      }
    }
    // Setup the vars to handle this widget.
    var $ul = $(list),
        $input = $(data.input),
        value = $input.val(),
        html = '';
    // Clear the list.
    $ul.html('');
    // If a value has been input, start the autocomplete search.
    if (value && value.length > 0) {
      // Show the loader icon.
      $ul.html('<li><div class="ui-loader">' +
        '<span class="ui-icon ui-icon-loading"></span>' +
        '</div></li>');
      $ul.listview('refresh');
      // Prepare the path to the view.
      var path = _theme_autocomplete_variables.path + '?' +
        _theme_autocomplete_variables.filter + '=' + encodeURIComponent(value);
      // Any extra params to send along?
      if (_theme_autocomplete_variables.params) {
        path += '&' + _theme_autocomplete_variables.params;
      }
      // Retrieve JSON results. Keep in mind, we use this for retrieving Views
      // JSON results and custom hook_menu() path results in Drupal.
      views_datasource_get_view_result(path, {
          success: function(results) {
            // If this was a custom path, don't use a wrapper around the
            // results like the one used by Views Datasource.
            var wrapped = true;
            if (_theme_autocomplete_variables.custom) { wrapped = false; }

            // Extract the result items based on the presence of the wrapper or
            // not.
            var result_items = null;
            if (wrapped) { result_items = results[results.view.root]; }
            else { result_items = results; }

            // If there are no results, just return.
            if (result_items.length == 0) { return; }

            // Convert the result into an items array for a list. Each item will
            // be a JSON object with a "value" and "label" properties.
            var items = [];
            var _value = _theme_autocomplete_variables.value;
            var _label = _theme_autocomplete_variables.label;
            $.each(result_items, function(index, object) {
                var _item = null;
                if (wrapped) { _item = object[results.view.child]; }
                else { _item = object; }
                var item = {
                  value: _item[_value],
                  label: _item[_label]
                };
                items.push(item);
            });

            // Now render the items, add them to list and refresh the list.
            if (items.length == 0) { return; }
            _theme_autocomplete_variables.items = items;
            var _items = _theme_autocomplete_prepare_items(
              _theme_autocomplete_variables
            );
            $.each(_items, function(index, item) {
              html += '<li>' + item + '</li>';
            });
            $ul.html(html);
            $ul.listview('refresh');
            $ul.trigger('updatelayout');
          }
      });
    }
  }
  catch (error) { console.log('_theme_autocomplete - ' + error); }
}

/**
 * An internal function used to prepare the items for an autocomplete list.
 * @param {Object} variables
 * @return {*}
 */
function _theme_autocomplete_prepare_items(variables) {
  try {
    // Make sure we have an items array.
    var items = [];
    if (variables.items) { items = variables.items; }

    // Prepare the items, and return them.
    var _items = [];
    if (items.length > 0) {
      $.each(items, function(index, item) {
          var value = '';
          var label = '';
          if (typeof item === 'string') {
            value = item;
            label = item;
          }
          else {
            value = item.value;
            label = item.label;
          }
          var options = {
            attributes: {
              value: value,
              onclick: '_theme_autocomplete_click(\'' +
                variables.attributes.id +
              '\', this)'
            }
          };
          var _item = l(label, null, options);
          _items.push(_item);
      });
    }
    return _items;
  }
  catch (error) { console.log('_theme_autocomplete_prepare_items - ' + error); }
}

/**
 * An internal function used to handle clicks on items in autocomplete results.
 * @param {String} id The id of the hidden input that holds the value.
 * @param {Object} item The list item anchor that was just clicked.
 */
function _theme_autocomplete_click(id, item) {
  try {
    // Set the hidden input with the value, and the text field with the text.
    var list_id = id + '-list';
    $('#' + id).val($(item).attr('value'));
    $(_theme_autocomplete_input_selector).val($(item).html());
    if (_theme_autocomplete_remote) {
      $('#' + list_id).html('');
    }
    else {
      $('#' + list_id + ' li').addClass('ui-screen-hidden');
      $('#' + list_id).listview('refresh');
    }
    // Now fire the item onclick handler, if one was provided.
    if (
      _theme_autocomplete_variables.item_onclick &&
      drupalgap_function_exists(_theme_autocomplete_variables.item_onclick)
    ) {
      var fn = window[_theme_autocomplete_variables.item_onclick];
      fn(id, $(item));
    }
  }
  catch (error) { console.log('_theme_autocomplete_click - ' + error); }
}

/**
 * Themes a button.
 * @param {Object} variables
 * @return {String}
 */
function theme_button(variables) {
  try {
    variables.attributes['data-role'] = 'button';
    var html = '<a ' + drupalgap_attributes(variables.attributes) + '>' +
      variables.text +
    '</a>';
    return html;
  }
  catch (error) { console.log('theme_button_link - ' + error); }
}

/**
 * Themes a button link.
 * @param {Object} variables
 * @return {String}
 */
function theme_button_link(variables) {
  try {
    variables.attributes['data-role'] = 'button';
    return theme_link(variables);
  }
  catch (error) { console.log('theme_button_link - ' + error); }
}

/**
 * Themes a collapsible widget.
 * @param {Object} variables
 * @return {String}
 */
function theme_collapsible(variables) {
  try {
    variables.attributes['data-role'] = 'collapsible';
    var header_type = 'h2';
    if (variables.header_type) { header_type = variables.header_type; }
    var header_attributes = {};
    if (variables.header_attributes) {
      header_attributes = variables.header_attributes;
    }
    var html = '<div ' + drupalgap_attributes(variables.attributes) + '>' +
      '<' + header_type + ' ' + drupalgap_attributes(header_attributes) + '>' +
        variables.header +
      '</' + header_type + '>' + variables.content + '</div>';
    return html;
  }
  catch (error) { console.log('theme_collapsible - ' + error); }
}

/**
 * Themes a collapsibleset widget.
 * @param {Object} variables
 * @return {String}
 */
function theme_collapsibleset(variables) {
  try {
    variables.attributes['data-role'] = 'collapsible-set';
    var html = '<div ' + drupalgap_attributes(variables.attributes) + '>';
    $.each(variables.items, function(index, item) {
        html += theme('collapsible', item);
    });
    html += '</div>';
    return html;
  }
  catch (error) { console.log('theme_collapsibleset - ' + error); }
}

/**
 * Themes a controlgroup widget.
 * @param {Object} variables
 * @return {String}
 */
function theme_controlgroup(variables) {
  try {
    variables.attributes['data-role'] = 'controlgroup';
    var html = '<div ' + drupalgap_attributes(variables.attributes) + '>';
    $.each(variables.items, function(index, item) { html += item; });
    html += '</div>';
    return html;
  }
  catch (error) { console.log('theme_controlgroup - ' + error); }
}

/**
 * Themes a header widget.
 * @param {Object} variables
 * @return {String}
 */
function theme_header(variables) {
  try {
    variables.attributes['data-role'] = 'header';
    if (typeof variables.type === 'undefined') { type = 'h2'; }
    var html = '<div ' + drupalgap_attributes(variables.attributes) + '>' +
      '<' + type + '>' + variables.text + '</' + type + '></div>';
    return html;
  }
  catch (error) { console.log('theme_header - ' + error); }
}

/**
 * Implementation of theme_image().
 * @param {Object} variables
 * @return {String}
 */
function theme_image(variables) {
  try {
    // Turn the path, alt and title into attributes if they are present.
    if (variables.path) { variables.attributes.src = variables.path; }
    if (variables.alt) { variables.attributes.alt = variables.alt; }
    if (variables.title) { variables.attributes.title = variables.title; }
    // Render the image.
    return '<img ' + drupalgap_attributes(variables.attributes) + ' />';
  }
  catch (error) { console.log('theme_image - ' + error); }
}

/**
 * Implementation of theme_image_style().
 * @param {Object} variables
 * @return {String}
 */
function theme_image_style(variables) {
  try {
    variables.path = image_style_url(variables.style_name, variables.path);
    return theme_image(variables);
  }
  catch (error) { console.log('theme_image - ' + error); }
}

/**
 * Theme's an item from an MVC collection.
 * @param {Object} variables
 * @return {String}
 */
function theme_item(variables) {
  try {
    var html = '';
    //var mvc_model_system_fields
    $.each(variables.item, function(field, value) {
        html +=
          '<h2>' + variables.model.fields[field].title + '</h2>' +
          '<p>' + value + '</p>';
    });
    return html;
  }
  catch (error) { console.log('theme_item - ' + error); }
}

/**
 * Implementation of theme_item_list().
 * @param {Object} variables
 * @return {String}
 */
function theme_item_list(variables) {
  try {
    // We'll theme an empty list unordered list by default, if there is a type
    // of list specified we'll use that, and if there are some items we'll
    // theme them too.
    var type = 'ul';
    if (variables.type) { type = variables.type; }
    var html = '';
    if (variables.title) { html += '<h2>' + variables.title + '</h2>'; }
    html += '<' + type + ' ' +
      drupalgap_attributes(variables.attributes) + '>';
    if (variables.items && variables.items.length > 0) {
      var listview = typeof variables.attributes['data-role'] !== 'undefined' &&
          variables.attributes['data-role'] == 'listview';
      $.each(variables.items, function(index, item) {
          var icon;
          html += '<li';
          if (listview && (icon = $(item).attr('data-icon'))) {
            // If we're in a listview and the item specifies an icon,
            // add the icon attribute to the list item element.
            html += ' data-icon="' + icon + '"';
          }
          html += '>' + item + '</li>';
      });
    }
    html += '</' + type + '>';
    return html;
  }
  catch (error) { console.log('theme_item_list - ' + error); }
}

/**
 * Identical to theme_item_list, except this turns the list into a jQM listview.
 * @param {Object} variables
 * @return {String}
 */
function theme_jqm_item_list(variables) {
  try {
    if (variables.attributes) {
      if (
        variables.attributes['data-role'] &&
        variables.attributes['data-role'] != 'listview'
      ) { }
      else {
        variables.attributes['data-role'] = 'listview';
      }
    }
    else {
      variables.attributes['data-role'] = 'listview';
    }
    return theme_item_list(variables);
  }
  catch (error) { console.log('theme_jqm_item_list - ' + error); }
}

/**
 * Implementation of theme_link().
 * @param {Object} variables
 * @return {String}
 */
function theme_link(variables) {
  try {
    var text = '';
    if (variables.text) { text = variables.text; }
    if (typeof variables.path !== 'undefined' && variables.path != null) {
      // By default our onclick will use a drupalgap_goto(). If we have any
      // incoming link options, then modify the link accordingly.
      var onclick = 'drupalgap_goto(\'' + variables.path + '\');';
      if (variables.options) {
        // Use an InAppBrowser?
        if (variables.options.InAppBrowser) {
          onclick =
            "window.open('" + variables.path + "', '_blank', 'location=yes');";
        }
        else {
          // All other options need to be extracted into a JSON string for the
          // onclick handler.
          var goto_options = '';
          $.each(variables.options, function(option, value) {
              if (option == 'attributes') { return; }
              if (typeof value === 'string') { value = "'" + value + "'"; }
              goto_options += option + ':' + value + ',';
          });
          onclick =
            'drupalgap_goto(\'' +
              variables.path + '\', ' +
              '{' + goto_options + '});';
        }
      }
      return '<a href="#" onclick="javascript:' + onclick + '"' +
        drupalgap_attributes(variables.attributes) + '>' + text + '</a>';
    }
    else {
      // The link has no path, so just render the text and attributes.
      if (typeof variables.attributes.href === 'undefined') {
        variables.attributes.href = '#';
      }
      return '<a ' + drupalgap_attributes(variables.attributes) + '>' +
        text +
      '</a>';
    }
  }
  catch (error) { console.log('theme_link - ' + error); }
}

/**
 * Themes the logout button.
 * @param {Object} variables
 * @return {String}
 */
function theme_logout(variables) {
  try {
    return bl(
      'Logout',
      'user/logout',
      {
        attributes: {
          'data-icon': 'action',
          'data-iconpos': 'right'
        }
      }
    );
  }
  catch (error) { console.log('theme_logout - ' + error); }
}

/**
 * Themes a popup widget.
 * @param {Object} variables
 * @return {String}
 */
function theme_popup(variables) {
  try {
    variables.attributes['data-role'] = 'popup';
    var button_attributes = {};
    if (variables.button_attributes) {
      button_attributes = variables.button_attributes;
    }
    button_attributes.href = '#' + variables.attributes.id;
    button_attributes['data-rel'] = 'popup';
    var html = bl(variables.button_text, null, {
        attributes: button_attributes
    }) +
    '<div ' + drupalgap_attributes(variables.attributes) + '>' +
      variables.content +
    '</div>';
    return html;
  }
  catch (error) { console.log('theme_popup - ' + error); }
}

/**
 * Implementation of theme_submit().
 * @param {Object} variables
 * @return {String}
 */
function theme_submit(variables) {
  try {
    return '<button ' + drupalgap_attributes(variables.attributes) + '>' +
      variables.element.value +
    '</button>';
  }
  catch (error) { console.log('theme_submit - ' + error); }
}

/**
 * Implementation of theme_table().
 * @param {Object} variables
 * @return {String}
 */
function theme_table(variables) {
  try {
    var html = '<table ' + drupalgap_attributes(variables.attributes) + '>';
    if (variables.header) {
      html += '<thead><tr>';
      $.each(variables.header, function(index, column) {
          if (column.data) {
            html += '<td>' + column.data + '</td>';
          }
      });
      html += '</tr></thead>';
    }
    html += '<tbody>';
    if (variables.rows) {
      $.each(variables.rows, function(row_index, row) {
          html += '<tr>';
          if (row) {
            $.each(row, function(column_index, column) {
                html += '<td>' + column + '</td>';
            });
          }
          html += '</tr>';
      });
    }
    return html + '</tbody></table>';
  }
  catch (error) { console.log('theme_table - ' + error); }
}

/**
 * Theme a jQueryMobile table.
 * @param {Object} variables
 * @return {String}
 */
function theme_jqm_table(variables) {
  try {
    variables.attributes['data-role'] = 'table';
    variables.attributes['data-mode'] = 'reflow';
    return theme_table(variables);
  }
  catch (error) { console.log('theme_jqm_table - ' + error); }
}

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

