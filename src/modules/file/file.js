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
