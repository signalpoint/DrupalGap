drupalgap.services.drupalgap_content = {
	'content_types_user_permissions':{
		'options':{
			'type':'post',
			'path':'drupalgap_content/content_types_user_permissions.json',
		},
		'call':function(options){
			try {
				drupalgap.api.call(drupalgap_chain_callbacks(drupalgap.services.drupalgap_content.content_types_user_permissions.options, options));
			}
			catch (error) {
				navigator.notification.alert(
					error,
					function(){},
					'DrupalGap User Roles and Permissions Error',
					'OK'
				);
			}
		},
	}, // <!-- content_types_user_permissions -->
};