$('#drupalgap_node_edit').live('pagebeforeshow',function(){
	try {
		if (!drupalgap.node_edit.nid) {
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