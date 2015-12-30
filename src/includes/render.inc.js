dg.appRender = function(content) {
  dg.themeLoad().then(function(theme) {
    var innerHTML = '';

    // Process regions.
    // @TODO move this to dg.loadRegions().
    dg.regions = {};
    var regions = theme.getRegions();
    for (var id in regions) {
      if (!regions.hasOwnProperty(id)) { continue; }

      // Instantiate the region, merge the theme's configuration for the region into it,
      // place the region into the dg scope and then load its blocks.
      var config = {
        id: id,
        attributes: { id: id }
      };
      var region = new dg.Region(config);
      for (var setting in regions[id]) {
        if (!regions[id].hasOwnProperty(setting)) { continue; }
        region.set(setting, regions[id][setting]);
      }
      dg.regions[id] = region;
      var blocks = dg.regions[id].getBlocks();
      if (blocks.length == 0) { continue; }

      // Open the region, render the placeholder for each of its block(s), then
      // close the region.
      innerHTML += '<' + region.get('format')  + ' ' + dg.attributes(region.get('attributes')) + '>';
      for (var i = 0; i < blocks.length; i++) {
        var block = dg.blockLoad(blocks[i]);
        innerHTML += '<' + block.get('format')  + ' ' + dg.attributes(block.get('attributes')) + '>';
        innerHTML += '</' + block.get('format') + '>';
      }
      innerHTML += '</' + region.get('format') + '>';

    }
    innerHTML += dg.render(content);

    // Place the region, and block placeholders, into the app's div.
    document.getElementById('dg-app').innerHTML = innerHTML;

    // Run the build promise for each block, then inject their content as they respond.
    // Keep a tally of all the blocks, and once their promises have all completed, then
    // if there are any forms on the page, attach their UI submit handlers. We don't use
    // a promise all, so blocks can render one by one.
    var blocks = dg.blocksLoad();
    var blocksToRender = [];
    for (id in blocks) {
      if (!blocks.hasOwnProperty(id)) { continue; }
      blocksToRender.push(id);
      blocks[id].buildWrapper().then(function(_block) {

        // Inject the block content and mark the block as rendered.
        document.getElementById(_block.get('id')).innerHTML = dg.render(_block.get('content'));
        blocksToRender.splice(blocksToRender.indexOf(_block.get('id')), 1);

        // If we're all done with every block, process the form(s), if any.
        // @TODO form should be processed as they're injected, because waiting
        // until all promises have resolved like this means a form can't be used
        // until they've all resolved.
        if (blocksToRender.length == 0) {
          var forms = dg.loadForms();
          for (var id in forms) {
            if (!forms.hasOwnProperty(id)) { continue; }
            var form_html_id = dg.killCamelCase(id, '-');
            var form = document.getElementById(form_html_id);
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
        }

      });
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
      if (content.markup) {
        console.log('DEPRECATED: Use "_markup" instead of "markup" in this render array:');
        console.log(content);
        content._markup = content.markup;
      }
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