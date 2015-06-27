/**
 * Given a html string, a render object or render array, this return the html
 * representing the content's output.
 * @param {String|Object|Array} output The html string or render array to render.
 * @return {String}
 */
function drupalgap_render(content) {
  try {
    //dpm('drupalgap_render');
    //console.log(content);
    var type = $.type(content);
    if (type === 'string') { return content; }
    var html = '';
    if (type === 'object') {
      if (content.markup) { return content.markup; }
      if (content.theme) { return theme(content.theme, content); }
      for (var index in content) {
        if (!content.hasOwnProperty(index)) { continue; }
        var piece = content[index];
        var _type = $.type(piece);
        if (_type === 'object') { drupalgap_render(piece); }
        else if (_type === 'array') {
          for (var i = 0; i < piece.length; i++) {
            html += drupalgap_render(piece[i]);
          }
        }
        
      }
    }
    return html;
    
    
    
    
    
    // Since the output has already been assembled, render the content
    // based on the output type. The output type will either be an html string
    // or a drupalgap render object.
    var output_type = $.type(output);
    var content = '';

    // If the output came back as a string, we can render it as is. If the
    // output came back as on object, render each element in it through the
    // theme system.
    if (output_type === 'string') {
      // The page came back as an html string.
      content = output;
    }
    else if (output_type === 'object') {
      // The page came back as a render object. Let's define the names of
      // variables that are reserved for theme processing.
      var render_variables = ['theme', 'view_mode', 'language'];

      // Is there a theme value specified in the output and the registry?
      if (output.theme && drupalgap.theme_registry[output.theme]) {

        // Extract the theme object template and determine the template file
        // name and path.
        var template = drupalgap.theme_registry[output.theme];
        var template_file_name = output.theme.replace(/_/g, '-') + '.tpl.html';
        var template_file_path = template.path + '/' + template_file_name;

        // Make sure the template file exists.
        if (drupalgap_file_exists(template_file_path)) {

          // Loads the template file's content into a string.
          var template_file_html = drupalgap_file_get_contents(
            template_file_path
          );
          if (template_file_html) {

            // What variable placeholders are present in the template file?
            var placeholders = drupalgap_get_placeholders_from_html(
              template_file_html
            );
            if (placeholders) {

              // Replace each placeholder with html.
              // @todo - each placeholder should have its own container div and
              // unique id.
              for (var index in placeholders) {
                  if (!placeholders.hasOwnProperty(index)) { continue; }
                  var placeholder = placeholders[index];
                  var html = '';
                  if (output[placeholder]) {
                    // Grab the element variable from the output.
                    var element = output[placeholder];
                    // If it is markup, render it as is, if it is themeable,
                    // then theme it.
                    if (output[placeholder].markup) {
                      html = output[placeholder].markup;
                    }
                    else if (output[placeholder].theme) {
                      html = theme(output[placeholder].theme, element);
                    }
                    // Now remove the variable from the output.
                    delete output[placeholder];
                  }
                  // Now replace the placeholder with the html, even if it was
                  // empty.
                  template_file_html = template_file_html.replace(
                    '{:' + placeholder + ':}',
                    html
                  );
              }
            }
            else {
              // There were no place holders found, do nothing, ok.
            }

            // Finally add the rendered template file to the content.
            content += template_file_html;
          }
          else {
            console.log(
              'drupalgap_render - failed to get file contents (' +
                template_file_path +
              ')'
            );
          }
        }
        else {
          console.log(
            'drupalgap_render - template file does not exist (' +
              template_file_path +
              ')'
            );
        }
      }

      // Iterate over any remaining variables and theme them.
      // @todo - each remaining variables should have its own container div and
      // unique id, similar to the placeholder div containers mentioned above.
      for (var element in output) {
          if (!output.hasOwnProperty(element)) { continue; }
          var variables = output[element];
          if ($.inArray(element, render_variables) == -1) {
            content += theme(variables.theme, variables);
          }
      }
    }

    // Now that we are done assembling the content into an html string, we can
    // return it.
    return content;
  }
  catch (error) { console.log('drupalgap_render - ' + error); }
}

