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
        api_options.data = drupalgap_entity_assemble_data('node', options.node.type, options.node);
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
        api_options.data = drupalgap_entity_assemble_data('node', options.node.type, options.node);
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
    
    // TODO - this needs to be turned into drupalgap_entity_assemble_date() and
    // instead of iterating over possible fields, it should iterate over the
    // fields set in the options.entity variable, that way it builds the data
    // string off of whatever is sent in, and we don't have to guess how to
    // build it.
    
    // Determine language code and start building data string.
    var lng = language_default();
    var data = 'node[language]=' + encodeURIComponent(lng);
    if (options.node.type) {
      data += '&node[type]=' + encodeURIComponent(options.node.type);
    }
    if (options.node.title) {
      data += '&node[title]=' + encodeURIComponent(options.node.title);
    }
    
    // Iterate over the fields on this node and add them to the data string.
    var fields = drupalgap_field_info_instances('node', options.node.type);
    $.each(fields, function(field_name, field){
        var key = drupalgap_field_key(field_name);
        if (key) {
          // Iterate over each delta value in the field cardinality.
          var field_info_field = drupalgap_field_info_field(field_name);
          var allowed_values = field_info_field.cardinality;
          if (allowed_values == -1) {
            allowed_values = 1; // convert unlimited value fields to one, for now...
          }
          for (var delta = 0; delta < allowed_values; delta++) {
            // Skip fields without values.
            if (typeof options.node[field_name][lng][delta][key] === 'undefined' ||
                !options.node[field_name][lng][delta][key] ||
                options.node[field_name][lng][delta][key] == '') { continue; }
            // Encode the value.
            var value = encodeURIComponent(options.node[field_name][lng][delta][key]);
            // TODO - someone is passing a 'null' string instead of null, but who?
            if (!value || value == 'null') { continue; }
            // Add the key and value to the data string. Note, select does not work
            // with [und][0][value] but works with [und][value]
            if (field.widget.type == 'options_select') {
              data += '&node[' + field_name + '][' + lng + '][' + key + ']=';
            }
            else {
              data += '&node[' + field_name + '][' + lng + '][' + delta + '][' + key + ']=';
            }
            data += value;
          }
        }
    });
    
    // Return the data string.
    return data;
  }
  catch (error) { drupalgap_error(error); }
}

