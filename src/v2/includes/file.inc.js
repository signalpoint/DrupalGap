/**
 * Reads entire file into a string and returns the string. Returns false if
 * it fails.
 * @param {String} path
 * @param {Object} options
 * @return {String}
 */
function dg_file_get_contents(path, options) {
  try {
    var file = false;
    var default_options = {
      type: 'GET',
      url: path,
      dataType: 'html',
      data: null,
      async: false,
      success: function(data) { file = data; },
      error: function(xhr, textStatus, errorThrown) {
        console.log(
          'dg_file_get_contents - failed to load file (' + path + ')'
        );
      }
    };
    $.extend(default_options, options);
    jQuery.ajax(default_options);
    return file;
  }
  catch (error) { console.log('dg_file_get_contents - ' + error); }
}
