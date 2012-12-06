$('#drupalgap_node').live('pagebeforeshow', function(){
	
});

$('#drupalgap_node').live('pageshow', function(){
	drupalgap.services.node.retrieve.call({
		'nid':drupalgap.node.nid,
		'success':function(node){
			$('#drupalgap_node h1').html(node.type);
			$('#drupalgap_node h2').html(node.title);
			$('#drupalgap_node .content').html(node.content);
			if (node.uid == drupalgap.user.uid) {
				$('#node_edit').show();
			}
		},
	});
});

$('#node_edit').live('click', function(){
	drupalgap.node_edit.nid = drupalgap.node.nid;
	drupalgap.node_edit.destination = 'node.html';
	$.mobile.changePage('node_edit.html');
});