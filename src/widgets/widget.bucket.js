dg.theme_bucket = function(variables) {
  if (!variables._attributes.id) { variables._attributes.id = 'bucket-' + jDrupal.userPassword(); }
  if (!variables._format) { variables._format = 'div'; }
  if (!variables._grab) { return; }
  var format = variables._format;
  var element = {};
  var prefix = variables._prefix ? dg.render(variables._prefix) : '';
  var suffix = variables._suffix ? dg.render(variables._suffix) : '';
  element.bucket = {
    _markup: prefix +
    '<' + format + ' ' + dg.attributes(variables._attributes) + '></' + format + '>' +
    suffix,
    _postRender: [function() {
      variables._grab().then(function(content) {
        document.getElementById(variables._attributes.id).innerHTML = dg.render(content);
        if (dg.postRenderCount()) { dg.runPostRenders(); }
      });
    }]
  };
  return dg.render(element);
};
