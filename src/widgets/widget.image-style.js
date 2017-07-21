dg.theme_image_style = function(vars) {
  vars._path = dg.imageStyleUrl(vars._style_name, vars._path);
  return dg.theme_image(vars);
};

dg.imageStyleUrl = function(styleName, path) {
  var src = jDrupal.sitePath() + jDrupal.basePath() + path;
  return src.indexOf('public://') != -1 ?
      src.replace(
          'public://',
          'sites/default/files/styles/' + styleName + '/public/'
      ) : src;
};
