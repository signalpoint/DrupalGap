/**
 * Given a node, this determines if the current user has access to it. Returns
 * true if so, false otherwise. This function implementation is incomplete, use
 * with caution.
 */
function node_access(node) {
  try {
    if (drupalgap.settings.debug) {
      console.log('node_access()');
      console.log(JSON.stringify(arguments));
    }
    if (((node.uid == drupalgap.user.uid) 
    		&& user_access('edit own '+node.type+' content'))
    		|| user_access('edit any '+node.type+' content')){
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
    var content = {
      "header":{'markup':'<h2>Create Content</h2>'},
      'node_type_listing':{
        'theme':'jqm_item_list',
        'title':'Content Types',
        'items':[],
        'attributes':{'id':'node_type_listing_items'},
      }
    };
    return content;
  }
  catch (error) {
    alert('node_add_page - ' + error);
  }
}

/**
 * The jQM pageshow callback for the node add page.
 */
function node_add_page_pageshow() {
  try {
    if (drupalgap.settings.debug) {
      console.log('node_add_page_pageshow()');
    }
    drupalgap.services.drupalgap_content.content_types_user_permissions.call({
      'success':function(data) {
        var items = [];
        $.each(data,function(type,permissions){
            if (permissions.create) {
              items.push(l(type, 'node/add/' + type));
            }
        });
        drupalgap_item_list_populate("#node_type_listing_items", items);
      },
    });
  }
  catch (error) {
    alert('node_add_page_pageshow - ' + error);
  }
}

/**
 * Page call back function for node/add/[type].
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
function node_edit(form, form_state, node) {
  try {
    if (drupalgap.settings.debug) {
      console.log('node_edit()');
      console.log(JSON.stringify(arguments));
    }
    // Setup form defaults.
    form.entity_type = 'node';
    
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

/**
 * The node edit form's validation function.
 */
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

/**
 * The node edit form's submit function.
 */
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
    var options = null;
    if (arguments[1]) { options = arguments[1]; }
    return entity_load('node', nid, options);
  }
  catch (error) { drupalgap_error(error); }
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
        'pageshow':'node_add_page_pageshow',
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
        'pageshow':'node_page_view_pageshow',
        'title_callback':'node_page_title',
        'title_arguments':[1],
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
        'attributes':{'id':'node_listing_items'},
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
 * The jQM pageshow callback for the node listing page.
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
        // Extract the nodes into items, then drop them in the list.
        var items = [];
        $.each(data.nodes, function(index, object){
            items.push(l(object.node.title, 'node/' + object.node.nid));
        });
        drupalgap_item_list_populate("#node_listing_items", items);
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
      // If the comments are hidden, do nothing.
      if (node.comment == 0) { }
      // If the comments are closed or open, show the comments.
      else if (node.comment == 1 || node.comment == 2) {
        
        // Build an empty list for the comments
        build.comments = {
          'theme':'jqm_item_list',
          'title':'Comments',
          'items':[],
          'attributes':{'id':'comment_listing_items_' + node.nid},
        };
        
        // If the comments are open, show the comment form.
        if (node.comment == 2) {
          build.comments_form = {
            'markup':
              '<h2>Add comment</h2>' +
                drupalgap_get_form('comment_edit', {'nid':node.nid})
          };
        }
      }
      
      return build;
    }
    else {
      alert('node_page_view - failed to load node (' + node.nid + ')');
    }
  }
  catch (error) {
    alert('node_page_view - ' + error);
  }
}

/**
 * jQM pageshow handler for node/% pages.
 */
function node_page_view_pageshow(node) {
  try {
    if (drupalgap.settings.debug) {
      console.log('node_page_view_pageshow()');
    }
    // Grab some recent comments and display it.
    if ($('#comment_listing_items_'+arg(1))) {
      drupalgap.views_datasource.call({
        'path':'drupalgap/views_datasource/drupalgap_comments/' + node.nid,
        'success':function(data) {
          // Extract the comments into items, then drop them in the list.
          var items = [];
          $.each(data.comments, function(index, object){
              var html = '';
              if (user_access('administer comments')) {
                html += l('Edit', 'comment/' + object.comment.cid + '/edit');
              }
              html += object.comment.created + "<br />" +
                'Author: ' + object.comment.name + "<br />"+ 
                'Subject: ' + object.comment.subject + "<br />" +
                'Comment:<br />' + object.comment.comment_body + "<hr />"; 
              items.push(html);
          });
          drupalgap_item_list_populate("#comment_listing_items_" + node.nid, items);
        },
      });
    }
  }
  catch (error) {
    alert('node_page_view_pageshow - ' + error);
  }
}

/**
 * The title call back function for the node view page.
 */
function node_page_title(node) {
  try {
    var title = '';
    if (node && node.title) { title = node.title; }
    return title;
  }
  catch (error) { drupalgap_error(error); }
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

