drupalgap.services.comment = {
  'create':{
    'options':{
      'type':'post',
      'path':'comment.json',
    },
    'call':function(options){
      try {
        var api_options = drupalgap_chain_callbacks(drupalgap.services.comment.create.options, options);
        api_options.data = drupalgap_comment_assemble_data(options);
        drupalgap.api.call(api_options);
      }
      catch (error) {
        navigator.notification.alert(
          error,
          function(){},
          'Comment Create Error',
          'OK'
        );
      }
    },
  }, // <!-- create -->
  'retrieve':{
    'options':{
      'type':'get',
      'path':'comment/%cid.json',
      'success':function(comment){
        drupalgap_entity_render_content('comment', comment);
        // TODO - a good opportunity for a hook to come in
        // and modify comment.content if developer wants.

        // Extract the comment_body and set at a top level in
        // the comment object for easy access.
        comment.body = comment.comment_body[comment.language][0].value;
      },
    },
    'call':function(options){
      try {
        if (!options.cid) {
          navigator.notification.alert(
            'No comment id provided!',
            function(){},
            'Comment Retrieve Error',
            'OK'
          );
          return;
        }
        var api_options = drupalgap_chain_callbacks(drupalgap.services.comment.retrieve.options, options);
        api_options.path = 'comment/' + options.cid + '.json';
        drupalgap.api.call(api_options);
      }
      catch (error) {
        navigator.notification.alert(
          error,
          function(){},
          'Comment Retrieve Error',
          'OK'
        );
      }
    },
  }, // <!-- retrieve -->
  'update':{
    'options':{
      'type':'put',
      'path':'comment/%cid.json',
      'success':function(result){
      },
    },
    'call':function(options){
      try {
        var api_options = drupalgap_chain_callbacks(drupalgap.services.comment.update.options, options);
        api_options.data = drupalgap_comment_assemble_data(options);
        api_options.path = 'comment/' + options.comment.cid + '.json';
        drupalgap.api.call(api_options);
      }
      catch (error) {
        navigator.notification.alert(
          error,
          function(){},
          'Comment Update Error',
          'OK'
        );
      }
    },
  }, // <!-- update -->
  'del':{
    'options':{
      'type':'delete',
      'path':'comment/%cid.json',
    },
    'call':function(options){
      try {
        var api_options = drupalgap_chain_callbacks(drupalgap.services.comment.del.options, options);
        api_options.path = 'comment/' + options.cid + '.json';
        window.localStorage.removeItem(entity_local_storage_key('comment', options.cid));
        drupalgap.api.call(api_options);
      }
      catch (error) {
        navigator.notification.alert(
          error,
          function(){},
          'Comment Delete Error',
          'OK'
        );
      }
    },
  }, // <!-- delete -->
};

/**
 * Assembles the data uri component for comment entity service resource calls.
 */
function drupalgap_comment_assemble_data(options) {
  var data = '';
  if (options.comment.nid) {
    data += '&nid=' + encodeURIComponent(options.comment.nid);
  }
  if (options.comment.cid) {
    data += '&cid=' + encodeURIComponent(options.comment.cid);
  }
  if (options.comment.subject) {
    data += '&subject=' + encodeURIComponent(options.comment.subject);
  }
  if (options.comment.name) {
    data += '&name=' + encodeURIComponent(options.comment.name);
  }
  if (options.comment.mail) {
    data += '&mail=' + encodeURIComponent(options.comment.mail);
  }
  if (options.comment.homepage) {
    data += '&homepage=' + encodeURIComponent(options.comment.homepage);
  }
  if (options.comment.comment_body) {
    data += '&comment_body[' + drupalgap.settings.language +'][0][value]=' +
      encodeURIComponent(options.comment.comment_body[drupalgap.settings.language][0].value);
  }
  return data;
}

