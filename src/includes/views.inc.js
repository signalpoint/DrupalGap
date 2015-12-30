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
      if (data.results.length > 0) {
        for (var i = 0; i < data.results.length; i++) {
          content += variables._row_callback(data.results[i]);
        }
      }
      else {
        content = ''; // empty
      }
      ok({
        variables: variables,
        content: content
      });
    });
  });
};