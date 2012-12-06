$('#drupalgap_node').live('pagebeforeshow', function(){
	
});

$('#drupalgap_node').live('pageshow', function(){
	drupalgap.services.node.retrieve.call({
		'nid':drupalgap.node.nid,
		'success':function(node){
			$('#drupalgap_node h1').html(node.title);
			$('#drupalgap_node .content').html(node.body[node.language][0].safe_value);
		},
	});
});