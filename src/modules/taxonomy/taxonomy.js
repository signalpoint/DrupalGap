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
      $.each(taxonomy_vocabularies, function(index, vocabulary) {
          eval('results.' + vocabulary.machine_name + ' = vocabulary;');
      });
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
      $.each(items, function(delta, item) {
          var text = item.tid;
          if (item.name) { text = item.name; }
          element[delta] = {
            theme: 'button_link',
            text: text,
            path: 'taxonomy/term/' + item.tid
          };
      });
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
        var path =
          'drupalgap/taxonomy-term-autocomplete/' + vid + '&name=' +
          encodeURIComponent(value);
        views_datasource_get_view_result(path, {
            success: function(results) {
              if (results.terms.length == 0) { return; }
              $.each(results.terms, function(index, object) {
                  var attributes = {
                    tid: object.term.tid,
                    vid: vid,
                    name: object.term.name,
                    onclick: '_taxonomy_field_widget_form_click(' +
                      "'" + id + "', " +
                      "'" + $ul.attr('id') + "', " +
                      'this' +
                    ')'
                  };
                  html += '<li ' + drupalgap_attributes(attributes) + '>' +
                    object.term.name +
                  '</li>';
              });
              $ul.html(html);
              $ul.listview('refresh');
              $ul.trigger('updatelayout');
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
  try {
    var items = {
      'taxonomy/vocabularies': {
        'title': 'Taxonomy',
        'page_callback': 'taxonomy_vocabularies_page',
        'pageshow': 'taxonomy_vocabularies_pageshow'
      },
      'taxonomy/vocabulary/%': {
        'title': 'Taxonomy vocabulary',
        'page_callback': 'taxonomy_vocabulary_page',
        'page_arguments': [2],
        'pageshow': 'taxonomy_vocabulary_pageshow'
      },
      'taxonomy/vocabulary/%/view': {
        'title': 'View',
        'type': 'MENU_DEFAULT_LOCAL_TASK',
        'weight': -10
      },
      'taxonomy/vocabulary/%/edit': {
        'title': 'Edit',
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
        'title': 'Taxonomy term',
        'page_callback': 'taxonomy_term_page',
        'page_arguments': [2],
        'pageshow': 'taxonomy_term_pageshow'
      },
      'taxonomy/term/%/view': {
        'title': 'View',
        'type': 'MENU_DEFAULT_LOCAL_TASK',
        'weight': -10
      },
      'taxonomy/term/%/edit': {
        'title': 'Edit',
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
  catch (error) { console.log('taxonomy_menu - ' + error); }
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
      'value': 'Save'
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
      'value': 'Save'
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
                $.each(results, function(index, node) {
                    items.push(l(node.title, 'node/' + node.nid));
                });
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
  try {
    // Place an empty item list that will hold a list of users.
    var content = {
      'vocabulary_listing': {
        'theme': 'jqm_item_list',
        'title': 'Vocabularies',
        'items': [],
        'attributes': {'id': 'vocabulary_listing_items'}
      }
    };
    return content;
  }
  catch (error) { console.log('taxonomy_vocabularies_page - ' + error); }
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
          $.each(vocabularies, function(index, vocabulary) {
              items.push(
                l(vocabulary.name, 'taxonomy/vocabulary/' + vocabulary.vid)
              );
          });
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
          title: 'Terms',
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
                  $.each(terms, function(index, term) {
                      items.push(l(term.name, 'taxonomy/term/' + term.tid));
                  });
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

    // Make this a hidden field since the widget will just populate a value.
    variables.attributes.type = 'hidden';
    html += '<input ' + drupalgap_attributes(variables.attributes) + '/>';

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
      var fn = window[widget_function];
      html += fn.call(null, {
        attributes: {
          id: widget_id,
          onchange: "_theme_taxonomy_term_reference_onchange(this, '" +
            variables.attributes.id + "');"
        }
      });
      // Attach a pageshow handler to the current page that will load the terms
      // into the widget.
       var options = {
         'page_id': drupalgap_get_page_id(drupalgap_path_get()),
         'jqm_page_event': 'pageshow',
         'jqm_page_event_callback': '_theme_taxonomy_term_reference_load_items',
         'jqm_page_event_args': JSON.stringify({
             'taxonomy_vocabulary': taxonomy_vocabulary,
             'widget_id': widget_id
         })
       };
       html += drupalgap_jqm_page_event_script_code(options);
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
    var query = {
      parameters: {
        vid: options.taxonomy_vocabulary.vid
      }
    };
    taxonomy_term_index(query, {
        success: function(terms) {
          if (terms.length == 0) { return; }
          $.each(terms, function(index, term) {
              var option = '<option value="' + term.tid + '">' +
                term.name +
              '</option>';
              $('#' + options.widget_id).append(option);
          });
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

