dg.theme_bucket = function(variables) {
  if (!variables._attributes.id) { variables._attributes.id = 'bucket-' + jDrupal.userPassword(); }
  if (!variables._format) { variables._format = 'div'; }
  if (!variables._grab) { return; }
  var format = variables._format;
  var element = {};
  var prefix = variables._prefix ? dg.render(variables._prefix) : '';
  var suffix = variables._suffix ? dg.render(variables._suffix) : '';
  element.bucket = {
    _markup: prefix +
        '<' + format + ' ' + dg.attributes(variables._attributes) + '></' + format + '>' +
      suffix,
    _postRender: [function() {
      variables._grab().then(function(content) {
        document.getElementById(variables._attributes.id).innerHTML = dg.render(content);
        if (dg.postRenderCount()) { dg.runPostRenders(); }
      });
    }]
  };
  return dg.render(element);
};

/**
 * Themes a button.
 * @param {Object} variables
 * @returns {string}
 */
dg.theme_button = function(variables) {
  if (!variables._value) { variables._value = ''; }
  return '<button ' + dg.attributes(variables._attributes) + '>' + variables._value + '</button>';
};

/**
 * Themes a link.
 * @param {Object} variables
 * @return {String}
 */
dg.theme_link = function(variables) {
  var text = variables._text ? variables._text : '';
  var path = variables._path;
  if (path == '') { path = dg.getFrontPagePath(); }
  if (typeof variables._attributes.href === 'undefined' && path) {
    var href = path;
    if (path.indexOf('http://') != -1 || path.indexOf('https://') != -1) { }
    else if (path.indexOf('/') == 0) { href = path; }
    else { href = '#' + path; }
    if (path == dg.getPath() && !jDrupal.inArray('active', variables._attributes.class)) {
      variables._attributes.class.push('active');
    }
    variables._attributes.href = href;
  }
  return '<a ' + dg.attributes(variables._attributes) + '>' + text + '</a>';
};

dg.theme_image = function(vars) {
  vars._attributes.src = vars._attributes.src ? vars._attributes.src : vars._path;
  var src = vars._attributes.src;
  if (src && src.indexOf('public://') != -1 || src.indexOf('private://') != -1) {
    vars._attributes.src = dg.imagePath(src);
  }
  if (vars._alt) { vars._attributes.alt = vars._alt; }
  if (vars._title) { vars._attributes.title = vars._title; }
  return '<img ' + dg.attributes(vars._attributes) + '/>';
};

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
    for (var i in variables._items) {
      if (!variables._items.hasOwnProperty(i)) { continue; }
      html += dg.theme('list_item', {
        _item: variables._items[i],
        _i: i,
        _total: variables._items.length
      });
    }
  }
  html += '</' + type + '>';
  if (variables._items_suffix) { html += variables._items_suffix; }
  return html;
};

dg.theme_list_item = function(variables) {
  var item = variables._item;
  var i = variables._i;
  if (typeof item === 'object') {
    dg.setRenderElementDefaults(item);
    if (i == 0) { item._attributes.class.push('first'); }
    else if (i == item._total - 1) { item._attributes.class.push('last'); }
    if (item._theme && item._theme != 'list_item') {
      return dg.theme(item._theme, item);
    }
    var text = item._text ? item._text : '';
    return '<li ' + dg.attributes(item._attributes) + '>' + dg.render(text) + '</li>';
  }
  else {
    var attrs = {};
    if (i == 0) { attrs['class'] = ['first']; }
    else if (i == item._total - 1) { attrs['class'] = ['last']; }
    return '<li ' + dg.attributes(attrs) + '>' + item + '</li>';
  }
};

dg.theme_title = function(variables) {
  return '<h1 ' + dg.attributes(variables._attributes) + '>' + variables._title + '</h1>';
};
dg.theme_document_title = function(variables) {
  return variables._title + ' | ' + dg.config('title');
};
