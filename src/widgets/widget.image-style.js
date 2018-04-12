dg.theme_image_style = function(vars) {
  vars._path = dg.imageStyleUrl(vars._style_name, vars._path);
  return dg.theme_image(vars);
};

/**
 * Given a style name and image URI, this will return the full URL for the image.
 * @param styleName {String} An image style name.
 * @param path {String} An image URI (recommended) or path.
 * @returns {*}
 */
dg.imageStyleUrl = function(styleName, path) {
  var look = 'public://';
  var isUri = path.indexOf(look) != -1;
  var sitePath = jDrupal.sitePath();
  var basePath = jDrupal.basePath();
  if (isUri) {
    var common = 'sites/default/files/styles/' + styleName + '/public/';
    var fullPath = basePath + common;
    return (
            dg.isCompiled() ? sitePath + fullPath : fullPath
    ) + path.replace(look, '');
  }
  else { return sitePath + basePath + path; }
};
