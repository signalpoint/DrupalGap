$('#drupalgap_taxonomy_term').on('pageshow', function(){
	drupalgap.services.taxonomy_term.retrieve.call({
		'tid':drupalgap.taxonomy_term.tid,
		'success':function(term){
			drupalgap.taxonomy_term = term;
			$('#drupalgap_taxonomy_term h2').html(term.name);
			$('#drupalgap_taxonomy_term .content').html(term.description);
			drupalgap.services.taxonomy_term.selectNodes.call({
				'tid':term.tid,
				'success':function(nodes){
					$("#taxonomy_term_nodes").html("");
					$.each(nodes, function(index, object){	
						$("#taxonomy_term_nodes").append($("<li></li>",{"html":"<a href='#' nid='" + object.nid + "'>" + object.title + "</a>"}));
					});
					$("#taxonomy_term_nodes").listview("destroy").listview();
				}
			});
		},
	});
});

$('#taxonomy_term_edit').on('click', function(){
	//drupalgap.taxonomy_term_edit.tid = drupalgap.taxonomy_term.tid;
	alert('edit');
	return false;
});

$('#taxonomy_term_nodes li a').live('click', function(){
	drupalgap.node.nid = $(this).attr('nid');
	$.mobile.changePage('node.html');
	return false;
});
