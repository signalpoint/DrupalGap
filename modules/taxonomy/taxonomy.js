function taxonomy_form_vocabulary() {
  try {
    form = {
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
    form = {
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

