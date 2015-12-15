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
  return jDrupal.lcfirst(str).replace(/([A-Z])/g, separator + '$1');
};
