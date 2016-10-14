function drupalgap_render(content) {

  var output_type = $.type(content);
  var html = '';

  // If the output came back as a string, we can render it as is. If the
  // output came back as on object, render each element in it through the
  // theme system.
  if (output_type === 'string') { html = content; }
  else if (output_type === 'object') {
    // The page came back as a render object. Let's define the names of
    // variables that are reserved for theme processing.
    var render_variables = ['theme', 'view_mode', 'language'];

    if (content.markup) { return content.markup; }
    if (content.theme && !drupalgap.theme_registry[content.theme]) {
      return theme(content.theme, content);
    }

    // Is there a theme value specified in the content and the registry?
    if (content.theme && drupalgap.theme_registry[content.theme]) {

      var themeName = drupalgap.settings.theme;
      var tplHtmlFunctionName = themeName + '_' + content.theme + '_tpl_html';
      template_file_html = '';
      if (function_exists(tplHtmlFunctionName)) { template_file_html = window[tplHtmlFunctionName](); }
      else {
        var template = drupalgap.theme_registry[content.theme];
        var template_file_name = content.theme.replace(/_/g, '-') + '.tpl.html';
        var template_file_path = template.path + '/' + template_file_name;
        console.log('@deprecated: ' + template_file_path + ' - use ' + tplHtmlFunctionName + '() in ' +
            themeName + '.js instead, see: http://docs.drupalgap.org/7/Themes/Create_a_Custom_Theme');
        template_file_html = drupalgap_file_get_contents(template_file_path);
      }

      // What variable placeholders are present in the template file?
      var placeholders = drupalgap_get_placeholders_from_html(template_file_html);
      if (placeholders) {

        // Replace each placeholder with html.
        for (var index in placeholders) {
          if (!placeholders.hasOwnProperty(index)) { continue; }
          var placeholder = placeholders[index];
          var _html = '';
          if (content[placeholder]) {
            // Grab the element variable from the content.
            var element = content[placeholder];
            // If it is markup, render it as is, if it is themeable, then theme it.
            if (content[placeholder].markup) {
              _html = content[placeholder].markup;
            }
            else if (content[placeholder].theme) {
              _html = theme(content[placeholder].theme, element);
            }
            // Now remove the variable from the content.
            delete content[placeholder];
          }
          // Now replace the placeholder with the html, even if it was empty.
          template_file_html = template_file_html.replace('{:' + placeholder + ':}', _html);
        }
      }

      // Finally add the rendered template file to the html.
      html += template_file_html;

    }
    else {

      var weighted = {};
      var weightedCount = 0;
      for (var index in content) {
        if (!content.hasOwnProperty(index)) { continue; }
        var piece = content[index];
        var _type = typeof piece;
        if (_type === 'object' && piece !== null) {
          if (piece.theme && drupalgap.theme_registry[piece.theme]) { continue; }
          var weight = typeof piece.weight !== 'undefined' ? piece.weight : 0;
          if (typeof weighted[weight] === 'undefined') { weighted[weight] = []; }
          weighted[weight].push(drupalgap_render(piece));
          weightedCount++;
        }
        else if (_type === 'array') {
          for (var i = 0; i < piece.length; i++) {
            html += drupalgap_render(piece[i]);
          }
        }
        else if (_type === 'string') { html += piece; }
      }
      if (weightedCount) {
        for (var weight in weighted) {
          if (!weighted.hasOwnProperty(weight)) { continue; }
          for (var i = 0; i < weighted[weight].length; i++) {
            html += weighted[weight][i];
          }
        }
      }

    }

  }

  // Now that we are done assembling the content into an html string, we can
  // return it.
  return html;
}
