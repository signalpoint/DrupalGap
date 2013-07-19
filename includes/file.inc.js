/**
 * An JSON object representing the file, or false if the file was not found.
 */
function file_load(fid) {
  try {
    var options = null;
    if (arguments[1]) { options = arguments[1]; }
    return entity_load('file', fid, options);
  }
  catch (error) { drupalgap_error(error); }
}

