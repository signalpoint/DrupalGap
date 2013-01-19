$('#drupalgap_node_edit').on('pagebeforeshow',function(){
	try {
		if (!drupalgap.node_edit || !drupalgap.node_edit.nid) {
			// Creating a new node.
			if (!drupalgap.node_edit.type) {
				alert('drupalgap_node_edit - pagebeforeshow - node type not set');
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
		alert("drupalgap_node_edit - pagebeforeshow - " + error);
	}
});

$('#drupalgap_node_edit').on('pageshow',function(){
	try {
		if (drupalgap.node_edit.nid) {
			drupalgap.services.node.retrieve.call({
				'nid':drupalgap.node_edit.nid,
				'success':function(node){
					drupalgap.node_edit = node;
					$('#drupalgap_node_edit h1').html('Edit ' + node.type);
					$('#node_title').val(node.title);
					if (node.body.length != 0) {
						$('#node_body').val(node.body);
					}
				},
			});
		}
    }
	catch (error) {
		alert("drupalgap_node_edit - pageshow - " + error);
	}
});

$('#node_submit').on('click', function(){
	var node = {
		"type": drupalgap.node_edit.type,
		"title": $('#node_title').val(),
		"body": {"value":$('#node_body').val()}
	};
	if (!drupalgap.node_edit.nid) {
		// Creating a new node.
		drupalgap.services.node.create.call({
			'node':node,
			'success':function(node) {
				$.mobile.changePage('node.html');
			},
		});
	}
	else {
		// Editing an existing node.
		node.nid = drupalgap.node_edit.nid;
		drupalgap.services.node.update.call({
			'node':node,
			'success':function(node) {
				$.mobile.changePage('node.html');
			},
		});
	}
});

$('#node_cancel').on('click', function(){
	destination = 'node_add.html';
	if (drupalgap.node_edit.nid) {
		destination = 'node.html';
	}
	$.mobile.changePage(destination);
});

$('#node_delete').on('click', function(){
	if (confirm('Are you sure you want to delete "' + drupalgap.node_edit.title + '"? This cannot be undone.')) {
		drupalgap.services.node.del.call({
			'nid':drupalgap.node_edit.nid,
			'success':function(result){
				if (result[0]) {
					alert('Node deleted!');
				}
				$.mobile.changePage(drupalgap.settings.front);
			},
		});
	}
});
