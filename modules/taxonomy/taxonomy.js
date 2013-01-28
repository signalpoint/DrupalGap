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
    
    //var entity_info = drupalgap_entity_get_info('taxonomy_vocabulary');
    //console.log(JSON.stringify(entity_info));
    
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
    if (!drupalgap.taxonomy_vocabulary_edit || !drupalgap.taxonomy_vocabulary_edit.vid) {
      // Creating a new vocabulary.
    }
    else {
      // Editing an existing vocabulary, load it up and set placeholders.
      /*drupalgap.services.taxonomy_vocabulary.retrieve.call({
        'vid':drupalgap.taxonomy_vocabulary.vid,
        'success':function(vocabulary){
          $('#drupalgap_taxonomy_vocabulary_edit h1').html('Edit Vocabulary');
          $('#taxonomy_vocabulary_name').val(vocabulary.name);
          $('#taxonomy_vocabulary_machine_name').val(vocabulary.machine_name);
          $('#taxonomy_vocabulary_description').val(vocabulary.description);
          $('#taxonomy_vocabulary_weight').val(vocabulary.weight);
        },
      });*/
    }
  }
  catch (error) {
    alert('taxonomy_form_vocabulary_loaded - ' + error);
  }
  
}

function taxonomy_form_vocabulary_submit(form, form_state) {
  var vocabulary = drupalgap_entity_build_from_form_state();
  drupalgap_entity_form_submit(vocabulary);
  /*
  // Grab form input, build json taxonomy_vocabulary and call service resource.
	taxonomy_vocabulary = {
		'vid':drupalgap.taxonomy_vocabulary.vid,
		'name':$('#taxonomy_vocabulary_name').val(),
		'machine_name':$('#taxonomy_vocabulary_machine_name').val(),
		'description':$('#taxonomy_vocabulary_description').val(),
		'weight':$('#taxonomy_vocabulary_weight').val(),
	};
	// If this was an existing vocabulary, set the vid and update the vocabulary,
	// otherwise create a new vocabulary.
	if (drupalgap.taxonomy_vocabulary_edit.vid) {
		taxonomy_vocabulary.vid = drupalgap.taxonomy_vocabulary_edit.vid;
		drupalgap.services.taxonomy_vocabulary.update.call({
			'taxonomy_vocabulary':taxonomy_vocabulary,
			'success':function(result){
				$.mobile.changePage('taxonomy_vocabularies.html');
			},
		});
	}
	else {
		drupalgap.services.taxonomy_vocabulary.create.call({
			'taxonomy_vocabulary':taxonomy_vocabulary,
			'success':function(result){
				$.mobile.changePage('taxonomy_vocabularies.html');
			},
		});
	}
	*/
}
