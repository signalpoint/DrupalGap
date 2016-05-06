/**
 * Given a node, this determines if the current user has access to it. Returns
 * true if so, false otherwise. This function implementation is incomplete, use
 * with caution.
 * @param {Object} node
 * @return {Boolean}
 */
function node_access(node) {
  try {
    if (
      (
        node.uid == Drupal.user.uid &&
        user_access('edit own ' + node.type + ' content')
      ) ||
      user_access('edit any ' + node.type + ' content')
    ) { return true; }
    else { return false; }
  }
  catch (error) { console.log('node_access - ' + error); }
}

/**
 * Page call back for node/add.
 * @return {Object}
 */
function node_add_page() {
  try {
    var content = {
      header: { markup: '<h2>' + t('Create Content') + '</h2>' },
      node_type_listing: {
        theme: 'jqm_item_list',
        title: t('Content Types'),
        attributes: { id: 'node_type_listing_items' }
      }
    };
    var items = [];
    var user_permissions = Drupal.user.content_types_user_permissions;
    for (var type in user_permissions) {
        if (!user_permissions.hasOwnProperty(type)) { continue; }
        var permissions = user_permissions[type];
        if (permissions.create) {
          items.push(l(drupalgap.content_types_list[type].name,
          'node/add/' + type));
        }
    }
    content.node_type_listing.items = items;
    return content;
  }
  catch (error) { console.log('node_add_page - ' + error); }
}

/**
 * Page call back function for node/add/[type].
 * @param {String} type
 * @return {Object}
 */
function node_add_page_by_type(type) {
  try {
    return drupalgap_get_form('node_edit', {'type': type});
  }
  catch (error) { console.log('node_add_page_by_type - ' + error); }
}

/**
 * Title call back function for node/add/[type].
 * @param {Function} callback
 * @param {String} type
 * @return {Object}
 */
function node_add_page_by_type_title(callback, type) {
  try {
    var title = t('Create') + ' ' + drupalgap.content_types_list[type].name;
    return callback.call(null, title);
  }
  catch (error) { console.log('node_add_page_by_type_title - ' + error); }
}

/**
 * The node edit form.
 * @param {Object} form
 * @param {Object} form_state
 * @param {Object} node
 * @return {Object}
 */
function node_edit(form, form_state, node) {
  try {
    // Setup form defaults.
    form.entity_type = 'node';
    form.bundle = node.type;

    // Add the entity's core fields to the form.
    drupalgap_entity_add_core_fields_to_form('node', node.type, form, node);

    // Add the fields for this content type to the form.
    drupalgap_field_info_instances_add_to_form('node', node.type, form, node);

    // Add submit to form.
    form.elements.submit = {
      'type': 'submit',
      'value': t('Save')
    };

    // Add cancel button to form.
    form.buttons['cancel'] = drupalgap_form_cancel_button();

    // Add delete button to form if we're editing a node.
    if (node && node.nid) {
      form.buttons['delete'] =
        drupalgap_entity_edit_form_delete_button('node', node.nid);
    }

    return form;
  }
  catch (error) { console.log('node_edit - ' + error); }
}

/**
 * The node edit form's submit function.
 * @param {Object} form
 * @param {Object} form_state
 */
function node_edit_submit(form, form_state) {
  try {
    var node = drupalgap_entity_build_from_form_state(form, form_state);
    drupalgap_entity_form_submit(form, form_state, node);
  }
  catch (error) { console.log('node_edit_submit - ' + error); }
}

/**
 * Implements hook_menu().
 * @return {Object}
 */
function node_menu() {
    var items = {
      'node': {
        'title': t('Content'),
        'page_callback': 'node_page',
        'pageshow': 'node_page_pageshow'
      },
      'node/add': {
        'title': t('Add content'),
        'page_callback': 'node_add_page'
      },
      'node/add/%': {
        title: t('Add content'),
        title_callback: 'node_add_page_by_type_title',
        title_arguments: [2],
        page_callback: 'node_add_page_by_type',
        page_arguments: [2],
        options: { reloadPage: true }
      },
      'node/%': {
        'title': t('Node'),
        'page_callback': 'node_page_view',
        'page_arguments': [1],
        'pageshow': 'node_page_view_pageshow',
        'title_callback': 'node_page_title',
        'title_arguments': [1]
      },
      'node/%/view': {
        'title': t('View'),
        'type': 'MENU_DEFAULT_LOCAL_TASK',
        'weight': -10
      },
      'node/%/edit': {
        'title': t('Edit'),
        'page_callback': 'entity_page_edit',
        'pageshow': 'entity_page_edit_pageshow',
        'page_arguments': ['node_edit', 'node', 1],
        'weight': 0,
        'type': 'MENU_LOCAL_TASK',
        'access_callback': 'node_access',
        'access_arguments': [1],
        options: {reloadPage: true}
      }
    };
    return items;
}

/**
 * Page callback for node.
 * @return {Object}
 */
function node_page() {
    var content = {
      'create_content': {
        'theme': 'button_link',
        'path': 'node/add',
        'text': t('Create Content')
      },
      'node_listing': {
        'theme': 'jqm_item_list',
        'title': t('Content List'),
        'items': [],
        'attributes': {'id': 'node_listing_items'}
      }
    };
    return content;
}

/**
 * The jQM pageshow callback for the node listing page.
 */
function node_page_pageshow() {
  try {
    // Grab some recent content and display it.
    views_datasource_get_view_result(
      'drupalgap/views_datasource/drupalgap_content', {
        success: function(content) {
          // Extract the nodes into items, then drop them in the list.
          var items = [];
          for (var index in content.nodes) {
              if (!content.nodes.hasOwnProperty(index)) { continue; }
              var object = content.nodes[index];
              items.push(l(object.node.title, 'node/' + object.node.nid));
          }
          drupalgap_item_list_populate('#node_listing_items', items);
        }
      }
    );
  }
  catch (error) { console.log('node_page_pageshow - ' + error); }
}

/**
 * Page callback for node/%.
 * @param {Number} nid
 * @return {Object}
 */
function node_page_view(nid) {
  try {
    if (nid) {
      var content = {
        container: _drupalgap_entity_page_container('node', nid, 'view')
      };
      return content;
    }
    else { drupalgap_error(t('No node id provided!')); }
  }
  catch (error) { console.log('node_page_view - ' + error); }
}

/**
 * jQM pageshow handler for node/% pages.
 * @param {Number} nid
 */
function node_page_view_pageshow(nid) {
  try {
    node_load(nid, {
        success: function(node) {

          // By this point the node's content has been assembled into an html
          // string. This is because when a node is retrieved from the server,
          // we use a services post processor to render its content.
          // @see entity_services_request_pre_postprocess_alter()

          // Does anyone want to take over the rendering of this content type?
          // Any implementors of hook_node_page_view_alter_TYPE()?
          // @TODO this should probably be moved up to the entity level.
          var hook = 'node_page_view_alter_' + node.type;
          var modules = module_implements(hook);
          if (modules.length > 0) {
            if (modules.length > 1) {
              var msg = 'node_page_view_pageshow - WARNING - there is more ' +
                'than one module implementing hook_' + hook + '(), we will ' +
                'use the first one: ' + modules[0];
              console.log(msg);
            }
            var function_name = modules[0] + '_' + hook;
            var fn = window[function_name];
            fn(node, {
                success: function(content) {
                  _drupalgap_entity_page_container_inject(
                    'node', node.nid, 'view', content
                  );
                }
            });
            return;
          }

          // Build a done handler which will inject the given build into the page container. If there was a success
          // callback attached to the page options call it.
          var done = function(build) {
            _drupalgap_entity_page_container_inject(
                'node', node.nid, 'view', build
            );
            if (drupalgap.page.options.success) { drupalgap.page.options.success(node); }
          };

          // Figure out the title, and watch for translation.
          var default_language = language_default();
          var node_title = node.title;
          if (node.title_field && node.title_field[default_language]) {
            node_title = node.title_field[default_language][0].safe_value;
          }
          // Build the node display. Set the node onto the build so it makes it to the theme layer variables.
          var build = {
            'theme': 'node',
            'node': node,
            // @todo - this is a core field and should by fetched from entity.js
            'title': { markup: node_title },
            'content': { markup: node.content }
          };

          // If comments are undefined, just inject the page.
          if (typeof node.comment === 'undefined') { done(build); }

          // If the comments are closed (1) or open (2), show the comments.
          else if (node.comment != 0) {
            if (node.comment == 1 || node.comment == 2) {
              // Render the comment form, so we can add it to the content later.
              var comment_form = '';
              if (node.comment == 2) {
                comment_form = drupalgap_get_form(
                  'comment_edit',
                  { nid: node.nid },
                  node
                );
              }
              // If there are any comments, load them.
              if (node.comment_count != 0) {
                var query = {
                  parameters: {
                    nid: node.nid
                  }
                };
                comment_index(query, {
                    success: function(results) {
                      try {
                        // Render the comments.
                        var comments = '';
                        for (var index in results) {
                            if (!results.hasOwnProperty(index)) { continue; }
                            var comment = results[index];
                            comments += theme('comment', { comment: comment });
                        }
                        build.content.markup += theme('comments', {
                            node: node,
                            comments: comments
                        });
                        // If the comments are open, show the comment form.
                        if (node.comment == 2 && user_access('post comments')) {
                          build.content.markup += comment_form;
                        }
                        // Finally, inject the page.
                        done(build);
                      }
                      catch (error) {
                        var msg = 'node_page_view_pageshow - comment_index - ' +
                          error;
                        console.log(msg);
                      }
                    },
                    error: function(xhr, status, msg) {
                      if (drupalgap.page.options.error) { drupalgap.page.options.error(xhr, status, msg); }
                    }
                });
              }
              else {
                // There weren't any comments, append an empty comments wrapper
                // and show the comment form if comments are open, then inject
                // the page.
                if (node.comment == 2) {
                  build.content.markup += theme('comments', { node: node });
                  if (user_access('post comments')) { build.content.markup += comment_form; }
                }
                done(build);
              }
            }
          }
          else {
            // Comments are hidden (0), append an empty comments wrapper to the
            // content and inject the content into the page.
            build.content.markup += theme('comments', { node: node });
            done(build);
          }
        },
      error: function(xhr, status, msg) {
        if (drupalgap.page.options.error) { drupalgap.page.options.error(xhr, status, msg); }
      }
    });
  }
  catch (error) { console.log('node_page_view_pageshow - ' + error); }
}

/**
 * The title call back function for the node view page.
 * @param {Function} callback
 * @param {Number} nid
 */
function node_page_title(callback, nid) {
  try {
    // Try to load the node title, then send it back to the given callback.
    var title = '';
    var node = node_load(nid, {
        success: function(node) {
          if (node && node.title) { title = node.title; }
          callback.call(null, title);
        }
    });
  }
  catch (error) { console.log('node_page_title - ' + error); }
}

/**
 * Implements hook_theme().
 * @return {Object}
 */
function node_theme() {
    return { node: { template: 'node' } };
}

