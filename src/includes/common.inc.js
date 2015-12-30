/**
 *
 * @param attributes
 * @returns {string}
 */
dg.attributes = function(attributes) {
  var attrs = '';
  if (attributes) {
    for (var name in attributes) {
      if (!attributes.hasOwnProperty(name)) { continue; }
      var value = attributes[name];
      if (Array.isArray(value)) {
        attrs += name + '="' + value.join(' ') + '" ';
      }
      else if (value != '') {
        // @todo - if someone passes in a value with double quotes, this
        // will break. e.g.
        // 'onclick':'_drupalgap_form_submit("' + form.id + "');'
        // will break, but
        // 'onclick':'_drupalgap_form_submit(\'' + form.id + '\');'
        // will work.
        attrs += name + '="' + value + '" ';
      }
      else {
        // The value was empty, just place the attribute name on the
        // element, unless it was an empty class.
        if (name != 'class') { attrs += name + ' '; }
      }
    }
  }
  return attrs;
};

/**
 * Given a string separated by underscores or hyphens, this will return the
 * camel case version of a string. For example, given "foo_bar" or "foo-bar",
 * this will return "fooBar".
 * @see http://stackoverflow.com/a/2970667/763010
 */
dg.getCamelCase = function(str) {
  return str.replace(/[-_]([a-z])/g, function (g) { return g[1].toUpperCase(); });
};

/**
 *
 */
dg.killCamelCase = function(str, separator) {
  return jDrupal.lcfirst(str).replace(/([A-Z])/g, separator + '$1').toLowerCase();
};
