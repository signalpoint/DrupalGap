$('#drupalgap_taxonomy_vocabulary').on('pagebeforeshow', function(){
	// If the user can administer taxonomy, show them the edit vocabulary
	// and add term buttons.
	if (drupalgap_user_access({'permission':'administer taxonomy'})) {
		$('#taxonomy_vocabulary_edit').show();
		$('#taxonomy_term_add').show();
	}
});

$('#drupalgap_taxonomy_vocabulary').on('pageshow', function(){
	// Retrieve the vocabulary.
	drupalgap.services.taxonomy_vocabulary.retrieve.call({
		'vid':drupalgap.taxonomy_vocabulary.vid,
		'success':function(vocabulary){
			// Set the placeholders.
			$('#drupalgap_taxonomy_vocabulary h2').html(vocabulary.name);
			$('#drupalgap_taxonomy_vocabulary .content').html(vocabulary.description);
			// Get the vocabulary term tree.
			if (drupalgap_user_access({'permission':'drupalgap get terms'})) {
				drupalgap.services.drupalgap_taxonomy.get_terms.call({
					'vid':vocabulary.vid,
					'success':function(tree){
						// Render the tree into a list.
						// TODO - turn this into a function (drupal equivalent)
						$("#taxonomy_vocabulary_tree").html("");
						$.each(tree, function(index, object){
							var prefix = '';
							if (object.depth && object.depth != 0) {
								for (var i = 0; i < object.depth; i++) {
									prefix += '&nbsp;&nbsp;';
								}
							}
							$("#taxonomy_vocabulary_tree").append($("<li></li>",{"html":"<a href='taxonomy_term.html' tid='" + object.tid + "'>" + prefix + object.name + "</a>"}));
						});
						$("#taxonomy_vocabulary_tree").listview("destroy").listview();
					}
				});
			}
		},
	});
});

$('#taxonomy_vocabulary_edit').on('click', function(){
	drupalgap.taxonomy_vocabulary_edit.vid = drupalgap.taxonomy_vocabulary.vid;
});

$('#taxonomy_vocabulary_tree a').live('click', function(){
	drupalgap.taxonomy_term.tid = $(this).attr('tid');
});

/*$('#taxonomy_term_add').on('click', function(){
});*/
