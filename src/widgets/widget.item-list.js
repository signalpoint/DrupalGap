/**
 * Themes an item list.
 * @param {Object} variables
 *  _title {String} The title for the list.
 *  _items {Array} An array of list items to render, or an array of strings to render.
 *  _items_prefix {String} An html string to render immediately before the items, but after the title.
 *  _items_suffix {String} An html string to render immediately after the items.
 * @return {String}
 */
dg.theme_item_list = function(variables) {
  var html = '';
  var type = variables._type ? variables._type : 'ul';
  if (variables._title) {
    html += typeof variables._title === 'object' ?
        dg.render(variables._title) :
    '<h3>' + variables._title + '</h3>';
  }
  if (variables._items_prefix) { html += variables._items_prefix; }
  html += '<' + type + ' ' + dg.attributes(variables._attributes) + '>';
  if (variables._items && variables._items.length > 0) {
    var itemType = variables._itemType ? variables._itemType : 'li';
    for (var i in variables._items) {
      if (!variables._items.hasOwnProperty(i)) { continue; }
      html += dg.theme('list_item', {
        _item: variables._items[i],
        _itemType: itemType,
        _i: i,
        _total: variables._items.length
      });
    }
  }
  html += '</' + type + '>';
  if (variables._items_suffix) { html += variables._items_suffix; }
  return html;
};
