$('#drupalgap_taxonomy_vocabulary_edit').on('pagebeforeshow',function(){
	try {
	  drupalgap_form_render('taxonomy_form_vocabulary', '#drupalgap_taxonomy_vocabulary_edit .content');
  }
	catch (error) {
		alert("drupalgap_taxonomy_vocabulary_edit - pagebeforeshow - " + error);
	}
});

$('#drupalgap_taxonomy_vocabulary_edit').on('pageshow',function(){
	try {
		
  }
	catch (error) {
		alert("drupalgap_taxonomy_vocabulary_edit - pageshow - " + error);
	}
});

$('#edit-taxonomy-form-vocabulary-cancel').live('click', function(){
  destination = 'taxonomy_vocabularies.html';
	if (drupalgap.taxonomy_vocabulary.vid) {
		destination = 'taxonomy_vocabulary.html';
	}
	drupalgap_changePage(destination);
});

$('#edit-taxonomy-form-vocabulary-delete').on('click', function(){
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

