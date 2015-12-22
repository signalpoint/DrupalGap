dg.l = function(text, path, options) {
  if (!options) { options = {}; }
  if (!options._text) { options._text = text; }
  if (!options._path) { options._path = path; }
  return dg.theme('link', options);
};
/**
 * Implementation of theme_link().
 * @param {Object} variables
 * @return {String}
 */
dg.theme_link = function(variables) {
  var text = variables._text ? variables._text : '';
  if (typeof variables._attributes.href === 'undefined' && variables._path) {
    variables._attributes.href = '#' + variables._path;
  }
  return '<a ' + dg.attributes(variables._attributes) + '>' + text + '</a>';
};

/**
 * Implementation of theme_item_list().
 * @param {Object} variables
 * @return {String}
 */
dg.theme_item_list = function(variables) {
  var html = '';
  var type = variables._type ? variables._type : 'ul';
  if (variables._title) { html += '<h2>' + variables._title + '</h2>'; }
  html += '<' + type + ' ' + dg.attributes(variables._attributes) + '>';
  if (variables._items && variables._items.length > 0) {
    for (var i in variables._items) {
      if (!variables._items.hasOwnProperty(i)) { continue; }
      var item = variables._items[i];
      html += '<li>' + item + '</li>';
    }
  }
  return html += '</' + type + '>';
};
