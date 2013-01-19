$('#drupalgap_taxonomy_vocabulary_edit').on('pagebeforeshow',function(){
	try {
		if (!drupalgap.taxonomy_vocabulary_edit || !drupalgap.taxonomy_vocabulary_edit.vid) {
			// Creating a new term.
			$('#drupalgap_taxonomy_vocabulary_edit h1').html('Create Vocabulary');
			$('#taxonomy_vocabulary_weight').val(0);
			$('#taxonomy_vocabulary_delete').hide();
		}
		else {
			// Editing an existing term.
		}
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
			drupalgap.services.taxonomy_vocabulary.retrieve.call({
				'vid':drupalgap.taxonomy_vocabulary.vid,
				'success':function(vocabulary){
					$('#drupalgap_taxonomy_vocabulary_edit h1').html('Edit Vocabulary');
					$('#taxonomy_vocabulary_name').val(vocabulary.name);
					$('#taxonomy_vocabulary_machine_name').val(vocabulary.machine_name);
					$('#taxonomy_vocabulary_description').val(vocabulary.description);
					$('#taxonomy_vocabulary_weight').val(vocabulary.weight);
				},
			});
		}
    }
	catch (error) {
		alert("drupalgap_taxonomy_vocabulary_edit - pageshow - " + error);
	}
});

$('#taxonomy_vocabulary_submit').on('click', function(){
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
