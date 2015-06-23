/**
 * Converts a JSON object to an XML/HTML tag attribute string and returns the
 * string.
 * @param {Object} attributes
 * @return {String{
 */
function dg_attributes(attributes) {
  try {
    //dpm('dg_attributes');
    //console.log(attributes);
    var attribute_string = '';
    if (attributes) {
      for (var name in attributes) {
          if (!attributes.hasOwnProperty(name)) { continue; }
          var value = attributes[name];
          if (value != '') {
            // @todo - if someone passes in a value with double quotes, this
            // will break. e.g.
            // 'onclick':'_drupalgap_form_submit("' + form.id + "');'
            // will break, but
            // 'onclick':'_drupalgap_form_submit(\'' + form.id + '\');'
            // will work.
            attribute_string += name + '="' + value + '" ';
          }
          else {
            // The value was empty, just place the attribute name on the
            // element.
            attribute_string += name + ' ';
          }
      }
    }
    return attribute_string;
  }
  catch (error) { console.log('dg_attributes - ' + error); }
}

/**
 * Given a string separated by underscores or hyphens, this will return the
 * camel case version of a string. For example, given "foo_bar" or "foo-bar",
 * this will return "fooBar".
 * @see http://stackoverflow.com/a/2970667/763010
 */
function dg_get_camel_case(str) {
  try {
    return str.replace(/[-_]([a-z])/g, function (g) { return g[1].toUpperCase(); });
  }
  catch (error) { console.log('dg_get_camel_case - ' + error); }
}

/**
 *
 */
function dg_kill_camel_case(str, separator) {
  try {
    return str.replace(/([A-Z])/g, separator + '$1');
  }
  catch (error) { console.log('dg_kill_camel_case - ' + error); }
}

/**
 * Returns translated text.
 * @param {String} str The string to translate
 * @return {String}
 */
function t(str) {
  return str;
}

