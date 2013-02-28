$('#drupalgap_taxonomy_term_edit').on('pagebeforeshow',function(){
	try {
	  drupalgap_form_render('taxonomy_form_term', '#drupalgap_taxonomy_term_edit .content');	
  }
	catch (error) {
		alert("drupalgap_taxonomy_term_edit - pagebeforeshow - " + error);
	}
});

$('#drupalgap_taxonomy_term_edit').on('pageshow',function(){
	try {
  }
	catch (error) {
		alert("drupalgap_taxonomy_term_edit - pageshow - " + error);
	}
});

$('#edit-taxonomy-form-term-cancel').live('click', function(){
	drupalgap_changePage('taxonomy_vocabulary.html');
});

$('#edit-taxonomy-form-term-delete').on('click', function(){
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
