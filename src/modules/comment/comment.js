/**
 * Implements hook_menu().
 * @return {Object}
 */
function comment_menu() {
    var items = {
      'comment/%': {
        title: t('Comment'),
        page_callback: 'comment_page_view',
        page_arguments: [1],
        pageshow: 'comment_page_view_pageshow',
        title_callback: 'comment_page_title',
        title_arguments: [1]
      },
      'comment/%/view': {
        title: t('View'),
        type: 'MENU_DEFAULT_LOCAL_TASK',
        weight: -10
      },
      'comment/%/edit': {
        title: t('Edit'),
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
 * Given a node id, this will return the id to use on the comments wrapper.
 * @param {Number} nid
 * @return {String}
 */
function comments_container_id(nid) {
    return 'comments_container_' + nid;
}

/**
 * Given a comment id, this will return the id to use on the comment wrapper.
 * @param {Number} cid
 * @return {String}
 */
function comment_container_id(cid) {
    return 'comment_container_' + cid;
}

/**
 * Given a node id, this will return the id to use on the html list for the
 * comments.
 * @param {Number} nid
 * @return {String}
 * @deprecated Use comments_container_id() instead.
 */
function comment_list_id(nid) {
  try {
    return comments_container_id(nid);
  }
  catch (error) { console.log('comment_list_id - ' + error); }
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
    else { drupalgap_error(t('No comment id provided!')); }
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
    form.id += '_' + comment.nid;  // Append the node id the comment form id.
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
      'value': t('Save')
    };

    // Add cancel and delete button to form if we're editing a comment. Also
    // figure out a form title to use in the prefix.
    var form_title = t('Add comment');
    if (comment && comment.cid) {
      form_title = t('Edit comment');
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
 * Implements hook_services_postprocess().
 * @param {Object} options
 * @param {Object} result
 */
function comment_services_postprocess(options, result) {
  try {
    if (options.service == 'comment' && options.resource == 'create') {
      // If we're on the node view page, inject the comment into the comment
      // listing (if it is in the DOM), then scroll the page to the newly
      // inserted/rendered comment, then clear the form input.
      var path = drupalgap_path_get();
      var router_path = drupalgap_get_menu_link_router_path(path);
      if (router_path == 'node/%') {
        var nid = arg(1);
        var container_id = comments_container_id(nid);
        var container = $('#' + container_id);
        if (
          typeof container.length !== 'undefined' &&
          container.length == 0
        ) { return; }
        node_load(nid, {
            reset: true,
            success: function(node) {
              comment_load(result.cid, {
                  success: function(comment) {
                    $(container).append(
                      theme('comment', { comment: comment })
                    ).trigger('create');
                    scrollToElement('#' + container_id + ' #' + comment_container_id(comment.cid), 500);
                    var form_selector = '#' + drupalgap_get_page_id() +
                      ' #comment_edit' + '_' + comment.nid;
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
 * Theme's a comment container.
 * @param {Object} variables
 * @return {String}
 */
function theme_comments(variables) {
  try {
    // Set the container id and append default attributes.
    variables.attributes.id = comments_container_id(variables.node.nid);
    variables.attributes['class'] +=
      'comments comments-node-' + variables.node.type;
    variables.attributes['data-role'] = 'collapsible-set';
    // Open the container.
    var html = '<div ' + drupalgap_attributes(variables.attributes) + '>';
    // Show a comments title if there are any comments.
    if (variables.node.comment_count > 0) {
      html += '<h2 class="comments-title">Comments</h2>';
    }
    // If the comments are already rendered, show them.
    if (variables.comments) { html += variables.comments; }
    // Close the container and return the html.
    html += '</div>';
    return html;
  }
  catch (error) { console.log('theme_comments - ' + error); }
}

/**
 * Theme's a comment.
 * @param {Object} variables
 * @return {String}
 */
function theme_comment(variables) {
  try {
    var comment = variables.comment;
    // Set the container id and append default attributes.
    variables.attributes.id = comment_container_id(comment.cid);
    variables.attributes['class'] += 'comment ';
    variables.attributes['data-role'] = 'collapsible';
    variables.attributes['data-collapsed'] = 'false';
    var html = '<div ' + drupalgap_attributes(variables.attributes) + '>';
    var comment_content = '';
    // Any user picture?
    // @TODO - the user picture doesn't use an image style here, it uses the
    // original picture uploaded by the user, which can be varying sizes.
    var picture = '';
    if (comment.picture_uri) {
      picture += theme(
        'image', { path: drupalgap_image_path(comment.picture_uri) }
      );
    }
    // Comment date.
    var created = new Date(comment.created * 1000);
    created = created.toLocaleDateString() + ' at ' +
      created.toLocaleTimeString();
    // Append comment extra fields and content. The user info will be rendered
    // as a list item link.
    var author = picture +
        '<h3>' + comment.name + '</h3>' +
        '<p>' + created + '</p>';
    author = l(author, 'user/' + comment.uid);
    comment_content +=
      '<h2>' + comment.subject + '</h2>' +
      '<ul data-role="listview" data-inset="true">' +
        '<li>' + author + '</li>' +
      '</ul>' + comment.content;
    html += comment_content;
    // Add an edit link if necessary.
    if (
      user_access('administer comments') ||
      (user_access('edit own comments') && comment.uid == Drupal.user.uid)
    ) {
      html += theme('button_link', {
          text: t('Edit'),
          path: 'comment/' + comment.cid + '/edit',
          attributes: {
            'data-icon': 'gear'
          }
      });
    }
    // Close the container and return the html.
    html += '</div>';
    return html;
  }
  catch (error) { console.log('theme_comment - ' + error); }
}

