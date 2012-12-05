$('#drupalgap_node_edit').live('pagebeforeshow',function(){
	try {
		if (!drupalgap.node_edit.type) {
			alert('drupalgap_node_edit - node type not set');
			return;
		}
		if (!drupalgap.node_edit.nid) {
			// Creating a new node.
			$('#drupalgap_node_edit h1').html('Create ' + drupalgap.node_edit.type);
			$('#node_delete').hide();
		}
		else {
			// Editing an existing node.
			$('#drupalgap_node_edit h1').html('Edit ' + drupalgap.node_edit.type);
		}
    }
	catch (error) {
		if (drupalgap.settings.debug) {
			console.log("drupalgap_node_edit - " + error);
		}
	}
});

$('#node_submit').live('click', function(){
	if (!drupalgap.node_edit.nid) {
		// Create new node.
		drupalgap.services.node.create.call({
			'node':{
				'type':drupalgap.node_edit.type,
				'title':$('#node_title').val(),
				/*'body':{
					'und':{
						'value':$('#node_body').val()
					}
				},*/
			},
			'success':function(node) {
				alert('node ' + node.nid + ' created');
			},
		});
	}
	else {
		// Update existing node.
	}
});

$('#node_cancel').live('click', function(){
	drupalgap.node_edit.type = null;
	drupalgap.node_edit.nid = null;
	if (drupalgap.node_edit.destination) {
	  var destination = drupalgap.node_edit.destination;
	  drupalgap.node_edit.destination = null;
	  $.mobile.changePage(destination);
	}
	else {
		$.mobile.changePage('node_add.html');
	}
});

$('#node_delete').live('click', function(){
	alert('delete');
});