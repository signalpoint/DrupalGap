

// Holds onto the phonegap getPicture success image data. It is keyed by field
// name, then delta value.
var image_phonegap_camera_options = {};

/**
 * Implements hook_field_formatter_view().
 /**
 * Implements hook_field_formatter_view().
 * @param {String} entity_type
 * @param {Object} entity
 * @param {Object} field
 * @param {Object} instance
 * @param {String} langcode
 * @param {Object} items
 * @param {*} display
 * @return {Object}
 */
function image_field_formatter_view(entity_type, entity, field, instance,
  langcode, items, display) {
  try {
    var element = {};
    if (!empty(items)) {
      $.each(items, function(delta, item) {
          // @TODO - add support for image_style
          element[delta] = {
            theme: 'image',
            alt: item.alt,
            title: item.title,
            path: drupalgap_image_path(item.uri)
            /*image_style:display.settings.image_style*/
          };
      });
    }
    return element;
  }
  catch (error) { console.log('image_field_formatter_view - ' + error); }
}

/**
 * Implements hook_field_widget_form().
 * @param {Object} form
 * @param {Object} form_state
 * @param {Object} field
 * @param {Object} instance
 * @param {String} langcode
 * @param {Object} items
 * @param {Number} delta
 * @param {Object} element
 */
function image_field_widget_form(form, form_state, field, instance, langcode,
  items, delta, element) {
  try {
    // Change the item type to a hidden input to hold the file id.
    items[delta].type = 'hidden';

    // If we're dealing with the user profile 'picture' it isn't a real field,
    // so we need to spoof some field settings to get the widget to render
    // properly.
    // @TODO the field label doesn't show up.
    if (form.id == 'user_profile_form' && element.name == 'picture') {
      field = { field_name: 'picture' };
    }

    // If we already have an image for this item, show it.
    if (typeof items[delta].item !== 'undefined' && items[delta].item.fid) {
      // Set the hidden input's value equal to the file id.
      items[delta].value = items[delta].item.fid;
      // Show the image on the form, the file name as a link to the actual file,
      // the file size, and a remove button.
      var path = drupalgap_image_path(items[delta].item.uri);
      // @TODO - show the filesize.
      // @TODO - show the remove button.
      var html = theme('image', { path: path }) +
        '<div class="filename">' +
          l(items[delta].item.filename, path, { InAppBrowser: true }) +
        '</div>';
        /*theme('button_link', {
            text: 'Remove',
            path: null,
            attributes: {
              onclick: "_image_field_widget_form_remove_image()",
              'data-icon': 'delete',
              'data-iconpos': 'right'
            }
        });*/
        //'<div class="filesize">(' + items[delta].item.filesize + ')</div>';
      // Add html to the item's children.
      items[delta].children.push({markup: html});
      return; // No further processing required.
    }

    // Set the default button text, and if a value was provided,
    // overwrite the button text.
    var button_text = 'Take Photo';
    if (items[delta].value) { button_text = items[delta].value; }
    var browse_button_text = 'Browse';
    if (items[delta].value2) { browse_button_text = items[delta].value2; }

    // Place variables into document for PhoneGap image processing.
    var item_id_base = items[delta].id.replace(/-/g, '_');
    var image_field_source = item_id_base + '_imagefield_source';
    var imagefield_destination_type =
      item_id_base + '_imagefield_destination_type';
    var imagefield_data = item_id_base + '_imagefield_data';
    eval('var ' + image_field_source + ' = null;');
    eval('var ' + imagefield_destination_type + ' = null;');
    eval('var ' + imagefield_data + ' = null;');
    // Build an imagefield widget with PhoneGap. Contains a message
    // div, an image item, a button to add an image, and a button to browse for
    // images.
    var browse_button_id = items[delta].id + '-browse-button';
    var html = '<div>' +
      '<div id="' + items[delta].id + '-imagefield-msg"></div>' +
      '<img id="' + items[delta].id + '-imagefield" style="display: none;" />' +
      '<a href="#" data-role="button" data-icon="camera" ' +
        'id="' + items[delta].id + '-button">' +
        button_text +
      '</a>' +
      '<a href="#" data-role="button" data-icon="grid" ' +
        'id="' + browse_button_id + '">' +
        browse_button_text +
      '</a>' +
    '</div>';
    // Open extra javascript declaration.
    html += '<script type="text/javascript">';
    // Add device ready listener for PhoneGap camera.
    var event_listener = item_id_base + '_imagefield_ready';
    html += '$("#' + drupalgap_get_page_id(
      drupalgap_path_get()) + '").on("pageshow",function(){' +
        'document.addEventListener(' +
        '"deviceready", ' +
        event_listener + ', ' +
        'false);' +
      '});' +
    'function ' + event_listener + '() {' +
      image_field_source + ' = navigator.camera.PictureSourceType;' +
      imagefield_destination_type + ' = navigator.camera.DestinationType;' +
    '}';
    // Define error callback function.
    var imagefield_error = item_id_base + '_error';
    html += 'function ' + imagefield_error + '(message) {' +
      'if (message != "Camera cancelled." && ' +
        'message != "Selection cancelled." && ' +
        'message != "no image selected")' +
      '{' +
        'console.log("' + imagefield_error + '");' +
        'drupalgap_alert(message);' +
      '}' +
    '}';
    // Define success callback function.
    var imagefield_success = item_id_base + '_success';
    html += 'function ' + imagefield_success + '(imageData) {' +
      '_image_phonegap_camera_getPicture_success(' +
      '{field_name:"' + field.field_name + '", ' +
        'image:imageData, id:"' + items[delta].id + '"' +
       '})' +
    '}';
    // Determine image quality.
    var quality = 50;
    if (drupalgap.settings.camera.quality) {
      quality = drupalgap.settings.camera.quality;
    }
    // Add click handler for photo button.
    html += '$("#' + items[delta].id + '-button").on("click",function(){' +
      'var photo_options = {' +
        'quality: ' + quality + ',' +
        'destinationType: ' + imagefield_destination_type + '.DATA_URL,' +
        'correctOrientation: true' +
      '};' +
      'navigator.camera.getPicture(' +
        imagefield_success + ', ' +
        imagefield_error + ', ' +
        'photo_options);' +
    '});';
    // Add click handler for browse button.
    html += '$("#' + browse_button_id + '").on("click",function(){' +
      'var browse_photo_options = {' +
        'quality: ' + quality + ',' +
        'sourceType: ' + image_field_source + '.PHOTOLIBRARY,' +
        'destinationType: ' + imagefield_destination_type + '.DATA_URL,' +
        'correctOrientation: true' +
      '};' +
      'navigator.camera.getPicture(' +
        imagefield_success + ', ' +
        imagefield_error + ', ' +
        'browse_photo_options);' +
    '});';
    // Close extra javascript declaration.
    html += '</script>';
    // Add html to the item's children.
    items[delta].children.push({markup: html});
  }
  catch (error) { console.log('image_field_widget_form - ' + error); }
}

/**
 * On an entity edit form, this removes an image file from the server, then from
 * the form elements and user interface.
 */
function _image_field_widget_form_remove_image() {
  try {
    alert('_image_field_widget_form_remove_image');
  }
  catch (error) {
    console.log('_image_field_widget_form_remove_image - ' + error);
  }
}

/**
 * Given an entity type and optional bundle name, this will return an array
 * containing any image field names present, false otherwise.
 * @param {String} entity_type
 * @param {String} bundle
 * @return {Object}
 */
function image_fields_present_on_entity_type(entity_type, bundle) {
  try {
    var results = [];
    var fields = drupalgap_field_info_instances(entity_type, bundle);
    if (!fields) { return false; }
    $.each(fields, function(name, field) {
        if (field.widget &&
          field.widget.type &&
          field.widget.type == 'image_image'
        ) {
          results.push(name);
        }
    });
    if (results.length == 0) { return false; }
    return results;
  }
  catch (error) {
    console.log('image_fields_present_on_entity_type - ' + error);
  }
}

/**
 * Implements hook_form_alter().
 * @param {Object} form
 * @param {Object} form_state
 * @param {String} form_id
 */
function image_form_alter(form, form_state, form_id) {
  try {
    // Make potential alterations to any entity edit form that has an image
    // field element(s).
    if (form.entity_type) {
      var bundle = form.bundle;
      var image_fields =
        image_fields_present_on_entity_type(form.entity_type, bundle);
      if (image_fields) {
        // Attach the image field names to the form for later reference.
        form.image_fields = image_fields;
        // For each image field, create a place for it in the global var.
        if ($.isArray(image_fields)) {
          $.each(image_fields, function(index, name) {
              image_phonegap_camera_options[name] = {0: null};
          });
        }
      }
    }
  }
  catch (error) { console.log('image_form_alter - ' + error); }
}

/**
 * Given an image style name and image uri, this will return the absolute URL
 * that can be used as a src value for an img element.
 * @param {String} style_name
 * @param {String} path
 * @return {String}
 */
function image_style_url(style_name, path) {
  try {
    var src =
      Drupal.settings.site_path + Drupal.settings.base_path + path;
    if (src.indexOf('public://') != -1) {
      src = src.replace(
        'public://',
        Drupal.settings.file_public_path +
          '/styles/' +
          style_name +
          '/public/'
      );
    }
    else if (src.indexOf('private://') != -1) {
      src = src.replace(
        'private://',
        Drupal.settings.file_private_path +
          '/styles/' +
          style_name +
          '/private/'
      );
    }
    return src;
  }
  catch (error) { console.log('image_style_url - ' + error); }
}

/**
 * The success callback function used when handling PhoneGap's camera
 * getPicture() call.
 * @param {Object} options
 */
function _image_phonegap_camera_getPicture_success(options) {
  try {

    // Hold on to the image options in the global var.
    image_phonegap_camera_options[options.field_name] = {0: options};

    // Hide the 'Add image' button and show the 'Upload' button.
    //$('#' + options.id + '-button').hide();
    //$('#' + options.id + '_upload').show();

    // Show the captured photo as a thumbnail. When the photo is loaded, resize
    // it to fit the content area, then show it.
    var image_element_id = options.id + '-imagefield';
    var image = document.getElementById(image_element_id);
    image.src = 'data:image/jpeg;base64,' +
      image_phonegap_camera_options[options.field_name][0].image;
    image.onload = function() {
      var width = this.width;
      var height = this.height;
      var ratio = width / drupalgap_max_width();
      var new_width = width / ratio;
      var new_height = height / ratio;
      image.width = new_width;
      image.height = new_height;
      $('#' + image_element_id).show();
    };
  }
  catch (error) {
    console.log('_image_phonegap_camera_getPicture_success - ' + error);
  }
}

/**
 * An internal function used to upload images to the server, retreive their file
 * id and then populate the corresponding form element's value with the file id.
 * @param {Object} form
 * @param {Object} form_state
 * @param {Object} options
 */
function _image_fields_form_process(form, form_state, form_id, options) {
  try {
    // @todo - this needs mutli value field support (delta)
    var lng = language_default();
    var files = new Array();
    var fid, element_id;
    $.each(form.image_fields, function(index, name) {
      // Skip empty images.
      if (!image_phonegap_camera_options[name][0]) { return false; }
      // Skip image fields that already have their file id set.
      if (form_state.values[name][lng][0] != '') { return false; }
      // Create a unique file name using the UTC integer value.
      var d = new Date();
      var image_file_name = Drupal.user.uid + '_' + d.valueOf() + '.jpg';
      // Build the data for the file create resource. If it's private, adjust
      // the filepath.
      var file = {
        file: {
          file: image_phonegap_camera_options[name][0].image,
          filename: image_file_name,
          filepath: 'public://' + image_file_name,
          name: name
        }
      };
      if (!empty(Drupal.settings.file_private_path)) {
        file.file.filepath = 'private://' + image_file_name;
      }
      // Add file to deferred processing array
      files.push(file);
    });

    // Build deferred processing array of functions
    var uploads = files.map(_image_upload_deferred);

    // Special when gets array of deferred returns
    $.whenall = function(arr) {
      return $.when.apply($, arr).pipe(function() {
        return Array.prototype.slice.call(arguments);
      });
    };

    // When deferred images are done
    $.whenall(uploads).done(function(arguments) {
      for (var i = 0; i < arguments.length; i++) {
        var element_id = drupalgap_form_get_element_id(arguments[i].name, form_id);
        $('#' + element_id).val(arguments[i].fid);
        form_state.values[arguments[i].name][lng][0] = arguments[i].fid;
      }
      // Call success now that all images are processed
      // and the form has been updated
      options.success();
    });
  }
  catch (error) { console.log('_image_fields_form_validate - ' + error); }
}

/**
 * Custom function for deferred image uploading
 */
function _image_upload_deferred(file) {
  var deferred = new $.Deferred();
  drupalgap.loader = 'saving';
  file_save(file, {
    success: function(result) {
      deferred.resolve({fid: result.fid, name:file.file.name});
    }
  });
  return deferred;
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
function image_assemble_form_state_into_field(entity_type, bundle,
  form_state_value, field, instance, langcode, delta, field_key) {
  try {
    field_key.value = 'fid';
    return form_state_value;
  }
  catch (error) {
    console.log('image_assemble_form_state_into_field - ' + error);
  }
}
