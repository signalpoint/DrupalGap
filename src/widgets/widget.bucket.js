dg.theme_bucket = function(vars) {
  if (!vars._format) { vars._format = 'div'; }
  var format = vars._format;
  if (!vars._attributes.id) { vars._attributes.id = format + '-' + dg.salt(); }
  if (!vars._grab && !vars._fill) { return; }
  var element = {};
  var prefix = vars._prefix ? dg.render(vars._prefix) : '';
  var suffix = vars._suffix ? dg.render(vars._suffix) : '';
  element.bucket = {
    _markup: prefix +
    '<' + format + ' ' + dg.attributes(vars._attributes) + '></' + format + '>' +
    suffix,
    _postRender: [function() {
        var p = null;
        if (vars._grab) { p = vars._grab(); }
        else if (vars._fill) { p = new Promise(vars._fill); }
        p.then(function(content) {
          dg.qs('#' + vars._attributes.id).innerHTML = dg.render(content);
          if (dg.postRenderCount()) { dg.runPostRenders(); }
        });
    }]
  };
  return dg.render(element);
};
