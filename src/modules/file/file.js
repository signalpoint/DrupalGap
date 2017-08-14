/**
 * Implements hook_form_alter().
 */
function file_form_alter(form, form_state, form_id) {

  // Make sure we have at least one file element on the form.
  var fileElements = dgFile.getFileElementNamesFromForm(form);
  if (!fileElements) { return; }
  console.log('file_form_alter', form, fileElements);

  // Add a custom form submit handler to any form that has a file input element.
  form.submit.push('file_form_submit_handler');

  // Attach a value callback to each file input element, if one isn't set already.
  for (var i = 0; i < fileElements.length; i++) {
    var name = fileElements[i];
    var element = form.elements[name];
    if (!element.value_callback) { element.value_callback = 'file_value_callback'; }
  }

}

function file_value_callback(id, element) {
  var fid = $('#' + element.id).attr('fid');
  return fid ? {
    fid: fid,
    display: 1
  } : null;
}

function file_form_submit_handler(form, form_state) {
  console.log('file_form_submit_handler', form_state.values);

  // For each file input element that has a file id, remove that file id from the pending list.
  var fileElements = dgFile.getFileElementNamesFromForm(form);
  if (!fileElements) { return; }
  for (var i = 0; i < fileElements.length; i++) {
    var name = fileElements[i];
    var element = form.elements[name];
    var fid = form_state.values[name];
    if (fid == '') { continue; }
    console.log('removing fid from submit', fid);
    dgFile.removeFromPendingFileIds(fid);
  }
}

/**
 * Implements hook_drupalgap_goto_post_process().
 */
function file_drupalgap_goto_post_process(path) {

  // If there are any pending file ids when the app is changing pages, delete them from Drupal and remove their id
  // from the dgFile pending tracker.
  if (dgFile.hasPendingFileIds()) {
    var fileIds = dgFile.getPendingFileIds().slice();
    for (var i = 0; i < fileIds.length; i++) {
      var fid = fileIds[i];
      console.log('removing fid from goto preprocess', fid);
      dgFile.removeFromPendingFileIds(fid);
      file_delete(fid, {
        success: function(result) {
          console.log('deleted file from drupal');
        },
        error: dgFile.error
      });
    }
  }

}

/**
 * Implements hook_field_formatter_view().
 */
function file_field_formatter_view(entity_type, entity, field, instance, langcode, items, display) {
  try {

    //console.log(entity_type);
    //console.log(entity);
    //console.log(field);
    //console.log(instance);
    //console.log(langcode);
    //console.log(items);
    //console.log(display);

    // Iterate over each item, and place a widget onto the render array.
    var content = {};
    for (var delta in items) {
      if (!items.hasOwnProperty(delta)) { continue; }
      var item = items[delta];
      switch (display.type) {

        case 'file_table':

            // Instantiate the table only once.
            if (!content['file_table']) {
              content['file_table'] = {
                theme: 'jqm_table',
                header: [{ data: t('Attachment') }, { data: t('Size') }],
                rows: [],
                attributes: {
                  border: 1
                }
              };
            }

            // Build the path to the file.
            var file_path = drupalgap_image_path(item.uri);

            // Android can't open .pdf files in the in app browser, so have
            // Google Docs open it instead.
            if (item.filemime == 'application/pdf' &&
              typeof device !== 'undefined' && device.platform == 'Android'
            ) { file_path = 'https://docs.google.com/gview?embedded=true&url=' + file_path; }

            // Add the row to the table.
            content.file_table.rows.push([
              l(item.filename, file_path, { InAppBrowser: true }),
              Math.round(item.filesize/1000).toFixed(2) + ' KB'
            ]);

          break;

        default:
          console.log('file_field_formatter_view() - unsupported display type: ' + display.type);
          break;
      }
    }
    return content;
  }
  catch (error) { console.log('file_field_formatter_view - ' + error); }
}

/**
 * Implements hook_field_formatter_view().
 */
function file_entity_field_formatter_view(entity_type, entity, field, instance, langcode, items, display) {
  try {
    //console.log(entity_type);
    //console.log(entity);
    //console.log(field);
    //console.log(instance);
    //console.log(langcode);
    //console.log(items);
    //console.log(display);

    // Special case for media module.
    if (display.type == 'file_rendered') {
      return media_field_formatter_view(entity_type, entity, field, instance, langcode, items, display);
    }

    // Iterate over each item, and place a widget onto the render array.
    var content = {};
    for (var delta in items) {
        if (!items.hasOwnProperty(delta)) { continue; }
        var item = items[delta];

        switch (display.type) {
          default:
            console.log('file_entity_field_formatter_view() - unsupported display type: ' + display.type);
            break;
        }
    }
    return content;
  }
  catch (error) { console.log('file_entity_field_formatter_view - ' + error); }
}
