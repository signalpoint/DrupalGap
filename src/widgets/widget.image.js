dg.theme_image = function(vars) {
  vars._attributes.src = vars._attributes.src ? vars._attributes.src : vars._path;
  var src = vars._attributes.src;
  // @TODO support a _uri property here instead.
  if (src && src.indexOf('public://') != -1 || src.indexOf('private://') != -1) {
    vars._attributes.src = dg.imagePath(src);
  }
  if (vars._alt) { vars._attributes.alt = vars._alt; }
  if (vars._title) { vars._attributes.title = vars._title; }
  return '<img ' + dg.attributes(vars._attributes) + '/>';
};
