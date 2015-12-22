dg.appRender = function(content) {
  dg.themeLoad().then(function(theme) {
    var innerHTML = '';

    // Process regions.
    // @TODO move this to dg.loadRegions().
    dg.regions = {};
    var regions = theme.getRegions();
    for (var id in regions) {
      if (!regions.hasOwnProperty(id)) { continue; }

      var region = new dg.Region({
        id: id,
        attributes: { id: id }
      });
      dg.regions[id] = region;

      var blocks = dg.regions[id].getBlocks();
      if (blocks.length == 0) { continue; }

      innerHTML += '<' + region.get('format')  + ' ' + dg.attributes(region.get('attributes')) + '>';
      for (var i = 0; i < blocks.length; i++) {
        var block = dg.blockLoad(blocks[i]);
        innerHTML += '<' + block.get('format')  + ' ' + dg.attributes(block.get('attributes')) + '>';
        innerHTML += '</' + block.get('format') + '>';
      }
      innerHTML += '</' + region.get('format') + '>';

    }
    innerHTML += dg.render(content);
    document.getElementById('dg-app').innerHTML = innerHTML;

    // Run the build promise for each block, then inject their content as the respond.
    var blocks = dg.blocksLoad();
    for (id in blocks) {
      if (!blocks.hasOwnProperty(id)) { continue; }
      var block = blocks[id];
      block.buildWrapper().then(function(_block) {
        document.getElementById(_block.get('id')).innerHTML = dg.render(_block.get('content'));
      });
    }

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