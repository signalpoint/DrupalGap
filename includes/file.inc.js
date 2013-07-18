/**
 * An JSON object representing the file, or false if the file was not found.
 */
function file_load(fid) {
  try {
    return entity_load('file', fid);
  }
  catch (error) { drupalgap_error(error); }
}

