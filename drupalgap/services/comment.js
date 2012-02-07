// global variables used to hold the latest system resource call results
var drupalgap_services_comment_create_result;

function drupalgap_services_comment_create (comment) {
	try {
		
		// Clear last result.
		drupalgap_services_comment_create_result = null;
		
		// Validate incoming parameters.
		valid = true;
		if (!comment.nid) {
			alert("drupalgap_services_comment_create - no node id provided");
			valid = false;
		}
		if (!comment.body) {
			alert("drupalgap_services_comment_create - no comment body provided");
			valid = false;
		}
		
		// If everything is valid, make the service resource call.
		if (valid) {
			
			// Build the data string.
			data = "nid=" + encodeURIComponent(comment.nid) + "&comment_body[und][0][value]=" + encodeURIComponent(comment.body);
			
			// If they provided a subject, add it to the data string.
			if (comment.subject) {
				data += "&subject=" + encodeURIComponent(comment.subject);
			}
			
			// Make the call.
			drupalgap_services_comment_create_result = drupalgap_services_resource_call({"resource_path":"comment.json","data":data});
		}
	}
	catch (error) {
		console.log("drupalgap_services_comment_create");
		console.log(error);
	}
	return drupalgap_services_comment_create_result;
}