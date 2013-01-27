/**
 * Implements hook_entity_info().
 */
function node_entity_info() {
  try {
  }
  catch (error) {
    alert('node_entity_info - ' + error);
  }
}

function node_edit_form() {
  try {
    // Setup form defaults.
    /* TODO - Always having to declare the default submit and validate
                function names is lame. Set it up to be automatic, then update
                all existing forms to inherit the automatic goodness. */
    form = {
      'id':'node_edit',
      'submit':['node_edit_form_submit'],
      'validate':['node_edit_form_validate'],
      'elements':{},
      'buttons':{},
      'entity_type':'node',
      'action':'node.html',
    };
		
    // Add the node title field to the form.
    form.elements.title = {
      'type':'textfield',
      'title':'Title',
      'required':true,
      'default_value':'',
      'description':'',
    };
    
    // Add the node type as a hidden field.
    form.elements.type = {
      'type':'hidden',
      'required':true,
      'default_value':drupalgap.node_edit.type,
    };
    
    // Add the fields for this content type to the form.
    drupalgap_field_info_instances_add_to_form(
      'node',
      drupalgap.node_edit.type,
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
    
    // Add delete button to form if we're editing a node.
    if (drupalgap.node_edit.nid) {
      form.buttons['delete'] = {
        'title':'Delete',
      };
    }
    
    return form;
  }
  catch (error) {
    alert('node_edit_form - ' + error);
  }
  return null;
}

function node_edit_form_loaded() {
  try {
    // Are we editing a node?
    if (drupalgap.node_edit.nid) {
      // Retrieve the node and fill in the form values.
      drupalgap.node_edit = drupalgap.services.node.retrieve.call({
        'nid':drupalgap.node_edit.nid,
        'success':function(node){
          // Set the drupalgap node edit.
          drupalgap.node_edit = node;
          // Place the title in the form.
          $('#' + drupalgap_form_get_element_id('title', drupalgap.form.id)).val(node.title);
          // Load the entity into the form.
          drupalgap_entity_load_into_form('node', drupalgap.node_edit.type, drupalgap.node_edit, drupalgap.form);    
        },
      });
    }
  }
  catch (error) {
    alert('node_edit_form_loaded - ' + error);
  }
}

function node_edit_form_validate(form, form_state) {
  try {
  }
  catch (error) {
    alert('node_edit_form_validate - ' + error);
  }
}

function node_edit_form_submit(form, form_state) {
  try {
    var node = drupalgap_entity_build_from_form_state();
    drupalgap_entity_form_submit(node);
  }
  catch (error) {
    alert('node_edit_form_submit - ' + error);
  }
}

