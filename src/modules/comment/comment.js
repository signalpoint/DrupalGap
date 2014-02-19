/**
 * Implements hook_menu().
 * @return {Object}
 */
function comment_menu() {
  try {
    var items = {
      'comment/%': {
        title: 'Comment',
        page_callback: 'comment_page_view',
        page_arguments: [1],
        pageshow: 'comment_page_view_pageshow',
        title_callback: 'comment_page_title',
        title_arguments: [1]
      },
      'comment/%/view': {
        title: 'View',
        type: 'MENU_DEFAULT_LOCAL_TASK',
        weight: -10
      },
      'comment/%/edit': {
        title: 'Edit',
        page_callback: 'entity_page_edit',
        pageshow: 'entity_page_edit_pageshow',
        page_arguments: ['comment_edit', 'comment', 1],
        weight: 0,
        type: 'MENU_LOCAL_TASK',
        access_callback: 'comment_access',
        access_arguments: [1],
        options: { reloadPage: true }
      }
    };
    return items;
  }
  catch (error) { console.log('comment_menu - ' + error); }
}

/**
 * Given a comment, this determines if the current user has access to it.
 * Returns true if so, false otherwise.
 * @param {Object} comment
 * @return {Boolean}
 */
function comment_access(comment) {
  try {
    if (comment.uid == Drupal.user.uid && user_access('edit own comments') ||
      user_access('administer comments')) {
      return true;
    }
    else { return false; }
  }
  catch (error) { console.log('comment_access - ' + error); }
}

/**
 * Page callback for comment/%.
 * @param {Number} cid
 * @return {Object}
 */
function comment_page_view(cid) {
  try {
    if (cid) {
      var content = {
        container: _drupalgap_entity_page_container('comment', cid, 'view')
      };
      return content;
    }
    else { drupalgap_error('No comment id provided!'); }
  }
  catch (error) { console.log('comment_page_view - ' + error); }
}

/**
 * jQM pageshow handler for comment/% pages.
 * @param {Number} cid
 */
function comment_page_view_pageshow(cid) {
  try {
    comment_load(cid, {
        success: function(comment) {
          var item = theme('comment', { comment: comment });
          var content = theme('jqm_item_list', {items: [item]});
          _drupalgap_entity_page_container_inject(
            'comment',
            cid,
            'view',
            content
          );
        }
    });
  }
  catch (error) { console.log('comment_page_view_pageshow - ' + error); }
}

/**
 * The title call back function for the comment view page.
 * @param {Function} callback
 * @param {Number} cid
 */
function comment_page_title(callback, cid) {
  try {
    // Try to load the comment subject, then send it back to the given callback.
    var title = '';
    var comment = comment_load(cid, {
        success: function(comment) {
          if (comment && comment.subject) { title = comment.subject; }
          callback.call(null, title);
        }
    });
  }
  catch (error) { console.log('comment_page_title - ' + error); }
}

/**
 * The comment edit form.
 * @param {Object} form
 * @param {Object} form_state
 * @param {Object} comment
 * @param {Object} node
 * @return {Object}
 */
function comment_edit(form, form_state, comment, node) {
  try {

    // If there is no comment object coming in, make an empty one with a node
    // id. Note, once the form.js submit handler is aware of its own entity and
    // can pass it along to this function (and others) when loading a form
    // during the submission process, this little chunk of code will no longer
    // be needed.
    if (!comment) { comment = {'nid': arg(1)}; }

    // Determine the comment bundle from the node type.
    var node_type = null;
    if (node && node.type) { node_type = node.type; }
    else { node_type = comment.node_type.replace('comment_node_', ''); }
    var bundle = 'comment_node_' + node_type;

    // Setup form defaults.
    form.entity_type = 'comment';
    form.bundle = bundle;
    form.action = 'node/' + comment.nid;

    // Add the entity's core fields to the form.
    drupalgap_entity_add_core_fields_to_form(
      'comment',
      bundle,
      form,
      comment
    );

    // Add the fields for this content type to the form.
    drupalgap_field_info_instances_add_to_form(
      'comment',
      bundle,
      form,
      comment
    );

    // Add submit to form.
    form.elements.submit = {
      'type': 'submit',
      'value': 'Save'
    };

    // Add cancel and delete button to form if we're editing a comment. Also
    // figure out a form title to use in the prefix.
    var form_title = 'Add comment';
    if (comment && comment.cid) {
      form_title = 'Edit comment';
      form.buttons['cancel'] = drupalgap_form_cancel_button();
      form.buttons['delete'] =
        drupalgap_entity_edit_form_delete_button('comment', comment.cid);
    }

    // Add a prefix.
    form.prefix += '<h2>' + form_title + '</h2>';

    return form;
  }
  catch (error) { console.log('comment_edit - ' + error); }
}

/**
 * The comment edit submit function.
 * @param {Object} form
 * @param {Object} form_state
 */
function comment_edit_submit(form, form_state) {
  try {
    var comment = drupalgap_entity_build_from_form_state(form, form_state);
    drupalgap_entity_form_submit(form, form_state, comment);
  }
  catch (error) { console.log('comment_edit_submit - ' + error); }
}

/**
 * Given a node id, this will return the id to use on the html list for the
 * comments.
 * @param {Number} nid
 * @return {String}
 */
function comment_list_id(nid) {
  try {
    return 'comment_listing_items_' + nid;
  }
  catch (error) { console.log('comment_list_id - ' + error); }
}

/**
 * Implements hook_services_postprocess().
 * @param {Object} options
 * @param {Object} result
 */
function comment_services_postprocess(options, result) {
  try {
    if (options.service == 'comment' && options.resource == 'create') {
      // If we're on the node view page, inject the comment into the comment
      // listing, then scroll the page to the newly inserted/rendered comment,
      // then clear the form input.
      var path = drupalgap_path_get();
      var router_path = drupalgap_get_menu_link_router_path(path);
      if (router_path == 'node/%') {
        node_load(arg(1), {
            reset: true,
            success: function(node) {
              comment_load(result.cid, {
                  success: function(comment) {
                    var list_id = comment_list_id(node.nid);
                    $('#' + list_id).append(
                      '<li>' + theme('comment', {
                          comment: comment
                      }) + '</li>'
                    ).listview('refresh');
                    scrollToElement('#' + list_id + ' li:last-child', 500);
                    var form_selector = '#' + drupalgap_get_page_id() +
                      ' #comment_edit';
                    drupalgap_form_clear(form_selector);
                  }
              });
            }
        });
      }
    }
  }
  catch (error) { console.log('comment_services_postprocess - ' + error); }
}

/**
 * Theme's a comment.
 * @param {Object} variables
 * @return {String}
 */
function theme_comment(variables) {
  try {
    var comment = variables.comment;
    var html = '';
    var comment_content = '';
    var picture = '';
    if (comment.picture_uri) {
      comment_content += theme(
        'image',
        { path: drupalgap_image_path(comment.picture_uri) }
      );
    }
    var created = new Date(comment.created * 1000);
    created = created.toLocaleDateString() + ' at ' +
      created.toLocaleTimeString();
    comment_content +=
      '<h2>' + comment.name + '</h2>' +
      '<h3>' + comment.subject + '<h3/>' +
      '<p>' + comment.content + '</p>' +
      '<p class="ui-li-aside">' + created + '</p>';
    html += l(comment_content, 'user/' + comment.uid);
    if (user_access('administer comments')) {
      html += l('Edit', 'comment/' + comment.cid + '/edit', {
          attributes: {
            'data-icon': 'gear'
          }
      });
    }
    return html;
  }
  catch (error) { console.log('theme_comment - ' + error); }
}

