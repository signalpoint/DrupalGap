dg.appRender = function(content) {
  dg.themeLoad().then(function(theme) {
    var innerHTML = '';

    // START HERE, turn regions into a prototype, then make a function
    // that can get all the blocks for that region, then it'll be easier
    // to control what happens in each.

    // Process regions.
    var regions = theme.getRegions();
    for (var region in regions) {
      if (!regions.hasOwnProperty(region)) { continue; }
      for (var block in regions[region]) {
        if (!regions[region].hasOwnProperty(block)) { continue; }
        if (block.indexOf('_') == 0) { continue; } // Skip properties.
        console.log(block);
      }
    }
    innerHTML += dg.render(content);
    document.getElementById('dg-app').innerHTML = innerHTML;

    // Attach UI submit handler for each form on the page, if any.
    var forms = dg.loadForms();
    for (var id in forms) {
      if (!forms.hasOwnProperty(id)) { continue; }
      var form = document.getElementById(dg.killCamelCase(id, '-'));
      function processForm(e) {
        if (e.preventDefault) e.preventDefault();
        var _form = dg.loadForm(id);
        _form._submission().then(
          function() { },
          function() { }
        );
        return false; // Prevent default form behavior.
      }
      if (form.attachEvent) { form.attachEvent("submit", processForm); }
      else { form.addEventListener("submit", processForm); }
    }
  });
};
dg.render = function(content) {
  try {
    var type = typeof content;
    if (type === 'string') { return content; }
    var html = '';
    var _html = null;
    if (type === 'object') {
      var prefix = content._prefix ? content._prefix : '';
      var suffix = content._suffix ? content._suffix : '';
      if (content._markup) {
        return prefix + content._markup + suffix;
      }
      if (content._theme) {
        return prefix + dg.theme(content._theme, content) + suffix;
      }
      if (content._type) {
        return prefix + dg.theme(content._type, content) + suffix;
      }
      html += prefix;
      for (var index in content) {
        if (
          !content.hasOwnProperty(index) ||
          index == '_prefix' || index == '_suffix'
        ) { continue; }
        var piece = content[index];
        var _type = typeof piece;
        if (_type === 'object') { html += dg.render(piece); }
        else if (_type === 'array') {
          for (var i = 0; i < piece.length; i++) {
            html += dg.render(piece[i]);
          }
        }
      }
      html += suffix;
    }
    else if (type === 'array') {
      for (var i = 0; i < content.length; i++) {
        html += dg.render(content[i]);
      }
    }
    return html;
  }
  catch (error) { console.log('dg.render - ' + error); }
};