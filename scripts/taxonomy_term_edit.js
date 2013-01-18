$('#drupalgap_taxonomy_term_edit').on('pagebeforeshow',function(){
	try {
		if (!drupalgap.taxonomy_term_edit || !drupalgap.taxonomy_term_edit.tid) {
			// Creating a new term.
			$('#drupalgap_taxonomy_term_edit h1').html('Create Term');
			$('#taxonomy_term_weight').val(0);
			$('#taxonomy_term_delete').hide();
		}
		else {
			// Editing an existing term.
		}
    }
	catch (error) {
		alert("drupalgap_taxonomy_term_edit - pagebeforeshow - " + error);
	}
});

$('#drupalgap_taxonomy_term_edit').on('pageshow',function(){
	try {
		if (!drupalgap.taxonomy_term_edit || !drupalgap.taxonomy_term_edit.tid) {
			// Creating a new term.
		}
		else {
			// Editing an existing term, set placeholders.
			$('#drupalgap_taxonomy_term_edit h1').html('Edit Term');
			$('#taxonomy_term_name').val(drupalgap.taxonomy_term_edit.name);
			$('#taxonomy_term_description').val(drupalgap.taxonomy_term_edit.description);
			$('#taxonomy_term_weight').val(drupalgap.taxonomy_term_edit.weight);
		}
    }
	catch (error) {
		alert("drupalgap_taxonomy_term_edit - pageshow - " + error);
	}
});

$('#taxonomy_term_submit').on('click', function(){
	// Grab form input, build json taxonomy_term and call service resource.
	taxonomy_term = {
		'vid':drupalgap.taxonomy_vocabulary.vid,
		'name':$('#taxonomy_term_name').val(),
		'description':$('#taxonomy_term_description').val(),
		'weight':$('#taxonomy_term_weight').val(),
	};
	// If this was an existing term, set the term id and update the term,
	// otherwise create a new term.
	if (drupalgap.taxonomy_term_edit.tid) {
		taxonomy_term.tid = drupalgap.taxonomy_term_edit.tid;
		drupalgap.services.taxonomy_term.update.call({
			'taxonomy_term':taxonomy_term,
			'success':function(result){
				$.mobile.changePage('taxonomy_vocabulary.html');
			},
		});
	}
	else {
		drupalgap.services.taxonomy_term.create.call({
			'taxonomy_term':taxonomy_term,
			'success':function(result){
				$.mobile.changePage('taxonomy_vocabulary.html');
			},
		});
	}
	
});

$('#taxonomy_term_delete').on('click', function(){
	if (confirm('Are you sure you want to delete "' + drupalgap.taxonomy_term_edit.name + '"? This cannot be undone.')) {
		drupalgap.services.taxonomy_term.del.call({
			'tid':drupalgap.taxonomy_term_edit.tid,
			'success':function(result){
				$.mobile.changePage('taxonomy_vocabulary.html');
			},
		});
	}
	return false;
});
