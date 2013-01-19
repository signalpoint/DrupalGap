$('#drupalgap_page_taxonomy_vocabularies').on('pagebeforeshow',function(){
	try {
		// If the user can administer taxonomy, show the vocabulary add button.
		if (drupalgap_user_access({'permission':'administer taxonomy'})) {
			$('#taxonomy_vocabulary_add').show();
		}
	}
	catch (error) {
		alert("drupalgap_page_taxonomy_vocabularies - pagebeforeshow - " + error);
	}
});

$('#drupalgap_page_taxonomy_vocabularies').on('pageshow',function(){
	try {
		drupalgap.services.drupalgap_taxonomy.get_vocabularies.call({
			'success':function(vocabularies){
				$("#taxonomy_vocabularies_list").html("");
				$.each(vocabularies, function(index, vocabulary){	
					$("#taxonomy_vocabularies_list").append($("<li></li>",{"html":"<a href='taxonomy_vocabulary.html' vid='" + vocabulary.vid + "'>" + vocabulary.name + "</a>"}));
				});
				$("#taxonomy_vocabularies_list").listview("destroy").listview();
			}
		});
    }
	catch (error) {
		alert("drupalgap_page_taxonomy_vocabularies - " + error);
	}
});

$('#taxonomy_vocabularies_list a').live('click', function(){
	drupalgap.taxonomy_vocabulary = {'vid':$(this).attr('vid')};
});
