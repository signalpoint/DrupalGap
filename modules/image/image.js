

// Holds onto the phonegap getPicture success image data. It is keyed by field
// name, then delta value.
var image_phonegap_camera_options = {};

/**
 * Implements hook_field_formatter_view().
 */
function image_field_formatter_view(entity_type, entity, field, instance, langcode, items, display) {
  try {
    var element = {};
    if (!drupalgap_empty(items)) {
      $.each(items, function(delta, item){
          // TODO - add support for image_style
          element[delta] = {
            theme:'image',
            alt:item.alt,
            title:item.title,
            path:drupalgap_image_path(item.uri)
            /*image_style:display.settings.image_style*/
          };
      });
    }
    return element;
  }
  catch (error) { drupalgap_error(error); }
}

/**
 * Given an entity type and optional bundle name, this will return an array
 * containing any image field names present, false otherwise.
 */
function image_fields_present_on_entity_type(entity_type, bundle) {
  try {
    var results = [];
    var fields = drupalgap_field_info_instances(entity_type, bundle);
    $.each(fields, function(name, field){
        if (field.widget && field.widget.type && field.widget.type == 'image_image') {
          results.push(name);
        }
    });
    if (results.length == 0) { return false; }
    return results;
  }
  catch (error) { drupalgap_error(error); }
}

/**
 * Implements hook_form_alter().
 */
function image_form_alter(form, form_state, form_id) {
  // Make potential alterations to any entity edit form that has an image field
  // element(s).
  if (form.entity_type) {
    var bundle = null;
    if (form.entity_type == 'node') { bundle = form.elements.type.default_value; }
    var image_fields = image_fields_present_on_entity_type(form.entity_type, bundle);
    if (image_fields) {
      // Attach the image field names to the form for later reference.
      form.image_fields = image_fields;
      // Prepend a custom validate submit handler to the form to handle images.
      form.validate.unshift('_image_field_form_validate');
      form.submit.unshift('_image_field_form_submit');
      // For each image field, create a place for it in the global var.
      if ($.isArray(image_fields)) {
        $.each(image_fields, function(index, name){
            image_phonegap_camera_options[name] = {0:null};
        });
      }
    }
  }
} 

/**
 * The success callback function used when handling PhoneGap's camera
 * getPicture() call.
 */
function _image_phonegap_camera_getPicture_success(options) {
  try {
    
    // Hold on to the image options in the global var.
    image_phonegap_camera_options[options.field_name] = {0:options};
    
    // Hide the 'Add image' button and show the 'Upload' button.
    $('#' + options.id + '-button').hide();
    //$('#' + options.id + '_upload').show();
    
    // Show the captured photo as a thumbnail. When the photo is loaded, resize
    // it to fit the content area, then show it.
    var image_element_id = options.id + '-imagefield';
    var image = document.getElementById(image_element_id);
    image.src = "data:image/jpeg;base64," + image_phonegap_camera_options[options.field_name][0].image;
    image.onload = function () {
      var width = this.width;
      var height = this.height;
      var ratio = width/drupalgap_max_width();
      var new_width = width/ratio;
      var new_height = height/ratio;
      image.width = new_width;
      image.height = new_height;
      $('#' + image_element_id).show();
    };
  }
  catch(error) { drupalgap_error(error); }
}

/**
 * Handles the click on the 'Upload' button on image field form elements. 
 */
/*function _image_phonegap_camera_getPicture_upload() {
  try {
    // Use the global options.
    var options = image_phonegap_camera_options;
    // Hide the upload button.
    $('#' + options.id + '_upload').hide();
  }
  catch(error) { drupalgap_error(error); }
}*/

/**
 * A custom form validate handler for forms that contain image fields.
 */
function _image_field_form_validate(form, form_state) {
  try {
    $.each(form.image_fields, function(index, name){
        // Skip empty images.
        if (!image_phonegap_camera_options[name][0]) { return; }
        // Skip image fields that already have their file id set.
        if (form_state.values[name] != '') { return; }
        // Create a unique file name using the UTC integer value.
        var d = new Date();
        var image_file_name = "" + d.valueOf() + ".jpg";
        // Build the data for the file create resource.
        var file = {"file":{
          "file":image_phonegap_camera_options[name][0].image,
          "filename":image_file_name,
          "filepath":'public://' + image_file_name
        }};
        // Call the file create resource.
        drupalgap.services.file.create.call({
          'file':file,
          async:false,
          success:function(result){
            // Set the hidden input and form state values with the file id.
            var element_id = drupalgap_form_get_element_id(name, form.id);
            $('#' + element_id).val(result.fid);
            form_state.values[name] = result.fid;
          }
        });
    });
  }
  catch (error) { drupalgap_error(error); }
}

/**
 * A custom form submit handler for forms that contain image fields.
 */
function _image_field_form_submit(form, form_state) {
  try {
    
  }
  catch (error) { drupalgap_error(error); }
}

