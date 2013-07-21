drupalgap.services.taxonomy_term = {
  'create':{
    'options':{
      'type':'post',
      'path':'taxonomy_term.json',
      'success':function(result){
        // If the term was not successfully created, notify the user of the
        // problem.
        if (result[0] != 1) {
          alert('taxonomy_term - create failed - ' + JSON.stringify(result));
        }
      },
    },
    'call':function(options){
      try {
        var api_options = drupalgap_chain_callbacks(drupalgap.services.taxonomy_term.create.options, options);
        api_options.data = drupalgap_taxonomy_term_assemble_data(options);
        drupalgap.api.call(api_options);
      }
      catch (error) {
        navigator.notification.alert(
          error,
          function(){},
          'taxonomy_term Create Error',
          'OK'
        );
      }
    },
  }, // <!-- create -->
  'retrieve':{
    'options':{
      'type':'get',
      'path':'taxonomy_term/%tid.json',
      'success':function(taxonomy_term){
        drupalgap_entity_render_content('taxonomy_term', taxonomy_term);
      },
    },
    'call':function(options){
      try {
        if (!options.tid) {
          navigator.notification.alert(
            'No Term ID provided!',
            function(){},
            'taxonomy_term Retrieve Error',
            'OK'
          );
          return;
        }
        var api_options = drupalgap_chain_callbacks(drupalgap.services.taxonomy_term.retrieve.options, options);
        api_options.path = 'taxonomy_term/' + options.tid + '.json';
        drupalgap.api.call(api_options);
      }
      catch (error) {
        navigator.notification.alert(
          error,
          function(){},
          'taxonomy_term Retrieve Error',
          'OK'
        );
      }
    },
  }, // <!-- retrieve -->
  'update':{
    'options':{
      'type':'put',
      'path':'taxonomy_term/%tid.json',
      'success':function(result){
        // If the update was not successful, notify the user.
        if (result[0] != 2) {
          alert('taxonomy_term - update failed - ' + JSON.stringify(result));
        }
      }
    },
    'call':function(options){
      try {
        var api_options = drupalgap_chain_callbacks(drupalgap.services.taxonomy_term.update.options, options);
        api_options.data = drupalgap_taxonomy_term_assemble_data(options);
        api_options.path = 'taxonomy_term/' + options.taxonomy_term.tid + '.json';
        drupalgap.api.call(api_options);
      }
      catch (error) {
        navigator.notification.alert(
          error,
          function(){},
          'taxonomy_term Update Error',
          'OK'
        );
      }
    },
  }, // <!-- update -->
  'del':{
    'options':{
      'type':'delete',
      'path':'taxonomy_term/%tid.json',
      'success':function(result) {
        // If the delete was not successful, notify the user.
        if (result[0] != 3) {
          alert('taxonomy_term - delete failed - ' + JSON.stringify(result));
        }
      },
    },
    'call':function(options){
      try {
        var api_options = drupalgap_chain_callbacks(drupalgap.services.taxonomy_term.del.options, options);
        api_options.path = 'taxonomy_term/' + options.tid + '.json';
        window.localStorage.removeItem(entity_local_storage_key('taxonomy_term', options.tid));
        drupalgap.api.call(api_options);
      }
      catch (error) {
        navigator.notification.alert(
          error,
          function(){},
          'taxonomy_term Delete Error',
          'OK'
        );
      }
    },
  }, // <!-- delete -->
  'selectNodes':{
    'options':{
      'type':'post',
      'path':'taxonomy_term/selectNodes.json',
      'success':function(tree){
      },
    },
    'call':function(options){
      try {
        if (!options.tid) {
          navigator.notification.alert(
            'No Term ID provided!',
            function(){},
            'taxonomy_term selectNodes Error',
            'OK'
          );
          return;
        }
        var api_options = drupalgap_chain_callbacks(drupalgap.services.taxonomy_term.selectNodes.options, options);
        api_options.data = '';
        if (options.tid) {
          api_options.data += '&tid=' + encodeURIComponent(options.tid);
        }
        if (options.pager) {
          api_options.data += '&pager=' + encodeURIComponent(options.pager);
        }
        if (options.limit) {
          api_options.data += '&limit=' + encodeURIComponent(options.limit);
        }
        if (options.order) {
          api_options.data += '&order=' + encodeURIComponent(options.maxdepth);
        }
        // The Services module throws a 404 if no nodes are found which the
        // DrupalGap API interprets by throwing an alert, let's supress that.
        //api_options.error_alert = false;
        // Make the call.
        drupalgap.api.call(api_options);
      }
      catch (error) {
        navigator.notification.alert(
          error,
          function(){},
          'taxonomy_term selectNodes Error',
          'OK'
        );
      }
    },
  }, // <!-- selectNodes -->
};

/**
 * Assembles the data uri component for taxonomy term entity service resource
 * calls.
 */
function drupalgap_taxonomy_term_assemble_data (options) {
  // TODO - I'm pretty sure this function's implementation is causing this
  // console log error to show up when terms are created/updates:
  // TypeError: Result of expression 'this.element' [undefined] is not an object.
  // at file:///android_asset/www/jquery.mobile-1.2.0.min.js:2
  var data = '';
  try {
    data += 'vid=' + encodeURIComponent(options.taxonomy_term.vid);
    data += '&name=' + encodeURIComponent(options.taxonomy_term.name);
    data += '&description=' + encodeURIComponent(options.taxonomy_term.description);
    data += '&weight=' + encodeURIComponent(options.taxonomy_term.weight);
  }
  catch (error) {
    alert('drupalgap_taxonomy_term_assemble_data - ' + error);
  }
  return data;
}

