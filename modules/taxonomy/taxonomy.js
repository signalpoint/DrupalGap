/**
 * Implements hook_field_formatter_view().
 */
function taxonomy_field_formatter_view(entity_type, entity, field, instance, langcode, items, display) {
  try {
    var element = {};
    // If items is a string, convert it into a single item JSON object.
    if (typeof items === 'string') {
      items = {0:{tid:items}}
    }
    if (!drupalgap_empty(items)) {
      $.each(items, function(delta, item){
          element[delta] = {
            theme:'link',
            text:item.tid,
            path:'taxonomy/term/' + item.tid
          };
      });
    }
    return element;
  }
  catch (error) { drupalgap_error(error); }
}

/**
 * Implements hook_menu().
 */
function taxonomy_menu() {
  try {
    if (drupalgap.settings.debug) {
      console.log('taxonomy_menu()');
    }
    var items = {
      'taxonomy/vocabularies':{
        'title':'Taxonomy',
        'page_callback':'taxonomy_vocabularies_page',
        'pageshow':'taxonomy_vocabularies_pageshow',
      },
      'taxonomy/vocabulary/%':{
        'title':'Taxonomy vocabulary',
        'page_callback':'taxonomy_vocabulary_page',
        'page_arguments':[2],
        'pageshow':'taxonomy_vocabulary_pageshow',
      },
      'taxonomy/vocabulary/%/view':{
        'title':'View',
        'type':'MENU_DEFAULT_LOCAL_TASK',
        'weight':-10,
      },
      'taxonomy/vocabulary/%/edit':{
        'title':'Edit',
        'page_callback':'entity_page_edit',
        'pageshow':'entity_page_edit_pageshow',
        'page_arguments':['taxonomy_form_vocabulary', 'taxonomy_vocabulary', 2],
        'weight':0,
        'type':'MENU_LOCAL_TASK',
        'access_arguments':['administer taxonomy'],
      },
      'taxonomy/term/%':{
        'title':'Taxonomy term',
        'page_callback':'taxonomy_term_page',
        'page_arguments':[2],
        'pageshow':'taxonomy_term_pageshow',
      },
      'taxonomy/term/%/view':{
        'title':'View',
        'type':'MENU_DEFAULT_LOCAL_TASK',
        'weight':-10,
      },
      'taxonomy/term/%/edit':{
        'title':'Edit',
        'page_callback':'entity_page_edit',
        'pageshow':'entity_page_edit_pageshow',
        'page_arguments':['taxonomy_form_term', 'taxonomy_term', 2],
        'weight':0,
        'type':'MENU_LOCAL_TASK',
        'access_arguments':['administer taxonomy'],
      },
      /*'admin/structure/taxonomy':{
        'title':'Taxonomy',
        'page_callback':'drupalgap_get_form',
        'page_arguments':['taxonomy_overview_vocabularies'],
        'access_arguments':['administer taxonomy'],
      },
      'admin/structure/taxonomy/list':{
        'title':'List',
        'type':'MENU_DEFAULT_LOCAL_TASK',
        'weight':-10,
      },
      'admin/structure/taxonomy/add':{
        'title':'Add vocabulary',
        'page_callback':'taxonomy_form_vocabulary',
      },*/
    };
    return items;
  }
  catch (error) { drupalgap_error(error); }
}

/**
 * The taxonomy vocabulary form.
 */
function taxonomy_form_vocabulary(form, form_state, vocabulary) {
  try {
    
    // Setup form defaults.
    form.entity_type = 'taxonomy_vocabulary';
    form.action = 'taxonomy/vocabularies';
    
    // Add the entity's core fields to the form.
    drupalgap_entity_add_core_fields_to_form('taxonomy_vocabulary', null, form, vocabulary);
    
    // Add submit to form.
    form.elements.submit = {
      'type':'submit',
      'value':'Save',
    };
    
    // Add cancel button to form.
    form.buttons['cancel'] = drupalgap_form_cancel_button();
    
    // If we're editing a vocabulary add a delete button, if the user has access.
    if (vocabulary && vocabulary.vid && user_access('administer taxonomy')) {
      form.buttons['delete'] = drupalgap_entity_edit_form_delete_button('taxonomy_vocabulary', vocabulary.vid);
    }
    
    return form;
  }
  catch (error) { drupalgap_error(error); }
}

/**
 * The taxonomy vocabulary form submit handler.
 */
function taxonomy_form_vocabulary_submit(form, form_state) {
  try {
    var vocabulary = drupalgap_entity_build_from_form_state(form, form_state);
    drupalgap_entity_form_submit(form, form_state, vocabulary);
  }
  catch (error) { drupalgap_error(error); }
}

/**
 * The taxonomy term form.
 */
function taxonomy_form_term(form, form_state, term) {
  try {
    // Setup form defaults.
    form.entity_type = 'taxonomy_term';
    form.action = 'taxonomy/vocabularies';
    
    // Add the entity's core fields to the form.
    drupalgap_entity_add_core_fields_to_form('taxonomy_term', null, form, term);
    
    // Add submit to form.
    form.elements.submit = {
      'type':'submit',
      'value':'Save',
    };
    
    // Add cancel button to form.
    form.buttons['cancel'] = drupalgap_form_cancel_button();
    
    // If we are editing a term, add a delete button.
    if (term && term.tid && user_access('administer taxonomy')) {
      form.buttons['delete'] = drupalgap_entity_edit_form_delete_button('taxonomy_term', term.tid);
    }
    
    return form;
  }
  catch (error) { drupalgap_error(error); }
}

/**
 * The taxonomy term form submit handler.
 */
function taxonomy_form_term_submit(form, form_state) {
  try {
    var term = drupalgap_entity_build_from_form_state(form, form_state);
    drupalgap_entity_form_submit(form, form_state, term);
  }
  catch (error) { drupalgap_error(error); }
}

/**
 * Return the term object matching a term ID, otherwise it returns
 * false.
 */
function taxonomy_term_load(tid) {
  try {
    var options = null;
    if (arguments[1]) { options = arguments[1]; }
    return entity_load('taxonomy_term', tid, options);
  }
  catch (error) { drupalgap_error(error); }
}

/**
 * Page callback for taxonomy/term/%
 */
function taxonomy_term_page(tid) {
  try {
    if (tid) {
      var content = {
        container:_drupalgap_entity_page_container('taxonomy_term', tid, 'view'),
        taxonomy_term_node_listing:{
          theme:"jqm_item_list",
          title:"Content",
          items:[],
          attributes:{
            id:"taxonomy_term_node_listing_items"
          },
        }
      };
      return content;
    }
    else { drupalgap_error('No term id provided!'); }
  }
  catch (error) { drupalgap_error(error); }
}

/**
 * jQM pageshow callback for taxonomy/term/%
 */
function taxonomy_term_pageshow(tid) {
  try {
    taxonomy_term_load(tid, {
        success:function(term){
          var content = {
            'name':{
              'markup':'<h2>' + term.name + '</h2>',
            },
            'description':{
              'markup':'<p>' + term.description + '</p>',
            }
          };
          _drupalgap_entity_page_container_inject('taxonomy_term', term.tid, 'view', content);
          drupalgap.services.taxonomy_term.selectNodes.call({
            'tid':term.tid,
            'success':function(data){
              // Extract the nodes into items, then drop them in the list.
              var items = [];
              $.each(data, function(index, node){
                  items.push(l(node.title, 'node/' + node.nid));
              });
              drupalgap_item_list_populate("#taxonomy_term_node_listing_items", items);
            }
          });
        }
    });
  }
  catch (error) { drupalgap_error(error); }
}

/**
 * Page call back for taxonomy/vocabularies.
 */
function taxonomy_vocabularies_page() {
  try {
    // Place an empty item list that will hold a list of users.
    var content = {
      'vocabulary_listing':{
        'theme':'jqm_item_list',
        'title':'Vocabularies',
        'items':[],
        'attributes':{'id':'vocabulary_listing_items'},
      }
    };
    return content;
  }
  catch (error) { drupalgap_error(error); }
}

/**
 * jQM pageshow call back for taxonomy/vocabularies.
 */
function taxonomy_vocabularies_pageshow() {
  try {
    drupalgap.services.drupalgap_taxonomy.get_vocabularies.call({
			'success':function(data){
			  // Extract the vocabs into items, then drop them in the list.
        var items = [];
        $.each(data, function(index, vocabulary){
            items.push(l(vocabulary.name, 'taxonomy/vocabulary/' + vocabulary.vid));
        });
        drupalgap_item_list_populate("#vocabulary_listing_items", items);
			}
		});
  }
  catch (error) { drupalgap_error(error); }
}

/**
 * Page callback for taxonomy/vocabulary/%
 */
function taxonomy_vocabulary_page(vid) {
  try {
    if (vid) {
      var content = {
        container:_drupalgap_entity_page_container('taxonomy_vocabulary', vid, 'view'),
        taxonomy_term_listing:{
          theme:"jqm_item_list",
          title:"Terms",
          items:[],
          attributes:{
            id:"taxonomy_term_listing_items"
          }
        }
      };
      return content;
    }
    else { drupalgap_error('No vocabulary id provided!'); }
  }
  catch (error) { drupalgap_error('taxonomy_vocabulary_page - ' + error); }
}

/**
 * jQM pageshow callback for taxonomy/vocabulary/%
 */
function taxonomy_vocabulary_pageshow(vid) {
  try {
    taxonomy_vocabulary_load(vid, {
        success:function(vocabulary){
          var content = {
            'name':{
              'markup':'<h2>' + vocabulary.name + '</h2>',
            },
            'description':{
              'markup':'<p>' + vocabulary.description + '</p>',
            } 
          };
          _drupalgap_entity_page_container_inject('taxonomy_vocabulary', vocabulary.vid, 'view', content);
          drupalgap.services.drupalgap_taxonomy.get_terms.call({
              'vid':vocabulary.vid,
              'success':function(data){
                // Extract the terms into items, then drop them in the list.
                var items = [];
                $.each(data, function(index, term){
                    items.push(l(term.name, 'taxonomy/term/' + term.tid));
                });
                drupalgap_item_list_populate("#taxonomy_term_listing_items", items);
              }
          });
        }
    });
  }
  catch (error) { drupalgap_error(error); }
}

/**
 * Return the vocabulary object matching a vocabulary ID, otherwise it returns
 * false.
 */
function taxonomy_vocabulary_load(vid) {
  try {
    var options = null;
    if (arguments[1]) { options = arguments[1]; }
    return entity_load('taxonomy_vocabulary', vid, options);
  }
  catch (error) { drupalgap_error(error); }
}

