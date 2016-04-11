dg.theme_view = function(variables) {
  if (!variables._attributes.id) {
    var msg = 'WARNING: dg.theme_view - no attribute id was provided, so a ' +
      'random one was generated for the following View widget: ' +
      dg.restPath() + variables._path;
    console.log(msg);
    variables._attributes.id = dg.userPassword();
  }
  return new Promise(function(ok) {
    jDrupal.viewsLoad(variables._path).then(function(data) {
      var content = '';
      var format = variables._format ? variables._format : 'div';
      var attrs = variables._format_attributes ? variables._format_attributes : null;
      if (variables._title) {
        if (typeof variables._title === 'object') { content += dg.render(variables._title); }
        else { content += '<h2>' + variables._title + '</h2>'; };
      }
      content += '<' + format + ' ' + dg.attributes(attrs) + '>';
      if (data.results.length > 0) {
        for (var i = 0; i < data.results.length; i++) {
          var open = '';
          var close = '';
          switch (format) {
            case 'ul':
            case 'ol':
              open = '<li>';
              close = '</li>';
              break;
            case 'table':
              open = '<tr>';
              close = '</tr>';
              break;
            default: break;
          }
          content += open + variables._row_callback(data.results[i]) + close;
        }
        var contentPrefix = variables._contentPrefix ? variables._contentPrefix : '';
        var contentSuffix = variables._contentSuffix ? variables._contentSuffix : '';
        if (typeof contentPrefix === 'object') { contentPrefix = dg.render(contentPrefix); }
        if (typeof contentSuffix === 'object') { contentSuffix = dg.render(contentSuffix); }
        content = contentPrefix + content + contentSuffix;
      }
      else if (variables._empty) {
        if (typeof variables._empty === 'object') { content += dg.render(variables._empty); }
        else { content += '<div class="view-empty">' + variables._empty + '</div>'; };
      }
      content += '</' + format + '>';
      ok({
        variables: variables,
        content: content
      });
    });
  });
};
