/**
 * Themes a file input.
 * @param variables
 * @returns {string}
 */
function theme_file(variables) {
  var attrs = variables.attributes;


  if (variables.file) {

    // There is an existing file...

    var file = variables.file;
    var preview = theme('image_style', {
      style_name: 'thumbnail',
      path: file.uri
    });
    var deleteBtn = bl(t('Remove'), null, {
      attributes: {
        'data-icon': 'delete',
        'data-iconpos': 'notext',
        onclick: 'dgFileWidgetRemoveOnclick(' + file.fid + ')'
      }
    });
    return deleteBtn + preview;

  }
  else {

    // There is no default file...

    // Generate some DOM ids.
    if (!attrs.id) { attrs.id = 'file-widget-' + user_password(); }
    var previewId = attrs.id + '-preview';

    // Input widget.
    if (!attrs.type) { attrs.type = 'file'; }
    if (!attrs.onchange) { attrs.onchange = "dgFileWidgetPreviewFile('" + attrs.id + "', '" + previewId + "')"; }
    attrs.class += ' file-widget ';
    var input = '<input ' + drupalgap_attributes(attrs) + '/>';
    var previewAttrs = {
      id: previewId,
      src: ''
    };

    // Preview widget.
    var preview = '<img ' + drupalgap_attributes(previewAttrs) + '>';

    return input + preview;

  }

}

function dgFileWidgetPreviewFile(inputId, previewId) {

  // @TODO if the user saves the file to Drupal, then backs out of the page or doesn't submit the form, then the file
  // space and file_managed entry will be wasteful and a ghost.

  // Grab the preview widget.
  var preview = document.querySelector('#' + previewId);

  // Grab the file input widget.
  var file = document.querySelector('#' + inputId).files[0];
  console.log('file', file);

  // Get ready to load the file...
  var reader  = new FileReader();
  reader.addEventListener("load", function () {

    // The file has been loaded...

    // Preview the image.
    preview.src = reader.result;
    preview.height = 64;

    // Build the JSON deliverable.
    var fileData = {
      file: reader.result,
      filename: file.name,
      filepath: "public://" + file.name
    };

    // Prepare for any errors.
    var notOk = function(xhr, status, msg) { drupalgap_alert(msg); };

    // Save the file to Drupal...
    file_save(fileData, {
      success: function(result) {
        if (result.fid) {

          // Set the file id onto the input form element.
          $('#' + inputId).attr('value', result.fid);

        }
        else { notOk(null, null, t('There was a problem saving the file.')); }
      },
      error: notOk
    });

  }, false);

  // Finally, load the file chosen by the user and circle back to the "load" event listener.
  if (file) { reader.readAsDataURL(file); }
}

function dgFileWidgetRemoveOnclick(fid) {
  drupalgap_confirm(t('Are you sure you want to remove this file?'), {
    confirmCallback: function(button) {
      console.log(button);
      if (button === 1) {
        file_delete(fid, {
          success: function(result) {
            console.log(result);
          },
          error: function(xhr, status, msg) { drupalgap_alert(msg); }
        });
      }
      else if (button === 2) { /* cancel */ }
    }
  });
}