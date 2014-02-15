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
    var bundle = 'comment_node_' + node.type;

    // Setup form defaults.
    form.entity_type = 'comment';
    form.bundle = bundle;
    form.action = 'node/' + node.nid;

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

    // Add cancel button to form.
    form.buttons['cancel'] = {
      'title': 'Cancel'
    };

    // Add delete button to form if we're editing a comment.
    if (comment && comment.cid) {
      form.buttons['delete'] = {
        'title': 'Delete'
      };
    }

    form.prefix += '<h2>Add comment</h2>';

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
      // listing.
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

