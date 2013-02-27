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
          // Set the drupalgap taxonomy vocabular edit, and place the vocabulary
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

