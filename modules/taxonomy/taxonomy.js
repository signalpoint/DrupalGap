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
      'taxonomy/term/%':{
        'title':'Taxonomy term',
        'page_callback':'taxonomy_term_page',
        'page_arguments':[2],
        'pageshow':'taxonomy_term_pageshow',
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


function taxonomy_form_vocabulary() {
  try {
    var form = {
      'id':'taxonomy_form_vocabulary',
      'entity_type':'taxonomy_vocabulary',
      'action':'taxonomy_vocabularies.html',
      'elements':{
        'vid':{
          'type':'hidden',
          'required':false,
          'default_value':'',
        },
        'name':{
          'type':'textfield',
          'title':'Name',
          'required':true,
        },
        'machine_name':{
          'type':'textfield',
          'title':'Machine Name',
          'required':true,
          'default_value':'',
        },
        'description':{
          'type':'textarea',
          'title':'Description',
          'required':false,
          'default_value':'',
        },
        'submit':{
          'type':'submit',
          'value':'Save',
        },
      },
      'buttons':{
        'cancel':{
          'title':'Cancel',
        },
      },
    };
    
    // Add delete button to form if we're editing a vocabulary.
    if (drupalgap.taxonomy_vocabulary_edit.vid) {
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

function taxonomy_form_vocabulary_loaded() {
  try {
    // Are we editing a vocabulary?
    if (drupalgap.taxonomy_vocabulary_edit.vid) {
      // Retrieve the vocabulary and fill in the form values.
      drupalgap.services.taxonomy_vocabulary.retrieve.call({
        'vid':drupalgap.taxonomy_vocabulary_edit.vid,
        'success':function(vocabulary){
          // Set the drupalgap taxonomy vocabulary edit, and place the vocabulary
          // properties in the form. We don't need to load entity info into the
          // form for vocabularies, only for terms.
          drupalgap.taxonomy_vocabulary_edit = vocabulary;
          $('#' + drupalgap_form_get_element_id('name', drupalgap.form.id)).val(vocabulary.name);
          $('#' + drupalgap_form_get_element_id('machine_name', drupalgap.form.id)).val(vocabulary.machine_name);
          $('#' + drupalgap_form_get_element_id('description', drupalgap.form.id)).val(vocabulary.description);
          //$('#' + drupalgap_form_get_element_id('weight', drupalgap.form.id)).val(vocabulary.weight);    
        },
      });
    }
  }
  catch (error) {
    alert('taxonomy_form_vocabulary_loaded - ' + error);
  }
}

function taxonomy_form_vocabulary_submit(form, form_state) {
  var vocabulary = drupalgap_entity_build_from_form_state();
  drupalgap_entity_form_submit(vocabulary);
}

function taxonomy_form_term() {
  try {
    var form = {
      'id':'taxonomy_form_term',
      'entity_type':'taxonomy_term',
      'action':'taxonomy_vocabulary.html',
      'elements':{
        'vid':{
          'type':'hidden',
          'required':true,
          'default_value':'',
        },
        'tid':{
          'type':'hidden',
          'required':false,
          'default_value':'',
        },
        'name':{
          'type':'textfield',
          'title':'Name',
          'required':true,
        },
        'description':{
          'type':'textarea',
          'title':'Description',
          'required':false,
          'default_value':'',
        },
        'submit':{
          'type':'submit',
          'value':'Save',
        },
      },
      'buttons':{
        'cancel':{
          'title':'Cancel',
        },
      },
    };
    
    // Add delete button to form if we're editing a term.
    if (drupalgap.taxonomy_term_edit.tid) {
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

function taxonomy_form_term_loaded() {
  try {
    // Place the hidden vid in the form.
    $('#' + drupalgap_form_get_element_id('vid', drupalgap.form.id)).val(drupalgap.taxonomy_vocabulary.vid);
    // Are we editing a term?
    if (drupalgap.taxonomy_term_edit.tid) {
      // Retrieve the term and fill in the form values.
      drupalgap.services.taxonomy_term.retrieve.call({
        'tid':drupalgap.taxonomy_term_edit.tid,
        'success':function(term){
          // Set the drupalgap taxonomy term edit, and place the term
          // properties in the form.
          drupalgap.taxonomy_term_edit = term;
          $('#' + drupalgap_form_get_element_id('name', drupalgap.form.id)).val(term.name);
          $('#' + drupalgap_form_get_element_id('description', drupalgap.form.id)).val(term.description);
          // Load the entity into the form.
          drupalgap_entity_load_into_form('taxonomy_term', null, drupalgap.taxonomy_term_edit, drupalgap.form);
        },
      });
    }
  }
  catch (error) {
    alert('taxonomy_form_term_loaded - ' + error);
  }
}

function taxonomy_form_term_submit(form, form_state) {
  var term = drupalgap_entity_build_from_form_state();
  drupalgap_entity_form_submit(term);
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


