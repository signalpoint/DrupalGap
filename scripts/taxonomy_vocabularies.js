$('#drupalgap_page_taxonomy_vocabularies').on('pageshow',function(){
	try {
		drupalgap.views_datasource.call({
			'path':'drupalgap/views_datasource/taxonomy_vocabularies',
			'success':function(data) {
				$("#taxonomy_vocabularies_list").html("");
				$.each(data.vocabularies, function(index, object){	
					$("#taxonomy_vocabularies_list").append($("<li></li>",{"html":"<a href='taxonomy_vocabulary.html' vid='" + object.vocabulary.vid + "'>" + object.vocabulary.name + "</a>"}));
				});
				$("#taxonomy_vocabularies_list").listview("destroy").listview();
			},
		});
    }
	catch (error) {
		alert("drupalgap_page_taxonomy_vocabularies - " + error);
	}
});

$('#taxonomy_vocabularies_list a').live('click', function(){
	drupalgap.taxonomy_vocabulary = {'vid':$(this).attr('vid')};
});