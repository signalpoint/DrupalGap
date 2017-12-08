dg.theme_image_style = function(vars) {
  vars._path = dg.imageStyleUrl(vars._style_name, vars._path);
  return dg.theme_image(vars);
};

dg.imageStyleUrl = function(styleName, path) {
  var src = jDrupal.sitePath() + jDrupal.basePath() + path;
  var common = 'sites/default/files/styles/' + styleName + '/public/';
  return src.indexOf('public://') != -1 ?
      src.replace(
          'public://',
          dg.isCompiled() ?
            jDrupal.sitePath() + '/' + common :
              common
      ) : src;
};
