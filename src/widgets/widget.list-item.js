/**
 *
 * @param variables
 *  _text {String} The text to appear within the item.
 * @returns {*}
 */
dg.theme_list_item = function(variables) {
  var item = variables._item;
  var itemType = variables._itemType ? variables._itemType : 'li';
  var i = variables._i;
  if (typeof item === 'object') {
    dg.setRenderElementDefaults(item);
    if (i == 0) { item._attributes.class.push('first'); }
    else if (i == item._total - 1) { item._attributes.class.push('last'); }
    if (item._theme && item._theme != 'list_item') {
      return dg.theme(item._theme, item);
    }
    var text = item._text ? item._text : '';
    return '<' + itemType + ' ' + dg.attributes(item._attributes) + '>' + dg.render(text) + '</' + itemType + '>';
  }
  else {
    var attrs = {};
    if (i == 0) { attrs['class'] = ['first']; }
    else if (i == item._total - 1) { attrs['class'] = ['last']; }
    return '<' + itemType + ' ' + dg.attributes(attrs) + '>' + item + '</' + itemType + '>';
  }
};
