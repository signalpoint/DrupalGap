$('#drupalgap_node_edit').on('pagebeforeshow',function(){
	try {
		if (!drupalgap.node_edit || !drupalgap.node_edit.nid) {
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
						$('#node_body').val(node.body[node.language][0].value);
					}
				},
			});
		}
    }
	catch (error) {
		alert("drupalgap_node_edit - pageshow - " + error);
	}
});

$('#node_submit').live('click', function(){
	var node = {
		'type':drupalgap.node_edit.type,
		'title':$('#node_title').val()
	};
	node.body = {};
	node.body[drupalgap.settings.language] = {};
	node.body[drupalgap.settings.language][0] = {'value':$('#node_body').val()};
	if (!drupalgap.node_edit.nid) {
		drupalgap.services.node.create.call({
			'node':node,
			'success':function(node) {
				drupalgap.node_edit = {};
				drupalgap.node = {'nid':node.nid};
				$.mobile.changePage('node.html');
			},
		});
	}
	else {
		node.nid = drupalgap.node_edit.nid;
		drupalgap.services.node.update.call({
			'node':node,
			'success':function(node) {
				drupalgap.node_edit = {};
				drupalgap.node = {'nid':node.nid};
				$.mobile.changePage('node.html');
			},
		});
	}
});

$('#node_cancel').live('click', function(){
	destination = 'node_add.html';
	if (drupalgap.node_edit.nid) {
		destination = 'node.html';
	}
	$.mobile.changePage(destination);
});

$('#node_delete').live('click', function(){
	if (confirm('Are you sure you want to delete "' + drupalgap.node_edit.title + '"? This cannot be undone.')) {
		drupalgap.services.node.del.call({
			'nid':drupalgap.node_edit.nid,
			'success':function(result){
				if (result) {
					drupalgap.node = {};
					drupalgap.node_edit = {};
					$.mobile.changePage(drupalgap.settings.front);
				}
			},
		});
	}
});