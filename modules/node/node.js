/**
 * Page call back for node/add.
 */
function node_add_page() {
  try {
    if (drupalgap.settings.debug) {
      console.log('node_add_page()');
    }
    return "node_add_page()";
  }
  catch (error) {
    alert('node_add_page - ' + error);
  }
}

function node_edit() {
  try {
    // Setup form defaults.
    /* TODO - Always having to declare the default submit and validate
                function names is lame. Set it up to be automatic, then update
                all existing forms to inherit the automatic goodness. */
    var form = {
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
    alert('node_edit - ' + error);
  }
  return null;
}

function node_edit_loaded() {
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
    alert('node_edit_loaded - ' + error);
  }
}

function node_edit_validate(form, form_state) {
  try {
  }
  catch (error) {
    alert('node_edit_validate - ' + error);
  }
}

function node_edit_submit(form, form_state) {
  try {
    var node = drupalgap_entity_build_from_form_state();
    drupalgap_entity_form_submit(node);
  }
  catch (error) {
    alert('node_edit_submit - ' + error);
  }
}

/**
 * Loads a node object and returns it. Returns false if the node load fails.
 */
function node_load(nid) {
  try {
    if (drupalgap.settings.debug) {
      console.log('node_load()');
      console.log(JSON.stringify(arguments));
    }
    var node = false;
    drupalgap.services.node.retrieve.call({
      'nid':nid,
      'async':false,
      'success':function(data){
        node = data;
      }
    });
    return node;
  }
  catch (error) {
    alert(' - ' + error);
  }
}


/**
 * Implements hook_menu().
 */
function node_menu() {
  try {
    if (drupalgap.settings.debug) {
      console.log('node_menu()');
    }
    var items = {
      'node':{
        'title':'Content',
        'page_callback':'node_page',
      },
      'node/add':{
        'title':'Add content',
        'page_callback':'node_add_page',
        'access_callback':'_node_add_access',
      },
      'node/%':{
        'title':'Node',
        'page_callback':'node_page_view',
        'page_arguments':[1],
      },
    };
    return items;
  }
  catch (error) {
    alert('node_menu - ' + error);
  }
}

/**
 * Access callback: Checks whether the user has permission to add a node.
 */
function _node_add_access() {
  try {
    if (drupalgap.settings.debug) {
      console.log('_node_add_access()');
    }
  }
  catch (error) {
    alert('_node_add_access - ' + error);
  }
}

/**
 * Page callback for node.
 */
function node_page() {
  try {
    if (drupalgap.settings.debug) {
      console.log('node_page()');
      console.log(JSON.stringify(arguments));
    }
    // Grab some recent content and display it.
    var html = '';
    drupalgap.views_datasource.call({
      'path':'drupalgap/views_datasource/drupalgap_content',
      'async':false,
      'success':function(data) {
        var items = [];
        $.each(data.nodes, function(index, object){
            items.push(l(object.node.title, 'node/' + object.node.nid));
        });
        html = theme('jqm_item_list', {'items':items});
      },
    });
    return html;
  }
  catch (error) {
    alert('node_page - ' + error);
  }
}

/**
 * Page callback for node/%.
 */
function node_page_view(nid) {
  try {
    if (drupalgap.settings.debug) {
      console.log('node_page_view()');
      console.log(JSON.stringify(arguments));
    }
    var node = node_load(nid);
    if (node) {
      var build = {
        'theme':'node',
        'node':node
      };
      return build;
    }
    else {
      alert('node_page_view - failed to load node (' + nid + ')');
    }
  }
  catch (error) {
    alert('node_page_view - ' + error);
  }
}

/**
 * Implements hook_theme().
 */
function node_theme() {
  try {
    if (drupalgap.settings.debug) {
      console.log('node_theme()');
    }
    return {
      'node':{
        'template':'node',
      },
    };
  }
  catch (error) {
    alert('node_theme - ' + error);
  }
}

