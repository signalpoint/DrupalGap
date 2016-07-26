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

/**
 * Implements hook_field_widget_form().
 */
function file_field_widget_form(form, form_state, field, instance, langcode, items, delta, element) {
  try {
    // Change the item type to a hidden input to hold the file id.
    // items[delta].type = 'textfield';
    items[delta].type = 'hidden';

    // If we already have an file for this item, show it.
    // @TODO: show exisiting fid

    var browse_button_text = t('Add Media');
    var item_id_base = items[delta].id.replace(/-/g, '_');

    var browse_button_id = items[delta].id + '-add-media-button';

    var html = '<div id="' + items[delta].id + '-media"></div><a href="#" data-role="button" data-icon="camera" ' +
      'id="' + browse_button_id + '" ' +
      'data-form_id="' + form.id + '" ' +
      'data-name="' + element.name + '" ' +
      'data-delta="' + delta + '" ' +
      'data-cardinality="' + field.cardinality + '" ' +
      '>' +
      browse_button_text +
      '</a>';

    html += '<script type="text/javascript">';
    html += '$("#' + drupalgap_get_page_id() + '").on("pageshow",function(){' +
      'document.addEventListener(' +
      '"deviceready", init_media_upload, false );' +
      '});' ;

    html += '</script>';

    // Add html to the item's children.
    if (items[delta].children) {
      items[delta].children.push({markup: html});
    } else {
      items[delta].children = [{markup: html}];
    }

    //drupalgap_add_js(drupalgap_get_path('module', 'file') + '/file_upload.js');
  }

  catch (error) {
    console.log('file_entity_field_formatter_view - ' + error);
  }
}


/**
 * Implements hook_assemble_form_state_into_field().
 * @param {Object} entity_type
 * @param {String} bundle
 * @param {String} form_state_value
 * @param {Object} field
 * @param {Object} instance
 * @param {String} langcode
 * @param {Number} delta
 * @param {Object} field_key
 * @return {*}
 */
function file_assemble_form_state_into_field(entity_type, bundle,
                                             form_state_value,
                                             field,
                                             instance,
                                             langcode,
                                             delta,
                                             field_key) {
  try {
    field_key.value = 'fid';
    return form_state_value;
  }
  catch (error) {
    console.log('file_assemble_form_state_into_field - ' + error);
  }
}

//
// $("#" + drupalgap_get_page_id(drupalgap_path_get())).on("pageshow", function () {
//   document.addEventListener("deviceready", init, false);
// });

function init_media_upload() {
  console.log("init_media_upload");
  $("[id$=-add-media-button]").on("click", function (event) {
    // get id of input field
    var regExp = /(.+)-add-media-button/;
    var input_id = regExp.exec(event.target.id)[1];

    var form_id = $(this).data("form_id");
    var name = $(this).data("name");
    var cardinality = $(this).data("cardinality");
    var delta = $(this).data("delta");

    function setCameraOptions(srcType, medType) {
      var options = {
        quality: (drupalgap.settings.camera.quality) ? drupalgap.settings.camera.quality : 50,
        sourceType: srcType, // Camera.PictureSourceType.PHOTOLIBRARY, Camera.PictureSourceType.CAMERA,
        destinationType: Camera.DestinationType.FILE_URI,
        mediaType: medType, // Camera.MediaType.VIDEO, Camera.MediaType.PICTURE, Camera.MediaType.ALLMEDIA
        targetWidth: (drupalgap.settings.camera.targetWidth) ? drupalgap.settings.camera.targetWidth : 1024,
        targetHeight: (drupalgap.settings.camera.targetHeight) ? drupalgap.settings.camera.targetHeight : 1024
      };

      return options;
    }

    function captureError(e) {
      console.log("capture error: " + JSON.stringify(e));
    }

    function captureVideoSuccess(s) {
      console.log("Success");
      dpm(s);
      console.dir(s[0]);
      console.log("dpm:");
      dpm(s[0]);
      var mediaHTML = "<video  style='max-width:100%;' controls><source src='" + s[0].fullPath + "'></video>";
      $("#" + input_id + "-media").html(mediaHTML);
      uploadFile(s[0].fullPath);
    }

    function captureAudioSuccess(s) {
      console.log("Success");
      dpm(s);
      console.dir(s[0]);
      console.log("dpm:");
      dpm(s[0]);
      var mediaHTML = "<audio style='max-width:100%;' controls><source src='" + s[0].fullPath + "'></audio>";
      $("#" + input_id + "-media").html(mediaHTML);
      uploadFile(s[0].fullPath);
    }

    function uploadFile(fileURI) {
      // upload file
      var uri = encodeURI(Drupal.settings.site_path + "/" + Drupal.settings.endpoint + "/file/create_raw");

      var fileOptions = new FileUploadOptions();
      fileOptions.fileKey = "files[file_1]";
      fileOptions.fileName = fileURI.substr(fileURI.lastIndexOf('/') + 1);
      //options.mimeType="image/jpeg";
      //options.mimeType="video/quicktime";

      var ft = new FileTransfer();

      // show progress
      ft.onprogress = function (progressEvent) {
        if (progressEvent.lengthComputable) {
          var progress = Math.round(progressEvent.loaded * 100 / progressEvent.total);
          $(".ui-loader h1").replaceWith("<h1>" + t("Uploading") + " " + progress + "%</h1>");
        }
      };

      // show toast
      drupalgap.loader = 'uploading';
      drupalgap_loading_message_show();

      ft.upload(
        fileURI,
        uri,
        function (r) {
          // success
          // $("#edit-node-edit-field-media-und-0-value-add-media-button").trigger( "click" );
          //_drupalgap_form_add_another_item(form_id, name, delta);


          drupalgap_loading_message_hide();
          console.log("Code = " + r.responseCode);
          console.log("Response = " + r.response);
          console.log("Sent = " + r.bytesSent);

          var result = $.parseJSON(r.response);
          var fid = result[0].fid;

          // set fid in form
          $("input#" + input_id).val(fid);

          // add another item
          // @TODO: check cardinality of field
          _drupalgap_form_add_another_item(form_id, name, delta);
          // remove current media button
          $("#" + input_id + "-add-media-button").remove();
          init_media_upload();
          // move media button below new field
          //$(this).after($(this).next());


        },
        function (error) {
          // error
          drupalgap_loading_message_hide();
          console.log("upload error source " + error.source);
          console.log("upload error target " + error.target);
        },
        fileOptions
      );
    }

    function cameraGetMedia(srcType, medType) {
      var cameraOptions = setCameraOptions(srcType, medType);
      dpm("medType: " + medType);
      navigator.camera.getPicture(function (f) {
        var mediaHTML = "";
        if (medType == Camera.MediaType.PICTURE) {
          mediaHTML = "<img src='" + f + "'>";
        } else if (medType == Camera.MediaType.VIDEO) {
          mediaHTML += "<video  style='max-width:100%;' controls><source src='" + f + "'></video>";
        }
        $("#" + input_id + "-media").html(mediaHTML);
        uploadFile(f);
      }, function (e) {
        dpm(e);
      }, cameraOptions);

    }

    function onConfirm(buttonIndex) {
      switch (buttonIndex) {
        case 1:
          // Upload Picture
          // TODO: add support for multiple picks at once
          var srcType = Camera.PictureSourceType.PHOTOLIBRARY;
          var medType = Camera.MediaType.PICTURE;
          cameraGetMedia(srcType, medType);
          break;
        case 2:
          // Take Picture
          var srcType = Camera.PictureSourceType.CAMERA;
          var medType = Camera.MediaType.PICTURE;
          cameraGetMedia(srcType, medType);
          break;
        case 3:
          // Upload Video
          var srcType = Camera.PictureSourceType.PHOTOLIBRARY;
          var medType = Camera.MediaType.VIDEO;
          cameraGetMedia(srcType, medType);
          break;
        case 4:
          // Record Video
          navigator.device.capture.captureVideo(captureVideoSuccess, captureError, {limit: 1});
          break;
        case 5:
          // Record Audi
          navigator.device.capture.captureAudio(captureAudioSuccess, captureError, {limit: 1});
          break;
        default:
          return;
      }
    }

    // @TODO  check allowed file/mime types
    navigator.notification.confirm(
      t('Which kind of media do you want to add?'), // message
      onConfirm,            // callback to invoke with index of button pressed
      t('Add media'),           // title
      [t('Upload Picture'), t('Take Picture'), t('Upload Video'), t('Record Video'), t('Record Audio'), t('Cancel')]         // buttonLabels
    );
  })
}

