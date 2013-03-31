/**
 *
 */
function node_access(node) {
  try {
    if (drupalgap.settings.debug) {
      console.log('node_access()');
      console.log(JSON.stringify(arguments));
    }
    if (node.uid == drupalgap.user.uid) {
      return true;
    }
    else {
      return false;
    }
  }
  catch (error) {
    alert('node_access - ' + error);
  }
}

/**
 * Page call back for node/add.
 */
function node_add_page() {
  try {
    if (drupalgap.settings.debug) {
      console.log('node_add_page()');
    }
    var content = {};
    content['header'] = {'markup':'<h2>Create Content</h2>'};
    drupalgap.services.drupalgap_content.content_types_user_permissions.call({
        'async':false,
        'success':function(data){
          var items = [];
          $.each(data,function(type,permissions){
            if (permissions.create) {
              items.push(l(type, 'node/add/' + type));
            }
          });
          if (items.length > 0) {
            content['content_type_list'] = {'theme':'jqm_item_list', 'items':items};
          }
          else {
            content['content_type_list'] = '<p>Sorry, you do not have permission to add content!</p>';
          }
        },
		});
		return content;
  }
  catch (error) {
    alert('node_add_page - ' + error);
  }
}

/**
 *
 */
function node_add_page_by_type(type) {
  try {
    if (drupalgap.settings.debug) {
      console.log('node_add_page_by_type(' + type + ')');
    }
    return drupalgap_get_form('node_edit', {'type':type});
  }
  catch (error) {
    alert('node_add_page_by_type - ' + error);
  }
}

/**
 * The node edit form.
 */
function node_edit(node) {
  try {
    if (drupalgap.settings.debug) {
      console.log('node_edit()');
      console.log(JSON.stringify(arguments));
    }
    // Setup form defaults.
    // TODO - Always having to declare the default submit and validate
    //          function names is lame. Set it up to be automatic, then update
    //          all existing forms to inherit the automatic goodness.
    var form = {
      'id':'node_edit',
      'submit':['node_edit_form_submit'],
      'validate':['node_edit_form_validate'],
      'elements':{},
      'buttons':{},
      'entity_type':'node',
    };
    
    // Add the entity's core fields to the form.
    drupalgap_entity_add_core_fields_to_form('node', node.type, form, node);
    
    // Add the fields for this content type to the form.
    drupalgap_field_info_instances_add_to_form('node', node.type, form, node);
    
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
    if (node && node.nid) {
      form.buttons['delete'] = {
        'title':'Delete',
      };
    }
    
    return form;
  }
  catch (error) {
    alert('node_edit - ' + error);
  }
}

function node_edit_validate(form, form_state) {
  try {
    if (drupalgap.settings.debug) {
      console.log('node_edit_validate()');
      console.log(JSON.stringify(arguments));
    }
  }
  catch (error) {
    alert('node_edit_validate - ' + error);
  }
}

function node_edit_submit(form, form_state) {
  try {
    if (drupalgap.settings.debug) {
      console.log('node_edit_submit()');
      console.log(JSON.stringify(arguments));
    }
    var node = drupalgap_entity_build_from_form_state(form, form_state);
    drupalgap_entity_form_submit(form, form_state, node);
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
    alert('node_load - ' + error);
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
        'pageshow':'node_page_pageshow',
      },
      'node/add':{
        'title':'Add content',
        'page_callback':'node_add_page',
      },
      'node/add/%':{
        'title':'Add content',
        'page_callback':'node_add_page_by_type',
        'page_arguments':[2],
      },
      'node/%':{
        'title':'Node',
        'page_callback':'node_page_view',
        'page_arguments':[1],
      },
      'node/%/view':{
        'title':'View',
        'type':'MENU_DEFAULT_LOCAL_TASK',
        'weight':-10,
      },
      'node/%/edit':{
        'title':'Edit',
        'page_callback':'drupalgap_get_form',
        'page_arguments':['node_edit', 1],
        'weight':0,
        'type':'MENU_LOCAL_TASK',
        'access_callback':'node_access',
        'access_arguments':[1],
      },
    };
    return items;
  }
  catch (error) {
    alert('node_menu - ' + error);
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
    var content = {
      'create_content':{
        'theme':'button_link',
        'path':'node/add',
        'text':'Create Content',
      },
      'node_listing':{
        'theme':'jqm_item_list',
        'title':'Content List',
        'items':[],
        'attributes':{'id':'node_listing_list'},
      }
    };
    
    // Return the content.
    return content;
  }
  catch (error) {
    alert('node_page - ' + error);
  }
}

/**
 *
 */
function node_page_pageshow() {
  try {
    if (drupalgap.settings.debug) {
      console.log('node_page_pageshow()');
    }
    // Grab some recent content and display it.
    drupalgap.views_datasource.call({
      'path':'drupalgap/views_datasource/drupalgap_content',
      'success':function(data) {
        // Extract the users into items, then drop them in the list.
        var items = [];
        $.each(data.nodes, function(index, object){
            items.push(l(object.node.title, 'node/' + object.node.nid));
        });
        drupalgap_item_list_populate("#node_listing_list", items);
      },
    });
  }
  catch (error) {
    alert('node_page_pageshow - ' + error);
  }
}

/**
 * Page callback for node/%.
 */
function node_page_view(node) {
  try {
    if (drupalgap.settings.debug) {
      console.log('node_page_view()');
      console.log(JSON.stringify(arguments));
    }
    if (node) {
      var build = {
        'theme':'node',
        'node':node, // TODO - is this line of code doing anything?
        'title':{'markup':node.title}, // TODO - this is a core field and should probably by fetched from entity.js
        'content':{'markup':node.content},
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

