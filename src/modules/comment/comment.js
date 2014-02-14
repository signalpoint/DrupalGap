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

