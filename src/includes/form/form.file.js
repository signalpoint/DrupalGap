var dgFile = {

  error: function(xhr, status, msg) {},

  parseFid: function(fid) { return parseInt(fid); },
  getFileElementNamesFromForm: function(form) {
    var names = [];
    if (form.elements) {
      for (var name in form.elements) {
        if (!form.elements.hasOwnProperty(name)) { continue; }
        var element = form.elements[name];
        if (!element.type || element.type != 'file') { continue; }
        names.push(name);
        break;
      }
    }
    return names.length ? names : null;
  },

  _pendingFileIds: [],
  getPendingFileIds: function() { return dgFile._pendingFileIds; },
  setPendingFileIds: function(fileIds) { dgFile._pendingFileIds = fileIds; },
  hasPendingFileIds: function() { return dgFile.getPendingFileIds().length; },
  isPendingFileId: function(fid) {
    return in_array(dgFile.parseFid(fid), dgFile.getPendingFileIds());
  },
  addToPendingFileIds: function(fid) {
    fid = dgFile.parseFid(fid);
    if (!dgFile.isPendingFileId(fid)) {
      dgFile.getPendingFileIds().push(fid);
      console.log('added to pending list: ' + fid);
    }
  },
  removeFromPendingFileIds: function(fid) {
    fid = dgFile.parseFid(fid);
    var fileIds = dgFile.getPendingFileIds();
    console.log('removeFromPendingFileIds', fid, dgFile.getPendingFileIds());
    fileIds = fileIds.filter(function(e) { return e !== fid });
    dgFile.setPendingFileIds(fileIds);
    console.log('removeFromPendingFileIds', fid, dgFile.getPendingFileIds());
  },

  //_pendingDelete: {},
  //getPendingDelete: function() { return this._pendingDelete; },
  //addToPendingDelete: function(entityType, entityId) {
  //  var pending = this._pendingDelete;
  //  if (!pending[entityType]) { pending[entityType] = []; }
  //  pending[entityType].push(entityId);
  //},
  //hasPendingDelete: function(entityType, entityId) {
  //  var isPending = false;
  //  var pending = this.getPendingDelete();
  //  $.each(pending, function(_entityType, ids) {
  //    if (entityType == _entityType && in_array(entityId, ids)) {
  //      isPending = true;
  //      return false;
  //    }
  //  });
  //  return isPending;
  //},
  //pendingDeleteEntityTypes: function() {
  //  var entityTypes = [];
  //  var pending = this.getPendingDelete();
  //  $.each(pending, function(entityType, ids) {
  //    entityTypes.push(entityType);
  //  });
  //  return entityTypes.length ? entityTypes: null;
  //}

};


/**
 * Themes a file input.
 * @param variables
 * @returns {string}
 */
function theme_file(variables) {
  //console.log('theme_file', variables);
  var attrs = variables.attributes;

  // Generate an attribute id if one wasn't provided.
  if (!attrs.id) { attrs.id = 'file-widget-' + user_password(); }

  var wrapperId = attrs.id + '-wrapper';

  var html = '<div id="' + wrapperId + '" class="file-widget-wrapper">';

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
        onclick: 'dgFileWidgetRemoveOnclick(' + file.fid + ')',
        wrapperId: wrapperId
      }
    });
    html += deleteBtn + preview;

  }
  else {

    // There is no default file...

    var previewId = attrs.id + '-preview';

    // Input widget.
    if (!attrs.type) { attrs.type = 'file'; }
    if (!attrs.onchange) {
      attrs.onchange = "dgFileWidgetPreviewFile('" + wrapperId + "', '" + attrs.id + "', '" + previewId + "')";
    }
    attrs.class += ' file-widget ';
    var input = '<input ' + drupalgap_attributes(attrs) + '/>';
    var previewAttrs = {
      id: previewId,
      src: ''
    };

    // Preview widget.
    var preview = '<img ' + drupalgap_attributes(previewAttrs) + '>';

    html += input + preview;

  }

  return html + '</div>';

}

function dgFileWidgetPreviewFile(wrapperId, inputId, previewId) {

  // @TODO if the user saves the file to Drupal, then backs out of the page or doesn't submit the form, then the file
  // space and file_managed entry will be wasteful and a ghost.

  // Grab the preview widget.
  var preview = document.querySelector('#' + previewId);

  // Grab the file input widget.
  var file = document.querySelector('#' + inputId).files[0];
  if (!file) { return; }
  console.log('file input', file);

  // Prepare to read the file.
  var dgFileRead = function() {

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

      // Save the file to Drupal...
      file_save(fileData, {
        success: function(result) {
          console.log('file_save', result);
          if (result.fid) {

            var fid = result.fid;
            dgFile.addToPendingFileIds(fid);

            // Set the file id onto the input form element.
            $('#' + inputId).attr('fid', fid);

          }
          else { dgFile.error(null, null, t('There was a problem saving the file.')); }
        },
        error: dgFile.error
      });

    }, false);

    // Finally, load the file chosen by the user and circle back to the "load" event listener.
    if (file) { reader.readAsDataURL(file); }

  };

  // If they previously selected a file for preview, then delete it from Drupal's file management since it will be
  // unused.
  var fid = $('#' + inputId).attr('fid');
  if (fid) {
    console.log('fid', fid);
    file_delete(fid, {
      success: function(result) {
        dgFile.removeFromPendingFileIds(fid);
        dgFileRead();
      },
      error: function(xhr, status, msg) { drupalgap_alert(msg); }
    });
  }
  else { dgFileRead(); }
}

function dgFileWidgetRemoveOnclick(fid) {
  file_delete(fid, {
    success: function(result) {
      console.log(result);

      // When editing an existing entity, the file will be marked as used by Drupal's file management
      // system...
      if (result.file) {
        $.each(result.file, function(entityType, entities) {
          $.each(entities, function(entityId) {
            // If a file is in use, we can't delete it. However, it appears that if an entity update call
            // removes a reference to that file id from an e.g. image field, then Drupal automatically deletes
            // the file after the entity is updated.

            //dgFile.addToPendingFileIds(fid);
          });
        });
      }

    },
    error: function(xhr, status, msg) { drupalgap_alert(msg); }
  });
}
