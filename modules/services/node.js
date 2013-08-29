drupalgap.services.node = {
  'create':{
    'options':{
      'type':'post',
      'path':'node.json',
      'success':function(node){
      },
    },
    'call':function(options){
      try {
        var api_options = drupalgap_chain_callbacks(drupalgap.services.node.create.options, options);
        api_options.data = drupalgap_node_assemble_data(options);
        drupalgap.api.call(api_options);
      }
      catch (error) {
        navigator.notification.alert(
          error,
          function(){},
          'Node Create Error',
          'OK'
        );
      }
    },
  }, // <!-- create -->
  'retrieve':{
    'options':{
      'type':'get',
      'path':'node/%nid.json',
      'success':function(node){
        drupalgap_entity_render_content('node', node);
      },
    },
    'call':function(options){
      try {
        if (!options.nid) {
          navigator.notification.alert(
            'No node id provided!',
            function(){},
            'Node Retrieve Error',
            'OK'
          );
          return;
        }
        var api_options = drupalgap_chain_callbacks(drupalgap.services.node.retrieve.options, options);
        api_options.path = 'node/' + options.nid + '.json';
        drupalgap.api.call(api_options);
      }
      catch (error) {
        navigator.notification.alert(
          error,
          function(){},
          'Node Retrieve Error',
          'OK'
        );
      }
    },
  }, // <!-- retrieve -->
  'update':{
    'options':{
      'type':'put',
      'path':'node/%nid.json',
      'success':function(node){
      },
    },
    'call':function(options){
      try {
        var api_options = drupalgap_chain_callbacks(drupalgap.services.node.update.options, options);
        api_options.data = drupalgap_node_assemble_data(options);
        api_options.path = 'node/' + options.node.nid + '.json';
        drupalgap.api.call(api_options);
      }
      catch (error) {
        navigator.notification.alert(
          error,
          function(){},
          'Node Update Error',
          'OK'
        );
      }
    },
  }, // <!-- update -->
  'del':{
    'options':{
      'type':'delete',
      'path':'node/%nid.json',
      'success':function(result){
        if (result[0]) {
          
        }
        else {
          alert('node delete - error - ' + JSON.stringify(result));
        }
      },
    },
    'call':function(options){
      try {
        var api_options = drupalgap_chain_callbacks(drupalgap.services.node.del.options, options);
        api_options.path = 'node/' + options.nid + '.json';
        window.localStorage.removeItem(entity_local_storage_key('node', options.nid));
        drupalgap.api.call(api_options);
      }
      catch (error) {
        navigator.notification.alert(
          error,
          function(){},
          'Node Delete Error',
          'OK'
        );
      }
    },
  }, // <!-- delete -->
};

/**
 * Assembles the data uri component for node entity service resource calls.
 */
function drupalgap_node_assemble_data(options) {
  try {
    if (drupalgap.settings.debug) {
      console.log(JSON.stringify(options));
    }
    var data = 'node[language]=' + encodeURIComponent(drupalgap.settings.language);
    if (options.node.type) {
      data += '&node[type]=' + encodeURIComponent(options.node.type);
    }
    if (options.node.title) {
      data += '&node[title]=' + encodeURIComponent(options.node.title);
    }
    
    var node_fields_list = drupalgap_field_info_instances('node', options.node.type);
    var node_fields = Object.keys(node_fields_list);
    //console.log(node_fields);
    $(node_fields).each(function(index,field_name){      	
    	if(field_name in options.node){
    		var field_data = eval("options.node."+field_name+"['"+drupalgap.settings.language+"'][0].value");
    		if(field_data){
    			var field_widget_type = eval("node_fields_list."+field_name+".widget.type");   			
    			if(field_widget_type == 'options_select'){
    				//Options select does not work with [und][0][value] but works with [und][value]
    				data += '&node['+field_name+'][' + drupalgap.settings.language + '][value]=' +
    	            encodeURIComponent(field_data);
    			}else{
    				data += '&node['+field_name+'][' + drupalgap.settings.language + '][0][value]=' +
    	            encodeURIComponent(field_data);
    			}    				    	
    		}
    	}
    	
    });
    if (drupalgap.settings.debug) {
      console.log(data);
    }
    return data;
  }
  catch (error) {
    alert('drupalgap_node_assemble_data - ' + error);
  }
}

