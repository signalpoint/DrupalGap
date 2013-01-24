function comment_form() {
  try {
    form = {
      'id':'comment_edit',
      'elements':{},
      'buttons':{},
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
    form.elements.cid = {
      'type':'hidden',
      'required':true,
      'default_value':drupalgap.comment_edit.cid,
    };
    
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
  }
}

function comment_form_validate(form, form_state) {
  try {
  }
  catch (error) {
    alert('comment_form_validate - ' + error);
  }
}

function comment_form_submit(form, form_state) {
  try {
  }
  catch (error) {
    alert('comment_form_submit - ' + error);
  }
  
}

/**
 * Implements hook_entity_info().
 */
/*function comment_entity_info() {
  try {
  }
  catch (error) {
    alert('comment_entity_info - ' + error);
  }
}*/

