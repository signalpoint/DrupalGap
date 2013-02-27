$('#drupalgap_node_edit').on('pagebeforeshow',function(){
	try {
	  drupalgap_form_render('node_edit', '#drupalgap_node_edit .content');
  }
	catch (error) {
		alert("drupalgap_node_edit - pagebeforeshow - " + error);
	}
});

$('#drupalgap_node_edit').on('pageshow',function(){
	try {
  }
	catch (error) {
		alert("drupalgap_node_edit - pageshow - " + error);
	}
});

$('#edit-node-edit-submit').on('click', function(){
	
});

$('#edit-node-edit-cancel').live('click', function(){
	destination = 'node_add.html';
	if (drupalgap.node_edit.nid) {
		destination = 'node.html';
	}
	drupalgap_changePage(destination);
});

$('#edit-node-edit-delete').live('click', function(){
	if (confirm('Are you sure you want to delete "' + drupalgap.node_edit.title + '"? This cannot be undone.')) {
		drupalgap.services.node.del.call({
			'nid':drupalgap.node_edit.nid,
			'success':function(result){
				if (result[0]) {
					alert('Node deleted!');
				}
				drupalgap_changePage(drupalgap.settings.front);
			},
		});
	}
});

