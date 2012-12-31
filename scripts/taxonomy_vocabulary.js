$('#drupalgap_taxonomy_vocabulary').on('pagebeforeshow', function(){
});

$('#drupalgap_taxonomy_vocabulary').on('pageshow', function(){
	drupalgap.services.taxonomy_vocabulary.retrieve.call({
		'vid':drupalgap.taxonomy_vocabulary.vid,
		'success':function(vocabulary){
			drupalgap.taxonomy_vocabulary = vocabulary;
			$('#drupalgap_taxonomy_vocabulary h2').html(vocabulary.name);
			$('#drupalgap_taxonomy_vocabulary .content').html(vocabulary.description);
			drupalgap.services.taxonomy_vocabulary.getTree.call({
				'vid':vocabulary.vid,
				'success':function(tree){
					$("#taxonomy_vocabulary_tree").html("");
					$.each(tree, function(index, object){
						var prefix = '';
						if (object.depth && object.depth != 0) {
							for (var i = 0; i < object.depth; i++) {
								prefix += '&nbsp;&nbsp;';
							}
						}
						$("#taxonomy_vocabulary_tree").append($("<li></li>",{"html":"<a href='#' tid='" + object.tid + "'>" + prefix + object.name + "</a>"}));
					});
					$("#taxonomy_vocabulary_tree").listview("destroy").listview();
				}
			});
		},
	});
});

$('#taxonomy_vocabulary_edit').on('click', function(){
	//drupalgap.taxonomy_vocabulary_edit.vid = drupalgap.taxonomy_vocabulary.vid;
	alert('edit');
	return false;
});

$('#taxonomy_vocabulary_tree a').live('click', function(){
	drupalgap.taxonomy_term.tid = $(this).attr('tid');
	$.mobile.changePage('taxonomy_term.html');
	return false;
});