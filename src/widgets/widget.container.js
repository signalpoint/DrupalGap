/**
 *
 * @param {type} vars
 *  _type {String} The html element type to use, defaults to div.
 * @returns {String}
 */
dg.theme_container = function(vars) {
  var type = vars._type ? vars._type : 'div';
  return '<' + type + ' ' + dg.attrs(vars) + '>' + dg.render(vars._children) + '</' + type + '>';
};
