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
        'page_callback':'drupalgap_get_form',
        'page_arguments':['taxonomy_form_vocabulary', 2],
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
        'page_callback':'drupalgap_get_form',
        'page_arguments':['taxonomy_form_term', 2],
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
  catch (error) {
    alert('taxonomy_menu - ' + error);
  }
}

/**
 * The taxonomy vocabulary form.
 */
function taxonomy_form_vocabulary(vocabulary) {
  try {
    if (drupalgap.settings.debug) {
      console.log('taxonomy_form_vocabulary');
      console.log(JSON.stringify(vocabulary));
    }
    
    // Setup form defaults.
    var form = {
      'id':'taxonomy_form_vocabulary',
      'submit':['taxonomy_form_vocabulary_submit'],
      'validate':['taxonomy_form_vocabulary_validate'],
      'elements':{},
      'buttons':{},
      'entity_type':'taxonomy_vocabulary',
      'action':'taxonomy/vocabularies',
    };
    
    // Add the entity's core fields to the form.
    drupalgap_entity_add_core_fields_to_form('taxonomy_vocabulary', null, form, vocabulary);
    
    // Add submit to form.
    form.elements.submit = {
      'type':'submit',
      'value':'Save',
    };
    
    // Add cancel button to form.
    form.buttons['cancel'] = {
      'title':'Cancel',
    };
    
    // If we're editing a vocabulary set the form action to the vocabulary page
    // view and add a delete button to form if we're editing a node.
    // TODO - delete buttons should be automated for all entity types based
    // on user's permission.
    if (vocabulary && vocabulary.vid) {
      // TODO - this action isn't being retained upon entity form submission
      // drupalgap_goto...
      form.action = 'taxonomy/vocabulary/' + vocabulary.vid;
      form.buttons['delete'] = {
        'title':'Delete',
      };
    }
    
    return form;
  }
  catch (error) {
    alert('taxonomy_form_vocabulary - ' + error);
  }
}

/**
 * The taxonomy vocabulary form submit handler.
 */
function taxonomy_form_vocabulary_submit(form, form_state) {
  try {
    if (drupalgap.settings.debug) {
      console.log('taxonomy_form_vocabulary_submit()');
      console.log(JSON.stringify(arguments));
    }
    var vocabulary = drupalgap_entity_build_from_form_state(form, form_state);
    drupalgap_entity_form_submit(form, form_state, vocabulary);
  }
  catch (error) {
    alert('taxonomy_form_vocabulary_submit - ' + error);
  }
}

/**
 * The taxonomy term form.
 */
function taxonomy_form_term(term) {
  try {
    if (drupalgap.settings.debug) {
      console.log('taxonomy_form_term()');
      console.log(JSON.stringify(arguments));
    }
    // Setup form defaults.
    var form = {
      'id':'taxonomy_form_term',
      'submit':['taxonomy_form_term_submit'],
      'validate':['taxonomy_form_term_validate'],
      'elements':{},
      'buttons':{},
      'entity_type':'taxonomy_term',
      'action':'taxonomy/vocabularies',
    };
    
    // Add the entity's core fields to the form.
    drupalgap_entity_add_core_fields_to_form('taxonomy_term', null, form, term);
    
    // Add submit to form.
    form.elements.submit = {
      'type':'submit',
      'value':'Save',
    };
    
    // Add cancel button to form.
    form.buttons['cancel'] = {
      'title':'Cancel',
    };
    
    // If we are editing a term, set the form action to the term and add a
    // delete button to the form.
    if (term && term.tid) {
      form.action = 'taxonomy/term/' + term.tid;
      form.buttons['delete'] = {
        'title':'Delete',
      };
    }
    
    return form;
  }
  catch (error) {
    alert('taxonomy_form_term - ' + error);
  }
}

/**
 * The taxonomy term form submit handler.
 */
function taxonomy_form_term_submit(form, form_state) {
  try {
    if (drupalgap.settings.debug) {
      console.log('taxonomy_form_term_submit()');
      console.log(JSON.stringify(arguments));
    }
    var term = drupalgap_entity_build_from_form_state(form, form_state);
    drupalgap_entity_form_submit(form, form_state, term);
  }
  catch (error) {
    alert('taxonomy_form_term_submit - ' + error);
  }
}

/**
 * Return the term object matching a term ID, otherwise it returns
 * false.
 */
function taxonomy_term_load(tid) {
  try {
    if (drupalgap.settings.debug) {
      console.log('taxonomy_term_load(' + tid + ')');
    }
    var term = false;
    drupalgap.services.taxonomy_term.retrieve.call({
      'tid':tid,
      'async':false,
      'success':function(data){
        term = data;
      },
    });
    return term;
  }
  catch (error) {
    alert('taxonomy_term_load - ' + error);
  }
}

/**
 * Page callback for taxonomy/term/%
 */
function taxonomy_term_page(term) {
  try {
    if (drupalgap.settings.debug) {
      console.log('taxonomy_term_page()');
    }
    var content = {
      'name':{
        'markup':'<h2>' + term.name + '</h2>',
      },
      'description':{
        'markup':'<p>' + term.description + '</p>',
      },
      'taxonomy_term_node_listing':{
        'theme':'jqm_item_list',
        'title':'Content',
        'items':[],
        'attributes':{'id':'taxonomy_term_node_listing_items'},
      }
    };
    return content;
  }
  catch (error) {
    alert('taxonomy_term_page - ' + error);
  }
}

/**
 * jQM pageshow callback for taxonomy/term/%
 */
function taxonomy_term_pageshow() {
  try {
    if (drupalgap.settings.debug) {
      console.log('taxonomy_term_pageshow()');
    }
    drupalgap.services.taxonomy_term.selectNodes.call({
      'tid':arg(2),
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
  catch (error) {
    alert('taxonomy_term_pageshow - ' + error);
  }
}

/**
 * Page call back for taxonomy/vocabularies.
 */
function taxonomy_vocabularies_page() {
  try {
    if (drupalgap.settings.debug) {
      console.log('taxonomy_vocabularies_page()');
    }
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
  catch (error) {
    alert('taxonomy_vocabularies_page - ' + error);
  }
}

/**
 * jQM pageshow call back for taxonomy/vocabularies.
 */
function taxonomy_vocabularies_pageshow() {
  try {
    if (drupalgap.settings.debug) {
      console.log('taxonomy_vocabularies_pageshow()');
    }
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
  catch (error) {
    alert('taxonomy_vocabularies_pageshow - ' + error);
  }
}

/**
 * Page callback for taxonomy/vocabulary/%
 */
function taxonomy_vocabulary_page(vocabulary) {
  try {
    if (drupalgap.settings.debug) {
      console.log('taxonomy_vocabulary_page()');
    }
    var content = {
      'name':{
        'markup':'<h2>' + vocabulary.name + '</h2>',
      },
      'description':{
        'markup':'<p>' + vocabulary.description + '</p>',
      },
      'taxonomy_term_listing':{
        'theme':'jqm_item_list',
        'title':'Terms',
        'items':[],
        'attributes':{'id':'taxonomy_term_listing_items'},
      }
    };
    return content;
  }
  catch (error) {
    alert('taxonomy_vocabulary_page - ' + error);
  }
}

/**
 * jQM pageshow callback for taxonomy/vocabulary/%
 */
function taxonomy_vocabulary_pageshow() {
  try {
    if (drupalgap.settings.debug) {
      console.log('taxonomy_vocabulary_pageshow()');
    }
    drupalgap.services.drupalgap_taxonomy.get_terms.call({
        'vid':arg(2),
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
  catch (error) {
    alert('taxonomy_vocabulary_pageshow - ' + error);
  }
}

/**
 * Return the vocabulary object matching a vocabulary ID, otherwise it returns
 * false.
 */
function taxonomy_vocabulary_load(vid) {
  try {
    if (drupalgap.settings.debug) {
      console.log('taxonomy_vocabulary_load(' + vid + ')');
    }
    var vocabulary = false;
    drupalgap.services.taxonomy_vocabulary.retrieve.call({
      'vid':vid,
      'async':false,
      'success':function(data){
        vocabulary = data;
      },
    });
    return vocabulary;
  }
  catch (error) {
    alert('taxonomy_vocabulary_load - ' + error);
  }
}

