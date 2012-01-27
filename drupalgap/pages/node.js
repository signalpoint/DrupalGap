var drupalgap_page_node;
var drupalgap_page_node_nid; // other's set this nid so this page knows which node to load
$('#drupalgap_page_node').live('pageshow',function(){
	try {
		drupalgap_page_node = drupalgap_services_node_retrieve(drupalgap_page_node_nid);
		if (!drupalgap_page_node) {
			alert("drupalgap_page_node - failed to load node (" + drupalgap_page_node_nid + ")");
			return false;
		}
		$('#drupalgap_page_node h1').html(drupalgap_page_node.title);
		$('#drupalgap_page_node .content').html(drupalgap_page_node.body.und[0].safe_value);
	}
	catch (error) {
		console.log("drupalgap_page_node");
		console.log(error);
	}
});

$('#drupalgap_page_node_button_edit').live("click",function(){
	drupalgap_page_node_edit_nid = drupalgap_page_node_nid;
});