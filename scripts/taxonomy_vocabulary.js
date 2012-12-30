$('#drupalgap_taxonomy_vocabulary').on('pagebeforeshow', function(){
});

$('#drupalgap_taxonomy_vocabulary').on('pageshow', function(){
	drupalgap.services.taxonomy_vocabulary.retrieve.call({
		'vid':drupalgap.taxonomy_vocabulary.vid,
		'success':function(vocabulary){
			drupalgap.taxonomy_vocabulary = vocabulary;
			$('#drupalgap_taxonomy_vocabulary h2').html(vocabulary.name);
			$('#drupalgap_taxonomy_vocabulary .content').html(vocabulary.description);
		},
	});
});

$('#taxonomy_vocabulary_edit').on('click', function(){
	//drupalgap.taxonomy_vocabulary_edit.vid = drupalgap.taxonomy_vocabulary.vid;
	alert('edit');
	return false;
});