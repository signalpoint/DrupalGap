/**
 * The comment edit form.
 */
function comment_edit(form, form_state, comment) {
  try {
    if (drupalgap.settings.debug) {
      console.log('comment_edit');
    }

    // If there is no comment object coming in, make an empty one with a node
    // id. Note, once the form.js submit handler is aware of its own entity and
    // can pass it along to this function (and others) when loading a form during
    // the submission process, this little chunk of code will no longer by needed.
    if (!comment) { comment = {'nid':arg(1)}; }
    
    // Load up the node specified in the comment.
    var node = node_load(comment.nid);
    
    if (node) {
      // Setup form defaults.
      form.entity_type = 'comment';
      form.action = 'node/' + node.nid;
      
      // Determine the comment bundle from the node type.
      var bundle = 'comment_node_' + node.type;
    
      // Add the entity's core fields to the form.
      drupalgap_entity_add_core_fields_to_form('comment', bundle, form, comment);
      // TODO - fields like 'name' and 'mail' should not be shown when the user
      // is authenticated.
      
      // Add the fields for this content type to the form.
      drupalgap_field_info_instances_add_to_form('comment', bundle, form, comment);
      
      // Add submit to form.
      form.elements.submit = {
        'type':'submit',
        'value':'Save',
      };
      
      // Add cancel button to form.
      form.buttons['cancel'] = {
        'title':'Cancel',
      };
      
      // Add delete button to form if we're editing a comment.
      if (comment && comment.cid) {
        form.buttons['delete'] = {
          'title':'Delete',
        };
      }
      
      return form;
    }
    else {
      return 'comment_edit - failed to load node!';
    }
  }
  catch (error) {
    alert('comment_edit - ' + error);
  }
}

/**
 * The comment edit submit function.
 */
function comment_edit_submit(form, form_state) {
  try {
    if (drupalgap.settings.debug) {
      console.log('comment_edit_submit');
    }
    var comment = drupalgap_entity_build_from_form_state(form, form_state);
    drupalgap_entity_form_submit(form, form_state, comment);
  }
  catch (error) {
    alert('comment_edit_submit - ' + error);
  }
}

/**
 * Loads a comment object and returns it, returns false if the load fails.
 */
function comment_load(cid) {
  try {
    var options = null;
    if (arguments[1]) { options = arguments[1]; }
    return entity_load('comment', cid, options);
  }
  catch (error) { drupalgap_error(error); }
}

