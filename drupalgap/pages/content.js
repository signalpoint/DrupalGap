$('#drupalgap_page_content').live('pageshow',function(){
	try {
		content = drupalgap_views_datasource_retrieve({"path":"views_datasource/drupalgap_content"});
		$("#drupalgap_page_content_list").html(""); // clear the list
		$.each(content.nodes,function(index,obj){
			$("#drupalgap_page_content_list").append($("<li></li>",{"html":"<a href='node.html' id='" + obj.node.nid + "'>" + obj.node.title + "</a>"}));
		});
		$("#drupalgap_page_content_list").listview("destroy").listview(); // refresh the list
	}
	catch (error) {
		console.log("drupalgap_page_content");
		console.log(error);
	}
});

$('#drupalgap_page_content_list a').live("click",function(){
	drupalgap_page_node_nid = $(this).attr('id');
});
