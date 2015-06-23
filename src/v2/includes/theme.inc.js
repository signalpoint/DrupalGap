/**
 * Implementation of theme().
 * @param {String} hook
 * @param {Object} variables
 * @return {String}
 */
function theme(hook, variables) {
  try {
    
    // If there is HTML markup present, just return it as is. Otherwise, run
    // the theme hook and send along the variables.
    if (!variables) { variables = {}; }
    if (variables.markup) { return variables.markup; }
    var content = '';
    
    var theme_function = 'theme_' + hook;
    
    // @TODO check for modules implementing the theme hook.
    
    // @TODO check for the current theme implementing the theme hook.
    
    // If no attributes are coming in, look to variables.options.attributes
    // as a secondary option, otherwise setup an empty JSON object for them.
    if (
      typeof variables.attributes === 'undefined' ||
      !variables.attributes
    ) {
      if (variables.options && variables.options.attributes) {
        variables.attributes = variables.options.attributes;
      }
      else {
        variables.attributes = {};
      }
    }
    // If there is no class name, set an empty one.
    if (!variables.attributes['class']) { variables.attributes['class'] = ''; }
    
    if (!window[theme_function]) { return ''; }
    var fn = window[theme_function];
    content = fn.call(null, variables);
    return content;
    
  }
  catch (error) { console.log('theme - ' + error); }
}

