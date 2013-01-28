$('#drupalgap_taxonomy_vocabulary_edit').on('pagebeforeshow',function(){
	try {
	  drupalgap_form_render('taxonomy_form_vocabulary', '#drupalgap_taxonomy_vocabulary_edit .content');
		/*if (!drupalgap.taxonomy_vocabulary_edit || !drupalgap.taxonomy_vocabulary_edit.vid) {
			// Creating a new term.
			$('#drupalgap_taxonomy_vocabulary_edit h1').html('Create Vocabulary');
			$('#taxonomy_vocabulary_weight').val(0);
			$('#taxonomy_vocabulary_delete').hide();
		}
		else {
			// Editing an existing term.
		}*/
  }
	catch (error) {
		alert("drupalgap_taxonomy_vocabulary_edit - pagebeforeshow - " + error);
	}
});

$('#drupalgap_taxonomy_vocabulary_edit').on('pageshow',function(){
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
		alert("drupalgap_taxonomy_vocabulary_edit - pageshow - " + error);
	}
});

$('#edit-taxonomy-form_vocabulary-cancel').live('click', function(){
  destination = 'taxonomy_vocabularies.html';
	if (drupalgap.taxonomy_vocabulary.vid) {
		destination = 'taxonomy_vocabulary.html';
	}
	drupalgap_changePage(destination);
});

$('#taxonomy_vocabulary_delete').on('click', function(){
	if (confirm('Are you sure you want to delete "' + drupalgap.taxonomy_vocabulary.name + '"? This cannot be undone.')) {
		drupalgap.services.taxonomy_vocabulary.del.call({
			'vid':drupalgap.taxonomy_vocabulary_edit.vid,
			'success':function(result){
				$.mobile.changePage('taxonomy_vocabularies.html');
			},
		});
	}
	return false;
});
