$('#drupalgap_node_edit').on('pagebeforeshow',function(){
	try {
	  drupalgap_form_render('node_edit', '#drupalgap_node_edit .content');
		/*if (!drupalgap.node_edit || !drupalgap.node_edit.nid) {
			// Creating a new node.
			if (!drupalgap.node_edit.type) {
				alert('drupalgap_node_edit - node type not set');
				return;
			}
			$('#drupalgap_node_edit h1').html('Create ' + drupalgap.node_edit.type);
			$('#node_delete').hide();
		}
		else {
			// Editing an existing node.
		}*/
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

$('#edit-submit').on('click', function(){
	
});

$('#edit-cancel').live('click', function(){
	destination = 'node_add.html';
	if (drupalgap.node_edit.nid) {
		destination = 'node.html';
	}
	drupalgap_changePage(destination);
});

$('#edit-delete').live('click', function(){
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
