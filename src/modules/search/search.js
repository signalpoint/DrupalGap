/**
 * Implements hook_block_info().
 * @return {Object}
 */
function search_block_info() {
  try {
    var blocks = {};
    blocks['search'] = {
      delta: 'search',
      module: 'search'
    };
    return blocks;
  }
  catch (error) { console.log('search_block_info - ' + error); }
}

/**
 * Implements hook_block_view().
 * @param {String} delta
 * @param {String} region
 * @return {String}
 */
function search_block_view(delta, region) {
  try {
    var content = '';
    if (delta == 'search') {
      if (user_access('search content')) {
        content = drupalgap_get_form('search_block_form');
      }
    }
    return content;
  }
  catch (error) { console.log('search_block_view - ' + error); }
}

/**
 * Implements hook_menu().
 * @return {Object}
 */
function search_menu() {
  try {
    var items = {};
    items['search/%/%'] = {
      title: t('Search'),
      'page_callback': 'drupalgap_get_form',
      'pageshow': 'search_form_pageshow',
      'page_arguments': ['search_form'],
      'access_arguments': ['search content']
    };
    return items;
  }
  catch (error) { console.log('search_menu - ' + error); }
}


/**
 * The search block form.
 * @param {Object} form
 * @param {Object} form_state
 * @return {Object}
 */
function search_block_form(form, form_state) {
  try {
    form.elements['type'] = {
      type: 'hidden',
      default_value: 'node'
    };
    form.elements['keys'] = {
      type: 'search',
      title: '',
      title_placeholder: true,
      required: true,
      default_value: ''
    };
    // Since there is no submit button on the form, we'll catch the onsubmit
    // action and the trigger the form submission.
    form.options.attributes['onsubmit'] =
      "_drupalgap_form_submit('" + form.id + "'); return false;";
    return form;
  }
  catch (error) { console.log('search_block_form - ' + error); }
}

/**
 * The search block form submit handler.
 * @param {Object} form
 * @param {Object} form_state
 */
function search_block_form_submit(form, form_state) {
  try {
    var type = form_state.values['type'];
    var keys = form_state.values['keys'];
    drupalgap_goto('search/' + type + '/' + keys);
  }
  catch (error) { console.log('search_block_form_submit - ' + error); }
}

/**
 * The search form.
 * @param {Object} form
 * @param {Object} form_state
 * @return {Object}
 */
function search_form(form, form_state) {
  try {
    var type = arg(1);
    var keys = arg(2);
    form.elements.type = {
      type: 'hidden',
      default_value: type ? type : 'node'
    };
    form.elements.keys = {
      type: 'textfield',
      title: t('Enter your keywords'),
      required: true,
      default_value: keys ? keys : ''
    };
    form.elements.submit = {
      type: 'submit',
      value: t('Go'),
      options: {
        attributes: {
          'data-icon': 'search'
        }
      }
    };
    form.suffix += theme('jqm_item_list', {
        title: t('Search results'),
        items: [],
        options: {
          attributes: {
            id: 'search_form_results'
          }
        }
    });
    return form;
  }
  catch (error) { console.log('search_form - ' + error); }
}

/**
 * The search form submit handler.
 * @param {Object} form
 * @param {Object} form_state
 */
function search_form_submit(form, form_state) {
  try {
    var type = form_state.values['type'];
    var keys = form_state.values['keys'];
    switch (type) {
      case 'node':
        search_node(keys, {
            success: function(results) {
              var items = [];
              for (var index in results) {
                  if (!results.hasOwnProperty(index)) { continue; }
                  var result = results[index];
                  var link = theme('search_result_node', result);
                  items.push(link);
              }
              drupalgap_item_list_populate('#search_form_results', items);
            }
        });
        break;
      default:
        console.log('search_form_submit - unsupported type (' + type + ')');
        break;
    }
  }
  catch (error) { console.log('search_form_submit - ' + error); }
}

/**
 * The pageshow callback for the search form page.
 * @param {String} form_id
 */
function search_form_pageshow(form_id) {
  try {
    var type = arg(1);
    var keys = arg(2);
    switch (type) {
      case 'node':
        search_node(keys, {
            success: function(results) {
              var items = [];
              for (var index in results) {
                  if (!results.hasOwnProperty(index)) { continue; }
                  var result = results[index];
                  var link = theme('search_result_node', result);
                  items.push(link);
              }
              drupalgap_item_list_populate('#search_form_results', items);
            }
        });
        break;
      default:
        console.log('search_form_pageshow - unsupported type (' + type + ')');
        break;
    }
  }
  catch (error) { console.log('search_form_pageshow - ' + error); }
}

/**
 * The search node service.
 * @param {String} keys The keyword(s) to search for.
 * @param {Object} options
 */
function search_node(keys, options) {
  try {
    options.method = 'GET';
    options.path = 'search_node/retrieve.json&keys=' + encodeURIComponent(keys);
    options.service = 'search_node';
    options.resource = 'retrieve';
    Drupal.services.call(options);
  }
  catch (error) { console.log('search_node - ' + error); }
}

/**
 * Themes a search result node.
 * @param {Object} variables
 * @return {String}
 */
function theme_search_result_node(variables) {
  try {
    return l(
      '<h2>' + variables.title + '</h2>' +
        '<p>' + variables.snippet + '</p>',
      'node/' + variables.node.nid
    );
  }
  catch (error) { console.log('theme_search_result_node - ' + error); }
}

