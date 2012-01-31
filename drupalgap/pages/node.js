var drupalgap_page_node;
var drupalgap_page_node_nid; // other's set this nid so this page knows which node to load
$('#drupalgap_page_node').live('pageshow',function(){
	try {
		
		// load node
		drupalgap_page_node = drupalgap_services_node_retrieve(drupalgap_page_node_nid);
		if (!drupalgap_page_node) {
			alert("drupalgap_page_node - failed to load node (" + drupalgap_page_node_nid + ")");
			return false;
		}
		
		// clear any previous node edit id reference
		drupalgap_page_node_edit_nid = null;
		
		// fill in placeholders
		$('#drupalgap_page_node h1').html(drupalgap_page_node.title);
		$('#drupalgap_page_node .content').html(drupalgap_page_node.body.und[0].safe_value);
		
		// set edit button visibility
		
		// if user is not user 1 and user is not node author, hide the edit button, otherwise show it
		if (drupalgap_user.uid != 1 && drupalgap_user.uid != drupalgap_page_node.uid)
			$('#drupalgap_page_node_button_edit').hide();
		else
			$('#drupalgap_page_node_button_edit').show();
		
	}
	catch (error) {
		console.log("drupalgap_page_node");
		console.log(error);
	}
});

$('#drupalgap_page_node_button_edit').live("click",function(){
	drupalgap_page_node_edit_nid = drupalgap_page_node_nid;
});