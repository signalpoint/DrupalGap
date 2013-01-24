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

// TODO - this should really accept the form, and form_state as args.
function node_edit_form_loaded() {
  try {
    // Are we editing a node?
    if (drupalgap.node_edit.nid) {
      // Retrieve the node and fill in the form values.
      drupalgap.node_edit = drupalgap.services.node.retrieve.call({
        'nid':drupalgap.node_edit.nid,
        'success':function(node){
          $('#' + drupalgap_form_get_element_id('title', drupalgap.form.id)).val(node.title);
          // Get the fields for this content type, iterate over each and add each
          // of their values to their corresponding form. element
          fields = drupalgap_field_info_instances('node', node.type);
          $.each(fields, function(name, field){
              if (node[name] && node[name].length > 0) {
                var css_id = drupalgap_form_get_element_id(name, drupalgap.form.id); 
                $('#' + css_id).val(node[name][node.language][0].value);
              }
          });
        },
      });
    }
  }
  catch (error) {
    alert('node_edit_form_loaded - ' + error);
  }
}

function node_edit_form_submit(form, form_state) {
  try {
    console.log(JSON.stringify(drupalgap.node_edit));
    var node = {};
    $.each(form_state.values, function(name, value){
        field_info = drupalgap_field_info_field(name);
        if (field_info) {
          eval('node.' + name + ' = {};');
          node[name][drupalgap.node_edit.language] = [{"value":value}];
        }
        else {
          node[name] = value;  
        }
    });
    if (!drupalgap.node_edit.nid) {
      // Creating a new node.
      drupalgap.services.node.create.call({
        'node':node,
        'success':function(node) {
          drupalgap_changePage('node.html');
        },
      });
    }
    else {
      // Editing an existing node.
      node.nid = drupalgap.node_edit.nid;
      drupalgap.services.node.update.call({
        'node':node,
        'success':function(node) {
          drupalgap_changePage('node.html');
        },
      });
    }
  }
  catch (error) {
    alert('node_edit_form_submit - ' + error);
  }
}

function node_edit_form_validate(form, form_state) {
  try {
  }
  catch (error) {
    alert('node_edit_form_validate - ' + error);
  }
}

