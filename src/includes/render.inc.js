function drupalgap_render(content) {

  var output_type = $.type(content);
  var html = '';

  // If the output came back as a string, we can render it as is. If the
  // output came back as on object, render each element in it through the
  // theme system.
  if (output_type === 'string') {
    // The page came back as an html string.
    html = content;
  }
  else if (output_type === 'object') {
    // The page came back as a render object. Let's define the names of
    // variables that are reserved for theme processing.
    var render_variables = ['theme', 'view_mode', 'language'];

    if (content.markup) { return content.markup; }

    // Is there a theme value specified in the content and the registry?
    if (content.theme && drupalgap.theme_registry[content.theme]) {

      // Extract the theme object template and determine the template file
      // name and path.
      var template = drupalgap.theme_registry[content.theme];
      var template_file_name = content.theme.replace(/_/g, '-') + '.tpl.html';
      var template_file_path = template.path + '/' + template_file_name;

      // Make sure the template file exists.
      // @TODO disc read here, replace with render array!
      if (drupalgap_file_exists(template_file_path)) {

        // Loads the template file's content into a string.
        // @TODO there is a disc read here, it is slow for UX! Deprecate via a render array.
        var template_file_html = drupalgap_file_get_contents(template_file_path);
        if (template_file_html) {

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
                // If it is markup, render it as is, if it is themeable,
                // then theme it.
                if (content[placeholder].markup) {
                  _html = content[placeholder].markup;
                }
                else if (content[placeholder].theme) {
                  _html = theme(content[placeholder].theme, element);
                }
                // Now remove the variable from the content.
                delete content[placeholder];
              }
              // Now replace the placeholder with the html, even if it was
              // empty.
              template_file_html = template_file_html.replace('{:' + placeholder + ':}', _html);
            }
          }
          else {
            // There were no place holders found, do nothing, ok.
          }

          // Finally add the rendered template file to the html.
          html += template_file_html;
        }
        else {
          console.log('drupalgap_render - failed to get file contents (' + template_file_path + ')');
        }
      }
      else {
        console.log('drupalgap_render - template file does not exist (' + template_file_path + ')');
      }
    }

    // Iterate over any remaining variables and theme them.
    for (var element in content) {
      if (!content.hasOwnProperty(element)) { continue; }
      var variables = content[element];
      if ($.inArray(element, render_variables) == -1) {
        html += theme(typeof variables.theme === 'undefined' ? null : variables.theme, variables);
      }
    }
  }

  // Now that we are done assembling the content into an html string, we can
  // return it.
  return html;
}
