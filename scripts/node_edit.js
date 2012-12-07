$('#drupalgap_node_edit').live('pagebeforeshow',function(){
	try {
		if (!drupalgap.node_edit.nid) {
			// Creating a new node.
			//drupalgap.destination = 'node_add.html';
			if (!drupalgap.node_edit.type) {
				alert('drupalgap_node_edit - node type not set');
				return;
			}
			$('#drupalgap_node_edit h1').html('Create ' + drupalgap.node_edit.type);
			$('#node_delete').hide();
		}
		else {
			// Editing an existing node.
		}
    }
	catch (error) {
		if (drupalgap.settings.debug) {
			console.log("drupalgap_node_edit - pagebeforeshow - " + error);
		}
	}
});

$('#drupalgap_node_edit').live('pageshow',function(){
	try {
		if (!drupalgap.node_edit.nid) {
			// Creating a new node.
		}
		else {
			// Editing an existing node.
			drupalgap.services.node.retrieve.call({
				'nid':drupalgap.node_edit.nid,
				'success':function(node){
					drupalgap.node_edit = node;
					$('#drupalgap_node_edit h1').html('Edit ' + node.type);
					$('#node_title').val(node.title);
					if (node.body.length != 0) {
						$('#node_body').val(node.body[node.language][0].value);
					}
				},
			});
		}
    }
	catch (error) {
		if (drupalgap.settings.debug) {
			console.log("drupalgap_node_edit - pageshow - " + error);
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
					drupalgap.settings.language:{
						'value':$('#node_body').val()
					}
				},*/
			},
			'success':function(node) {
				alert('node ' + node.nid + ' created');
				drupalgap.node_edit = {};
			},
		});
	}
	else {
		// Update existing node.
		
		drupalgap.node_edit = {};
	}
});

$('#node_cancel').live('click', function(){
	destination = 'node_add.html';
	if (drupalgap.node_edit.nid) {
		destination = 'node.html';
	}
	//drupalgap.node_edit = {};
	//$.mobile.changePage(drupalgap.destination);
	//alert('going to destination: ' + destination);
	$.mobile.changePage(destination);
	return false;
});

$('#node_delete').live('click', function(){
	if (confirm('Are you sure you want to delete "' + drupalgap.node_edit.title + '"? This cannot be undone.')) {
		/*drupalgap.services.node.delete.call({
			'nid':drupalgap.node_edit.nid,
			'success':function(data){
				drupalgap.node_edit.node = null;
			},
		});*/
	}
});