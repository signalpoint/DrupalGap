// Used to hold onto the terms once they've been loaded into a widget, keyed by
// the form element's id, this allows (views exposed filters particularly) forms
// to easily retrieve the terms after they've been fetch from the server.
var _taxonomy_term_reference_terms = {};

/**
 * Extracts the taxonomy vocabularies JSON objects bundled by the Drupal module
 * into the system connect's resource results.
 * @param {Object} taxonomy_vocabularies
 * @return {Object}
 */
function drupalgap_taxonomy_vocabularies_extract(taxonomy_vocabularies) {
  try {
    var results = false;
    if (taxonomy_vocabularies && taxonomy_vocabularies.length > 0) {
      results = {};
      for (var index in taxonomy_vocabularies) {
          if (!taxonomy_vocabularies.hasOwnProperty(index)) { continue; }
          var vocabulary = taxonomy_vocabularies[index];
          results[vocabulary.machine_name] = vocabulary;
      }
    }
    return results;
  }
  catch (error) {
    console.log('drupalgap_taxonomy_vocabularies_extract - ' + error);
  }
}

/**
 * Implements hook_field_formatter_view().
 * @param {String} entity_type
 * @param {Object} entity
 * @param {Object} field
 * @param {Object} instance
 * @param {String} langcode
 * @param {Object} items
 * @param {*} display
 * @return {Object}
 */
function taxonomy_field_formatter_view(entity_type, entity, field, instance,
  langcode, items, display) {
  try {
    var element = {};
    // If items is a string, convert it into a single item JSON object.
    if (typeof items === 'string') { items = {0: {tid: items}}; }
    // It's possible the term items are wrapped in a language code, if they are,
    // pull them out.
    if (typeof items[language_default()] !== 'undefined') {
      items = items[language_default()];
    }
    if (!empty(items)) {
      for (var delta in items) {
          if (!items.hasOwnProperty(delta)) { continue; }
          var item = items[delta];
          var text = item.tid;
          if (item.name) { text = item.name; }
          var content = null;
          switch (display.type) {
            case 'taxonomy_term_reference_link':
              content = {
                theme: 'button_link',
                text: text,
                path: 'taxonomy/term/' + item.tid
              };
              break;
            case 'taxonomy_term_reference_plain':
              content = { markup: text };
              break;
            default:
              content = { markup: text };
              break;
          }
          element[delta] = content;
      }
    }
    return element;
  }
  catch (error) { console.log('taxonomy_field_formatter_view - ' + error); }
}

/**
 * Implements hook_field_widget_form().
 * @param {Object} form
 * @param {Object} form_state
 * @param {Object} field
 * @param {Object} instance
 * @param {String} langcode
 * @param {Object} items
 * @param {Number} delta
 * @param {Object} element
 */
function taxonomy_field_widget_form(form, form_state, field, instance, langcode,
  items, delta, element) {
  try {
    items[delta].type = 'hidden';
    // Build the widget and attach it to the item.
    var list_id = items[delta].id + '-list';
    var widget = {
      theme: 'item_list',
      items: [],
      attributes: {
        'id': list_id,
        'data-role': 'listview',
        'data-filter': 'true',
        'data-inset': 'true',
        'data-filter-placeholder': '...'
      }
    };
    items[delta].children.push(widget);
    // Attach JS to handle the widget's data fetching.
    var machine_name = field.settings.allowed_values[0].vocabulary;
    var vocabulary = taxonomy_vocabulary_machine_name_load(machine_name);
    var vid = vocabulary.vid;
    var js = '<script type="text/javascript">' +
      '$("#' + list_id + '").on("filterablebeforefilter",' +
        'function(e, d) {' +
          '_taxonomy_field_widget_form_autocomplete(' +
            '"' + items[delta].id + '", ' + vid + ', this, e, d' +
          ');' +
        '}' +
      ');' +
    '</script>';
    items[delta].children.push({
        markup: js
    });
  }
  catch (error) { console.log('taxonomy_field_widget_form - ' + error); }
}

var _taxonomy_field_widget_form_autocomplete_input = null;

/**
 * Handles the remote data fetching for taxonomy term reference autocomplete
 * tagging widget.
 * @param {String} id The id of the hidden input that will hold the term id.
 * @param {Number} vid
 * @param {Object} list The unordered list that displays the terms.
 * @param {Object} e
 * @param {Object} data
 */
function _taxonomy_field_widget_form_autocomplete(id, vid, list, e, data) {
  try {
    // Setup the vars to handle this widget.
    var $ul = $(list),
        $input = $(data.input),
        value = $input.val(),
        html = '';
    // Save a reference to this text input field. Then attach an on change
    // handler that will set the hidden input's value when the text field
    // changes. Keep in mind, later on we listen for clicks on autocomplete
    // results to populate this same hidden input's field.
    _taxonomy_field_widget_form_autocomplete_input = $input;
    $(_taxonomy_field_widget_form_autocomplete_input).on('change', function() {
        $('#' + id).val($(this).val());
    });
    // Clear the list, then set up its input handlers.
    $ul.html('');
    if (value && value.length > 0) {
        $ul.html('<li><div class="ui-loader">' +
          '<span class="ui-icon ui-icon-loading"></span>' +
          '</div></li>');
        $ul.listview('refresh');
        var query = {
          fields: ['tid', 'name'],
          parameters: {
            vid: vid,
            name: '%' + value + '%'
          },
          parameters_op: {
            name: 'like'
          }
        };
        taxonomy_term_index(query, {
            success: function(terms) {
              if (terms.length != 0) {
                // Extract the terms into items, then drop them in the list.
                var items = [];
                for (var index in terms) {
                    if (!terms.hasOwnProperty(index)) { continue; }
                    var term = terms[index];
                    var attributes = {
                      tid: term.tid,
                      vid: vid,
                      name: term.name,
                      onclick: '_taxonomy_field_widget_form_click(' +
                        "'" + id + "', " +
                        "'" + $ul.attr('id') + "', " +
                        'this' +
                      ')'
                    };
                    html += '<li ' + drupalgap_attributes(attributes) + '>' +
                      term.name +
                    '</li>';
                }
                $ul.html(html);
                $ul.listview('refresh');
                $ul.trigger('updatelayout');
              }
            }
        });
    }
  }
  catch (error) {
    console.log('_taxonomy_field_widget_form_autocomplete - ' + error);
  }
}

/**
 * Handles clicks on taxonomy term reference autocomplete widgets.
 * @param {String} id The id of the hidden input that will hold the term name.
 * @param {String} list_id The id of the list that holds the terms.
 * @param {Object} item The list item that was just clicked.
 */
function _taxonomy_field_widget_form_click(id, list_id, item) {
  try {
    var tid = $(item).attr('name');
    $('#' + id).val(tid);
    $(_taxonomy_field_widget_form_autocomplete_input).val($(item).attr('name'));
    $('#' + list_id).html('');
  }
  catch (error) { console.log('_taxonomy_field_widget_form_click - ' + error); }
}

/**
 * Implements hook_assemble_form_state_into_field().
 * @param {Object} entity_type
 * @param {String} bundle
 * @param {String} form_state_value
 * @param {Object} field
 * @param {Object} instance
 * @param {String} langcode
 * @param {Number} delta
 * @param {Object} field_key
 * @return {Object}
 */
function taxonomy_assemble_form_state_into_field(entity_type, bundle,
  form_state_value, field, instance, langcode, delta, field_key) {
  try {
    var result = null;
    switch (instance.widget.type) {
      case 'taxonomy_autocomplete':
        field_key.use_wrapper = false;
        result = form_state_value;
        break;
      case 'options_select':
        result = form_state_value;
        break;
    }
    return result;
  }
  catch (error) {
    console.log('taxonomy_assemble_form_state_into_field - ' + error);
  }
}

/**
 * Implements hook_menu().
 * @return {Object}
 */
function taxonomy_menu() {
    var items = {
      'taxonomy/vocabularies': {
        'title': t('Taxonomy'),
        'page_callback': 'taxonomy_vocabularies_page',
        'pageshow': 'taxonomy_vocabularies_pageshow'
      },
      'taxonomy/vocabulary/%': {
        'title': t('Taxonomy vocabulary'),
        'page_callback': 'taxonomy_vocabulary_page',
        'page_arguments': [2],
        'pageshow': 'taxonomy_vocabulary_pageshow'
      },
      'taxonomy/vocabulary/%/view': {
        'title': t('View'),
        'type': 'MENU_DEFAULT_LOCAL_TASK',
        'weight': -10
      },
      'taxonomy/vocabulary/%/edit': {
        'title': t('Edit'),
        'page_callback': 'entity_page_edit',
        'pageshow': 'entity_page_edit_pageshow',
        'page_arguments': [
          'taxonomy_form_vocabulary',
          'taxonomy_vocabulary',
          2
        ],
        'weight': 0,
        'type': 'MENU_LOCAL_TASK',
        'access_arguments': ['administer taxonomy'],
        options: {reloadPage: true}
      },
      'taxonomy/term/%': {
        'title': t('Taxonomy term'),
        'page_callback': 'taxonomy_term_page',
        'page_arguments': [2],
        'pageshow': 'taxonomy_term_pageshow'
      },
      'taxonomy/term/%/view': {
        'title': t('View'),
        'type': 'MENU_DEFAULT_LOCAL_TASK',
        'weight': -10
      },
      'taxonomy/term/%/edit': {
        'title': t('Edit'),
        'page_callback': 'entity_page_edit',
        'pageshow': 'entity_page_edit_pageshow',
        'page_arguments': ['taxonomy_form_term', 'taxonomy_term', 2],
        'weight': 0,
        'type': 'MENU_LOCAL_TASK',
        'access_arguments': ['administer taxonomy'],
        options: {reloadPage: true}
      }
    };
    return items;
}

/**
 * The taxonomy vocabulary form.
 * @param {Object} form
 * @param {Object} form_state
 * @param {Object} vocabulary
 * @return {Object}
 */
function taxonomy_form_vocabulary(form, form_state, vocabulary) {
  try {

    // Setup form defaults.
    form.entity_type = 'taxonomy_vocabulary';
    form.bundle = null;
    form.action = 'taxonomy/vocabularies';

    // Add the entity's core fields to the form.
    drupalgap_entity_add_core_fields_to_form(
      'taxonomy_vocabulary',
      null,
      form,
      vocabulary
    );

    // Add submit to form.
    form.elements.submit = {
      'type': 'submit',
      'value': t('Save')
    };

    // Add cancel button to form.
    form.buttons['cancel'] = drupalgap_form_cancel_button();

    // If we're editing a vocabulary add a delete button, if the user has
    // access.
    if (vocabulary && vocabulary.vid && user_access('administer taxonomy')) {
      form.buttons['delete'] = drupalgap_entity_edit_form_delete_button(
        'taxonomy_vocabulary',
        vocabulary.vid
      );
    }

    return form;
  }
  catch (error) { console.log('taxonomy_form_vocabulary - ' + error); }
}

/**
 * The taxonomy vocabulary form submit handler.
 * @param {Object} form
 * @param {Object} form_state
 */
function taxonomy_form_vocabulary_submit(form, form_state) {
  try {
    var vocabulary = drupalgap_entity_build_from_form_state(form, form_state);
    drupalgap_entity_form_submit(form, form_state, vocabulary);
  }
  catch (error) { console.log('taxonomy_form_vocabulary_submit - ' + error); }
}

/**
 * The taxonomy term form.
 * @param {Object} form
 * @param {Object} form_state
 * @param {Object} term
 * @return {Object}
 */
function taxonomy_form_term(form, form_state, term) {
  try {
    // Setup form defaults.
    form.entity_type = 'taxonomy_term';
    form.bundle = null;
    form.action = 'taxonomy/vocabularies';

    // Add the entity's core fields to the form.
    drupalgap_entity_add_core_fields_to_form('taxonomy_term', null, form, term);

    // Add submit to form.
    form.elements.submit = {
      'type': 'submit',
      'value': t('Save')
    };

    // Add cancel button to form.
    form.buttons['cancel'] = drupalgap_form_cancel_button();

    // If we are editing a term, add a delete button.
    if (term && term.tid && user_access('administer taxonomy')) {
      form.buttons['delete'] = drupalgap_entity_edit_form_delete_button(
        'taxonomy_term',
        term.tid
      );
    }

    return form;
  }
  catch (error) { console.log('taxonomy_form_term - ' + error); }
}

/**
 * The taxonomy term form submit handler.
 * @param {Object} form
 * @param {Object} form_state
 */
function taxonomy_form_term_submit(form, form_state) {
  try {
    var term = drupalgap_entity_build_from_form_state(form, form_state);
    drupalgap_entity_form_submit(form, form_state, term);
  }
  catch (error) { console.log('taxonomy_form_term_submit - ' + error); }
}

/**
 * Page callback for taxonomy/term/%.
 * @param {Number} tid
 * @return {Object}
 */
function taxonomy_term_page(tid) {
  try {
    if (tid) {
      var content = {
        container: _drupalgap_entity_page_container(
          'taxonomy_term',
          tid,
          'view'
        ),
        taxonomy_term_node_listing: {
          theme: 'jqm_item_list',
          items: [],
          attributes: {
            id: 'taxonomy_term_node_listing_items_' + tid
          }
        }
      };
      return content;
    }
    else { console.log('taxonomy_term_pageshow - No term id provided!'); }
  }
  catch (error) { console.log('taxonomy_term_pageshow - ' + error); }
}

/**
 * jQM pageshow callback for taxonomy/term/%
 * @param {Number} tid
 */
function taxonomy_term_pageshow(tid) {
  try {
    taxonomy_term_load(tid, {
        success: function(term) {
          var description = term.description ? term.description : '';
          var content = {
            'name': {
              'markup': '<h2>' + term.name + '</h2>'
            },
            'description': {
              'markup': '<p>' + description + '</p>'
            }
          };
          _drupalgap_entity_page_container_inject(
            'taxonomy_term',
            term.tid,
            'view',
            content
          );
          taxonomy_term_selectNodes(term.tid, {
              success: function(results) {
                // Extract the nodes into items, then drop them in the list.
                var items = [];
                for (var index in results) {
                    if (!results.hasOwnProperty(index)) { continue; }
                    var node = results[index];
                    items.push(l(node.title, 'node/' + node.nid));
                }
                drupalgap_item_list_populate(
                  '#taxonomy_term_node_listing_items_' + term.tid,
                  items
                );
              }
          });
        }
    });
  }
  catch (error) { console.log('taxonomy_term_pageshow - ' + error); }
}

/**
 * The selectNodes resource from the Taxonomy Term service.
 * @param {Number} tid The taxonomy term id.
 * @param {Object} options
 */
function taxonomy_term_selectNodes(tid, options) {
  try {
    // @TODO - move this function to jDrupal.
    options.method = 'POST';
    options.path = 'taxonomy_term/selectNodes.json';
    options.service = 'taxonomy_term';
    options.resource = 'selectNodes';
    options.data = JSON.stringify({ tid: tid});
    Drupal.services.call(options);
  }
  catch (error) { console.log('taxonomy_term_selectNodes - ' + error); }
}

/**
 * Page call back for taxonomy/vocabularies.
 * @return {Object}
 * @return {Object}
 */
function taxonomy_vocabularies_page() {
    // Place an empty item list that will hold a list of users.
    var content = {
      'vocabulary_listing': {
        'theme': 'jqm_item_list',
        'title': t('Vocabularies'),
        'items': [],
        'attributes': {'id': 'vocabulary_listing_items'}
      }
    };
    return content;
}

/**
 * jQM pageshow call back for taxonomy/vocabularies.
 */
function taxonomy_vocabularies_pageshow() {
  try {
    taxonomy_vocabulary_index(null, {
        success: function(vocabularies) {
          // Extract the vocabs into items, then drop them in the list.
          var items = [];
          for (var index in vocabularies) {
              if (!vocabularies.hasOwnProperty(index)) { continue; }
              var vocabulary = vocabularies[index];
              items.push(
                l(vocabulary.name, 'taxonomy/vocabulary/' + vocabulary.vid)
              );
          }
          drupalgap_item_list_populate('#vocabulary_listing_items', items);
        }
    });
  }
  catch (error) { console.log('taxonomy_vocabularies_pageshow - ' + error); }
}

/**
 * Page callback for taxonomy/vocabulary/%
 * @param {Number} vid
 * @return {String|Object}
 */
function taxonomy_vocabulary_page(vid) {
  try {
    if (vid) {
      var content = {
        container: _drupalgap_entity_page_container(
          'taxonomy_vocabulary',
          vid,
          'view'
        ),
        taxonomy_term_listing: {
          theme: 'jqm_item_list',
          title: t('Terms'),
          items: [],
          attributes: {
            id: 'taxonomy_term_listing_items_' + vid
          }
        }
      };
      return content;
    }
    else {
      console.log('taxonomy_vocabulary_page - No vocabulary id provided!');
    }
  }
  catch (error) { console.log('taxonomy_vocabulary_page - ' + error); }
}

/**
 * jQM pageshow callback for taxonomy/vocabulary/%.
 * @param {Number} vid
 */
function taxonomy_vocabulary_pageshow(vid) {
  try {
    taxonomy_vocabulary_load(vid, {
        success: function(vocabulary) {
          var content = {
            'name': {
              'markup': '<h2>' + vocabulary.name + '</h2>'
            },
            'description': {
              'markup': '<p>' + vocabulary.description + '</p>'
            }
          };
          _drupalgap_entity_page_container_inject(
            'taxonomy_vocabulary',
            vocabulary.vid,
            'view',
            content
          );
          var query = {
            parameters: {
              vid: vid
            }
          };
          taxonomy_term_index(query, {
              success: function(terms) {
                if (terms.length != 0) {
                  // Extract the terms into items, then drop them in the list.
                  var items = [];
                  for (var index in terms) {
                      if (!terms.hasOwnProperty(index)) { continue; }
                      var term = terms[index];
                      items.push(l(term.name, 'taxonomy/term/' + term.tid));
                  }
                  drupalgap_item_list_populate(
                    '#taxonomy_term_listing_items_' + vid,
                    items
                  );
                }
              }
          });
        }
    });
  }
  catch (error) { console.log('taxonomy_vocabulary_pageshow - ' + error); }
}

/**
 * Given a vocabulary machine name this will return the vocabulary id or false.
 * @param {String} name
 * @return {Number|Boolean}
 */
function taxonomy_vocabulary_get_vid_from_name(name) {
  try {
    var vocabulary = taxonomy_vocabulary_machine_name_load(name);
    if (vocabulary) { return vocabulary.vid; }
    return false;
  }
  catch (error) {
    console.log('taxonomy_vocabulary_get_vid_from_name - ' + error);
  }
}

/**
 * Given a vocabulary machine name this will return the JSON
 * object for the vocabulary that is attached to the
 * drupalgap.taxonomy_vocabularies object, or false if it doesn't exist.
 * @param {String} name
 * @return {Object|Boolean}
 */
function taxonomy_vocabulary_machine_name_load(name) {
  try {
    if (drupalgap.taxonomy_vocabularies &&
      drupalgap.taxonomy_vocabularies[name]) {
      return drupalgap.taxonomy_vocabularies[name];
    }
    return false;
  }
  catch (error) {
    console.log('taxonomy_vocabulary_machine_name_load - ' + error);
  }
}

/**
 * Theme's the html for a taxonomy term reference field.
 * @param {Object} variables
 * @return {String}
 */
function theme_taxonomy_term_reference(variables) {
  try {
    var html = '';

    // Make this a hidden field since the widget will just populate a value. If
    // somone wants to skip the input element html generation (e.g. taxonomy
    // term reference views exposed filter), let them do it, but by default
    // we'll render the input for them.
    var render_input_element = true;
    if (typeof variables.render_input_element !== 'undefined') {
      render_input_element = variables.render_input_element;
    }
    if (render_input_element) {
      variables.attributes.type = 'hidden';
      html += '<input ' + drupalgap_attributes(variables.attributes) + '/>';
    }

    // Is anyone flagging this as required? i.e. is it a views exposed filter?
    // @TODO - the field system that assembles the elements onto a form, when it
    // is a taxonomy term reference field, we need to pass along the required
    // option so when we load the items into the select list, we know whether or
    // not to include the "empty string" option. This is probably in field.js.
    var required = false;
    if (typeof variables.required !== 'undefined') {
      required = variables.required;
    }

    // Is this widget exposed (aka views exposed filter)?
    var exposed = false;
    if (typeof variables.exposed !== 'undefined') {
      exposed = variables.exposed;
    }

    // What vocabulary are we using?
    var machine_name =
      variables.field_info_field.settings.allowed_values[0].vocabulary;
    var taxonomy_vocabulary = taxonomy_vocabulary_machine_name_load(
      machine_name
    );

    // Prepare the variables for the widget and render it based on its type.
    var widget_type = variables.field_info_instance.widget.type;
    if (widget_type == 'options_select') { widget_type = 'select'; }
    var widget_function = 'theme_' + widget_type;
    var widget_id = variables.attributes.id + '-' + widget_type;
    if (drupalgap_function_exists(widget_function)) {

      // Grab the function in charge of themeing this widget.
      var fn = window[widget_function];
      // Build the variables for the widget.
      var widget_variables = {
        attributes: {
          id: widget_id,
          onchange: "_theme_taxonomy_term_reference_onchange(this, '" +
            variables.attributes.id + "');"
        }
      };

      // If the options were previously set aside for this widget, use them.
      var options_available = false;
      if (_taxonomy_term_reference_terms[variables.attributes.id]) {
        options_available = true;
        widget_variables.options =
          _taxonomy_term_reference_terms[variables.attributes.id];
      }

      // Was their a value present to include as the default value for the
      // widget, if so include it. If not, and this filter is not required, set
      // the default value to an empty string so the widget renders the default
      // option correctly. A views exposed filter uses 'All' instead of an
      // empty string.
      if (typeof variables.value !== 'undefined') {
        widget_variables.value = variables.value;
      }
      else if (!required) {
        if (exposed) { widget_variables.value = 'All'; }
        else { widget_variables.value = ''; }
      }

      // Render the widget.
      html += fn.call(null, widget_variables);

      // If the options weren't available, attach a pageshow handler to the
      // current page that will load the terms into the widget. Keep in mind,
      // this inline pageshow handler only gets called once when the first view
      // is loaded. That's why we later set aside the options so they can be
      // used again without having to fire the pageshow event.
      if (!options_available) {
        var options = {
          page_id: drupalgap_get_page_id(drupalgap_path_get()),
          jqm_page_event: 'pageshow',
          jqm_page_event_callback: '_theme_taxonomy_term_reference_load_items',
          jqm_page_event_args: JSON.stringify({
              taxonomy_vocabulary: taxonomy_vocabulary,
              element_id: variables.attributes.id,
              widget_id: widget_id,
              required: required,
              exposed: exposed
          })
        };
        html += drupalgap_jqm_page_event_script_code(options);
      }

    }
    else {
      console.log(
        'WARNING: theme_taxonomy_term_reference() - ' +
        'unsupported widget type! (' + widget_type + ')'
      );
    }
    return html;
  }
  catch (error) {
    console.log('theme_taxonomy_term_reference - ' + error);
  }
}

/**
 * An internal function used to load the taxonomy terms from a term reference
 * field and populate them into select list identified by options.widget_id.
 * @param {Object} options
 */
function _theme_taxonomy_term_reference_load_items(options) {
  try {
    // Build the index query, then make the call to the server.
    var query = {
      parameters: {
        vid: options.taxonomy_vocabulary.vid
      },
      options: {
        orderby: {
          weight: 'asc',
          name: 'asc'
        }
      }
    };
    taxonomy_term_index(query, {
        success: function(terms) {
          if (terms.length == 0) { return; }

          // As we iterate over the terms, we'll set them aside in a JSON
          // object so they can be used later.
          _taxonomy_term_reference_terms[options.element_id] = { };

          // Grab the widget.
          var widget = $('#' + options.widget_id);

          // If it's not required, place an empty option on the widget and set
          // it aside.
          if (!options.required) {
            var option = null;
            if (options.exposed) {
              option = '<option value="All">- ' + t('Any') + ' -</option>';
              _taxonomy_term_reference_terms[options.element_id]['All'] =
                '- Any -';
            }
            else {
              option = '<option value="">- ' + t('None') + ' -</option>';
              _taxonomy_term_reference_terms[options.element_id][''] =
                '- None -';
            }
            $(widget).append(option);
          }

          // Place each term in the widget as an option, and set the option
          // aside.
          for (var index in terms) {
              if (!terms.hasOwnProperty(index)) { continue; }
              var term = terms[index];
              var option = '<option value="' + term.tid + '">' +
                term.name +
              '</option>';
              $(widget).append(option);
              _taxonomy_term_reference_terms[options.element_id][term.tid] =
                term.name;
          }

          // Refresh the select list.
          $(widget).selectmenu('refresh', true);
        }
    });
  }
  catch (error) {
    console.log('_theme_taxonomy_term_reference_load_items - ' + error);
  }
}

/**
 * An internal function used by a taxonomy term reference field widget to
 * detect changes on it and populate the hidden field that holds the tid in the
 * form.
 * @param {Object} input
 * @param {String} id
 */
function _theme_taxonomy_term_reference_onchange(input, id) {
  try {
    $('#' + id).val($(input).val());
  }
  catch (error) {
    console.log('_theme_taxonomy_term_reference_onchange - ' + error);
  }
}

/**
 * Implements hook_views_exposed_filter().
 * @param {Object} form
 * @param {Object} form_state
 * @param {Object} element
 * @param {Object} filter
 * @param {Object} field
 */
function taxonomy_views_exposed_filter(
  form, form_state, element, filter, field) {
  try {
    //dpm('taxonomy_views_exposed_filter');
    //console.log(element);
    //console.log(filter);
    //console.log(field);

    // @TODO this filter loses its value after one submission, aka the next
    // submission will submit it as 'All' even though we have a term selected in
    // the widget from the previous submission.

    // Autocomplete.
    if (filter.options.type == 'textfield') {
      element.type = 'autocomplete';
      element.remote = true;
      element.custom = true;
      element.handler = 'index';
      element.entity_type = 'taxonomy_term';
      if (typeof filter.options.vocabulary !== 'undefined') {
        element.vid =
          taxonomy_vocabulary_get_vid_from_name(filter.options.vocabulary);
      }
      element.value = 'name';
      element.label = 'name';
      element.filter = 'name';
    }
    // Dropdown.
    else {
      // Change the input to hidden, then iterate over each vocabulary and inject
      // them into the widget. We'll just use a taxonomy term reference field and
      // fake its instance.
      element.type = 'hidden';
      for (var index in field.settings.allowed_values) {
        if (!field.settings.allowed_values.hasOwnProperty(index)) { continue; }
        var object = field.settings.allowed_values[index];

        // Build the variables for the widget.
        var variables = {
          required: element.required,
          render_input_element: false,
          attributes: {
            id: element.options.attributes.id
          },
          field_info_field: field,
          field_info_instance: {
            widget: {
              type: 'options_select'
            }
          },
          exposed: true
        };

        // If we have a default value, send it along.
        // @TODO add support for multiple values.
        if (!empty(filter.value)) {
          variables.value = parseInt(filter.value[0]);
          variables.attributes.value = variables.value;
        }

        // Add the widget as a child to the form element, including a label if
        // necessary (since the original label is lost because it was turned
        // into a hidden element).
        var child = '';
        if (!empty(element.title)) {
          child += theme('form_element_label', { element: element });
        }
        child += theme('taxonomy_term_reference', variables);
        element.children.push({ markup: child });

      }
    }
  }
  catch (error) { console.log('taxonomy_views_exposed_filter - ' + error); }
}
