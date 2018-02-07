dg.theme_container = function(variables) {
  return '<div ' + dg.attrs(variables) + '>' + dg.render(variables._children) + '</div>';
};
