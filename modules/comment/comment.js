function comment_edit() {
  try {
    form = {
      'id':'comment_edit',
      'elements':{},
      'buttons':{},
      'entity_type':'comment',
      'action':'node.html',
    };
		
    // Add the subject to the form.
    form.elements.subject = {
      'type':'textfield',
      'title':'Subject',
      'required':true,
      'default_value':'',
      'description':'',
    };
    
    // Add the node nid as a hidden field.
    form.elements.nid = {
      'type':'hidden',
      'required':true,
      'default_value':drupalgap.node.nid,
    };
    
    // Add the node cid as a hidden field.
    /*form.elements.cid = {
      'type':'hidden',
      'required':true,
      'default_value':drupalgap.comment_edit.cid,
    };*/
    
    // Add the comment fields for this content type to the form.
    drupalgap_field_info_instances_add_to_form(
      'comment',
      'comment_node_' + drupalgap.node.type,
      form
    );
    
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
    if (drupalgap.comment_edit.cid) {
      form.buttons['delete'] = {
        'title':'Delete',
      };
    }
    
    return form;
  }
  catch (error) {
    alert('comment_edit - ' + error);
  }
}

function comment_edit_loaded() {
  try {
    if (drupalgap.comment_edit.cid) {
			// Editing existing comment.
			drupalgap.services.comment.retrieve.call({
				'cid':drupalgap.comment_edit.cid,
				'success':function(comment){
				  // Set the drupalgap comment edit.
					drupalgap.comment_edit = comment;
					// Place the title in the form.
          $('#' + drupalgap_form_get_element_id('subject', drupalgap.form.id)).val(comment.subject);
          // Load the entity into the form.
          drupalgap_entity_load_into_form(
            'comment',
            'comment_node_' + drupalgap.node.type,
            drupalgap.comment_edit,
            drupalgap.form
          );
				}
			});
		}
		else {
			// Adding new comment.
		}
  }
  catch (error) {
    alert('comment_edit_loaded - ' + error);
  }
}

function comment_edit_validate(form, form_state) {
  try {
  }
  catch (error) {
    alert('comment_edit_validate - ' + error);
  }
}

function comment_edit_submit(form, form_state) {
  try {
    var comment = drupalgap_entity_build_from_form_state(form, form_state);
    drupalgap_entity_form_submit(form, form_state, comment);
  }
  catch (error) {
    alert('comment_edit_submit - ' + error);
  }
}

